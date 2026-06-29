fetch('https://forli.es/calzado-de-seguridad/49-bronx.html')
  .then(r => r.text())
  .then(html => {
    const m1 = html.match(/<img[^>]+id="bigpic"[^>]+src="([^"]+)"/i);
    const m2 = html.match(/<img[^>]+itemprop="image"[^>]+src="([^"]+)"/i);
    const m3 = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/ig);
    console.log('bigpic:', m1 ? m1[1] : null);
    console.log('itemprop:', m2 ? m2[1] : null);
    console.log('og:images:', m3);
  })
  .catch(console.error);
