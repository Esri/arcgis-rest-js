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
import { ApiKeyManager } from "@esri/arcgis-rest-request";
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
    test("should decode valid pbf as geojson from arrayBuffer", async () => {
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

    // test case: should decode a valid pbf-as-geojson response from public server without api key without fetchmock
    test("should decode valid pbf as geojson from arrayBuffer without fetchmock", async () => {
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

      // const liveResponse = await fetch(restJsParsedUrl);
      // const mockResponseClone = liveResponse.clone();

      // const data = await liveResponse.arrayBuffer();
      // console.log(data);
      // const geoJson = decode(data).featureCollection;
      // console.log("decoded geojson", geoJson);

      const response = await queryFeatures(testPublicFeatureServer);
      console.log("queryFeatures response", response);

      expect((response as any).features.length).toBe(1);
      expect((response as any).features[0].properties.OBJECTID).toBe(49481);
      expect((response as any).features[0].properties.County).toBe(
        "Nassau County"
      );
      console.log("feature id", (response as any).features[0].geometry);
      expect((response as any).features[0].id).toBe(49481);

      //expect(fetchMock.called()).toBeTruthy();
      //const [url, options] = fetchMock.lastCall("*");
      //expect(options.method).toBe("GET");
      //expect(geoJson).toEqual(response);
    });

    test("should throw an error when pbf-as-geojson fails to decode", async () => {
      const myUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0";
      const apiKey = "GOOD_API_KEY"; // replace with a valid API key for live testing
      const badApiKey = "BAD_API_KEY";

      const docsUrl =
        "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
      const docsUrlPbfWithBadKey = `${docsUrl}&token=${badApiKey}`;
      const docsUrlPbfWithGoodKey = `${docsUrl}&token=${apiKey}`;
      const docsUrlJsonWithGoodKey = docsUrlPbfWithGoodKey.replace(
        "f=pbf",
        "f=json"
      );
      const docsUrlJsonWithBadKey = docsUrlPbfWithBadKey.replace(
        "f=pbf",
        "f=json"
      );

      const goodRealPbfResponse = await fetch(docsUrlPbfWithGoodKey);
      const badRealPbfResponse = await fetch(docsUrlPbfWithBadKey);

      const goodRealJsonResponse = await fetch(docsUrlJsonWithGoodKey);
      const badRealJsonResponse = await fetch(docsUrlJsonWithBadKey);

      const docsPbfWithBadKeyOptions: IQueryFeaturesOptions = {
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

      const docsPbfWithGoodKeyOptions: IQueryFeaturesOptions = {
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
        authentication: ApiKeyManager.fromKey(apiKey)
      };

      const docsJsonWithGoodKeyOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "json",
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
        authentication: ApiKeyManager.fromKey(apiKey)
      };

      const docsJsonWithBadKeyOptions: IQueryFeaturesOptions = {
        url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
        f: "json",
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

      // now we need to use the live responses as mocks for fetchmock to test how request processes them

      //console.log(await goodRealPbfResponse.blob());

      try {
        // the reason we send the blob is to preserve the original response
        fetchMock.once("*", goodRealPbfResponse.blob(), {
          sendAsJson: false
        });
        const goodPbfRequestResponse = await queryFeatures(
          docsPbfWithGoodKeyOptions
        );
        console.log("goodPbfRequestResponse", goodPbfRequestResponse);
      } catch (error) {
        console.log("error caught", error);
      }

      try {
        fetchMock.once("*", badRealPbfResponse.blob(), {
          sendAsJson: false
        });
        const badPbfRequestResponse = await queryFeatures(
          docsPbfWithBadKeyOptions
        );
        console.log("badPbfRequestResponse", badPbfRequestResponse);
      } catch (error) {
        console.log("error caught", error);
      }
      try {
        fetchMock.once("*", goodRealJsonResponse.blob(), {
          sendAsJson: false
        });
        const goodJsonRequestResponse = await queryFeatures(
          docsJsonWithGoodKeyOptions
        );
        console.log("goodJsonRequestResponse", goodJsonRequestResponse);
      } catch (error) {
        console.log("error caught", error);
      }
      try {
        fetchMock.once("*", badRealJsonResponse.blob(), {
          sendAsJson: false
        });
        const badJsonRequestResponse = await queryFeatures(
          docsJsonWithBadKeyOptions
        );
        console.log("badJsonRequestResponse", badJsonRequestResponse);
      } catch (error) {
        console.log("error caught", error);
      }

      return;
    });

    test("should handle pbf-as-geojson requests that fail due to unauthenticated states", async () => {});
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
      console.log("queryFeatures pbf-as-arcgis response", response);

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
