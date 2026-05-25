const fs = require('fs');

const files = [
  'src/pages/HomePage.tsx',
  'src/components/Layout/Header.tsx',
  'src/components/Layout/Footer.tsx',
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Since the broken characters are actually the unicode replacement character \uFFFD () or \u01ED (ǭ)
  // Let's replace the whole word
  content = content.replace(/Protecci\S+n/g, 'Protección');
  content = content.replace(/m\S+s/g, 'más');
  content = content.replace(/a\S+os/g, 'años');
  content = content.replace(/cat\S+logo/g, 'catálogo');
  content = content.replace(/Env\S+o/g, 'Envío');
  content = content.replace(/R\S+pido/g, 'Rápido');
  content = content.replace(/pen\S+nsula/g, 'península');
  content = content.replace(/T\S+cnico/g, 'Técnico');
  content = content.replace(/Categor\S+as/g, 'Categorías');
  content = content.replace(/aqu\S+/g, 'aquí');
  content = content.replace(/qu\S+ elegir/g, 'qué elegir');
  
  // Custom manual replacements for specific cases seen in output:
  content = content.replace(/-\+Por/g, '¿Por');
  content = content.replace(/-\+Necesitas/g, '¿Necesitas');
  content = content.replace(/100\S/g, '100€');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Fixed', file);
});
