import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'eu-west-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function check() {
  const data = await docClient.send(new ScanCommand({
    TableName: 'EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU',
    FilterExpression: 'begins_with(PK, :pk)',
    ExpressionAttributeValues: { ':pk': 'PRODUCT#' },
    Limit: 10
  }));
  console.log(data.Items?.map(i => ({ name: i.name, category: i.category })));
}
check().catch(console.error);
