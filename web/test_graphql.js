const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key) env[key] = values.join('=');
});

async function test() {
  const q = `query { getProduct(id: "01001 ") { id name brand } }`;
  const res = await fetch(env.NEXT_PUBLIC_APPSYNC_URL.trim(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.NEXT_PUBLIC_APPSYNC_API_KEY.trim()
    },
    body: JSON.stringify({ query: q })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
test();
