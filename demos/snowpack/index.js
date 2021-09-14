import { searchItems } from "@esri/arcgis-rest-portal";

let element = document.createElement("div");
document.body.appendChild(element);

searchItems("water").then((response) => {
  element.innerHTML = JSON.stringify(response); // false
});
