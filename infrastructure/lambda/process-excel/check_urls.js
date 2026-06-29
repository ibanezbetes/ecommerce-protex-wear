const xlsx = require('xlsx');
const wb = xlsx.readFile('../../../excels/Forli.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
const urls = data.filter(r => r['URL Web'] || r['Link Articulo']).map(r => r['URL Web'] || r['Link Articulo']);
console.log(urls.slice(0, 5));
const bronxRow = data.find(r => r['MODELO'] === 'BRONX' || r['Etiquetas de fila'] === 'BRONX' || JSON.stringify(r).includes('BRONX'));
console.log('BRONX ROW:', bronxRow);
