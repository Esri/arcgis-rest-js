import { request } from "@esri/arcgis-rest-request";

console.log(request);

request("https://www.arcgis.com/sharing/rest/info").then((response) => {
  console.log(response);
});
