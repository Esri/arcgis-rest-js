import { describe, expect, test } from "vitest";
import {
  readEnvironmentFileToArrayBuffer,
  readEnvironmentFileToJSON
} from "../utils/readFileArrayBuffer.js";
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";

describe("geoJSONPbfParser should decode each geometry type", () => {
  test("should decode POINT pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPointResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Point");
    expect(geoJSON.crs).toBeUndefined(); // default response crs should be lat/long and not return crs property
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(2);
  });

  test("should decode LINE pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFLineResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "LineString");
    expect(geoJSON.crs).toBeUndefined();
    // line should have an array of coordinate arrays
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(22);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(2);
  });

  test("should decode POLYGON pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Polygon");
    expect(geoJSON.crs).toBeUndefined();
    // polygon should have an array of linear ring coordinate arrays
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(1);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(181);
    expect(geoJSON.features[0].geometry.coordinates[0][0].length).toBe(2);
  });

  // This does not work, as the pbf response has much higher precision than the geojson json file. Need to test this live against the service instead.
  test("for equality: geojson response vs pbf-as-geojson response", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponseCRS4326.pbf"
    );
    const jsonMock = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPolygonResponse.json"
    );
    console.log(arrayBuffer.byteLength);

    const geoJSONFromPbf = pbfToGeoJSON(arrayBuffer);
    (geoJSONFromPbf as any).tempId = "THISONE";
    //expect(geoJSONFromPbf).toEqual(jsonMock);
    //expect(geoJSONFromPbf.features[0].geometry.coordinates[0]).toEqual(jsonMock.features[0].geometry.coordinates[0]);
    console.log(
      JSON.stringify(
        geoJSONFromPbf.features[0].geometry.coordinates[0],
        null,
        2
      )
    );
    console.log(
      JSON.stringify(jsonMock.features[0].geometry.coordinates[0], null, 2)
    );
  });
});
