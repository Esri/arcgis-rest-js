import {
  getFeature,
  queryFeatures,
  addFeatures,
  updateFeatures,
<<<<<<< HEAD
  deleteFeatures,
  IDeleteFeaturesRequestOptions,
  IUpdateFeaturesRequestOptions
=======
  deleteFeatures
>>>>>>> 7523ddf... add tests for add, update and delete
} from "../src/index";

import * as fetchMock from "fetch-mock";

import {
  featureResponse,
  queryResponse,
  addFeaturesResponse,
  updateFeaturesResponse,
  deleteFeaturesResponse
} from "./mocks/feature";

describe("feature", () => {
  afterEach(fetchMock.restore);

  it("should return a feature by id", done => {
    const params = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      id: 42
    };
    fetchMock.once("*", featureResponse);
    getFeature(params).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${params.url}/42?f=json`);
      expect(options.method).toBe("GET");
      expect(response.attributes.FID).toEqual(42);
      done();
    });
  });

  it("should supply default query parameters", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0"
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(
        `${requestOptions.url}/query?f=json&where=1%3D1&outFields=*`
      );
      expect(options.method).toBe("GET");
      // expect(response.attributes.FID).toEqual(42);
      done();
    });
  });

  it("should use passed in query parameters", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      params: {
        where: "Condition='Poor'",
        outFields: ["FID", "Tree_ID", "Cmn_Name", "Condition"]
      }
    };
    fetchMock.once("*", queryResponse);
    queryFeatures(requestOptions).then(response => {
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
    });
  });

  it("should return objectId of the added feature and a truthy success", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      adds: [
        {
          geometry: {
            x: -9177311.62541634,
            y: 4247151.205222242,
            spatialReference: {
              wkid: 102100,
              latestWkid: 3857
            }
          },
          attributes: {
            Tree_ID: 102,
            Collected: 1349395200000,
            Crew: "Linden+ Forrest+ Johnny"
          }
        }
      ]
    };
    fetchMock.once("*", addFeaturesResponse);
    addFeatures(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${requestOptions.url}/addFeatures`);
      expect(options.body).toContain(
        "features=" +
          encodeURIComponent(
            '[{"geometry":{"x":-9177311.62541634,"y":4247151.205222242,"spatialReference":{"wkid":102100,"latestWkid":3857}},"attributes":{"Tree_ID":102,"Collected":1349395200000,"Crew":"Linden+ Forrest+ Johnny"}}]'
          )
      );
      expect(options.method).toBe("POST");
      expect(addFeaturesResponse.addResults[0].objectId).toEqual(1001);
      expect(addFeaturesResponse.addResults[0].success).toEqual(true);
      expect(options.method).toBe("POST");
      done();
    });
  });

  it("should return objectId of the updated feature and a truthy success", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      updates: [
        {
          attributes: {
            OBJECTID: 1001,
            Street: "NO",
            Native: "YES"
          }
        }
      ],
      params: {
        rollbackOnFailure: false
      }
    } as IUpdateFeaturesRequestOptions;
    fetchMock.once("*", updateFeaturesResponse);
    updateFeatures(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${requestOptions.url}/updateFeatures`);
      expect(options.method).toBe("POST");
      expect(options.body).toContain(
        "features=" +
          encodeURIComponent(
            '[{"attributes":{"OBJECTID":1001,"Street":"NO","Native":"YES"}}]'
          )
      );
      expect(options.body).toContain("rollbackOnFailure=false");
      expect(updateFeaturesResponse.updateResults[0].success).toEqual(true);
      done();
    });
  });

  it("should return objectId of the deleted feature and a truthy success", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      deletes: [1001],
      params: {
        where: "1=1"
      }
    } as IDeleteFeaturesRequestOptions;
    fetchMock.once("*", deleteFeaturesResponse);
    deleteFeatures(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${requestOptions.url}/deleteFeatures`);
      expect(options.body).toContain("objectIds=1001");
      expect(options.body).toContain("where=1%3D1");
      expect(options.method).toBe("POST");
      expect(deleteFeaturesResponse.deleteResults[0].objectId).toEqual(
        requestOptions.deletes[0]
      );
      expect(deleteFeaturesResponse.deleteResults[0].success).toEqual(true);
      done();
    });
  });
});
