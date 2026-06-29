const fs = require('fs');
const { execSync } = require('child_process');

const updates = [
  { PK: "PRODUCT#FOR.BRONX", url: "https://forli.es/602/BRONX.jpg" },
  { PK: "PRODUCT#FOR.BALTIMORE", url: "https://forli.es/608/BALTIMORE.jpg" },
  { PK: "PRODUCT#FOR.MEMPHIS", url: "https://forli.es/600/MEMPHIS.jpg" },
  { PK: "PRODUCT#FOR.HARLEM", url: "https://forli.es/604/HARLEM.jpg" },
  { PK: "PRODUCT#FOR.SIDNEY", url: "https://forli.es/606/SIDNEY.jpg" },
  { PK: "PRODUCT#FOR.CLEVELAND", url: "https://forli.es/599/CLEVELAND.jpg" }
];

const tableName = "EcommerceProtexWearStack-ProtexWearTableF73247B0-790OR4SHOYCU";
const region = "eu-west-1";

updates.forEach(update => {
  // get item
  const getCmd = `aws dynamodb get-item --table-name ${tableName} --key "{\\"PK\\": {\\"S\\": \\"${update.PK}\\"}, \\"SK\\": {\\"S\\": \\"${update.PK}\\"}}" --region ${region} --output json`;
  const result = JSON.parse(execSync(getCmd).toString());
  const item = result.Item;
  if (!item) return;

  // replace logo with proper url
  item.variants.L.forEach(v => {
    v.M.images.L = [{ S: update.url }];
  });

  const putParams = {
    TableName: tableName,
    Item: item
  };
  fs.writeFileSync('temp.json', JSON.stringify(putParams));
  execSync(`aws dynamodb put-item --cli-input-json file://temp.json --region ${region}`);
  console.log(`Updated ${update.PK} successfully.`);
});
