const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, ScanCommand, GetCommand, PutCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { LambdaClient, InvokeCommand } = require("@aws-sdk/client-lambda");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const lambdaClient = new LambdaClient({});

const TABLE_NAME = process.env.TABLE_NAME;
const NOTIFICATION_LAMBDA_NAME = process.env.NOTIFICATION_LAMBDA_NAME;

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
    case 'createOrder':
      return await createOrder(args.input, userId, identity.claims ? identity.claims.email : null);
    case 'updateOrderStatus':
      await requireAdmin(userId);
      return await updateOrderStatus(args.orderId, args.userId, args.status);
    default:
      throw new Error(`Unsupported field: ${fieldName}`);
  }
};

async function updateOrderStatus(orderId, customerUserId, status) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `ORDER#USER#${customerUserId}`,
      SK: `ORDER#${orderId}`
    },
    UpdateExpression: "SET #st = :status",
    ExpressionAttributeNames: {
      "#st": "status"
    },
    ExpressionAttributeValues: {
      ":status": status
    },
    ReturnValues: "ALL_NEW"
  };

  const { Attributes } = await docClient.send(new UpdateCommand(params));
  
  if (!Attributes) {
    throw new Error("Order not found");
  }

  return {
    ...Attributes,
    id: Attributes.orderId || Attributes.id,
    totalAmount: Attributes.totalAmount || Attributes.total || 0,
    items: (Attributes.items || []).map(i => ({
      ...i,
      priceAtPurchase: i.priceAtPurchase || i.price || 0
    }))
  };
}

async function requireAdmin(userId) {
  const { Item } = await docClient.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: { PK: `USER#${userId}`, SK: `USER#${userId}` }
  }));
  if (!Item || Item.role !== 'ADMIN') {
    throw new Error("Forbidden: Admin access required");
  }
}

async function createOrder(input, userId, email) {
  const orderId = `ORD-${Date.now()}`;
  
  const order = { ...input, orderId, userId, orderDate: new Date().toISOString(), status: 'PENDING' };
  const putParams = {
    TableName: TABLE_NAME,
    Item: {
      PK: `ORDER#USER#${userId}`,
      SK: `ORDER#${orderId}`,
      type: "Order",
      ...order
    }
  };
  
  await docClient.send(new PutCommand(putParams));

  if (NOTIFICATION_LAMBDA_NAME && email) {
    const payload = {
      type: "OrderConfirmation",
      payload: {
        email: email,
        orderId: orderId,
        name: email.split('@')[0],
        total: order.total
      }
    };
    
    const adminPayload = {
      type: "AdminNewOrder",
      payload: {
        email: email,
        orderId: orderId,
        total: order.total
      }
    };
    
    try {
      await lambdaClient.send(new InvokeCommand({
        FunctionName: NOTIFICATION_LAMBDA_NAME,
        InvocationType: "Event",
        Payload: Buffer.from(JSON.stringify(payload))
      }));
      console.log(`Notification lambda invoked for order ${orderId} (Customer)`);

      await lambdaClient.send(new InvokeCommand({
        FunctionName: NOTIFICATION_LAMBDA_NAME,
        InvocationType: "Event",
        Payload: Buffer.from(JSON.stringify(adminPayload))
      }));
      console.log(`Notification lambda invoked for order ${orderId} (Admin)`);
    } catch (e) {
      console.error("Failed to invoke notification lambda", e);
    }
  }

  return { success: true, orderId: orderId, status: 'PENDING', message: "Order created successfully" };
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
  const items = Items || [];
  return items.map(item => ({
    ...item,
    id: item.orderId || item.id,
    totalAmount: item.totalAmount || item.total || 0,
    customerEmail: item.customerEmail || item.email || "N/A",
    items: (item.items || []).map(i => ({
      ...i,
      priceAtPurchase: i.priceAtPurchase || i.price || 0,
      image: i.image || null
    }))
  }));
}

async function listAllOrders(args) {
  const { status, email, startDate, endDate, limit = 20, nextToken } = args;

  // Para desarrollo, usaremos un Scan filtrado ya que GSI no está totalmente configurado para órdenes.
  // En producción, esto debería usar un GSI.
  
  let filterExpressions = ["begins_with(PK, :pkPrefix)"];
  let expressionAttributeNames = {};
  let expressionAttributeValues = { ":pkPrefix": "ORDER#USER#" };

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
    ExpressionAttributeValues: expressionAttributeValues,
    Limit: limit
  };
  
  if (Object.keys(expressionAttributeNames).length > 0) {
    params.ExpressionAttributeNames = expressionAttributeNames;
  }

  if (nextToken) {
    params.ExclusiveStartKey = JSON.parse(Buffer.from(nextToken, 'base64').toString('utf8'));
  }

  const { Items, LastEvaluatedKey } = await docClient.send(new ScanCommand(params));

  const items = Items || [];
  return {
    items: items.map(item => ({
      ...item,
      id: item.orderId || item.id,
      totalAmount: item.totalAmount || item.total || 0,
      customerEmail: item.customerEmail || item.email || "N/A",
      items: (item.items || []).map(i => ({
        ...i,
        priceAtPurchase: i.priceAtPurchase || i.price || 0,
        image: i.image || null
      }))
    })),
    nextToken: LastEvaluatedKey ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') : null
  };
}
