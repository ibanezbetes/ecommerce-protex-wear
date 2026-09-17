import { NextResponse } from 'next/server';
import { 
  CognitoIdentityProviderClient, 
  AdminCreateUserCommand, 
  AdminSetUserPasswordCommand 
} from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION || 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(ddbClient);

export async function POST(request: Request) {
  try {
    const { name, email, password, cif, role = 'USER', can_pay_later = false } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email y contraseña son obligatorios.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'La contraseña debe tener al menos 8 caracteres.' },
        { status: 400 }
      );
    }

    const userPoolId = process.env.COGNITO_USER_POOL_ID || "eu-west-1_47nTFEdd6";
    const tableName = process.env.DYNAMODB_TABLE_NAME || "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";

    // 1. Crear el usuario en Cognito pre-verificado (MessageAction: 'SUPPRESS' evita enviar emails automáticos)
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: name || email.split('@')[0] },
        ...(cif ? [{ Name: 'nickname', Value: cif }] : []),
      ],
    });

    const createRes = await cognitoClient.send(createUserCommand);
    const cognitoSub = createRes.User?.Attributes?.find(attr => attr.Name === 'sub')?.Value || createRes.User?.Username || email;

    // 2. Establecer contraseña permanente (Permanent: true hace que el usuario no necesite cambiar contraseña en el primer login)
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    });
    await cognitoClient.send(setPasswordCommand);

    // 3. Crear el registro en DynamoDB con el formato estándar del Single Table Design
    const now = new Date().toISOString();
    const newUserItem = {
      PK: `USER#${cognitoSub}`,
      SK: `USER#${cognitoSub}`,
      type: 'User',
      id: cognitoSub,
      email: email.toLowerCase(),
      name: name || email.split('@')[0],
      cif: cif || '',
      role: role.toUpperCase(),
      can_pay_later: Boolean(can_pay_later),
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: newUserItem,
    }));

    return NextResponse.json({
      success: true,
      message: `Usuario ${email} creado y verificado correctamente. Ya puede iniciar sesión.`,
      user: {
        id: cognitoSub,
        email,
        name: newUserItem.name,
        role: newUserItem.role,
        can_pay_later: newUserItem.can_pay_later,
        cif: newUserItem.cif,
      }
    });

  } catch (error: any) {
    console.error('Error al crear usuario desde Admin:', error);
    let errorMessage = error.message || 'Error interno al crear usuario.';
    if (error.name === 'UsernameExistsException') {
      errorMessage = 'Ya existe una cuenta registrada con este correo electrónico.';
    } else if (error.name === 'InvalidPasswordException') {
      errorMessage = 'La contraseña no cumple los requisitos (mínimo 8 caracteres, mayúsculas, minúsculas y números).';
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
