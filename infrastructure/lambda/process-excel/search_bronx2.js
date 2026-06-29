fetch('https://forli.es/busqueda?s=BRONX')
  .then(r => r.text())
  .then(html => {
    const urls = [];
    const regex = /<a\s+class="thumbnail\s+product-thumbnail"\s+href="([^"]+)"/ig;
    let m;
    while ((m = regex.exec(html)) !== null) {
      urls.push(m[1]);
    }
    console.log('Search URLs for BRONX:', urls);
  })
  .catch(console.error);
