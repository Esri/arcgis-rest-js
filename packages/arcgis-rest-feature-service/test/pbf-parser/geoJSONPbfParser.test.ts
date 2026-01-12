import { describe, expect, test } from "vitest";
import decode from "../../src/pbf-parser/geoJSONPbfParser.js";
import { readEnvironmentFileToArrayBuffer } from "../utils/readFileArrayBuffer.js";

describe("geoJSONPbfParser should decode each geometry type", () => {
  test("should decode POINT pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/PBFPointResponse.pbf"
    );

    const decoded = decode(arrayBuffer);
    expect(decoded.featureCollection.features[0].geometry).toHaveProperty(
      "type",
      "Point"
    );
  });

  test("should decode POLYLINE pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/PBFLineResponse.pbf"
    );

    const decoded = decode(arrayBuffer);
    expect(decoded.featureCollection.features[0].geometry).toHaveProperty(
      "type",
      "LineString"
    );
  });

  test("should decode POLYGON pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/PBFPolygonResponse.pbf"
    );

    const decoded = decode(arrayBuffer);
    expect(decoded.featureCollection.features[0].geometry).toHaveProperty(
      "type",
      "Polygon"
    );
  });
});
