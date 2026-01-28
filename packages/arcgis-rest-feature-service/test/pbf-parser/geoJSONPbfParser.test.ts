import { describe, expect, test } from "vitest";
import { readEnvironmentFileToArrayBuffer } from "../utils/readFileArrayBuffer.js";
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";

describe("geoJSONPbfParser should decode each geometry type", () => {
  test("should decode POINT pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPointResponse.pbf"
    );

    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Point");
  });

  test("should decode POLYLINE pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFLineResponse.pbf"
    );

    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "LineString");
  });

  test("should decode POLYGON pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponse.pbf"
    );

    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Polygon");
  });
});
