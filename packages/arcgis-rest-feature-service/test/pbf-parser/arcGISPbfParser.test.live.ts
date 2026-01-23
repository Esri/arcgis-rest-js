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

    const features = pbfToArcGIS(arrBuffer);

    console.log(features);
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

    const features = pbfToArcGIS(arrBuffer);
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

    const features = pbfToArcGIS(arrBuffer);

    console.log(JSON.stringify(features.fields, null, 2));
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
// TODO: just added, need to clean this up (LIVE_TEST)
describe("pbfToArcGIS", () => {
  test("should compare pbfToArcGIS json object with json request object", async () => {
    /** arcgis json response from service
    {
      objectIdFieldName: 'OBJECTID',
      uniqueIdField: { name: 'OBJECTID', isSystemMaintained: true },
      globalIdFieldName: '',
      geometryType: 'esriGeometryPolygon',
      spatialReference: { wkid: 102100, latestWkid: 3857 },
      fields: [...],
      features: [ { attributes: [Object] } ]
    }
    */
    /** pbf decoded and converted to arcgis response
    {
      features: [ { attributes: [Object] } ],
      exceededTransferLimit: false
    }
    */
    const arcGISUrl =
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=json&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

    const pbfUrl =
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=pbf&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

    const liveArcGISResponse = await fetch(arcGISUrl);
    const livePbfResponse = await fetch(pbfUrl);
    const pbfArrayBuffer = await livePbfResponse.arrayBuffer();

    const arcGIS = await liveArcGISResponse.json();
    const pbfArcGIS = pbfToArcGIS(pbfArrayBuffer);

    // check for object differences
    expect(arcGIS).toHaveProperty("objectIdFieldName");
    expect(arcGIS).toHaveProperty("uniqueIdField");
    expect(arcGIS).toHaveProperty("geometryType");
    expect(arcGIS).toHaveProperty("fields");
    expect(arcGIS).not.toHaveProperty("exceededTransferLimit");

    expect(pbfArcGIS).toHaveProperty("exceededTransferLimit");
    expect(pbfArcGIS).not.toHaveProperty("objectIdFieldName");
    expect(pbfArcGIS).not.toHaveProperty("uniqueIdField");
    expect(pbfArcGIS).not.toHaveProperty("geometryType");
    expect(pbfArcGIS).not.toHaveProperty("fields");
    // check that features are equal for both
    expect(pbfArcGIS.features).toEqual(arcGIS.features);
  });

  test("should compare pbf-as-arcgis queryFeatures response with json queryFeatures response", async () => {
    const testPbfAsArcGIS: IQueryFeaturesOptions = {
      url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
      f: "pbf-as-arcgis",
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
      returnGeometry: false,
      spatialRel: "esriSpatialRelIntersects",
      where: "1=1"
    };

    const testJson: IQueryFeaturesOptions = {
      ...testPbfAsArcGIS,
      f: "json"
    };

    const responseJson = (await queryFeatures(
      testJson
    )) as IQueryFeaturesResponse;
    const responsePbfAsArcGIS = (await queryFeatures(
      testPbfAsArcGIS
    )) as IQueryFeaturesResponse;

    expect(responseJson).toHaveProperty("objectIdFieldName");
    expect(responseJson).toHaveProperty("uniqueIdField");
    expect(responseJson).toHaveProperty("geometryType");
    expect(responseJson).toHaveProperty("fields");
    expect(responseJson).not.toHaveProperty("exceededTransferLimit");

    expect(responsePbfAsArcGIS).toHaveProperty("exceededTransferLimit");
    expect(responsePbfAsArcGIS).not.toHaveProperty("objectIdFieldName");
    expect(responsePbfAsArcGIS).not.toHaveProperty("uniqueIdField");
    expect(responsePbfAsArcGIS).not.toHaveProperty("geometryType");
    expect(responsePbfAsArcGIS).not.toHaveProperty("fields");

    expect(responsePbfAsArcGIS.features).toEqual(responseJson.features);
  });
});
