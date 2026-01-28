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

describe("equality: pbfToGeoJSON should match ", () => {
  // ----------

  // const zipCodePointsJsonOptions: IQueryFeaturesOptions = {
  //   ...zipCodePointsPbfOptions,
  //   f: "geojson",
  //   rawResponse: false
  // };

  // // Route #1 get geojson response from service
  // const geoJsonResponse = await queryFeatures(zipCodePointsJsonOptions) as IQueryFeaturesResponse;
  // console.log("=== GEOJSON RESPONSE FROM SERVICE ===");
  // console.log(JSON.stringify(geoJsonResponse, null, 2));

  // //const geoJSON = pbfToGeoJSON(arrBuffer);
  // //console.log(JSON.stringify(geoJSON, null, 2));

  // // Route #3 get pbf response and convert to geojson through terrraformer
  // const arcgis = pbfToArcGIS(arrBuffer);
  // console.log(arcgis.spatialReference);

  // const response2 = await queryFeatures(zipCodePointsPbfOptions);
  // const arrBuffer2 = await (response2 as any).arrayBuffer();
  // const geoJSON2 = pbfToGeoJSON(arrBuffer2);
  // console.log("=== GEOJSON FROM PBF PARSER ===");
  // console.log(JSON.stringify(geoJSON2, null, 2));

  test("should compare pbfToGeoJSON object with geojson request object", async () => {
    const geojsonUrl =
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=geojson&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

    const pbfUrl =
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=pbf&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

    const liveGeoJsonResponse = await fetch(geojsonUrl);
    const livePbfResponse = await fetch(pbfUrl);
    const pbfArrayBuffer = await livePbfResponse.arrayBuffer();

    const pbfGeoJson = pbfToGeoJSON(pbfArrayBuffer);
    const geojson = await liveGeoJsonResponse.json();

    expect(geojson).toHaveProperty("crs");
    expect(pbfGeoJson).not.toHaveProperty("crs");
    expect(pbfGeoJson.type).toEqual(geojson.type);
    expect(pbfGeoJson.features).toEqual(geojson.features);
  });

  test("should compare pbf-as-geojson queryFeatures response with geojson queryFeatures response", async () => {
    const testPbfAsGeoJson: IQueryFeaturesOptions = {
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
      f: "pbf-as-geojson",
      objectIds: [49481],
      outFields: [
        "B12001_calc_numDivorcedE",
        "B12001_calc_numMarriedE",
        "B12001_calc_numNeverE",
        "B12001_calc_pctMarriedE",
        "County",
        "NAME",
        "OBJECTID"
      ],
      outSR: "102100",
      returnGeometry: true,
      spatialRel: "esriSpatialRelIntersects",
      where: "1=1"
    };

    const testGeoJson: IQueryFeaturesOptions = {
      ...testPbfAsGeoJson,
      f: "geojson"
    };

    const responseGeoJson = (await queryFeatures(
      testGeoJson
    )) as IQueryFeaturesResponse;
    const responsePbfAsGeoJson = (await queryFeatures(
      testPbfAsGeoJson
    )) as IQueryFeaturesResponse;

    expect(responseGeoJson).toHaveProperty("crs");
    expect(responsePbfAsGeoJson).not.toHaveProperty("crs");
    expect(responseGeoJson).toHaveProperty("type");
    expect(responsePbfAsGeoJson).not.toHaveProperty("type");
    expect(responsePbfAsGeoJson.features.length).toEqual(
      responseGeoJson.features.length
    );
    expect((responseGeoJson.features[0].geometry as any).type).toEqual(
      (responsePbfAsGeoJson.features[0].geometry as any).type
    );
    expect(
      (responseGeoJson.features[0].geometry as any).coordinates.length
    ).toEqual(
      (responsePbfAsGeoJson.features[0].geometry as any).coordinates.length
    );
  });
});
