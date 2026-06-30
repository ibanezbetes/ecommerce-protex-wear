const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";

async function run() {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: {
        PK: "ORDER#USER#92b5f404-f041-7082-b52a-b086c8b585ff",
        SK: "ORDER#ORD-1782831417592"
      },
      UpdateExpression: "SET #st = :status",
      ExpressionAttributeNames: {
        "#st": "status"
      },
      ExpressionAttributeValues: {
        ":status": "CONFIRMED"
      },
      ReturnValues: "ALL_NEW"
    };

    console.log("Updating...", params.Key);
    const result = await docClient.send(new UpdateCommand(params));
    console.log("Success:", result.Attributes.status);
  } catch (err) {
    console.error("Error updating:", err);
  }
}
run();
