/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  getFeature,
  queryFeatures,
  queryRelated,
  IQueryFeaturesRequestOptions,
  IQueryRelatedRequestOptions
} from "../src/index";

import * as fetchMock from "fetch-mock";

import {
  featureResponse,
  queryResponse,
  queryRelatedResponse
} from "./mocks/feature";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("getFeature() and queryFeatures()", () => {
  afterEach(fetchMock.restore);

  it("should return a feature by id", done => {
    const requestOptions = {
      url: serviceUrl,
      id: 42
    };
    fetchMock.once("*", featureResponse);
    getFeature(requestOptions)
      .then(response => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(`${requestOptions.url}/42?f=json`);
        expect(options.method).toBe("GET");
        expect(response.attributes.FID).toEqual(42);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("return rawResponse when getting a feature", done => {
    const requestOptions = {
      url: serviceUrl,
      id: 42,
      rawResponse: true
    };
    fetchMock.once("*", featureResponse);
    getFeature(requestOptions)
      .then(response => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(`${requestOptions.url}/42?f=json`);
        expect(options.method).toBe("GET");
        expect(response instanceof Response).toBe(true);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should supply default query parameters", done => {
    const requestOptions: IQueryFeaturesRequestOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/query?f=json&where=1%3D1&outFields=*`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should use passed in query parameters", done => {
    const requestOptions: IQueryFeaturesRequestOptions = {
      url: serviceUrl,
      where: "Condition='Poor'",
      outFields: ["FID", "Tree_ID", "Cmn_Name", "Condition"]
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${
            requestOptions.url
          }/query?f=json&where=Condition%3D'Poor'&outFields=FID%2CTree_ID%2CCmn_Name%2CCondition`
        );
        expect(options.method).toBe("GET");
        // expect(response.attributes.FID).toEqual(42);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should supply default query related parameters", done => {
    const requestOptions: IQueryRelatedRequestOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryRelatedResponse);
    queryRelated(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${
            requestOptions.url
          }/queryRelatedRecords?f=json&definitionExpression=1%3D1&outFields=*&relationshipId=0`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should use passed in query related parameters", done => {
    const requestOptions: IQueryRelatedRequestOptions = {
      url: serviceUrl,
      relationshipId: 1,
      definitionExpression: "APPROXACRE<10000",
      outFields: ["APPROXACRE", "FIELD_NAME"],
      httpMethod: "POST"
    };
    fetchMock.once("*", queryRelatedResponse);
    queryRelated(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(`${requestOptions.url}/queryRelatedRecords`);
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("relationshipId=1");
        expect(options.body).toContain(
          "definitionExpression=APPROXACRE%3C10000"
        );
        expect(options.body).toContain("outFields=APPROXACRE%2CFIELD_NAME");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
