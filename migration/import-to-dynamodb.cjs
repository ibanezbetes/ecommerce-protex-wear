const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const fs = require('fs');
const path = require('path');

const client = new DynamoDBClient({ region: "eu-west-1" }); // Ajusta tu región o quítalo si usas DynamoDB Local
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME || "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";

async function importToDynamo() {
  const jsonPath = path.join(__dirname, 'unified_products.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.error("El archivo unified_products.json no existe. Ejecuta el script de migración primero.");
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Cargando ${products.length} productos en DynamoDB...`);

  // DynamoDB BatchWriteItem soporta un máximo de 25 elementos por petición
  const chunkSize = 25;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map(product => ({
          PutRequest: {
            Item: product
          }
        }))
      }
    };

    try {
      await docClient.send(new BatchWriteCommand(params));
      console.log(`Lote ${i / chunkSize + 1} insertado (${chunk.length} items).`);
    } catch (error) {
      console.error(`Error insertando el lote ${i / chunkSize + 1}:`, error);
    }
  }

  console.log("Carga completada.");
}

importToDynamo();
