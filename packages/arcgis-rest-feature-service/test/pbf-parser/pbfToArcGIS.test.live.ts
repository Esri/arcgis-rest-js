import { describe, test, expect } from "vitest";
import { pbfToArcGIS } from "../../src/utils/pbfToArcGIS.js";
import {
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  queryFeatures
} from "../../src/query.js";

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
