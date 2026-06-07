const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  const { fieldName } = event.info;
  const { identity, arguments: args } = event;

  if (!identity || !identity.sub) {
    throw new Error("Unauthorized");
  }

  const userId = identity.sub;

  switch (fieldName) {
    case 'listUserOrders':
      return await listUserOrders(userId);
    case 'listAllOrders':
      await requireAdmin(userId);
      return await listAllOrders(args);
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

async function listUserOrders(userId) {
  const { Items } = await docClient.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
    ExpressionAttributeValues: {
      ":pk": `ORDER#USER#${userId}`, // Note: createOrder needs to save PK as ORDER#USER#<id> and SK as ORDER#<orderId>
      ":skPrefix": "ORDER#"
    }
  }));
  return Items || [];
}

async function listAllOrders(args) {
  const { status, email, startDate, endDate, limit = 20, nextToken } = args;

  // Para desarrollo, usaremos un Scan filtrado ya que GSI no está totalmente configurado para órdenes.
  // En producción, esto debería usar un GSI.
  
  let filterExpressions = ["#type = :type"];
  let expressionAttributeNames = { "#type": "type" };
  let expressionAttributeValues = { ":type": "Order" };

  if (status) {
    filterExpressions.push("#status = :status");
    expressionAttributeNames["#status"] = "status";
    expressionAttributeValues[":status"] = status;
  }

  if (email) {
    filterExpressions.push("contains(customerEmail, :email)");
    expressionAttributeValues[":email"] = email;
  }

  if (startDate && endDate) {
    filterExpressions.push("orderDate BETWEEN :startDate AND :endDate");
    expressionAttributeValues[":startDate"] = startDate;
    expressionAttributeValues[":endDate"] = endDate;
  }

  const params = {
    TableName: TABLE_NAME,
    FilterExpression: filterExpressions.join(" AND "),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
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
