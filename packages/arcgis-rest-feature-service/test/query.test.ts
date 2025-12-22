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
  IQueryAllFeaturesOptions
} from "../src/index.js";
import {
  featureResponse,
  queryResponse,
  queryRelatedResponse
} from "./mocks/feature.js";
import { ApiKeyManager, ArcGISAuthError } from "@esri/arcgis-rest-request";
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

  describe("PBF as GeoJSON tests", () => {
    // test case: should decode a valid pbf-as-geojson response from public server without api key
    test("(valid) should decode valid pbf as geojson from arrayBuffer", async () => {
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
        try {
          arrayBuffer = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
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

      const response = await queryFeatures(testPublicFeatureServer);
      console.log(response);

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect((response as any).features.length).toBe(1);
      expect((response as any).features[0].properties.OBJECTID).toBe(49481);
      expect((response as any).features[0].properties.County).toBe(
        "Nassau County"
      );
      expect((response as any).features[0].id).toBe(49481);
    });

    // TODO: will want to return an ArcGIS Request Error from the request instead of letting the error fall through from the decoder
    test("(invalid) should throw an error when pbf-as-geojson fails to decode", async () => {
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
        f: "pbf-as-geojson",
        where: "1=1",
        outFields: ["*"],
        resultOffset: 0,
        resultRecordCount: 3,
        geometry: {
          xmin: -13193261,
          ymin: 4028181.6,
          xmax: -13185072.9,
          ymax: 4035576.6,
          spatialReference: { wkid: 101200 }
        },
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects"
      };

      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        // right now this gets a fall through error from the decoder library, but should probably be a request error. (change types)
        expect(error).toBeInstanceOf(Error);
        expect((error as any).message).toContain(
          "500: Error decoding PBF response"
        );
      }
    });

    // test case: should handle pbf-as-geojson requests that fail due to unauthenticated states local obj fetchmock only
    test("(unauth) should handle pbf-as-geojson requests that fail due to unauthenticated states", async () => {
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
        resultRecordCount: 3,
        geometry: {
          xmin: -13193261,
          ymin: 4028181.6,
          xmax: -13185072.9,
          ymax: 4035576.6,
          spatialReference: { wkid: 101200 }
        },
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects"
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).message).toBe("498: Invalid token.");
      }
    });

    test("TODO: should compare decoder pbf-as-geojson-output to direct geojson output from server for output regression test", () => {
      console.log("TODO: implement output regression test");
    });
  });

  describe("PBF as ArcGIS tests", () => {
    test("should fetch pbf as arcgis json (convert pbf buffer to geojson to arcgis)", async () => {
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
        try {
          arrayBuffer = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
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

      const response = await queryFeatures(testPublicFeatureServer);

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect((response as any).features.length).toBe(1);
      expect((response as any).features[0].attributes.OBJECTID).toBe(49481);
      expect((response as any).features[0].attributes.County).toBe(
        "Nassau County"
      );
      // could assert match on the full object
    });

    test("(invalid) should throw an error when pbf-as-arcgis fails to decode", async () => {
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
        resultRecordCount: 3,
        geometry: {
          xmin: -13193261,
          ymin: 4028181.6,
          xmax: -13185072.9,
          ymax: 4035576.6,
          spatialReference: { wkid: 101200 }
        },
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects"
      };

      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        // right now this gets a fall through error from the decoder library, but should probably be a request error.
        expect(error).toBeInstanceOf(Error);
        expect((error as any).message).toContain(
          "500: Error decoding PBF response"
        );
      }
    });

    test("(unauth) should handle pbf-as-arcgis requests that fail due to unauthenticated states", async () => {
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
        resultRecordCount: 3,
        geometry: {
          xmin: -13193261,
          ymin: 4028181.6,
          xmax: -13185072.9,
          ymax: 4035576.6,
          spatialReference: { wkid: 101200 }
        },
        geometryType: "esriGeometryEnvelope",
        spatialRel: "esriSpatialRelIntersects"
      };
      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).message).toBe("498: Invalid token.");
      }
    });

    // test case: should convert to arcgis on live request

    // test case: should convert to arcgis on mock request from live pbf raw response

    // test case: should handle pbf request fail on unauthenticated json response
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
    test("(valid) should fetch only one page of pbf-as-geojson if total features are less than page size", async () => {
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
        try {
          arrayBufferSet1 = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 2000
      });

      fetchMock.once(
        // request feature service will be pbf since we are converting to geojson in rest-js
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
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

      try {
        const response = await queryAllFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(131);
      } catch (error) {
        throw error;
      }
    });

    test("(valid) should fetch only one page of pbf-as-geojson if total features equal page size", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf";
        try {
          arrayBufferSet1 = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 2000
      });

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
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

      try {
        const response = await queryAllFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(500);
      } catch (error) {
        throw error;
      }
    });

    test("(valid) should fetch multiple pages of pbf-as-geojson if total features exceed page size", async () => {
      // use fetchmock to return maxRecordCount that is less than the number of total features in the medium pbf results.
      // you might need to live query 4 groups of 500 or so with different offsets n*500 to mimic pages then synthetically reduce max record count to emulate service returning a low maxRecordCount to test if queryAllfeatures can iterate through that.
      // the "server" would then return 500 new pbf features per response until 2500 or whatever results requested are achieved

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
        try {
          arrayBufferSet1 = fs.readFileSync(filePath);
          arrayBufferSet2 = fs.readFileSync(filePathPartial);
        } catch (err) {
          throw err;
        }
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

      const start = Date.now();
      try {
        const response = await queryAllFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(631);
      } catch (error) {
        throw error;
      }
    });

    test("(valid) should query all features as arcgis json objects", async () => {
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
      let pbfPages: (ArrayBuffer | Buffer)[] = [];

      if (isBrowser) {
        for (let path of rawPbfPaths) {
          const resp = await fetch(path);
          pbfPages.push(await resp.arrayBuffer());
        }
      }

      if (isNode) {
        const fs = await import("fs");
        try {
          for (let path of rawPbfPaths) {
            pbfPages.push(fs.readFileSync(path));
          }
        } catch (err) {
          throw err;
        }
      }

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

      //const start = Date.now();
      try {
        const response = await queryAllFeatures(docsPbfOptions);
        //const duration = Date.now() - start;
        //console.log(`Test duration: ${duration} ms`);
        expect((response as any).features.length).toBe(2631);
      } catch (error) {
        throw error;
      }
    });
  });

  describe("queryAllFeatures (pbf-as-arcgis)", () => {
    test("should fetch one page of pbf-as-arcgis if total features are under page size", async () => {
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
        try {
          arrayBufferSet1 = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 2000
      });

      fetchMock.once(
        // backend request to feature server will be f=pbf, since we are converting the server response to arcgis json in rest-js
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
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

      try {
        const response = await queryAllFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(131);
      } catch (error) {
        throw error;
      }
    });

    test("should fetch one page of pbf-as-arcgis if total features are equal to one page", async () => {
      const thisServiceUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      let arrayBufferSet1: ArrayBuffer | Buffer;

      if (isBrowser) {
        const pbf = await fetch(
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf"
        );
        arrayBufferSet1 = await pbf.arrayBuffer();
      }

      if (isNode) {
        const fs = await import("fs");
        const filePath =
          "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet1.pbf";
        try {
          arrayBufferSet1 = fs.readFileSync(filePath);
        } catch (err) {
          throw err;
        }
      }

      fetchMock.once(`${thisServiceUrl}?f=json`, {
        maxRecordCount: 2000
      });

      fetchMock.once(
        `${thisServiceUrl}/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=2000`,
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

      try {
        const response = await queryAllFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(500);
      } catch (error) {
        throw error;
      }
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
      let pbfPages: (ArrayBuffer | Buffer)[] = [];

      if (isBrowser) {
        for (let path of pbfPaths) {
          const resp = await fetch(path);
          pbfPages.push(await resp.arrayBuffer());
        }
      }

      if (isNode) {
        const fs = await import("fs");
        try {
          for (let path of pbfPaths) {
            pbfPages.push(fs.readFileSync(path));
          }
        } catch (err) {
          throw err;
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

      const start = Date.now();
      try {
        const response = await queryAllFeatures(docsPbfOptions);

        const duration = Date.now() - start;
        // eslint-disable-next-line no-console
        console.log(`Test duration: ${duration} ms`);
        expect((response as any).features.length).toBe(2631);
        console.log("response features", (response as any).features[0]);
        expect((response as any).features[0].attributes.OBJECTID).toBe(1);
      } catch (error) {
        throw error;
      }
    });
  });
});
