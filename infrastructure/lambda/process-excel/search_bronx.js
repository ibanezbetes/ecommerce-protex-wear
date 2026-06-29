fetch('https://forli.es/busqueda?s=bronx')
  .then(r => r.text())
  .then(html => {
    const m = html.match(/<a[^>]+href="([^"]+bronx[^"]*)"/i);
    console.log(m ? m[1] : 'No URL found for bronx');
  })
  .catch(console.error);
