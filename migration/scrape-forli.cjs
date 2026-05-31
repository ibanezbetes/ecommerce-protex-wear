const fs = require('fs');
const path = require('path');

async function scrapeForli() {
  const jsonPath = path.join(__dirname, 'unified_products.json');
  const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  let updatedCount = 0;

  for (const product of products) {
    if (product.brand === 'Forli') {
      for (const variant of product.variants) {
        if (variant.images && variant.images.length > 0) {
          const url = variant.images[0];
          // Si la URL es una página HTML, hacemos scraping
          if (url.includes('.html')) {
            try {
              console.log(`Scraping ${url}...`);
              const response = await fetch(url);
              const html = await response.text();
              
              // Buscar <meta property="og:image" content="...">
              const match = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
              
              if (match && match[1]) {
                const imageUrl = match[1];
                console.log(`   -> Extraída imagen: ${imageUrl}`);
                variant.images[0] = imageUrl;
                updatedCount++;
              } else {
                console.log(`   -> No se encontró og:image`);
                variant.images = []; // Lo vaciamos para que use el placeholder
              }
            } catch (err) {
              console.error(`Error al hacer fetch de ${url}:`, err.message);
              variant.images = [];
            }
          }
        }
      }
    }
  }

  if (updatedCount > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));
    console.log(`✅ ${updatedCount} URLs de imágenes de Forli actualizadas con éxito.`);
  } else {
    console.log("No se actualizó ninguna imagen.");
  }
}

scrapeForli().catch(console.error);
