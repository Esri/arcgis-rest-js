/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import {
  getFeature,
  queryFeatures,
  queryAllFeatures,
  queryRelated,
  IQueryFeaturesOptions,
  IQueryRelatedOptions
} from "../src/index.js";
import {
  featureResponse,
  queryResponse,
  queryRelatedResponse
} from "./mocks/feature.js";
import { ApiKeyManager, ArcGISAuthError } from "@esri/arcgis-rest-request";
import decode from "../src/pbf/geoJSONPbfParser.js";
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
        // right now this gets a fall through error from the decoder library, but should probably be a request error.
        expect(error).toBeInstanceOf(Error);
        expect((error as any).message).toContain(
          "Could not parse arcgis-pbf buffer:"
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

    // LIVE TEST: should decode a valid pbf-as-geojson response from public server without api key without fetchmock
    test("LIVE TEST (valid): should decode valid pbf as geojson from arrayBuffer without fetchmock", async () => {
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

      expect((response as any).features.length).toBe(1);
      expect((response as any).features[0].properties.OBJECTID).toBe(49481);
      expect((response as any).features[0].properties.County).toBe(
        "Nassau County"
      );
      expect((response as any).features[0].id).toBe(49481);
    });

    // LIVE TEST W/Fetchmock: should decode a live pbf-as-geojson response when parsed and run through fetchmock for feature parity
    test("LIVE TEST w/fetch-mock (valid): should decode a live url pbf response when passed through fetchmock", async () => {
      // make live request for raw pbf data
      const testPublicFeatureServerUrl =
        "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=pbf&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

      const livePbfResponse = await fetch(testPublicFeatureServerUrl);

      fetchMock.once(
        "*",
        {
          status: 200,
          headers: { "content-type": "application/x-protobuf" },
          body: await livePbfResponse.arrayBuffer()
        },
        {
          sendAsJson: false
        }
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

    // LIVE TEST: should handle live pbf-as-geojson response with geometries (testing authenticated response requires api key for live testing)
    test("LIVE TEST (valid): should return live pbf-as-geojson response with geometries", async () => {
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

      const response = await queryFeatures(docsPbfOptions);
    });

    test("LIVE TEST w/fetch-mock (valid): should return live pbf-as-geojson response with geometries when passed through fetchmock", async () => {
      const docsPbfUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
      const livePbfResponse = await fetch(docsPbfUrl);
      fetchMock.once(
        "*",
        {
          status: 200,
          headers: livePbfResponse.headers,
          body: await livePbfResponse.arrayBuffer()
        },
        {
          sendAsJson: false
        }
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
      const response = await queryFeatures(docsPbfOptions);

      expect(fetchMock.called()).toBeTruthy();
      const [url, options] = fetchMock.lastCall("*");
      expect(options.method).toBe("GET");
      expect((response as any).features.length).toBe(3);
      expect((response as any).features[0].geometry).toHaveProperty("type");
      expect((response as any).features[0].geometry).toHaveProperty(
        "coordinates"
      );
    });

    // TODO: will want to return an ArcGIS Request Error from the request instead of letting the error fall through from the decoder
    test("LIVE TEST (invalid): should throw an error when pbf-as-geojson fails to decode", async () => {
      const docsPbfUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
      const livePbfResponse = await fetch(docsPbfUrl);
      fetchMock.once(
        "*",
        {
          status: 200,
          headers: livePbfResponse.headers,
          body: await livePbfResponse.blob()
        },
        {
          sendAsJson: false
        }
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
        // right now this gets a fall-through error from the decoder library, but should probably be a request error.
        expect(error).toBeInstanceOf(Error);
        expect((error as any).message).toContain(
          "Could not parse arcgis-pbf buffer:"
        );
      }
    });

    // LIVE TEST: should handle live pbf response for unauthenticated pbf-as-geojson requests
    test("LIVE TEST (UNAUTHENTICATED): should return json response for unauthenticated pbf-as-geojson requests without fetchmock", async () => {
      const docsPbfUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";

      const badApiKey = "BAD_API_KEY";
      const docsUrlPbfWithBadKey = `${docsPbfUrl}&token=${badApiKey}`;
      const liveJsonErrorResponse = await fetch(docsUrlPbfWithBadKey);
      expect(liveJsonErrorResponse.status).toBe(200);
      expect(liveJsonErrorResponse.headers.get("content-type")).toBe(
        "application/json; charset=utf-8"
      );
      const errorJson = await liveJsonErrorResponse.json();
      expect(errorJson.error.code).toBe(498);
      expect(errorJson.error.message).toBe("Invalid token.");

      // set up options for live request through query features
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
        spatialRel: "esriSpatialRelIntersects",
        authentication: ApiKeyManager.fromKey(badApiKey)
      };

      try {
        await queryFeatures(docsPbfOptions);
      } catch (error) {
        expect(error).toBeInstanceOf(ArcGISAuthError);
        expect((error as any).message).toBe("498: Invalid token.");
      }
      // await expect(queryFeatures(docsPbfOptions)).rejects.toThrowError(ArcGISAuthError);
    });

    test("LIVE TEST (UNAUTHENTICATED) w/fetchmock: should return json response through fetchmock for unauthenticated pbf-as-geojson requests", async () => {
      const docsPbfUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";

      const badApiKey = "BAD_API_KEY";
      const docsUrlPbfWithBadKey = `${docsPbfUrl}&token=${badApiKey}`;
      const livePbfResponse = await fetch(docsUrlPbfWithBadKey);

      expect(livePbfResponse.headers.get("content-type")).toBe(
        "application/json; charset=utf-8"
      );

      fetchMock.once("*", {
        status: 200,
        headers: livePbfResponse.headers,
        body: await livePbfResponse.json()
      });

      // deconstruct docsPBFurl to query features options object
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
        spatialRel: "esriSpatialRelIntersects",
        authentication: ApiKeyManager.fromKey(badApiKey)
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
      expect((response as any).length).toBe(1);
      expect((response as any)[0].attributes.OBJECTID).toBe(49481);
      expect((response as any)[0].attributes.County).toBe("Nassau County");
      // could assert match on the full object
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

  // test case: should handle converting geometries and also for queryAllFeatures over multiple pages (in queryallfeatures describe)

  test("should fetch PBF features as geoJSON if total features are under page size", async () => {
    // is this f=json needed to get the maxRecordCount from server? does maxRecordCount apply to all requests or just json?

    let aPublicUrl =
      "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=pbf&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

    let testUrl = aPublicUrl;
    //const testResponse = await fetch(testUrl);
    //let toJson = await testResponse.json();
    //console.log("testResponse", toJson);

    const jsonResponse = await fetch(testUrl.replace("f=pbf", "f=json"));
    const jsonData = await jsonResponse.json();
    console.log("jsonData", jsonData.features);
    const geojsonResponse = await fetch(testUrl.replace("f=pbf", "f=geojson"));
    const geojsonData = await geojsonResponse.json();
    console.log("geojsonData", geojsonData.features);

    const pbfResponse = await fetch(testUrl);
    // need to test other urls and their return values to make sure they can decode to pbf correctly
    //console.log("pbfResponse", pbfResponse);
    //const arrBuff = await pbfResponse.arrayBuffer();

    console.log("blob", await pbfResponse.headers);
    //console.log("arrBuff", arrBuff);
    //console.log("pbf as geojson", decode(arrBuff).featureCollection.features);

    // // queryAllFeatures makes at least two requests, one to get maxRecordCount and one to get features
    // // the second request should return a decoded geojson feature collection

    // TODO: try querying serviceurl as live url for a pbf response as well if it works.
    console.log("testUrl", testUrl);
    // console.log("result", result);

    // expect(result.features.length).toBe(1);
    // TODO: fit response return values to fulfil IFeature interface contract
    // expect(result.features[0].properties.OBJECTID).toBe(49481);
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

  test("fall back to a default size of 2000 if thes service does not return a page size", async () => {
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
});
