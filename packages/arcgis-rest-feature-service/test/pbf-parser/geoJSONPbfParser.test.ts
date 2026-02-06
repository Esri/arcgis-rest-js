import { describe, expect, test } from "vitest";
import {
  readEnvironmentFileToArrayBuffer,
  readEnvironmentFileToJSON
} from "../utils/readFileArrayBuffer.js";
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";
import {
  compareCoordinates,
  compareProperties,
  maxPrecision
} from "../utils/geoJsonTestHelpers.js";

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
    expect(geoJSON.features[0].geometry.coordinates[0][0][0].length).toBe(2);
  });

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
      compareProperties(geoJSONFeature.properties, pbfGeoJSONFeature.properties)
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

    // Coordinate precision reference (truncation-induced inaccuracies):
    // 5 decimal places: ~1.1 meters
    // 6 decimal places: ~1.1 decimeters (11 cm)
    // 7 decimal places: ~1.1 centimeters
    // 8 decimal places: ~1.1 millimeters
    // (at the equator; precision distance decreases with latitude)
    // Rounding to a precision will halve the inaccuracy, e.g., .5 meters at 5 decimal places

    // In this one polygon feature, we can only get total equality up to 5-digit precision.
    // theoretically and with rounding,
    // at 6 digit precision there are (1) coordinate differences of < (~11 cm / 2) (5.5 cm)
    // at 7 digit precision there are (3) coordinate differences of < (~1.1 cm / 2) (.55 cm)
    // at 8 digit precision there are (23) coordinate differences of < (~1.1 mm / 2) (.55 mm)
    const coordinatePrecision = 5;
    // at 5 digit precision, geojson and pbf coordinates all match
    const deviances = compareCoordinates(coordA, coordB, coordinatePrecision);
    // but could have drift of < .55 meter
    // this drift is due to the way pbf transforms and rebuilds coordinates using deltas to reconstruct coordinate values.
    // by preserving all digits and not rounding, the practical drift for the largest deviance in this single feature is 50 micrometers (.05mm).

    // therefore, for this test we will accept coordinates are close enough at 5 digit precision
    expect(deviances.length).toBe(0);

    const highPrecision = 6;
    const deviancesHighPrecision = compareCoordinates(
      coordA,
      coordB,
      highPrecision
    );
    // at 6 digit precision, there are (1)) coordinates that drift by < .05 millimeters (max coordinate deviance) for a single polygon feature
    expect(deviancesHighPrecision.length).toBe(1);
    const maxPrecisionHere = maxPrecision(coordA, coordB);
    // max precision where all coordinates match exactly is 5 decimals for this feature
    expect(maxPrecisionHere).toBe(coordinatePrecision);
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

    const coordinatePrecision = 7;
    const deviances = compareCoordinates(coordA, coordB, coordinatePrecision);
    // for this line feature, the max drift between a geojson and corresponding pbf coordinate is less than 50 micrometers or .05 mm
    expect(deviances.length).toBe(0);
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
