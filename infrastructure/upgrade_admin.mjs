import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE_NAME = "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";
const client = new DynamoDBClient({ region: "eu-west-1" });
const docClient = DynamoDBDocumentClient.from(client);

async function main() {
  const { Items } = await docClient.send(new ScanCommand({
    TableName: TABLE_NAME,
  }));

  console.log("Todos los elementos en DynamoDB:", Items.length);
  
  const users = Items.filter(i => i.type === 'User' || (i.PK && i.PK.startsWith('USER#')));
  console.log("Usuarios encontrados:", users);

  const daniel = users.find(u => u.email === 'danielibabet@gmail.com');
  if (daniel) {
    daniel.role = "ADMIN";
    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: daniel
    }));
    console.log(`Usuario ${daniel.email} actualizado a ADMIN exitosamente.`);
  } else {
    console.log("No se encontro danielibabet@gmail.com en la base de datos.");
  }
}

main().catch(console.error);
