import { ApiKeyManager } from "@esri/arcgis-rest-request";
import {
  findPlacesNearPoint,
  findPlacesWithinExtent,
  getPlaceDetails,
  getCategories,
  getCategory
} from "@esri/arcgis-rest-places";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const authentication = ApiKeyManager.fromKey(process.env.API_KEY as string);

let lastResponse = await findPlacesNearPoint({
  x: -3.1883,
  y: 55.9533,
  radius: 100,
  authentication
});

fs.promises.writeFile(
  "./nearPoint.mock.json",
  JSON.stringify(lastResponse, null, 2)
);

let allPlaces = lastResponse.results;

while (lastResponse.nextPage) {
  lastResponse = await lastResponse.nextPage();
  allPlaces = allPlaces.concat(lastResponse.results);
}

console.log("Found all near point:", allPlaces.length);

const extentResults = await findPlacesWithinExtent({
  xmin: -118.013334,
  ymin: 33.78193,
  xmax: -117.995753,
  ymax: 33.833337,
  categoryIds: ["13002"],
  authentication
});

fs.promises.writeFile(
  "./extent.mock.json",
  JSON.stringify(extentResults, null, 2)
);

const placeResult = await getPlaceDetails({
  placeId: extentResults.results[0].placeId,
  requestedFields: ["all"],
  authentication
});

fs.promises.writeFile(
  "./place.mock.json",
  JSON.stringify(placeResult, null, 2)
);

console.log("Found within extent: ", placeResult.placeDetails.name);

if (placeResult.placeDetails.categories) {
  const categoryDetails = await Promise.all(
    placeResult.placeDetails.categories.map(
      ({ categoryId }: { categoryId: string }) => {
        return getCategory({
          categoryId,
          authentication
        });
      }
    )
  );

  console.log(
    "Place categories: ",
    categoryDetails
      .reduce((labels: string[], { fullLabel }) => {
        return [...new Set(labels.concat(fullLabel as any))];
      }, [])
      .join(", ")
  );
}

const { categories } = await getCategories({ authentication });

console.log("Found categories: ", categories.length);

fs.promises.writeFile(
  "./categories.mock.json",
  JSON.stringify(categories, null, 2)
);
const categoryMock = await getCategory({
  categoryId: "10000",
  authentication
});

fs.promises.writeFile(
  "./category.mock.json",
  JSON.stringify(categoryMock, null, 2)
);

const searchCategoriesMock = await getCategories({
  filter: "Tea",
  authentication
});
fs.promises.writeFile(
  "./searchCategories.mock.json",
  JSON.stringify(searchCategoriesMock, null, 2)
);

const categoryResults = await getCategories({
  filter: "Tea",
  authentication
});

console.log(`Categories matching "Tea":`, categoryResults.categories.length);

try {
  await findPlacesNearPoint({
    x: -3.1883,
    y: 55.9533,
    categoryIds: ["13002"],
    offset: 300,
    authentication
  });
} catch (e: any) {
  if (
    e.message ===
    "HTTP 400 Bad Request: Parameter invalid. Invalid parameter: 'offset' value: '300'. The value must be a number between 0 and 200."
  ) {
    console.log("Expected error thrown");
  }
}

const searchTextResults = await findPlacesWithinExtent({
  xmin: -118.013334,
  ymin: 33.78193,
  xmax: -117.995753,
  ymax: 33.833337,
  searchText: "coffee",
  authentication
});

fs.promises.writeFile(
  "./searchText.mock.json",
  JSON.stringify(searchTextResults, null, 2)
);
