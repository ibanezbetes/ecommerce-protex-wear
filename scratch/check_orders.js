const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";

async function run() {
  const { Items } = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
    FilterExpression: "begins_with(PK, :pkPrefix)",
    ExpressionAttributeValues: { ":pkPrefix": "ORDER#USER#" }
  }));
  
  console.log(`Found ${Items.length} orders.`);
  
  const issues = Items.filter(i => !i.userId);
  if (issues.length > 0) {
    console.log(`WARNING: ${issues.length} orders have no userId!`);
  }
  
  const duplicated = Items.filter(i => i.PK.includes("undefined"));
  if (duplicated.length > 0) {
    console.log(`WARNING: ${duplicated.length} orders have undefined in PK!`);
    console.log(duplicated.map(d => ({ PK: d.PK, SK: d.SK, status: d.status })));
  }

  // Find a specific order that is pending
  const pendingOrders = Items.filter(i => i.status === 'PENDING' || i.status === 'CONFIRMED');
  console.log("Recent orders:", pendingOrders.slice(0, 5).map(o => ({ PK: o.PK, SK: o.SK, id: o.orderId, userId: o.userId, status: o.status })));
}
run();
