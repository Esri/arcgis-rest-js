const { request } = require("../../packages/arcgis-rest-request");
const fs = require("fs");
const fetch = require('node-fetch');
require('isomorphic-form-data')

const outFile = fs.createWriteStream(`./output/${Date.now()}.geojson`);
const serviceUrl = "https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Boating_Access_Sites/FeatureServer/0/query";

request(serviceUrl, {
  params: {
    where: "1=1",
    outSR: "4326",
    outFields: "*",
    returnGeometry: true,
    f: "geojson"
  },
  stream: true,
  fetch: fetch
}).then((resp) => {
  resp.pipe(outFile);
  resp.on('data', () => {
    console.log('Chunk received')
  });
  resp.on('end', () => {
    console.log('Finished!');
  });
}).catch((err) => {
  console.log(err);
})