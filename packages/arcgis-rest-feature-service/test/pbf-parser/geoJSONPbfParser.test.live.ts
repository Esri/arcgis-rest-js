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
    console.log(decoded);
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
    console.log(decoded);
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
    console.log(decoded);
  });

  test("LIVE TEST: should decode POLYGON pbf to geojson", async () => {
    const ParksPolygonsPbfOptions: IQueryFeaturesOptions = {
      url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
      f: "pbf",
      where: "1=1",
      outFields: ["*"],
      resultRecordCount: 1,
      rawResponse: true
    };

    const response = await queryFeatures(ParksPolygonsPbfOptions);
    const arrBuffer = await (response as any).arrayBuffer();

    const decoded = decode(arrBuffer);
    console.log(decoded);
  });
});
