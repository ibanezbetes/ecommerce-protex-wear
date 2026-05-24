import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
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

    // Resolver básico de listado directo a DynamoDB (opcional, si se quiere paginar sin lambda)
    const dbDataSource = api.addDynamoDbDataSource('DbDataSource', table);
    dbDataSource.createResolver('ListProductsResolver', {
      typeName: 'Query',
      fieldName: 'listProducts',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
        {
          "version": "2017-02-28",
          "operation": "Scan",
          "limit": $util.defaultIfNull($ctx.args.limit, 24),
          #if($ctx.args.nextToken)
            "nextToken": "$ctx.args.nextToken",
          #end
          #if($ctx.args.brand)
            "filter": {
              "expression": "brand = :brand",
              "expressionValues": {
                ":brand": $util.dynamodb.toDynamoDBJson($ctx.args.brand)
              }
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
  }
}
