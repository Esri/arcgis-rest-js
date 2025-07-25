/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

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
  it("should return a feature by id", (done) => {
    const requestOptions = {
      url: serviceUrl,
      id: 42
    };
    fetchMock.once("*", featureResponse);
    getFeature(requestOptions)
      .then((response) => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(`${requestOptions.url}/42?f=json`);
        expect(options.method).toBe("GET");
        expect(response.attributes.FID).toEqual(42);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("return rawResponse when getting a feature", (done) => {
    const requestOptions = {
      url: serviceUrl,
      id: 42,
      rawResponse: true
    };
    fetchMock.once("*", featureResponse);
    getFeature(requestOptions)
      .then((response: any) => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(`${requestOptions.url}/42?f=json`);
        expect(options.method).toBe("GET");
        expect(response.status).toBe(200);
        expect(response.ok).toBe(true);
        expect(response.body.Readable).not.toBe(null);
        response.json().then((raw: any) => {
          expect(raw).toEqual(featureResponse);
          done();
        });
        // this used to work with isomorphic-fetch
        // expect(response instanceof Response).toBe(true);
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should supply default query parameters", (done) => {
    const requestOptions: IQueryFeaturesOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/query?f=json&where=1%3D1&outFields=*`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should use passed in query parameters", (done) => {
    const requestOptions: IQueryFeaturesOptions = {
      url: serviceUrl,
      where: "Condition='Poor'",
      outFields: ["FID", "Tree_ID", "Cmn_Name", "Condition"],
      orderByFields: "test",
      geometry: {},
      geometryType: "esriGeometryPolygon"
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/query?f=json&where=Condition%3D%27Poor%27&outFields=FID%2CTree_ID%2CCmn_Name%2CCondition&geometry=%7B%7D&geometryType=esriGeometryPolygon&orderByFields=test`
        );
        expect(options.method).toBe("GET");
        // expect(response.attributes.FID).toEqual(42);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should supply default query related parameters", (done) => {
    const requestOptions: IQueryRelatedOptions = {
      url: serviceUrl
    };
    fetchMock.once("*", queryRelatedResponse);
    queryRelated(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/queryRelatedRecords?f=json&definitionExpression=1%3D1&outFields=*&relationshipId=0`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should use passed in query related parameters", (done) => {
    const requestOptions: IQueryRelatedOptions = {
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
        const [url, options] = fetchMock.lastCall("*");
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
      .catch((e) => {
        fail(e);
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

  it("fetches multiple pages based on feature count", async () => {
    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&resultOffset=0&resultRecordCount=2000&where=1%3D1&outFields=*`,
      {
        features: page1Features
      }
    );

    fetchMock.getOnce(
      `${serviceUrl}/query?f=json&resultOffset=2000&resultRecordCount=2000&where=1%3D1&outFields=*`,
      {
        features: page2Features
      }
    );

    const result = await queryAllFeatures({
      url: serviceUrl,
      where: "1=1",
      outFields: "*"
    });

    expect(fetchMock.calls().length).toBe(2);
    expect(result.features.length).toBe(pageSize + 1);

    expect(result.features[0].attributes.OBJECTID).toBe(1);
    expect(result.features[pageSize].attributes.OBJECTID).toBe(2001);
  });
});
