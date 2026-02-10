import { describe, expect, test } from "vitest";
import {
  readEnvironmentFileToArrayBuffer,
  readEnvironmentFileToJSON
} from "../utils/readFileArrayBuffer.js";
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";
import {
  compareKeysAndValues,
  CoordinateToleranceEnum,
  maxDifference
} from "../utils/parserTestHelpers.js";

describe("decode: geoJSONPbfParser should convert pbf arraybuffers to geoJSON objects", () => {
  test("should decode POINT pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPointResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Point");
    expect(geoJSON).not.toHaveProperty("crs"); // default response crs should be lat/long and not return crs property
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(2);
  });

  test("should decode LINE pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFLineResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "LineString");
    expect(geoJSON).not.toHaveProperty("crs");
    // line should have an array of coordinate arrays
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(22);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(2);
  });

  test("should decode POLYGON pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "Polygon");
    expect(geoJSON).not.toHaveProperty("crs");
    // polygon should have an array of linear ring coordinate arrays
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(1);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(181);
    expect(geoJSON.features[0].geometry.coordinates[0][0].length).toBe(2);
  });

  test("should decode MULTIPOLYGON pbf to geojson", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFMultiPolygonResponseCRS4326.pbf"
    );
    const geoJSON = pbfToGeoJSON(arrayBuffer);
    expect(geoJSON.features[0].geometry).toHaveProperty("type", "MultiPolygon");
    // multipolygon should have an array of polygon coordinate arrays
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(7);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(1);
    expect(geoJSON.features[0].geometry.coordinates[0][0].length).toBe(30);
    expect(geoJSON.features[0].geometry.coordinates[0][0][0].length).toBe(2);
  });
});

describe("equality: pbfToGeoJSON objects should closely match geoJSON responses", () => {
  // test the shape and structure of geojson and pbf-decoded geojson
  test("equality: geojson POINT vs decoded pbf POINT", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPointResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPointResponse.json"
    );
    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    expect(geoJSON.type).toEqual(pbfGeoJSON.type);
    expect(geoJSON.properties?.exceededTransferLimit).toEqual(
      pbfGeoJSON.properties?.exceededTransferLimit
    );

    // test feature equality
    const geoJSONFeature = geoJSON.features[0];
    const pbfGeoJSONFeature = pbfGeoJSON.features[0];

    expect(geoJSONFeature.id).toEqual(pbfGeoJSONFeature.id);
    expect(geoJSONFeature.type).toEqual(pbfGeoJSONFeature.type);

    // check that the feature properties match on both objects.
    expect(geoJSONFeature.properties).toEqual(pbfGeoJSONFeature.properties);

    // test for geometry shape and coordinate lengths, not checking for coordinates equality in this test
    expect(geoJSONFeature.geometry.type).toBe(pbfGeoJSONFeature.geometry.type);
    expect(geoJSONFeature.geometry.type).toBe("Point");
    const geoJSONCoords = geoJSONFeature.geometry.coordinates;
    const pbfGeoJSONCoords = pbfGeoJSONFeature.geometry.coordinates;
    expect(geoJSONCoords.length).toEqual(pbfGeoJSONCoords.length);
    expect(geoJSONCoords.length).toEqual(2);
  });

  test("equality: geojson LINE vs decoded pbf LINE", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFLineResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONLineResponse.json"
    );
    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    // check top-level properties
    expect(geoJSON.type).toEqual(pbfGeoJSON.type);
    expect(geoJSON.properties?.exceededTransferLimit).toEqual(
      pbfGeoJSON.properties?.exceededTransferLimit
    );
    const geoJSONFeature = geoJSON.features[0];
    const pbfGeoJSONFeature = pbfGeoJSON.features[0];

    // test feature equality
    expect(geoJSONFeature.id).toEqual(pbfGeoJSONFeature.id);
    expect(geoJSONFeature.type).toEqual(pbfGeoJSONFeature.type);

    // using a custom matcher for comparing properties with potential decimal precision issues
    expect(
      compareKeysAndValues(
        geoJSONFeature.properties,
        pbfGeoJSONFeature.properties
      )
    ).toBe(true);
    expect(geoJSONFeature.geometry.type).toBe(pbfGeoJSONFeature.geometry.type);
    expect(geoJSONFeature.geometry.type).toBe("LineString");
    const geoJSONCoords = geoJSONFeature.geometry.coordinates;
    const pbfGeoJSONCoords = pbfGeoJSONFeature.geometry.coordinates;
    expect(geoJSONCoords.length).toEqual(pbfGeoJSONCoords.length);
    expect(geoJSONCoords.length).toEqual(22);
  });

  test("equality: geojson POLYGON vs decoded pbf POLYGON", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPolygonResponse.json"
    );

    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    expect(geoJSON.type).toEqual(pbfGeoJSON.type);
    expect(geoJSON.properties?.exceededTransferLimit).toEqual(
      pbfGeoJSON.properties?.exceededTransferLimit
    );
    const geoJSONFeature = geoJSON.features[0];
    const pbfGeoJSONFeature = pbfGeoJSON.features[0];

    expect(geoJSONFeature.id).toEqual(pbfGeoJSONFeature.id);
    expect(geoJSONFeature.type).toEqual(pbfGeoJSONFeature.type);

    // check that the feature properties match on both objects.
    expect(geoJSONFeature.properties).toEqual(pbfGeoJSONFeature.properties);

    // test for geometry shape and coordinate lengths, not checking for coordinates equality in this test
    expect(geoJSONFeature.geometry.type).toBe(pbfGeoJSONFeature.geometry.type);
    const geoJSONCoords = geoJSONFeature.geometry.coordinates;
    const pbfGeoJSONCoords = pbfGeoJSONFeature.geometry.coordinates;
    expect(geoJSONFeature.geometry.type).toBe("Polygon");
    expect(geoJSONCoords[0].length).toEqual(pbfGeoJSONCoords[0].length);
  });
});

describe("precision: pbfToGeoJSON geometries coordinates should match geoJSON coordinates up to precision tolerance", () => {
  // test for coordinate equality to a certain precision
  test("precision: geojson POLYGON coordinates should match pbf POLYGON coordinates to a certain precision", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPolygonResponse.json"
    );
    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    const coordA = geoJSON.features[0].geometry.coordinates;
    const coordB = pbfGeoJSON.features[0].geometry.coordinates;

    // EPSG: 4326 lat/long degrees precision tolerance (at equator):
    // 6 decimal places: ~1.1 decimeters (11 cm)
    // 7 decimal places: ~1.1 centimeters
    // 8 decimal places: ~1.1 millimeters
    // 9 decimal places: ~0.1 millimeters (100 micrometers)
    const tolerance = CoordinateToleranceEnum.EPSG_4326;
    const maxDrift = maxDifference(coordA, coordB);
    expect(maxDrift.diff).toBeLessThan(tolerance);
  });

  test("precision: geojson LINE coordinates should match pbf LINE coordinates to a certain precision", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFLineResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONLineResponse.json"
    );
    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    const coordA = geoJSON.features[0].geometry.coordinates;
    const coordB = pbfGeoJSON.features[0].geometry.coordinates;

    const tolerance = CoordinateToleranceEnum.EPSG_4326;
    const maxDrift = maxDifference(coordA, coordB);
    expect(maxDrift.diff).toBeLessThan(tolerance);
  });

  test("precision: geojson POINT coordinates should equal pbf POINT coordinates", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPointResponseCRS4326.pbf"
    );
    const geoJSON = await readEnvironmentFileToJSON(
      "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPointResponse.json"
    );
    const pbfGeoJSON = pbfToGeoJSON(arrayBuffer);

    const coordA = geoJSON.features[0].geometry.coordinates;
    const coordB = pbfGeoJSON.features[0].geometry.coordinates;

    // for this point feature the coordinates match exactly.
    expect(coordA).toEqual(coordB);
  });
});
