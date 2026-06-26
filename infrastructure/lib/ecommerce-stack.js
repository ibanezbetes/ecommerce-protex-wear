"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EcommerceStack = void 0;
const cdk = require("aws-cdk-lib");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const appsync = require("aws-cdk-lib/aws-appsync");
const lambda = require("aws-cdk-lib/aws-lambda");
const cognito = require("aws-cdk-lib/aws-cognito");
const s3 = require("aws-cdk-lib/aws-s3");
const s3n = require("aws-cdk-lib/aws-s3-notifications");
const path = require("path");
class EcommerceStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // 1. DynamoDB Table (Single Table Design)
        const table = new dynamodb.Table(this, 'ProtexWearTable', {
            partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY, // Cambiar a RETAIN en Producción
        });
        table.addGlobalSecondaryIndex({
            indexName: 'GSI1',
            partitionKey: { name: 'GSI1PK', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'GSI1SK', type: dynamodb.AttributeType.STRING },
        });
        // 1.5. Cognito User Pool
        const userPool = new cognito.UserPool(this, 'ProtexWearUserPool', {
            userPoolName: 'ProtexWearUsers',
            selfSignUpEnabled: true,
            signInAliases: { email: true },
            autoVerify: { email: true },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
            },
            email: cognito.UserPoolEmail.withSES({
                fromEmail: 'Daniel.guillen@protexwear.es',
                fromName: 'Protex Wear',
                replyTo: 'Daniel.guillen@protexwear.es',
            }),
        });
        const userPoolClient = new cognito.UserPoolClient(this, 'ProtexWearUserPoolClient', {
            userPool,
            authFlows: {
                userPassword: true,
            },
        });
        // 2. AppSync GraphQL API
        const api = new appsync.GraphqlApi(this, 'ProtexWearApi', {
            name: 'protex-wear-api',
            schema: appsync.SchemaFile.fromAsset(path.join(__dirname, '../graphql/schema.graphql')),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: appsync.AuthorizationType.API_KEY, // Para invitados
                    apiKeyConfig: {
                        expires: cdk.Expiration.after(cdk.Duration.days(365)),
                    },
                },
                additionalAuthorizationModes: [{
                        authorizationType: appsync.AuthorizationType.USER_POOL, // Para usuarios con JWT
                        userPoolConfig: {
                            userPool,
                        }
                    }],
            },
            logConfig: {
                fieldLogLevel: appsync.FieldLogLevel.ALL,
            },
        });
        // 3. Lambdas y DataSources
        const getProductLambda = new lambda.Function(this, 'GetProductHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/get-product')),
            environment: {
                TABLE_NAME: table.tableName,
            },
        });
        // Permisos para que la Lambda lea de DynamoDB (productos y tabla puente)
        table.grantReadData(getProductLambda);
        const lambdaDataSource = api.addLambdaDataSource('GetProductDataSource', getProductLambda);
        // 4. Resolvers
        lambdaDataSource.createResolver('GetProductResolver', {
            typeName: 'Query',
            fieldName: 'getProduct',
        });
        // 4.1. User Operations Lambda
        const userHandlerLambda = new lambda.Function(this, 'UserOperationsHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/user-handler')),
            environment: {
                TABLE_NAME: table.tableName,
            },
        });
        table.grantReadWriteData(userHandlerLambda);
        const userDataSource = api.addLambdaDataSource('UserDataSource', userHandlerLambda);
        userDataSource.createResolver('GetUserProfileResolver', { typeName: 'Query', fieldName: 'getUserProfile' });
        userDataSource.createResolver('ListUsersResolver', { typeName: 'Query', fieldName: 'listUsers' });
        userDataSource.createResolver('UpdateUserProfileResolver', { typeName: 'Mutation', fieldName: 'updateUserProfile' });
        userDataSource.createResolver('SetSpecialPriceResolver', { typeName: 'Mutation', fieldName: 'setSpecialPrice' });
        // 4.2. Order Operations Lambda
        const orderHandlerLambda = new lambda.Function(this, 'OrderOperationsHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/order-handler')),
            environment: {
                TABLE_NAME: table.tableName,
            },
        });
        table.grantReadWriteData(orderHandlerLambda);
        const orderDataSource = api.addLambdaDataSource('OrderDataSource', orderHandlerLambda);
        orderDataSource.createResolver('ListUserOrdersResolver', { typeName: 'Query', fieldName: 'listUserOrders' });
        orderDataSource.createResolver('ListAllOrdersResolver', { typeName: 'Query', fieldName: 'listAllOrders' });
        orderDataSource.createResolver('CreateOrderResolver', { typeName: 'Mutation', fieldName: 'createOrder' });
        // Resolver básico de listado directo a DynamoDB (opcional, si se quiere paginar sin lambda)
        const dbDataSource = api.addDynamoDbDataSource('DbDataSource', table);
        dbDataSource.createResolver('ListProductsResolver', {
            typeName: 'Query',
            fieldName: 'listProducts',
            requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "operation": "Scan",
          "limit": $util.defaultIfNull($ctx.args.limit, 24)
          #if($ctx.args.nextToken)
            ,"nextToken": "$ctx.args.nextToken"
          #end
          #set($expression = "")
          #set($expressionValues = {})
          
          #if($ctx.args.brand)
            #set($expression = "brand = :brand")
            $util.qr($expressionValues.put(":brand", { "S": "$ctx.args.brand" }))
          #end
          
          #if($ctx.args.category)
            #if($expression != "")
              #set($expression = "$expression AND category = :category")
            #else
              #set($expression = "category = :category")
            #end
            $util.qr($expressionValues.put(":category", { "S": "$ctx.args.category" }))
          #end
          
          #if($expression != "")
            ,"filter": {
              "expression": "$expression",
              "expressionValues": $util.toJson($expressionValues)
            }
          #end
        }
      `),
            responseMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "items": $util.toJson($ctx.result.items),
          "nextToken": $util.toJson($util.defaultIfNullOrBlank($context.result.nextToken, null))
        }
      `),
        });
        // 5. Outputs para facilitar desarrollo
        new cdk.CfnOutput(this, 'GraphQLAPIURL', { value: api.graphqlUrl });
        new cdk.CfnOutput(this, 'GraphQLAPIKey', { value: api.apiKey || 'No Api Key Generated' });
        new cdk.CfnOutput(this, 'TableName', { value: table.tableName });
        new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
        new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
        // 6. S3 Bucket for Excel Uploads
        const uploadsBucket = new s3.Bucket(this, 'ExcelUploadsBucket', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            cors: [{
                    allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.POST, s3.HttpMethods.GET],
                    allowedOrigins: ['*'], // Ideally restrict this in production
                    allowedHeaders: ['*'],
                }],
        });
        // 7. Lambda to Process Excel Uploads
        const processExcelLambda = new lambda.Function(this, 'ProcessExcelHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/process-excel')),
            timeout: cdk.Duration.minutes(5),
            memorySize: 1024,
            environment: {
                TABLE_NAME: table.tableName,
            },
        });
        uploadsBucket.grantRead(processExcelLambda);
        table.grantWriteData(processExcelLambda);
        uploadsBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(processExcelLambda), { suffix: '.xls' });
        uploadsBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(processExcelLambda), { suffix: '.xlsx' });
        // 8. Notification Lambda (SES)
        const notificationLambda = new lambda.Function(this, 'NotificationHandler', {
            runtime: lambda.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: lambda.Code.fromAsset(path.join(__dirname, '../lambda/notification-handler')),
            environment: {
                SENDER_EMAIL: 'Daniel.guillen@protexwear.es',
            },
        });
        notificationLambda.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
            actions: ['ses:SendEmail', 'ses:SendRawEmail'],
            resources: ['*'],
        }));
        notificationLambda.grantInvoke(orderHandlerLambda);
        orderHandlerLambda.addEnvironment('NOTIFICATION_LAMBDA_NAME', notificationLambda.functionName);
        new cdk.CfnOutput(this, 'UploadsBucketName', { value: uploadsBucket.bucketName });
    }
}
exports.EcommerceStack = EcommerceStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNvbW1lcmNlLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWNvbW1lcmNlLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFtQztBQUVuQyxxREFBcUQ7QUFDckQsbURBQW1EO0FBQ25ELGlEQUFpRDtBQUNqRCxtREFBbUQ7QUFDbkQseUNBQXlDO0FBQ3pDLHdEQUF3RDtBQUN4RCw2QkFBNkI7QUFFN0IsTUFBYSxjQUFlLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDM0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM5RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QiwwQ0FBMEM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUN4RCxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNqRSxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUM1RCxXQUFXLEVBQUUsUUFBUSxDQUFDLFdBQVcsQ0FBQyxlQUFlO1lBQ2pELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQ0FBaUM7U0FDNUUsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLHVCQUF1QixDQUFDO1lBQzVCLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFlBQVksRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFO1lBQ3JFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFB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LEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztZQUNuRixXQUFXLEVBQUU7Z0JBQ1gsWUFBWSxFQUFFLDhCQUE4QjthQUM3QztTQUNGLENBQUMsQ0FBQztRQUVILGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO1lBQ2pFLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQztZQUM5QyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDLENBQUM7UUFFSixrQkFBa0IsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNuRCxrQkFBa0IsQ0FBQyxjQUFjLENBQUMsMEJBQTBCLEVBQUUsa0JBQWtCLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFL0YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUNwRixDQUFDO0NBQ0Y7QUF2T0Qsd0NBdU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcclxuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XHJcbmltcG9ydCAqIGFzIGR5bmFtb2RiIGZyb20gJ2F3cy1jZGstbGliL2F3cy1keW5hbW9kYic7XHJcbmltcG9ydCAqIGFzIGFwcHN5bmMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwcHN5bmMnO1xyXG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XHJcbmltcG9ydCAqIGFzIGNvZ25pdG8gZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZ25pdG8nO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBzM24gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLW5vdGlmaWNhdGlvbnMnO1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEVjb21tZXJjZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAvLyAxLiBEeW5hbW9EQiBUYWJsZSAoU2luZ2xlIFRhYmxlIERlc2lnbilcclxuICAgIGNvbnN0IHRhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdQcm90ZXhXZWFyVGFibGUnLCB7XHJcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnUEsnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICdTSycsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksIC8vIENhbWJpYXIgYSBSRVRBSU4gZW4gUHJvZHVjY2nDs25cclxuICAgIH0pO1xyXG5cclxuICAgIHRhYmxlLmFkZEdsb2JhbFNlY29uZGFyeUluZGV4KHtcclxuICAgICAgaW5kZXhOYW1lOiAnR1NJMScsXHJcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAnR1NJMVBLJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgc29ydEtleTogeyBuYW1lOiAnR1NJMVNLJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIDEuNS4gQ29nbml0byBVc2VyIFBvb2xcclxuICAgIGNvbnN0IHVzZXJQb29sID0gbmV3IGNvZ25pdG8uVXNlclBvb2wodGhpcywgJ1Byb3RleFdlYXJVc2VyUG9vbCcsIHtcclxuICAgICAgdXNlclBvb2xOYW1lOiAnUHJvdGV4V2VhclVzZXJzJyxcclxuICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHsgZW1haWw6IHRydWUgfSxcclxuICAgICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSB9LFxyXG4gICAgICBwYXNzd29yZFBvbGljeToge1xyXG4gICAgICAgIG1pbkxlbmd0aDogOCxcclxuICAgICAgICByZXF1aXJlTG93ZXJjYXNlOiB0cnVlLFxyXG4gICAgICAgIHJlcXVpcmVVcHBlcmNhc2U6IHRydWUsXHJcbiAgICAgICAgcmVxdWlyZURpZ2l0czogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgICAgZW1haWw6IGNvZ25pdG8uVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcclxuICAgICAgICBmcm9tRW1haWw6ICdEYW5pZWwuZ3VpbGxlbkBwcm90ZXh3ZWFyLmVzJyxcclxuICAgICAgICBmcm9tTmFtZTogJ1Byb3RleCBXZWFyJyxcclxuICAgICAgICByZXBseVRvOiAnRGFuaWVsLmd1aWxsZW5AcHJvdGV4d2Vhci5lcycsXHJcbiAgICAgIH0pLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgdXNlclBvb2xDbGllbnQgPSBuZXcgY29nbml0by5Vc2VyUG9vbENsaWVudCh0aGlzLCAnUHJvdGV4V2VhclVzZXJQb29sQ2xpZW50Jywge1xyXG4gICAgICB1c2VyUG9vbCxcclxuICAgICAgYXV0aEZsb3dzOiB7XHJcbiAgICAgICAgdXNlclBhc3N3b3JkOiB0cnVlLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gMi4gQXBwU3luYyBHcmFwaFFMIEFQSVxyXG4gICAgY29uc3QgYXBpID0gbmV3IGFwcHN5bmMuR3JhcGhxbEFwaSh0aGlzLCAnUHJvdGV4V2VhckFwaScsIHtcclxuICAgICAgbmFtZTogJ3Byb3RleC13ZWFyLWFwaScsXHJcbiAgICAgIHNjaGVtYTogYXBwc3luYy5TY2hlbWFGaWxlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vZ3JhcGhxbC9zY2hlbWEuZ3JhcGhxbCcpKSxcclxuICAgICAgYXV0aG9yaXphdGlvbkNvbmZpZzoge1xyXG4gICAgICAgIGRlZmF1bHRBdXRob3JpemF0aW9uOiB7XHJcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5BUElfS0VZLCAvLyBQYXJhIGludml0YWRvc1xyXG4gICAgICAgICAgYXBpS2V5Q29uZmlnOiB7XHJcbiAgICAgICAgICAgIGV4cGlyZXM6IGNkay5FeHBpcmF0aW9uLmFmdGVyKGNkay5EdXJhdGlvbi5kYXlzKDM2NSkpLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGFkZGl0aW9uYWxBdXRob3JpemF0aW9uTW9kZXM6IFt7XHJcbiAgICAgICAgICBhdXRob3JpemF0aW9uVHlwZTogYXBwc3luYy5BdXRob3JpemF0aW9uVHlwZS5VU0VSX1BPT0wsIC8vIFBhcmEgdXN1YXJpb3MgY29uIEpXVFxyXG4gICAgICAgICAgdXNlclBvb2xDb25maWc6IHtcclxuICAgICAgICAgICAgdXNlclBvb2wsXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfV0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGxvZ0NvbmZpZzoge1xyXG4gICAgICAgIGZpZWxkTG9nTGV2ZWw6IGFwcHN5bmMuRmllbGRMb2dMZXZlbC5BTEwsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyAzLiBMYW1iZGFzIHkgRGF0YVNvdXJjZXNcclxuICAgIGNvbnN0IGdldFByb2R1Y3RMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdHZXRQcm9kdWN0SGFuZGxlcicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXHJcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9sYW1iZGEvZ2V0LXByb2R1Y3QnKSksXHJcbiAgICAgIGVudmlyb25tZW50OiB7XHJcbiAgICAgICAgVEFCTEVfTkFNRTogdGFibGUudGFibGVOYW1lLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gUGVybWlzb3MgcGFyYSBxdWUgbGEgTGFtYmRhIGxlYSBkZSBEeW5hbW9EQiAocHJvZHVjdG9zIHkgdGFibGEgcHVlbnRlKVxyXG4gICAgdGFibGUuZ3JhbnRSZWFkRGF0YShnZXRQcm9kdWN0TGFtYmRhKTtcclxuXHJcbiAgICBjb25zdCBsYW1iZGFEYXRhU291cmNlID0gYXBpLmFkZExhbWJkYURhdGFTb3VyY2UoJ0dldFByb2R1Y3REYXRhU291cmNlJywgZ2V0UHJvZHVjdExhbWJkYSk7XHJcblxyXG4gICAgLy8gNC4gUmVzb2x2ZXJzXHJcbiAgICBsYW1iZGFEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKCdHZXRQcm9kdWN0UmVzb2x2ZXInLCB7XHJcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxyXG4gICAgICBmaWVsZE5hbWU6ICdnZXRQcm9kdWN0JyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIDQuMS4gVXNlciBPcGVyYXRpb25zIExhbWJkYVxyXG4gICAgY29uc3QgdXNlckhhbmRsZXJMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdVc2VyT3BlcmF0aW9uc0hhbmRsZXInLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxyXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGFtYmRhL3VzZXItaGFuZGxlcicpKSxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBUQUJMRV9OQU1FOiB0YWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YSh1c2VySGFuZGxlckxhbWJkYSk7XHJcblxyXG4gICAgY29uc3QgdXNlckRhdGFTb3VyY2UgPSBhcGkuYWRkTGFtYmRhRGF0YVNvdXJjZSgnVXNlckRhdGFTb3VyY2UnLCB1c2VySGFuZGxlckxhbWJkYSk7XHJcbiAgICB1c2VyRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcignR2V0VXNlclByb2ZpbGVSZXNvbHZlcicsIHsgdHlwZU5hbWU6ICdRdWVyeScsIGZpZWxkTmFtZTogJ2dldFVzZXJQcm9maWxlJyB9KTtcclxuICAgIHVzZXJEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKCdMaXN0VXNlcnNSZXNvbHZlcicsIHsgdHlwZU5hbWU6ICdRdWVyeScsIGZpZWxkTmFtZTogJ2xpc3RVc2VycycgfSk7XHJcbiAgICB1c2VyRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcignVXBkYXRlVXNlclByb2ZpbGVSZXNvbHZlcicsIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ3VwZGF0ZVVzZXJQcm9maWxlJyB9KTtcclxuICAgIHVzZXJEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKCdTZXRTcGVjaWFsUHJpY2VSZXNvbHZlcicsIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ3NldFNwZWNpYWxQcmljZScgfSk7XHJcblxyXG4gICAgLy8gNC4yLiBPcmRlciBPcGVyYXRpb25zIExhbWJkYVxyXG4gICAgY29uc3Qgb3JkZXJIYW5kbGVyTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnT3JkZXJPcGVyYXRpb25zSGFuZGxlcicsIHtcclxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzIwX1gsXHJcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcclxuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9sYW1iZGEvb3JkZXItaGFuZGxlcicpKSxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBUQUJMRV9OQU1FOiB0YWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICAgIHRhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShvcmRlckhhbmRsZXJMYW1iZGEpO1xyXG5cclxuICAgIGNvbnN0IG9yZGVyRGF0YVNvdXJjZSA9IGFwaS5hZGRMYW1iZGFEYXRhU291cmNlKCdPcmRlckRhdGFTb3VyY2UnLCBvcmRlckhhbmRsZXJMYW1iZGEpO1xyXG4gICAgb3JkZXJEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKCdMaXN0VXNlck9yZGVyc1Jlc29sdmVyJywgeyB0eXBlTmFtZTogJ1F1ZXJ5JywgZmllbGROYW1lOiAnbGlzdFVzZXJPcmRlcnMnIH0pO1xyXG4gICAgb3JkZXJEYXRhU291cmNlLmNyZWF0ZVJlc29sdmVyKCdMaXN0QWxsT3JkZXJzUmVzb2x2ZXInLCB7IHR5cGVOYW1lOiAnUXVlcnknLCBmaWVsZE5hbWU6ICdsaXN0QWxsT3JkZXJzJyB9KTtcclxuICAgIG9yZGVyRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcignQ3JlYXRlT3JkZXJSZXNvbHZlcicsIHsgdHlwZU5hbWU6ICdNdXRhdGlvbicsIGZpZWxkTmFtZTogJ2NyZWF0ZU9yZGVyJyB9KTtcclxuXHJcbiAgICAvLyBSZXNvbHZlciBiw6FzaWNvIGRlIGxpc3RhZG8gZGlyZWN0byBhIER5bmFtb0RCIChvcGNpb25hbCwgc2kgc2UgcXVpZXJlIHBhZ2luYXIgc2luIGxhbWJkYSlcclxuICAgIGNvbnN0IGRiRGF0YVNvdXJjZSA9IGFwaS5hZGREeW5hbW9EYkRhdGFTb3VyY2UoJ0RiRGF0YVNvdXJjZScsIHRhYmxlKTtcclxuICAgIGRiRGF0YVNvdXJjZS5jcmVhdGVSZXNvbHZlcignTGlzdFByb2R1Y3RzUmVzb2x2ZXInLCB7XHJcbiAgICAgIHR5cGVOYW1lOiAnUXVlcnknLFxyXG4gICAgICBmaWVsZE5hbWU6ICdsaXN0UHJvZHVjdHMnLFxyXG4gICAgICByZXF1ZXN0TWFwcGluZ1RlbXBsYXRlOiBhcHBzeW5jLk1hcHBpbmdUZW1wbGF0ZS5mcm9tU3RyaW5nKGBcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcInZlcnNpb25cIjogXCIyMDE3LTAyLTI4XCIsXHJcbiAgICAgICAgICBcIm9wZXJhdGlvblwiOiBcIlNjYW5cIixcclxuICAgICAgICAgIFwibGltaXRcIjogJHV0aWwuZGVmYXVsdElmTnVsbCgkY3R4LmFyZ3MubGltaXQsIDI0KVxyXG4gICAgICAgICAgI2lmKCRjdHguYXJncy5uZXh0VG9rZW4pXHJcbiAgICAgICAgICAgICxcIm5leHRUb2tlblwiOiBcIiRjdHguYXJncy5uZXh0VG9rZW5cIlxyXG4gICAgICAgICAgI2VuZFxyXG4gICAgICAgICAgI3NldCgkZXhwcmVzc2lvbiA9IFwiXCIpXHJcbiAgICAgICAgICAjc2V0KCRleHByZXNzaW9uVmFsdWVzID0ge30pXHJcbiAgICAgICAgICBcclxuICAgICAgICAgICNpZigkY3R4LmFyZ3MuYnJhbmQpXHJcbiAgICAgICAgICAgICNzZXQoJGV4cHJlc3Npb24gPSBcImJyYW5kID0gOmJyYW5kXCIpXHJcbiAgICAgICAgICAgICR1dGlsLnFyKCRleHByZXNzaW9uVmFsdWVzLnB1dChcIjpicmFuZFwiLCB7IFwiU1wiOiBcIiRjdHguYXJncy5icmFuZFwiIH0pKVxyXG4gICAgICAgICAgI2VuZFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAjaWYoJGN0eC5hcmdzLmNhdGVnb3J5KVxyXG4gICAgICAgICAgICAjaWYoJGV4cHJlc3Npb24gIT0gXCJcIilcclxuICAgICAgICAgICAgICAjc2V0KCRleHByZXNzaW9uID0gXCIkZXhwcmVzc2lvbiBBTkQgY2F0ZWdvcnkgPSA6Y2F0ZWdvcnlcIilcclxuICAgICAgICAgICAgI2Vsc2VcclxuICAgICAgICAgICAgICAjc2V0KCRleHByZXNzaW9uID0gXCJjYXRlZ29yeSA9IDpjYXRlZ29yeVwiKVxyXG4gICAgICAgICAgICAjZW5kXHJcbiAgICAgICAgICAgICR1dGlsLnFyKCRleHByZXNzaW9uVmFsdWVzLnB1dChcIjpjYXRlZ29yeVwiLCB7IFwiU1wiOiBcIiRjdHguYXJncy5jYXRlZ29yeVwiIH0pKVxyXG4gICAgICAgICAgI2VuZFxyXG4gICAgICAgICAgXHJcbiAgICAgICAgICAjaWYoJGV4cHJlc3Npb24gIT0gXCJcIilcclxuICAgICAgICAgICAgLFwiZmlsdGVyXCI6IHtcclxuICAgICAgICAgICAgICBcImV4cHJlc3Npb25cIjogXCIkZXhwcmVzc2lvblwiLFxyXG4gICAgICAgICAgICAgIFwiZXhwcmVzc2lvblZhbHVlc1wiOiAkdXRpbC50b0pzb24oJGV4cHJlc3Npb25WYWx1ZXMpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICNlbmRcclxuICAgICAgICB9XHJcbiAgICAgIGApLFxyXG4gICAgICByZXNwb25zZU1hcHBpbmdUZW1wbGF0ZTogYXBwc3luYy5NYXBwaW5nVGVtcGxhdGUuZnJvbVN0cmluZyhgXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpdGVtc1wiOiAkdXRpbC50b0pzb24oJGN0eC5yZXN1bHQuaXRlbXMpLFxyXG4gICAgICAgICAgXCJuZXh0VG9rZW5cIjogJHV0aWwudG9Kc29uKCR1dGlsLmRlZmF1bHRJZk51bGxPckJsYW5rKCRjb250ZXh0LnJlc3VsdC5uZXh0VG9rZW4sIG51bGwpKVxyXG4gICAgICAgIH1cclxuICAgICAgYCksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyA1LiBPdXRwdXRzIHBhcmEgZmFjaWxpdGFyIGRlc2Fycm9sbG9cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdHcmFwaFFMQVBJVVJMJywgeyB2YWx1ZTogYXBpLmdyYXBocWxVcmwgfSk7XHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnR3JhcGhRTEFQSUtleScsIHsgdmFsdWU6IGFwaS5hcGlLZXkgfHwgJ05vIEFwaSBLZXkgR2VuZXJhdGVkJyB9KTtcclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdUYWJsZU5hbWUnLCB7IHZhbHVlOiB0YWJsZS50YWJsZU5hbWUgfSk7XHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVXNlclBvb2xJZCcsIHsgdmFsdWU6IHVzZXJQb29sLnVzZXJQb29sSWQgfSk7XHJcbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnVXNlclBvb2xDbGllbnRJZCcsIHsgdmFsdWU6IHVzZXJQb29sQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQgfSk7XHJcblxyXG4gICAgLy8gNi4gUzMgQnVja2V0IGZvciBFeGNlbCBVcGxvYWRzXHJcbiAgICBjb25zdCB1cGxvYWRzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnRXhjZWxVcGxvYWRzQnVja2V0Jywge1xyXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxyXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcclxuICAgICAgY29yczogW3tcclxuICAgICAgICBhbGxvd2VkTWV0aG9kczogW3MzLkh0dHBNZXRob2RzLlBVVCwgczMuSHR0cE1ldGhvZHMuUE9TVCwgczMuSHR0cE1ldGhvZHMuR0VUXSxcclxuICAgICAgICBhbGxvd2VkT3JpZ2luczogWycqJ10sIC8vIElkZWFsbHkgcmVzdHJpY3QgdGhpcyBpbiBwcm9kdWN0aW9uXHJcbiAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnKiddLFxyXG4gICAgICB9XSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIDcuIExhbWJkYSB0byBQcm9jZXNzIEV4Y2VsIFVwbG9hZHNcclxuICAgIGNvbnN0IHByb2Nlc3NFeGNlbExhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ1Byb2Nlc3NFeGNlbEhhbmRsZXInLCB7XHJcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18yMF9YLFxyXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXHJcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vbGFtYmRhL3Byb2Nlc3MtZXhjZWwnKSksXHJcbiAgICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDUpLFxyXG4gICAgICBtZW1vcnlTaXplOiAxMDI0LFxyXG4gICAgICBlbnZpcm9ubWVudDoge1xyXG4gICAgICAgIFRBQkxFX05BTUU6IHRhYmxlLnRhYmxlTmFtZSxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIHVwbG9hZHNCdWNrZXQuZ3JhbnRSZWFkKHByb2Nlc3NFeGNlbExhbWJkYSk7XHJcbiAgICB0YWJsZS5ncmFudFdyaXRlRGF0YShwcm9jZXNzRXhjZWxMYW1iZGEpO1xyXG5cclxuICAgIHVwbG9hZHNCdWNrZXQuYWRkRXZlbnROb3RpZmljYXRpb24oXHJcbiAgICAgIHMzLkV2ZW50VHlwZS5PQkpFQ1RfQ1JFQVRFRCxcclxuICAgICAgbmV3IHMzbi5MYW1iZGFEZXN0aW5hdGlvbihwcm9jZXNzRXhjZWxMYW1iZGEpLFxyXG4gICAgICB7IHN1ZmZpeDogJy54bHMnIH1cclxuICAgICk7XHJcbiAgICB1cGxvYWRzQnVja2V0LmFkZEV2ZW50Tm90aWZpY2F0aW9uKFxyXG4gICAgICBzMy5FdmVudFR5cGUuT0JKRUNUX0NSRUFURUQsXHJcbiAgICAgIG5ldyBzM24uTGFtYmRhRGVzdGluYXRpb24ocHJvY2Vzc0V4Y2VsTGFtYmRhKSxcclxuICAgICAgeyBzdWZmaXg6ICcueGxzeCcgfVxyXG4gICAgKTtcclxuXHJcbiAgICAvLyA4LiBOb3RpZmljYXRpb24gTGFtYmRhIChTRVMpXHJcbiAgICBjb25zdCBub3RpZmljYXRpb25MYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdOb3RpZmljYXRpb25IYW5kbGVyJywge1xyXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMjBfWCxcclxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxyXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2xhbWJkYS9ub3RpZmljYXRpb24taGFuZGxlcicpKSxcclxuICAgICAgZW52aXJvbm1lbnQ6IHtcclxuICAgICAgICBTRU5ERVJfRU1BSUw6ICdEYW5pZWwuZ3VpbGxlbkBwcm90ZXh3ZWFyLmVzJyxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG5cclxuICAgIG5vdGlmaWNhdGlvbkxhbWJkYS5hZGRUb1JvbGVQb2xpY3kobmV3IGNkay5hd3NfaWFtLlBvbGljeVN0YXRlbWVudCh7XHJcbiAgICAgIGFjdGlvbnM6IFsnc2VzOlNlbmRFbWFpbCcsICdzZXM6U2VuZFJhd0VtYWlsJ10sXHJcbiAgICAgIHJlc291cmNlczogWycqJ10sXHJcbiAgICB9KSk7XHJcblxyXG4gICAgbm90aWZpY2F0aW9uTGFtYmRhLmdyYW50SW52b2tlKG9yZGVySGFuZGxlckxhbWJkYSk7XHJcbiAgICBvcmRlckhhbmRsZXJMYW1iZGEuYWRkRW52aXJvbm1lbnQoJ05PVElGSUNBVElPTl9MQU1CREFfTkFNRScsIG5vdGlmaWNhdGlvbkxhbWJkYS5mdW5jdGlvbk5hbWUpO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdVcGxvYWRzQnVja2V0TmFtZScsIHsgdmFsdWU6IHVwbG9hZHNCdWNrZXQuYnVja2V0TmFtZSB9KTtcclxuICB9XHJcbn1cclxuIl19