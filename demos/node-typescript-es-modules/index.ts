import { searchItems } from "@esri/arcgis-rest-portal";

// If you are using node < 14.8, you need to wrap the await in an async IFFE
//(async function () {
const response = await searchItems("water");
console.log(`Public item search for "water": ${response.total} total results`);
response.results.map((itm) => {
  console.log(`Title: ${itm.title}`);
});
// })();
