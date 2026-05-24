const fs = require('fs');
const path = require('path');

function verifyMigration() {
  const filePath = path.join(__dirname, 'unified_products.json');
  if (!fs.existsSync(filePath)) {
    console.error("El archivo JSON no existe.");
    return;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const totalProducts = data.length;
  let totalVariants = 0;
  let anborCount = 0;
  let forliCount = 0;
  
  data.forEach(product => {
    totalVariants += product.variants.length;
    if (product.brand === 'Anbor') anborCount++;
    if (product.brand === 'Forli') forliCount++;
  });

  console.log(`=== REPORTE DE QA DE MIGRACIÓN ===`);
  console.log(`📦 Total Productos (Padres): ${totalProducts} (Esperado: 282)`);
  console.log(`   ├─ Anbor: ${anborCount} (Esperado: 230)`);
  console.log(`   └─ Forli: ${forliCount} (Esperado: 52)`);
  console.log(`👕 Total Variantes (Tallas/Colores): ${totalVariants} (Esperado: 6190)`);
  
  console.log(`\n=== RESULTADO ===`);
  if (totalProducts === 282 && totalVariants === 6190) {
    console.log("✅ ÉXITO: El 100% de los datos se ha mapeado correctamente.");
  } else {
    console.log("❌ ALERTA: Hay un descuadre en los datos mapeados. Revisa el script de extracción.");
  }
}

verifyMigration();
