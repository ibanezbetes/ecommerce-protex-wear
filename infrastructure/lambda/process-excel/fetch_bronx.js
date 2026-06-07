fetch('https://forli.es/calzado-de-seguridad/49-bronx.html')
  .then(r => r.text())
  .then(html => require('fs').writeFileSync('bronx.html', html))
  .catch(console.error);
