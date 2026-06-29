const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const xlsx = require('xlsx');

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const s3Client = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  try {
    for (const record of event.Records) {
      const bucket = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      
      console.log(`Processing file ${key} from bucket ${bucket}`);

      const s3Response = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key
      }));

      // Convert S3 Body to Buffer
      const stream = s3Response.Body;
      const chunks = [];
      for await (let chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      const workbook = xlsx.read(buffer, { type: 'buffer' });
      let products = [];

      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('anbor')) {
        products = processAnbor(workbook);
      } else if (lowerKey.includes('forli')) {
        products = await processForli(workbook);
      } else {
        console.warn(`Unrecognized provider for file ${key}. Expected 'anbor' or 'forli' in the filename.`);
        continue;
      }

      console.log(`Found ${products.length} products to insert.`);
      await batchInsertToDynamoDB(products);
    }
    return { statusCode: 200, body: 'Success' };
  } catch (err) {
    console.error("Error processing Excel from S3:", err);
    throw err;
  }
};

function inferCategory(name, description, extra = '') {
  const text = (name + ' ' + description + ' ' + extra).toLowerCase();
  
  if (text.match(/(casco|pantalla|visor|barboquejo|arnés para casco|sotocasco)/)) return 'cascos';
  if (text.match(/(zapato|bota|deportivo|calzado|zapatilla|plantilla)/)) return 'calzado';
  if (text.match(/(guante)/)) return 'guantes';
  if (text.match(/(pantalón|pantalon|bermuda|pantalones)/)) return 'pantalones';
  if (text.match(/(calcetín|calcetin|calcetines)/)) return 'calcetines';
  if (text.match(/(sudadera|jersey)/)) return 'sudaderas';
  if (text.match(/(camiseta|polo)/)) return 'camisetas';
  if (text.match(/(chaqueta|cazadora|parka|softshell|anorak|abrigo)/)) return 'chaquetas';
  if (text.match(/(chaleco)/)) return 'chalecos';
  if (text.match(/(gorra|delantal|cinturón|cinturon|rodillera|complemento|accesorio)/)) return 'accesorios';
  if (text.match(/(peto|buzo|ropa|casaca|bata|térmico)/)) return 'ropa de trabajo';
  
  return 'otros';
}

function processAnbor(workbook) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { range: 4 });
  const productsMap = {};

  data.forEach(row => {
    const rawParent = row['Referencia padre'];
    if (!rawParent) return;
    const parentRef = String(rawParent).trim();

    if (!productsMap[parentRef]) {
      productsMap[parentRef] = {
        PK: `PRODUCT#${parentRef}`,
        SK: `PRODUCT#${parentRef}`,
        type: 'Product',
        id: parentRef,
        name: row['Nombre:ES'] || '',
        description: row['Descripción:ES'] || '',
        brand: 'Anbor',
        category: inferCategory(row['Nombre:ES'] || '', row['Descripción:ES'] || '', row['Subfamilia'] || ''),
        variants: []
      };
    }

    const images = row['Imágenes'] ? row['Imágenes'].split(',').map(i => i.trim()) : [];
    const basePrice = parseFloat(row[' Precio Venta ']) || parseFloat(row['Precio Venta']) || 0;

    if (basePrice > 0) {
      productsMap[parentRef].variants.push({
        id: String(row['Referencia variante'] || row['Referencia']).trim(),
        sku: String(row['EAN']).trim(),
        size: String(row['Talla']),
        color: String(row['Color']),
        basePrice: basePrice,
        images: images
      });
    }
  });

  return Object.values(productsMap).filter(p => p.variants.length > 0);
}

async function processForli(workbook) {
  const sheetName = workbook.SheetNames.includes('Hoja1') ? 'Hoja1' : workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  const productsMap = {};
  const urlCache = new Map();

  for (const row of data) {
    const rawModel = row['MODELO'];
    if (!rawModel) continue;
    const model = String(rawModel).trim();

    if (!productsMap[model]) {
      productsMap[model] = {
        PK: `PRODUCT#${model}`,
        SK: `PRODUCT#${model}`,
        type: 'Product',
        id: model,
        name: `Modelo ${model}`,
        description: row['DESCRIPCION CORTA'] || '',
        brand: 'Forli',
        category: inferCategory(`Modelo ${model}`, row['DESCRIPCION CORTA'] || ''),
        variants: []
      };
    }

    let imageUrl = null;
    if (row['URL Web']) {
      const url = row['URL Web'];
      if (!urlCache.has(url)) {
        try {
          const res = await fetch(url);
          const html = await res.text();
          const match = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
          const scrapedImg = match ? match[1] : url;
          // Ignore generic Forli logo
          if (scrapedImg.includes('logo-1643882024.jpg')) {
            urlCache.set(url, null);
          } else {
            urlCache.set(url, scrapedImg);
          }
        } catch (e) {
          console.error('Error fetching image for Forli URL:', url);
          urlCache.set(url, url);
        }
      }
      imageUrl = urlCache.get(url);
    }

    const basePrice = parseFloat(row['PRECIO VENTA (SIN IVA)']) || parseFloat(row['PRECIO VENTA']) || 0;
    
    if (basePrice > 0) {
      productsMap[model].variants.push({
        id: String(row['REFERENCIA']).trim(),
        sku: String(row['EAN13']).trim(),
        size: String(row['Talla']),
        color: String(row['Color']),
        basePrice: basePrice,
        images: imageUrl ? [imageUrl] : []
      });
    }
  }

  return Object.values(productsMap).filter(p => p.variants.length > 0);
}

async function batchInsertToDynamoDB(products) {
  const chunkSize = 25;
  for (let i = 0; i < products.length; i += chunkSize) {
    const chunk = products.slice(i, i + chunkSize);
    const params = {
      RequestItems: {
        [TABLE_NAME]: chunk.map(product => ({
          PutRequest: { Item: product }
        }))
      }
    };

    try {
      await docClient.send(new BatchWriteCommand(params));
      console.log(`Inserted chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(products.length / chunkSize)}`);
    } catch (error) {
      console.error(`Error inserting chunk ${Math.floor(i / chunkSize) + 1}:`, error);
    }
  }
}
