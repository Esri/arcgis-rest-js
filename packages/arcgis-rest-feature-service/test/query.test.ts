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
    // expect(response.attributes.FID).toEqual(42);
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
