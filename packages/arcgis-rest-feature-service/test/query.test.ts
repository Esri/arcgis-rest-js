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
import { isBrowser, isNode } from "../../../scripts/test-helpers.js";

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
    // test case: should decode a valid pbf-as-geojson response from public server without api key
    test("(valid) should query pbf-as-geojson features by requesting pbf arrayBuffer and decoding into geojson", async () => {
      // use ArrayBuffer for browser, Buffer for node fs
      let arrayBuffer: ArrayBuffer | Buffer;

      // load in arrayBuffer
      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/results.pbf"
        );
        arrayBuffer = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/results.pbf";
        arrayBuffer = fs.readFileSync(filePath);
      }

      // manually create fetch response object so fetchmock doesn't convert to json
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
        outSR: "102100",
        returnGeometry: false,
        spatialRel: "esriSpatialRelIntersects",
        where: "1=1"
      };

      // query pbf features as geojson, returns geojson feature collection with exceededTransferLimit property
      /**
       * {
       *   "type": "FeatureCollection",
       *   "features": [...geojsonFeatures],
       *   "exceededTransferLimit": false
       * }
       */
      const response = (await queryFeatures(testPublicFeatureServer)) as any;

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect(response.features.length).toBe(1);
      expect(response.features[0].properties.OBJECTID).toBe(49481);
      expect(response.features[0].properties.County).toBe("Nassau County");
      expect(response.features[0].id).toBe(49481);
    });

    test("(error) should throw an arcgis request error when pbf-as-geojson decode returns nothing or fails to decode", async () => {
      let arrayBuffer: ArrayBuffer | Buffer;
      // create empty buffer type according to test environment
      if (isBrowser) {
        arrayBuffer = new ArrayBuffer(8);
      }
      if (isNode) {
        arrayBuffer = Buffer.from([]);
      }

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
          "500: Error decoding PBF response"
        );
      }
    });

    // test case: should handle pbf-as-geojson requests that fail due to unauthenticated states local obj fetchmock only
    test("(invalid auth) should throw arcgis auth error for queryFeatures() pbf-as-geojson queries when service returns 200 with json object containing error", async () => {
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

    test("(invalid auth) should throw arcgis auth error when service returns 200 with json object containing token required error", async () => {
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
        expect(error).toBeInstanceOf(ArcGISRequestError);
        expect((error as any).code).toBe(500);
      }
    });
  });

  describe("queryFeatures(): pbf-as-arcgis", () => {
    test("should query pbf as arcgis features by requesting pbf arrayBuffer and decoding into geojson then transforming to arcgis json objects", async () => {
      // using arrayBuffer in browser and buffer for node fs
      let arrayBuffer: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/results.pbf"
        );
        arrayBuffer = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/results.pbf";
        arrayBuffer = fs.readFileSync(filePath);
      }

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
      let arrayBuffer: ArrayBuffer | Buffer;

      // create buffer type according to test environment
      if (isBrowser) {
        arrayBuffer = new ArrayBuffer(8);
      }
      if (isNode) {
        arrayBuffer = Buffer.from([]);
      }

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
          "500: Error decoding PBF response"
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
    fetchMock.mock(`${serviceUrl}?f=json`, {
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
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf";
        arrayBufferSet1 = fs.readFileSync(filePath);
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      fetchMock.once(
        // feature service request will be f=pbf since we are converting to geojson in rest-js
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
        f: "pbf-as-geojson"
      };

      const response = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for metadata, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(response.features.length).toBe(131);
      expect((response.features[0] as any).id).toBe(23401);
      expect(response.features[0]).toHaveProperty("properties");
      expect(response.features[0]).toHaveProperty("geometry");
      // since total features (131) is less than, exceededTransferLimit will be false
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("(valid equal to) should query only one page of pbf-as-geojson if total features equal page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf";
        arrayBufferSet1 = fs.readFileSync(filePath);
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 131
      });

      fetchMock.once(
        // feature service request will be f=pbf since we are converting to geojson in rest-js
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
        f: "pbf-as-geojson"
      };

      const response = await queryAllFeatures(docsPbfOptions);
      // expect fetch mock to only have been called twice: once for metadata, once for features
      expect(fetchMock.calls().length).toBe(2);
      expect(response.features.length).toBe(131);
      expect((response.features[0] as any).id).toBe(23401);
      expect(response.features[0]).toHaveProperty("properties");
      expect(response.features[0]).toHaveProperty("geometry");
      // since max page size equals total features, exceededTransferLimit should be false
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("(valid exceeds) should query multiple pages of pbf-as-geojson if total features exceed page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;
      let arrayBufferSet2: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbfFull = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf"
        );
        const pbfPartial = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
        );
        arrayBufferSet1 = await pbfFull.arrayBuffer();
        arrayBufferSet2 = await pbfPartial.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf";
        const filePathPartial =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf";
        arrayBufferSet1 = fs.readFileSync(filePath);
        arrayBufferSet2 = fs.readFileSync(filePathPartial);
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=500`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet1
        },
        { sendAsJson: false }
      );

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=500&resultRecordCount=500`,
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: arrayBufferSet2
        },
        { sendAsJson: false }
      );

      const docsPbfOptions: IQueryAllFeaturesOptions = {
        url: thisServiceUrl,
        f: "pbf-as-geojson"
      };

      const response = await queryAllFeatures(docsPbfOptions);
      expect(response.features.length).toBe(631);
      expect((response.features[0] as any).id).toBe(1);
      expect((response.features[499] as any).id).toBe(500);
      //id's jump because we are using last page as partial which comes after page 5
      expect((response.features[500] as any).id).toBe(23401);
      expect(response.features[0]).toHaveProperty("properties");
      expect(response.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect(response.exceededTransferLimit).toBe(true);
    });

    test("(valid large) should query all pbf-as-geojson features as geojson objects", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      const rawPbfPaths = [
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet2.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet3.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet4.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet5.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
      ];
      const pbfPages: (ArrayBuffer | Buffer)[] = [];

      if (isBrowser) {
        for (const path of rawPbfPaths) {
          const resp = await fetch(path);
          pbfPages.push(await resp.arrayBuffer());
        }
      }

      if (isNode) {
        const fs = await import("fs");
        for (const path of rawPbfPaths) {
          pbfPages.push(fs.readFileSync(path));
        }
      }

      // set up first fetchMock to return maxRecordCount of 500 to become the page size
      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 500
      });

      // Set up fetchMock for each page (offset = n*500)
      for (let i = 0; i < pbfPages.length; i++) {
        const offset = i * 500;
        fetchMock.once(
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
        f: "pbf-as-geojson"
      };

      const response = await queryAllFeatures(docsPbfOptions);

      expect(fetchMock.calls().length).toBe(7); // 1 for metadata + 6 pages
      expect(response.features.length).toBe(2631);
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect(response.exceededTransferLimit).toBe(true);
    });
  });

  describe("queryAllFeatures (pbf-as-arcgis)", () => {
    test("(valid less than) should query only one page of pbf-as-arcgis if total features are under page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf";
        arrayBufferSet1 = fs.readFileSync(filePath);
      }

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
      expect(response.features[0].attributes.OBJECTID).toBe(23401);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit should be false since all features were returned in one page
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("(valid equal to) should fetch one page of pbf-as-arcgis if total features are equal to one page", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf";
        arrayBufferSet1 = fs.readFileSync(filePath);
      }

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
      expect(response.features[0].attributes.OBJECTID).toBe(23401);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // since total features (131) is less than, exceededTransferLimit will be false
      expect(response.exceededTransferLimit).toBe(false);
    });

    test("should fetch all pages of pbf-as-arcgis and return as arcgis json objects", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      const pbfPaths = [
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet2.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet3.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet4.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet5.pbf",
        "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet6Partial.pbf"
      ];
      const pbfPages: (ArrayBuffer | Buffer)[] = [];

      if (isBrowser) {
        for (const path of pbfPaths) {
          const resp = await fetch(path);
          pbfPages.push(await resp.arrayBuffer());
        }
      }

      if (isNode) {
        const fs = await import("fs");
        for (const path of pbfPaths) {
          pbfPages.push(fs.readFileSync(path));
        }
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
      expect(response.features[0].attributes.OBJECTID).toBe(1);
      expect(response.features[0]).toHaveProperty("attributes");
      expect(response.features[0]).toHaveProperty("geometry");
      // exceededTransferLimit only gets set the first iteration on the response object so it will always be true in multi-page scenarios
      expect(response.exceededTransferLimit).toBe(true);
    });
  });
});
