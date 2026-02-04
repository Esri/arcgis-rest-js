/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect, vi } from "vitest";
import fetchMock from "fetch-mock";
import {
  getFeature,
  queryFeatures,
  queryAllFeatures,
  queryRelated,
  IQueryFeaturesOptions,
  IQueryRelatedOptions,
  IQueryAllFeaturesOptions,
  IQueryFeaturesResponse
} from "../src/index.js";
import {
  featureResponse,
  queryResponse,
  queryRelatedResponse
} from "./mocks/feature.js";
import {
  ApiKeyManager,
  ArcGISAuthError,
  ArcGISRequestError
} from "@esri/arcgis-rest-request";
import {
  readEnvironmentEmptyArrayBuffer,
  readEnvironmentFileToArrayBuffer
} from "./utils/readFileArrayBuffer.js";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("getFeature() and queryFeatures()", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  test("should return a feature by id", async () => {
    const requestOptions = {
      url: serviceUrl,
      id: 42
    };
    fetchMock.once("*", featureResponse);

    const response = await getFeature(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/42?f=json`);
    expect(options.method).toBe("GET");
    expect(response.attributes.FID).toBe(42);
  });

  test("return rawResponse when getting a feature", async () => {
    const requestOptions = {
      url: serviceUrl,
      id: 42,
      rawResponse: true
    };
    fetchMock.once("*", featureResponse);

    const response: any = await getFeature(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(`${requestOptions.url}/42?f=json`);
    expect(options.method).toBe("GET");
    expect(response.status).toBe(200);
    expect(response.ok).toBe(true);
    expect(response.body.Readable).not.toBe(null);

    const raw = await response.json();
    expect(raw).toEqual(featureResponse);
  });

  test("should supply default query parameters", async () => {
    const requestOptions: IQueryFeaturesOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryResponse);
    const response = await queryFeatures(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/query?f=json&where=1%3D1&outFields=*`
    );
    expect(options.method).toBe("GET");
  });

  test("should use passed in query parameters", async () => {
    const requestOptions: IQueryFeaturesOptions = {
      url: serviceUrl,
      where: "Condition='Poor'",
      outFields: ["FID", "Tree_ID", "Cmn_Name", "Condition"],
      orderByFields: "test",
      geometry: {},
      geometryType: "esriGeometryPolygon"
    };
    fetchMock.once("*", queryResponse);
    const response = await queryFeatures(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/query?f=json&where=Condition%3D%27Poor%27&outFields=FID%2CTree_ID%2CCmn_Name%2CCondition&geometry=%7B%7D&geometryType=esriGeometryPolygon&orderByFields=test`
    );
    expect(options.method).toBe("GET");
  });

  test("should supply default query related parameters", async () => {
    const requestOptions: IQueryRelatedOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryRelatedResponse);
    const response = await queryRelated(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/queryRelatedRecords?f=json&definitionExpression=1%3D1&outFields=*&relationshipId=0`
    );
    expect(options.method).toBe("GET");
  });

  test("should use passed in query related parameters", async () => {
    const requestOptions: IQueryRelatedOptions = {
      url: serviceUrl,
      relationshipId: 1,
      definitionExpression: "APPROXACRE<10000",
      outFields: ["APPROXACRE", "FIELD_NAME"],
      httpMethod: "POST"
    };
    fetchMock.once("*", queryRelatedResponse);
    const response = await queryRelated(requestOptions);

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(`${requestOptions.url}/queryRelatedRecords`);
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("relationshipId=1");
    expect(options.body).toContain("definitionExpression=APPROXACRE%3C10000");
    expect(options.body).toContain("outFields=APPROXACRE%2CFIELD_NAME");
  });

  describe("queryFeatures(): pbf-as-geojson", () => {
    test("should save pbf responses to local filesystem", async () => {
      const requestOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf", // triggers pbf request and geojson conversion in rest-js
        rawResponse: true,
        outSR: "4326", // matches the mocked outSR for web mercator
        resultOffset: 23464,
        where: "1=1",
        outFields: ["*"]
      };

      const response = await queryFeatures(requestOptions);
      const arrayBuffer = await (response as any).arrayBuffer();

      const fs = await import("fs");
      // fs.writeFileSync(
      //   "./packages/arcgis-rest-feature-service/test/mocks/geojson/Page500json.json",
      //   JSON.stringify(response, null, 2)
      // );
      // fs.writeFileSync(
      //   "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage67.pbf",
      //   Buffer.from(arrayBuffer)
      // );
    });

    test("should read many kinds of pbf files from local filesystem", async () => {
      const page3PartialArrBuff = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage3PartialCRS4326.pbf"
      );

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"]
      };
      const url =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&outSR=4326";
      fetchMock.once(
        url,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: page3PartialArrBuff
        },
        { sendAsJson: false }
      );
      const response4Page3Partial = await queryFeatures(docsPbfOptions);

      console.log(
        "response4Page3Partial",
        response4Page3Partial.features[0].id
      );
      console.log(
        "response4Page3Partial",
        response4Page3Partial.features[66].id
      );
      console.log(
        "exceededTransferLimit",
        response4Page3Partial.properties.exceededTransferLimit
      );
      expect(response4Page3Partial.features.length).toBe(67);
    });

    // should decode a valid pbf-as-geojson response from public server without api key
    test("(valid) should query pbf-as-geojson features by requesting pbf arrayBuffer and decoding into geojson", async () => {
      const arrayBuffer = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/MaritalStatusBoundariesResponseCRS4326.pbf"
      );

      // manually structure pbf response object so fetchmock doesn't convert to json
      fetchMock.once(
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );

      // configure query options
      const testPublicFeatureServer: IQueryFeaturesOptions = {
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
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        where: "1=1"
      };
      const response = (await queryFeatures(testPublicFeatureServer)) as any;

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(response.features.length).toBe(1);
      expect(response.features[0].properties.OBJECTID).toBe(49481);
      expect(response.features[0].properties.County).toBe("Nassau County");
      expect(response.features[0].id).toBe(49481);
    });

    test("(valid) standard geojson query should not return crs property in response", async () => {
      const serviceUrl = `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`;
      const arrayBuffer = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPointResponseCRS4326.pbf"
      );

      const zipCodePointsPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
        url: serviceUrl,
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultRecordCount: 1
      };

      fetchMock.once(
        // queryFeatures:pbf-as-geojson will default outSR to 4326 for pbf requests to get standard geojson crs coordinates.
        `${serviceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultRecordCount=1&outSR=4326`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );

      const geojson = (await queryFeatures(
        zipCodePointsPbfAsGeoJSONOptions
      )) as any;
      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(geojson.type).toBe("FeatureCollection");
      expect(geojson.features.length).toBe(1);
      // standard responses should not have a crs property as the standard for geojson is to always be in EPSG:4326
      expect(geojson).not.toHaveProperty("crs");
    });

    test("(error) should throw a 422 error when attempting a pbf-as-geojson request with nonstandard outSR for pbf-as-geojson", async () => {
      const serviceUrl = `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`;
      const arrayBuffer = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPointResponseCRS4326.pbf"
      );

      const zipCodePointsPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
        url: serviceUrl,
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultRecordCount: 1,
        outSR: "3857" // non standard for geojson
      };

      fetchMock.once(
        // queryFeatures:pbf-as-geojson will default outSR to 4326 for pbf requests to get standard geojson crs coordinates.
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );
      try {
        await queryFeatures(zipCodePointsPbfAsGeoJSONOptions);
      } catch (error) {
        expect(fetchMock.called()).toBeFalsy(); // should error before fetch called
        expect(fetchMock.calls().length).toBe(0);
        expect(error).toBeInstanceOf(ArcGISRequestError);
        expect((error as any).code).toBe(422);
        expect((error as any).message).toContain(
          "422: Unsupported CRS format for GeoJSON."
        );
      }
    });

    test("(error) should throw a 500 ArcGISRequestError when pbf-as-geojson decode returns nothing or fails to decode", async () => {
      const arrayBuffer = await readEnvironmentEmptyArrayBuffer();

      fetchMock.once(
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };

      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISRequestError);
        expect((error as any).message).toContain(
          "500: Unable to decode pbf response."
        );
      }
    });

    // should handle pbf-as-geojson requests that return unauthenticated states, fetchmock only
    test("(invalid auth) should throw 498 arcgis auth error for queryFeatures() pbf-as-geojson queries when service returns 200 with json object containing error", async () => {
      const featureServiceInvalidTokenErrorResponse = {
        error: {
          code: 498,
          message: "Invalid token.",
          details: ["Invalid token."]
        }
      };
      fetchMock.once("*", {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: featureServiceInvalidTokenErrorResponse
      });

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).message).toBe("498: Invalid token.");
      }
    });

    test("(invalid auth) should throw 499 arcgis auth error when service returns 200 with json object containing token required error", async () => {
      const featureServiceInvalidTokenErrorResponse = {
        error: {
          code: 499,
          // not exact message from service
          message: "Token required.",
          details: ["Token required."]
        }
      };
      fetchMock.once("*", {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: featureServiceInvalidTokenErrorResponse
      });

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).code).toBe(499);
      }
    });

    test("(invalid request) should throw arcgis request error when service returns 200 with json object containing error", async () => {
      const featureServiceInvalidTokenErrorResponse = {
        error: {
          code: 500,
          // not exact message from service
          message: "An error occurred.",
          details: ["An error occurred."]
        }
      };
      fetchMock.once("*", {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: featureServiceInvalidTokenErrorResponse
      });

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect((error as any).name).toBe("ArcGISRequestError");
        expect(error).toBeInstanceOf(ArcGISRequestError);
        expect((error as any).code).toBe(500);
      }
    });
  });

  describe("queryFeatures(): pbf-as-arcgis", () => {
    test("should query pbf as arcgis features by requesting pbf arrayBuffer and decoding into geojson then transforming to arcgis json objects", async () => {
      const arrayBuffer = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/MaritalStatusBoundariesResponse.pbf"
      );

      fetchMock.once(
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );

      const testPublicFeatureServer: IQueryFeaturesOptions = {
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

      const response = (await queryFeatures(
        testPublicFeatureServer
      )) as IQueryFeaturesResponse;

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(response.features.length).toBe(1);
      expect(response.features[0].attributes.OBJECTID).toBe(49481);
      expect(response.features[0].attributes.County).toBe("Nassau County");
    });

    test("(invalid) should throw an arcgis request error when pbf-as-arcgis decode returns nothing or fails to decode", async () => {
      const arrayBuffer = await readEnvironmentEmptyArrayBuffer();

      fetchMock.once(
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBuffer
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-arcgis",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };

      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISRequestError);
        expect((error as any).message).toContain(
          "500: Unable to decode pbf response."
        );
      }
    });

    test("(invalid auth) should throw arcgis auth error for queryFeatures() pbf-as-arcgis queries when service returns 200 with json object containing error", async () => {
      const featureServiceInvalidTokenErrorResponse = {
        error: {
          code: 498,
          message: "Invalid token.",
          details: ["Invalid token."]
        }
      };
      fetchMock.once("*", {
        status: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: featureServiceInvalidTokenErrorResponse
      });

      const docsPbfOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-arcgis",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).message).toBe("498: Invalid token.");
      }
    });
  });
});

describe("queryAllFeatures", () => {
  const pageSize = 2000;
  // first page with 2000 features
  const page1Features = Array.from({ length: pageSize }, (_, i) => ({
    attributes: { OBJECTID: i + 1, name: `Feature ${i + 1}` }
  }));

  // second page with 1 feature to simulate end of pagination
  const page2Features = [
    { attributes: { OBJECTID: 2001, name: "Feature 2001" } }
  ];

  afterEach(() => {
    fetchMock.restore();
  });

  test("fetches multiple pages based on feature count", async () => {
    fetchMock.mock(`${serviceUrl}?f=json`, {
      maxRecordCount: 2000
    });

    fetchMock.mock(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
      {
        features: page1Features,
        exceededTransferLimit: true
      }
    );

    fetchMock.mock(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=2000&resultRecordCount=2000`,
      {
        features: page2Features,
        exceededTransferLimit: false
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl
    });

    expect(result.features.length).toBe(pageSize + 1);
    expect(result.features[0].attributes.OBJECTID).toBe(1);
    expect(result.features[pageSize].attributes.OBJECTID).toBe(2001);
  });

  test("fetches multiple pages based on feature count with authentication", async () => {
    fetchMock.mock(`${serviceUrl}?f=json&token=MOCK_TOKEN`, {
      maxRecordCount: 2000
    });

    fetchMock.mock(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000&token=MOCK_TOKEN`,
      {
        features: page1Features,
        exceededTransferLimit: true
      }
    );

    fetchMock.mock(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=2000&resultRecordCount=2000&token=MOCK_TOKEN`,
      {
        features: page2Features,
        exceededTransferLimit: false
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl,
      authentication: ApiKeyManager.fromKey("MOCK_TOKEN")
    });

    expect(result.features.length).toBe(pageSize + 1);
    expect(result.features[0].attributes.OBJECTID).toBe(1);
    expect(result.features[pageSize].attributes.OBJECTID).toBe(2001);
  });

  test("fetches only one page if total features are under page size", async () => {
    fetchMock.getOnce(`${serviceUrl}?f=json`, {
      maxRecordCount: 2000
    });

    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
      {
        features: page2Features // only one feature
      }
    );
    const result = await queryAllFeatures({
      url: serviceUrl,
      where: "1=1",
      outFields: "*"
    });

    expect(result.features.length).toBe(1);
    expect(result.features[0].attributes.OBJECTID).toBe(2001);
  });

  test("uses user defined resultRecordCount if less than page size", async () => {
    const customCount = 1000;

    fetchMock.getOnce(`${serviceUrl}?f=json`, {
      maxRecordCount: 2000
    });

    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultRecordCount=${customCount}&resultOffset=0`,
      {
        features: page1Features.slice(0, customCount)
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl,
      where: "1=1",
      outFields: "*",
      params: {
        resultRecordCount: customCount
      }
    });

    expect(result.features.length).toBe(customCount);
  });

  test("fall back to service pageSize if user resultRecordCount exceeds it", async () => {
    fetchMock.getOnce(`${serviceUrl}?f=json`, {
      maxRecordCount: 2000
    });

    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultRecordCount=2000&resultOffset=0`,
      {
        features: page1Features
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl,
      where: "1=1",
      outFields: "*",
      params: {
        resultRecordCount: 3000 // greater than maxRecordCount
      }
    });

    expect(result.features.length).toBe(pageSize);
  });

  test("fall back to a default size of 2000 if the service does not return a page size", async () => {
    fetchMock.getOnce(`${serviceUrl}?f=json`, {});

    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
      {
        features: page1Features
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl
    });

    expect(result.features.length).toBe(pageSize);
  });

  test("paginates over services using f=geojson", async () => {
    // first page with 2000 features
    const page1Features = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1,
      type: "Feature",
      properties: { name: `Feature ${i + 1}` }
    }));

    // second page with 1 feature to simulate end of pagination
    const page2Features = [
      { id: 2001, type: "Feature", properties: { name: "Feature 2001" } }
    ];

    fetchMock.mock(`${serviceUrl}?f=json`, {
      maxRecordCount: 2000
    });

    fetchMock.mock(
      `${serviceUrl}/query?f=geojson&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
      {
        features: page1Features,
        properties: {
          exceededTransferLimit: true
        }
      }
    );

    fetchMock.mock(
      `${serviceUrl}/query?f=geojson&where=1%3D1&outFields=*&resultOffset=2000&resultRecordCount=2000`,
      {
        features: page2Features,
        properties: {
          exceededTransferLimit: false
        }
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl,
      f: "geojson"
    });

    expect((result as any).features.length).toBe(pageSize + 1);
    expect((result as any).features[0].id).toBe(1);
    expect((result as any).features[pageSize].id).toBe(2001);
  });

  describe("queryAllFeatures (pbf-as-geojson)", () => {
    test("(valid less than) should query only one page of pbf-as-geojson if total features are less than page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";

      const arrayBufferSet1 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage3PartialCRS4326.pbf"
      );

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      fetchMock.once(
        // feature service request will be f=pbf since we are converting to geojson in rest-js,
        // query-as-geojson will default outSR to 4326 for pbf requests to get standard WSG84 lat/long geojson crs coordinates.
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=500&outSR=4326`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson"
        // not setting outSR should default to 4326 for pbf-as-geojson requests
        // setting outSR to 4326 explicitly will yield the same behavior
      };

      const geojson = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for metadata, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(geojson.features.length).toBe(67);
      expect((geojson.features[0] as any).id).toBe(23465);
      expect(geojson.features[0]).toHaveProperty("properties");
      expect(geojson.features[0]).toHaveProperty("geometry");
      // default pbf-as-geojson responses should not have a crs property
      expect(geojson).not.toHaveProperty("crs");
      // since total features (67) is less than, exceededTransferLimit will be false
      expect((geojson as any).properties.exceededTransferLimit).toBe(false);
    });

    test("(valid equal to) should query only one page of pbf-as-geojson if total features equal page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";

      const arrayBufferSet1 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage3PartialCRS4326.pbf"
      );

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 67
      });

      fetchMock.once(
        // feature service request will be f=pbf since we are converting to geojson in rest-js
        // pbf-as-geojson queries will set outSR to 4326 (geojson standard) so feature service doesnt return 3857 coords by default
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=67&outSR=4326`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-geojson"
      };

      const geojson = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for metadata, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(geojson.features.length).toBe(67);
      expect((geojson.features[0] as any).id).toBe(23465);
      expect(geojson.features[0]).toHaveProperty("properties");
      expect(geojson.features[0]).toHaveProperty("geometry");
      // since max page size equals total features, exceededTransferLimit should be false
      expect((geojson as any).properties.exceededTransferLimit).toBe(false);
    });

    test("(valid exceeds) should query multiple pages of pbf-as-geojson if total features exceed page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";

      const arrayBufferSet1 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage1CRS4326.pbf"
      );
      const arrayBufferSet2 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage3PartialCRS4326.pbf"
      );

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=500&outSR=4326`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=500&resultRecordCount=500&outSR=4326`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet2
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: thisServiceUrl,
        f: "pbf-as-geojson",
        // explicitly setting outSR to 4326 for geojson standard will yield same behavior as default
        outSR: "4326"
      };

      const geojson = await queryAllFeatures(docsPbfOptions);
      expect(geojson.features.length).toBe(567);
      expect((geojson.features[0] as any).id).toBe(1);
      expect((geojson.features[499] as any).id).toBe(500);
      //id's jump because we are using last page as partial which comes after page 5
      expect((geojson.features[500] as any).id).toBe(23465);
      expect(geojson.features[0]).toHaveProperty("properties");
      expect(geojson.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect((geojson as any).properties.exceededTransferLimit).toBe(true);
    });

    test("(valid all) should query all pbf-as-geojson features as geojson objects", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      const rawPbfPaths = [
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage1CRS4326.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage2CRS4326.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/geojson/PBFPolygonPage3PartialCRS4326.pbf"
      ];
      const pbfPages: (ArrayBuffer | Buffer)[] = [];

      for (const path of rawPbfPaths) {
        const arrBuff = await readEnvironmentFileToArrayBuffer(path);
        pbfPages.push(arrBuff);
      }

      // set up first fetchMock to return maxRecordCount of 500 to become the page size
      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      // Set up fetchMock for each page (offset = n*500)
      for (let i = 0; i < pbfPages.length; i++) {
        const offset = i * 500;
        fetchMock.once(
          `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=${offset}&resultRecordCount=500&outSR=4326`,
          {
            status: 200,
            headers: { "content-type": "application/x-protobuf" },
            body: pbfPages[i]
          },
          { sendAsJson: false }
        );
      }

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: thisServiceUrl,
        f: "pbf-as-geojson"
      };

      const geojson = await queryAllFeatures(docsPbfOptions);

      expect(fetchMock.calls().length).toBe(4); // 1 for metadata + 6 pages
      expect(geojson.features.length).toBe(1067);
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect((geojson as any).properties.exceededTransferLimit).toBe(true);
    });
  });

  describe("queryAllFeatures (pbf-as-arcgis)", () => {
    test("(valid less than) should query only one page of pbf-as-arcgis if total features are under page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";

      const arrayBufferSet1 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage6Partial.pbf"
      );

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      fetchMock.once(
        // backend request to feature server will be f=pbf, since we are converting the server response to arcgis json in rest-js
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=500`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        // request pbf-as-arcgis to rest-js to get all features as pbf then convert to arcgis json in rest-js
        f: "pbf-as-arcgis"
      };

      const response = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for max page size, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(response.features.length).toBe(131);
      expect(response.features[0].attributes.FID).toBe(23401);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit should be false since all features were returned in one page
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("(valid equal to) should fetch one page of pbf-as-arcgis if total features are equal to one page", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";

      const arrayBufferSet1 = await readEnvironmentFileToArrayBuffer(
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage6Partial.pbf"
      );

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 131
      });

      fetchMock.once(
        // feature service request will be f=pbf since we are converting to geojson after the request
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=131`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "pbf-as-arcgis"
      };

      const response = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for metadata, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(response.features.length).toBe(131);
      expect(response.features[0].attributes.FID).toBe(23401);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // since total features (131) is less than, exceededTransferLimit will be false
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("should fetch all pages of pbf-as-arcgis and return as arcgis json objects", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      const pbfPaths = [
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage1.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage2.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage3.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage4.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage5.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage6Partial.pbf"
      ];
      // use arrayBuffer for browser, buffer in node environment
      const pbfPages: (ArrayBuffer | Buffer)[] = [];

      for (const path of pbfPaths) {
        const arrBuff = await readEnvironmentFileToArrayBuffer(path);
        pbfPages.push(arrBuff);
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      // Set up fetchMock for each page (offset = n*500)
      for (let i = 0; i < pbfPages.length; i++) {
        const offset = i * 500;
        fetchMock.once(
          // request to server will be f=pbf since we are converting to arcgis json from the server response
          `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=${offset}&resultRecordCount=500`,
          {
            status: 200,
            headers: { "content-type": "application/x-protobuf" },
            body: pbfPages[i]
          },
          { sendAsJson: false }
        );
      }

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: thisServiceUrl,
        f: "pbf-as-arcgis"
      };

      const response = await queryAllFeatures(docsPbfOptions);

      expect(fetchMock.calls().length).toBe(7); // 1 for metadata + 6 for pages
      expect(response.features.length).toBe(2631);
      expect(response.features[0].attributes.FID).toBe(1);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect(response.exceededTransferLimit).toBe(true);
    });
  });
});
