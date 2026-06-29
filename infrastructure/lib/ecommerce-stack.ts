import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as path from 'path';

export class EcommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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
        sesRegion: 'eu-west-1',
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

    uploadsBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(processExcelLambda),
      { suffix: '.xls' }
    );
    uploadsBucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(processExcelLambda),
      { suffix: '.xlsx' }
    );

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
