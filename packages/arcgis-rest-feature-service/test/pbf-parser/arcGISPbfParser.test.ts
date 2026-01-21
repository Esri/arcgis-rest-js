import { test, describe } from "vitest";
import { IQueryFeaturesOptions, queryFeatures } from "../../src/query.js";
import decode from "../../src/pbf-parser/arcGISPbfParser.js";

describe("arcGISPbfParser should decode each geometry type", () => {
  test("LIVE TEST: should decode POINT pbf to arcgis", async () => {
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

  test("LIVE TEST: should decode LINE pbf to arcgis", async () => {
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

  test("LIVE TEST: should decode POLYGON pbf to arcgis", async () => {
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

    console.log(JSON.stringify(decoded.fields, null, 2));
  });

  // test("LIVE TEST: should compare LINE terraformer decoded arcgis to arcgis object and pbf-as-arcgis", async () => {
  //   const trailsLinesPbfOptions: IQueryFeaturesOptions = {
  //     url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
  //     f: "pbf",
  //     where: "1=1",
  //     outFields: ["*"],
  //     resultRecordCount: 1,
  //     rawResponse: true
  //   };

  //   const response = await queryFeatures(trailsLinesPbfOptions);

  //   const arrBuffer = await (response as any).arrayBuffer();

  //   const decoded = pbfToArcGIS(arrBuffer);

  //   const fs = await import("fs");
  //   fs.writeFileSync(
  //     "./packages/arcgis-rest-feature-service/test/mocks/terraformerLine.json",
  //     JSON.stringify(decoded, null, 2)
  //   );
  // });
});
