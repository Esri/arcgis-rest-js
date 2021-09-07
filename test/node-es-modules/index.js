import { request } from "@esri/arcgis-rest-request";

request("https://www.arcgis.com/sharing/rest/info", {}).then((response) => {
  console.log(response);
});
