const models = ['BRONX', 'BALTIMORE', 'MEMPHIS', 'HARLEM', 'SIDNEY', 'CLEVELAND'];
const fs = require('fs');

async function fixImages() {
  const images = {};
  for (const m of models) {
    try {
      const res = await fetch(`https://forli.es/busqueda?s=${m}`);
      const html = await res.text();
      // look for data-src
      const imgMatch = html.match(new RegExp(`<img[^>]+data-src="([^"]+)"[^>]+alt="[^"]*${m}[^"]*"`, 'i'));
      if (imgMatch && imgMatch[1]) {
        images[m] = imgMatch[1].replace('-home_default', ''); // get original size
        console.log(`Found image for ${m}:`, images[m]);
      } else {
        console.log(`No image found for ${m}`);
      }
    } catch (e) {
      console.log(`Error for ${m}:`, e);
    }
  }
}

fixImages();
