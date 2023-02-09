import { searchItems } from "@esri/arcgis-rest-portal";

let element = document.createElement("pre");
document.body.appendChild(element);

searchItems("water").then((response) => {
  element.textContent = JSON.stringify(response, null, 2); // false
});
