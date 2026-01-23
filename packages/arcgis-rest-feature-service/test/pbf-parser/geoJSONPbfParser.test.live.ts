import { describe, test } from "vitest";
import { IQueryFeaturesOptions, queryFeatures } from "../../src/query.js";
import decode from "../../src/pbf-parser/geoJSONPbfParser.js";

describe("LIVE: geoJSONPbfParser should decode each geometry type", () => {
  test("LIVE TEST: should decode zip code service POINT pbf to geojson", async () => {
    const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true
    };

    const response = await queryFeatures(zipCodePointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const decoded = decode(arrBuffer);
  });

  test("LIVE TEST: should decode landmark service POINT pbf to geojson", async () => {
    const landmarksPointsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services9.arcgis.com/CAVmSZdRT9pdZgEk/arcgis/rest/services/Ball_Ground_Landmarks/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true
    };

    const response = await queryFeatures(landmarksPointsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const decoded = decode(arrBuffer);
  });

  test("LIVE TEST: should decode LINE pbf to geojson", async () => {
    const trailsLinesPbfOptions: IQueryFeaturesOptions = {
      url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true
    };

    const response = await queryFeatures(trailsLinesPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const decoded = decode(arrBuffer);
  });

  test("LIVE TEST: should decode POLYGON pbf to geojson", async () => {
    const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true
    };

    const response = await queryFeatures(parksPolygonsPbfOptions);

    const arrBuffer = await (response as any).arrayBuffer();

    const decoded = decode(arrBuffer);
  });
});

// TODO: just added, need to clean this up
describe("pbfToGeoJSON", () => {
  test("should compare pbfToGeoJSON object with geojson request object", async () => {
    /** geojson response from service
    {
      type: 'FeatureCollection',
      crs: { type: 'name', properties: { name: 'EPSG:3857' } },
      features: [
        {
          type: 'Feature',
          id: 49481,
          geometry: null,
          properties: [Object]
        }
      ]
    }
    */
    /** pbf decoded response
    {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 49481,
          properties: [Object],
          geometry: null
        }
      ]
    }
    */
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
