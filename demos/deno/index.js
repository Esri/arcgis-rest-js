import { searchItems } from "@esri/arcgis-rest-portal";

searchItems("water").then((response) => {
  console.log(response);
});
