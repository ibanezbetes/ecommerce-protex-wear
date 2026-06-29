const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const { fieldName } = event.info;
  const { identity, arguments: args } = event;

  // Si no hay identidad, rechazar
  if (!identity || !identity.sub) {
    throw new Error("Unauthorized");
  }

  const userId = identity.sub;
  const userEmail = identity.claims?.email || "";

  switch (fieldName) {
    case 'getUserProfile':
      return await getUserProfile(userId, userEmail);
    case 'updateUserProfile':
      return await updateUserProfile(userId, userEmail, args.input);
    case 'listUsers':
      await requireAdmin(userId);
      return await listUsers(args.limit, args.nextToken);
    case 'setSpecialPrice':
      await requireAdmin(userId);
      return await setSpecialPrice(args.userId, args.productId, args.specialPrice);
    default:
      throw new Error(`Unsupported field: ${fieldName}`);
  }
};

async function requireAdmin(userId) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: `USER#${userId}` }
  }));
  if (!Item || Item.role !== 'ADMIN') {
    throw new Error("Forbidden: Admin access required");
  }
}

async function getUserProfile(userId, defaultEmail) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: `USER#${userId}` }
  }));

  if (Item) {
    // Buscar precios especiales para este usuario
    const { Items: prices } = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `USER#${userId}`,
        ":skPrefix": "PRICE#"
      }
    }));
    return { ...Item, specialPrices: prices || [] };
  }

  // Si no existe, crear perfil base (lazy creation)
  const newUser = {
    PK: `USER#${userId}`,
    SK: `USER#${userId}`,
    type: 'User',
    id: userId,
    email: defaultEmail,
    role: 'USER', // Default role
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: newUser
  }));

  return { ...newUser, specialPrices: [] };
}

async function updateUserProfile(userId, email, input) {
  // Primero obtenemos el perfil existente (o lo creamos)
  const existingUser = await getUserProfile(userId, email);

  const updatedUser = {
    ...existingUser,
    ...input, // name, shippingAddress, billingAddress
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: updatedUser
  }));

  return updatedUser;
}

async function listUsers(limit = 20, nextToken) {
  // Como usamos Single Table Design y no hay un índice GSI específico para "type = User",
  // lo más óptimo a largo plazo es usar un GSI. Por ahora, si no hay muchos, podemos usar un Scan
  // o buscar en GSI1 si está configurado.
  // Asumamos que GSI1PK = "USERS" para todos los usuarios.
  
  // Para evitar errores si el GSI no está poblado, usaremos un Scan filtrado (para desarrollo)
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#type = :type",
    ExpressionAttributeNames: { "#type": "type" },
    ExpressionAttributeValues: { ":type": "User" },
    Limit: limit
  };
  
  if (nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString('utf8'));
  }

  const { Items, LastEvaluatedKey } = await docClient.send(new ScanCommand(params));

  return {
    items: Items || [],
    nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : null
  };
}

async function setSpecialPrice(userId, productId, specialPrice) {
  const item = {
    PK: `USER#${userId}`,
    SK: `PRICE#${productId}`,
    type: 'UserPrice',
    userId,
    productId,
    specialPrice
  };

  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: item
  }));

  return item;
}
