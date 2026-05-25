const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";

async function purge() {
  console.log(`Borrando tabla ${TABLE_NAME}...`);
  let lastEvaluatedKey = undefined;
  let totalDeleted = 0;

  do {
    const scan = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      ProjectionExpression: "PK, SK",
      ExclusiveStartKey: lastEvaluatedKey
    }));

    if (scan.Items && scan.Items.length > 0) {
      for (let i = 0; i < scan.Items.length; i += 25) {
        const chunk = scan.Items.slice(i, i + 25);
        await docClient.send(new BatchWriteCommand({
          RequestItems: {
            [TABLE_NAME]: chunk.map(item => ({
              DeleteRequest: { Key: item }
            }))
          }
        }));
        totalDeleted += chunk.length;
        console.log(`Borrados ${totalDeleted} items...`);
      }
    }
    lastEvaluatedKey = scan.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`Completado. Total borrados: ${totalDeleted}`);
}

purge().catch(console.error);
