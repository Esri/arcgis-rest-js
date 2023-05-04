import { authentication } from "./auth.js";
import { findPlacesNearPoint } from "@esri/arcgis-rest-places";

(async () => {
  let lastResponse = await findPlacesNearPoint({
    x: -74.00731801986696,
    y: 40.71120251262453,
    radius: 400,
    categoryIds: [13000],
    pageSize: 20,
    authentication
  });

  let allPlaces = lastResponse.results;

  while (lastResponse.nextPage) {
    lastResponse = await lastResponse.nextPage();
    allPlaces = allPlaces.concat(lastResponse.results);
  }

  console.log(allPlaces.length);
})();
