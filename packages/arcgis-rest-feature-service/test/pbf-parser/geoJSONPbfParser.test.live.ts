import { describe, expect, test } from "vitest";
import {
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  queryFeatures
} from "../../src/query.js";
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";
import pbfToArcGIS from "../../src/pbf-parser/arcGISPbfParser.js";

describe("decode: pbfToGeoJSON should decode each geometry type", () => {
  test("LIVE TEST: should decode zip code service POINT pbf to geojson", async () => {
    // handcraft pbf query to test pbfToGeoJSON output
    const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // pbf requests return data in web mercator by default (102100, EPSG:3857)
      // geojson crs format standard is EPSG:4326 lat/lon so we manually specify for pbf for pbf-as-geojson requests
      outSR: "4326"
    };
    const response = await queryFeatures(zipCodePointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);
    expect(geoJSON.type).toBe("FeatureCollection");
    expect(geoJSON.features.length).toBe(1);
    expect(geoJSON.properties).toHaveProperty("exceededTransferLimit");
    // verify geometry type
    expect(geoJSON.features[0].geometry.type).toBe("Point");
    // verify coordinates are lat/lon
    const coords = geoJSON.features[0].geometry.coordinates;
    expect(coords[0]).toBeLessThan(180);
    expect(coords[0]).toBeGreaterThan(-180);
    expect(coords[1]).toBeLessThan(90);
    expect(coords[1]).toBeGreaterThan(-90);
  });

  test("LIVE TEST: should decode landmark service POINT pbf to geojson", async () => {
    const landmarksPointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services9.arcgis.com/CAVmSZdRT9pdZgEk/arcgis/rest/services/Ball_Ground_Landmarks/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // geojson format should be EPSG:4326 lat/lon
      outSR: "4326"
    };
    const response = await queryFeatures(landmarksPointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);
    expect(geoJSON.features.length).toBe(1);
    expect(geoJSON.type).toBe("FeatureCollection");
    expect(geoJSON.properties).toHaveProperty("exceededTransferLimit");
    expect(geoJSON.features[0].type).toBe("Feature");
    expect(geoJSON.features[0].geometry.type).toBe("Point");
    // verify coordinates are lat/lon
    const coords = geoJSON.features[0].geometry.coordinates;
    expect(coords[0]).toBeLessThan(180);
    expect(coords[0]).toBeGreaterThan(-180);
    expect(coords[1]).toBeLessThan(90);
    expect(coords[1]).toBeGreaterThan(-90);
  });

  test("LIVE TEST: should decode LINE pbf to geojson", async () => {
    const trailsLinesPbfOptions: IQueryFeaturesOptions = {
      url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // geojson format should be EPSG:4326 lat/lon
      outSR: "4326"
    };
    const response = await queryFeatures(trailsLinesPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);
    expect(geoJSON.features.length).toBe(1);
    expect(geoJSON.features[0]).toHaveProperty("properties");
    // expect line shape
    expect(geoJSON.features[0].geometry.type).toBe("LineString");
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(22);
    const firstCoordSet = geoJSON.features[0].geometry.coordinates[0];
    // expect line coords to be lat/lon
    expect(firstCoordSet[0]).toBeLessThan(180);
    expect(firstCoordSet[0]).toBeGreaterThan(-180);
    expect(firstCoordSet[1]).toBeLessThan(90);
    expect(firstCoordSet[1]).toBeGreaterThan(-90);
  });

  test("LIVE TEST: should decode POLYGON pbf to geojson", async () => {
    const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // geojson format should be EPSG:4326 lat/lon
      outSR: "4326"
    };
    const response = await queryFeatures(parksPolygonsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);

    expect(geoJSON.features.length).toBe(1);
    expect(geoJSON.features[0]).toHaveProperty("properties");
    // expect polygon shape
    expect(geoJSON.features[0].geometry.type).toBe("Polygon");
    expect(geoJSON.features[0].geometry.coordinates.length).toBe(1);
    expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(181);
    const firstCoordSet = geoJSON.features[0].geometry.coordinates[0][0];
    // expect polygoon coords to be lat/lon
    expect(firstCoordSet[0]).toBeLessThan(180);
    expect(firstCoordSet[0]).toBeGreaterThan(-180);
    expect(firstCoordSet[1]).toBeLessThan(90);
    expect(firstCoordSet[1]).toBeGreaterThan(-90);
  });

  test("LIVE TEST: standard lat/long pbfToGeoJSON request should not include crs property in geojson object", async () => {
    const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // must specify pbf request to use crs of EPSG:4326 lat/lon for geojson standard
      // or default web mercator will be used
      outSR: "4326"
    };
    const response = await queryFeatures(zipCodePointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);

    console.log("=== GEOJSON CRS TEST RESPONSE ===");
    console.log(JSON.stringify(geoJSON, null, 2));

    // standard geojson response should not have crs property and should default to EPSG:4326 coordinates
    expect(geoJSON).not.toHaveProperty("crs");
    expect(geoJSON.features[0].geometry.type).toBe("Point");
    const coords = geoJSON.features[0].geometry.coordinates;
    // test specific values in this case
    expect(coords[0]).toBe(-73.045075);
    expect(coords[1]).toBe(40.816799);
  });

  test("LIVE TEST: web-mercator specified pbfToGeoJSON request should include crs property in geojson object", async () => {
    const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true,
      // specify web mercator in this case
      outSR: "102100"
    };
    const response = await queryFeatures(zipCodePointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const geoJSON = pbfToGeoJSON(arrBuffer);
    // geojson response should have crs property for web mercator
    expect(geoJSON).toHaveProperty("crs");
    expect(geoJSON.crs?.properties.name).toBe("EPSG:3857");
    expect(geoJSON.features[0].geometry.type).toBe("Point");
    const coords = geoJSON.features[0].geometry.coordinates;
    // test specific values in this case
    expect(coords[0]).toBe(-8131340.554);
    expect(coords[1]).toBe(4985356.9969);
  });
});
