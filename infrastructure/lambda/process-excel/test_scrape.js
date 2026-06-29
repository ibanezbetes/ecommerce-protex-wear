const url = 'https://forli.es/calzado-de-seguridad-ocupacional/265-2131-ALASKA.html';
fetch(url)
  .then(r => r.text())
  .then(html => {
    const match = html.match(/<meta property="og:image" content="([^"]+)"/);
    console.log(match ? match[1] : 'No og:image found');
  })
  .catch(console.error);
