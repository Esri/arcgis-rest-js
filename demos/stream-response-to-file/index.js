const { queryFeatures } = require("@esri/arcgis-rest-feature-service");
const fs = require("fs");

const outFileName = `./output/${Date.now()}.geojson`;
const outFile = fs.createWriteStream(outFileName);
const serviceUrl =
  "https://services.arcgis.com/uUvqNMGPm7axC2dD/arcgis/rest/services/Boating_Access_Sites/FeatureServer/0/query";

// const params = {
//   outSR: "4326",
//   returnGeometry: true,
//   f: "geojson"
// };

queryFeatures({
  url: serviceUrl,
  outSR: "4326",
  returnGeometry: true,
  f: "geojson",
  rawResponse: true
})
  .then((resp) => {
    //Access any response methods, or ReadableStream body
    //https://developer.mozilla.org/en-US/docs/Web/API/Response
    const stream = resp.body;
    stream.pipe(outFile);
    stream.on("data", (data) => {
      console.log("Buffering: ", data);
    });
    stream.on("end", () => {
      console.log(`Finished: ${outFileName}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
