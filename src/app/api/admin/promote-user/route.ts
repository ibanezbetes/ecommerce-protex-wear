import { NextResponse } from 'next/server';
import { CognitoIdentityProviderClient, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({});
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export async function POST(request: Request) {
  try {
    const { email, id } = await request.json();

    if (!email || !id) {
      return NextResponse.json({ success: false, error: 'Email e ID son requeridos' }, { status: 400 });
    }

    // 1. Añadir al grupo de Cognito
    const userPoolId = process.env.COGNITO_USER_POOL_ID || "eu-west-1_47nTFEdd6";
    const cognitoCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: "ADMIN",
    });
    await cognitoClient.send(cognitoCommand);

    // 2. Actualizar rol en DynamoDB
    const tableName = process.env.DYNAMODB_TABLE_NAME || "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";
    const ddbCommand = new UpdateCommand({
      TableName: tableName,
      Key: {
        PK: `USER#${id}`,
        SK: `USER#${id}`
      },
      UpdateExpression: "SET #r = :role",
      ExpressionAttributeNames: {
        "#r": "role"
      },
      ExpressionAttributeValues: {
        ":role": "ADMIN"
      }
    });
    await docClient.send(ddbCommand);

    return NextResponse.json({ success: true, message: `Usuario ${email} añadido al grupo Admins y actualizado en BD` });
  } catch (error: any) {
    console.error('Error promote user:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
