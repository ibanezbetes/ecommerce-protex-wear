const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function processAnbor() {
  const anborPath = path.join(__dirname, '../excels/Anbor completo.xls');
  if (!fs.existsSync(anborPath)) return [];
  
  const workbook = xlsx.readFile(anborPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { range: 4 });
  
  const products = {};

  data.forEach(row => {
    const rawParent = row['Referencia padre'];
    if (!rawParent) return;
    const parentRef = String(rawParent).trim();

    if (!products[parentRef]) {
      products[parentRef] = {
        PK: `PRODUCT#${parentRef}`,
        SK: `PRODUCT#${parentRef}`,
        type: 'Product',
        id: parentRef,
        name: row['Nombre:ES'] || '',
        description: row['Descripción:ES'] || '',
        brand: 'Anbor',
        variants: []
      };
    }

    const images = row['Imágenes'] ? row['Imágenes'].split(',').map(i => i.trim()) : [];
    const basePrice = parseFloat(row[' Precio Venta ']) || parseFloat(row['Precio Venta']) || 0;

    products[parentRef].variants.push({
      id: String(row['Referencia variante'] || row['Referencia']).trim(),
      sku: String(row['EAN']).trim(),
      size: String(row['Talla']),
      color: String(row['Color']),
      basePrice: basePrice,
      images: images
    });
  });

  return Object.values(products);
}

function processForli() {
  const forliPath = path.join(__dirname, '../excels/Forli.xlsx');
  if (!fs.existsSync(forliPath)) return [];

  const workbook = xlsx.readFile(forliPath);
  const sheet = workbook.Sheets['Hoja1'];
  const data = xlsx.utils.sheet_to_json(sheet);

  const products = {};

  data.forEach(row => {
    const rawModel = row['MODELO'];
    if (!rawModel) return;
    const model = String(rawModel).trim();

    if (!products[model]) {
      products[model] = {
        PK: `PRODUCT#${model}`,
        SK: `PRODUCT#${model}`,
        type: 'Product',
        id: model,
        name: `Modelo ${model}`,
        description: row['DESCRIPCION CORTA'] || '',
        brand: 'Forli',
        variants: []
      };
    }

    products[model].variants.push({
      id: String(row['REFERENCIA']).trim(),
      sku: String(row['EAN13']).trim(),
      size: String(row['Talla']),
      color: String(row['Color']),
      basePrice: parseFloat(row['PRECIO VENTA (SIN IVA)']) || parseFloat(row['PRECIO VENTA']) || 0,
      images: row['URL Web'] ? [row['URL Web']] : []
    });
  });

  return Object.values(products);
}

function main() {
  const anborProducts = processAnbor();
  const forliProducts = processForli();
  const allProducts = [...anborProducts, ...forliProducts];
  
  if (allProducts.length === 0) {
      console.log("No se encontraron productos. Revisa la ruta de los excels.");
      return;
  }

  fs.writeFileSync(
    path.join(__dirname, 'unified_products.json'), 
    JSON.stringify(allProducts, null, 2)
  );
  console.log(`✅ ${allProducts.length} productos procesados correctamente.`);
}

main();
