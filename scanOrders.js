const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

async function scanOrders() {
  const params = {
    TableName: "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU",
    FilterExpression: "begins_with(PK, :pk)",
    ExpressionAttributeValues: {
      ":pk": "ORDER#"
    }
  };
  try {
    const data = await docClient.send(new ScanCommand(params));
    console.log(JSON.stringify(data.Items, null, 2));
  } catch (err) {
    console.error(err);
  }
}

scanOrders();
