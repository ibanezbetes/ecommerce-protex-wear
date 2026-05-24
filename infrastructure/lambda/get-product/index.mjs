import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  console.log("Event:", JSON.stringify(event, null, 2));
  
  const { id } = event.arguments;
  
  // 1. Obtener el producto base
  const getProductCommand = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      PK: `PRODUCT#${id}`,
      SK: `PRODUCT#${id}`,
    },
  });

  try {
    const { Item: product } = await docClient.send(getProductCommand);

    if (!product) {
      return null;
    }

    // 2. Si el usuario está autenticado, buscar si tiene precio especial
    // AppSync inyecta event.identity cuando hay un usuario logueado (por OIDC, Cognito, etc.)
    const userId = event.identity?.sub || event.identity?.username;
    
    if (userId) {
      const getPriceCommand = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: `USER#${userId}`,
          SK: `PRICE#${id}`, // En nuestra arquitectura es PK: USER#ID, SK: PRICE#PRODUCT_ID
        },
      });
      
      const { Item: specialPriceItem } = await docClient.send(getPriceCommand);
      
      if (specialPriceItem && specialPriceItem.custom_price != null) {
        // Sobrescribir los precios base de todas las variantes (o aplicar lógica específica)
        console.log(`Aplicando precio especial de ${specialPriceItem.custom_price} al usuario ${userId}`);
        product.variants = product.variants.map(variant => ({
          ...variant,
          basePrice: specialPriceItem.custom_price
        }));
      }
    }

    return product;
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    throw new Error("No se pudo obtener el producto");
  }
};
