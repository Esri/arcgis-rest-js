import {
  getFeature,
  queryFeatures,
  addFeatures,
  updateFeatures,
  deleteFeatures,
  IDeleteFeaturesRequestOptions,
  IUpdateFeaturesRequestOptions,
  getAttachments,
  IGetAttachmentsOptions,
  addAttachment,
  IAddAttachmentOptions,
  updateAttachment,
  IUpdateAttachmentOptions,
  deleteAttachments,
  IDeleteAttachmentsOptions
} from "../src/index";

import { IFeatureRequestOptions } from "../src/query";

import * as fetchMock from "fetch-mock";

import {
  featureResponse,
  queryResponse,
  addFeaturesResponse,
  updateFeaturesResponse,
  deleteFeaturesResponse,
  getAttachmentsResponse,
  addAttachmentResponse,
  updateAttachmentResponse,
  deleteAttachmentsResponse
} from "./mocks/feature";

function attachmentFile() {
  if (typeof File !== "undefined" && File) {
    return new File(["foo"], "foo.txt", { type: "text/plain" });
  } else {
    const fs = require("fs");
    return fs.createReadStream(
      "./packages/arcgis-rest-feature-service/test/mocks/foo.txt"
    );
  }
}

describe("feature", () => {
  afterEach(fetchMock.restore);

  it("should return a feature by id", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      id: 42
    };
    fetchMock.once("*", featureResponse);
    getFeature(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(`${requestOptions.url}/42?f=json`);
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
      done();
    });
  });

  it("should use passed in query parameters", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
      where: "Condition='Poor'",
      outFields: ["FID", "Tree_ID", "Cmn_Name", "Condition"]
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
      rollbackOnFailure: false
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
      where: "1=1"
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

  it("should return an array of attachmentInfos for a feature by id", done => {
    const requestOptions = {
      url:
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
      featureId: 42,
      params: {
        gdbVersion: "SDE.DEFAULT"
      },
      httpMethod: "GET"
    } as IGetAttachmentsOptions;
    fetchMock.once("*", getAttachmentsResponse);
    getAttachments(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(
        `${requestOptions.url}/${
          requestOptions.featureId
        }/attachments?f=json&gdbVersion=SDE.DEFAULT`
      );
      expect(options.method).toBe("GET");
      expect(getAttachmentsResponse.attachmentInfos.length).toEqual(2);
      expect(getAttachmentsResponse.attachmentInfos[0].id).toEqual(409);
      done();
    });
  });

  it("should return objectId of the added attachment and a truthy success", done => {
    const requestOptions = {
      url:
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
      featureId: 42,
      attachment: attachmentFile(),
      params: {
        returnEditMoment: true
      }
    } as IAddAttachmentOptions;
    fetchMock.once("*", addAttachmentResponse);
    addAttachment(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(
        `${requestOptions.url}/${requestOptions.featureId}/addAttachment`
      );
      expect(options.method).toBe("POST");
      // expect(options.body).toContain("returnEditMoment=true");
      expect(addAttachmentResponse.addAttachmentResult.objectId).toEqual(1001);
      expect(addAttachmentResponse.addAttachmentResult.success).toEqual(true);
      done();
    });
  });

  it("should return objectId of the updated attachment and a truthy success", done => {
    const requestOptions = {
      url:
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
      featureId: 42,
      attachmentId: 1001,
      attachment: attachmentFile(),
      params: {
        returnEditMoment: true
      }
    } as IUpdateAttachmentOptions;
    fetchMock.once("*", updateAttachmentResponse);
    updateAttachment(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(
        `${requestOptions.url}/${requestOptions.featureId}/updateAttachment`
      );
      expect(options.method).toBe("POST");
      // expect(options.body).toContain("returnEditMoment=true");
      expect(updateAttachmentResponse.updateAttachmentResult.objectId).toEqual(
        1001
      );
      expect(updateAttachmentResponse.updateAttachmentResult.success).toEqual(
        true
      );
      done();
    });
  });

  it("should return objectId of the deleted attachment and a truthy success", done => {
    const requestOptions = {
      url:
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
      featureId: 42,
      attachmentIds: [1001],
      params: {
        returnEditMoment: true
      }
    } as IDeleteAttachmentsOptions;
    fetchMock.once("*", deleteAttachmentsResponse);
    deleteAttachments(requestOptions).then(response => {
      expect(fetchMock.called()).toBeTruthy();
      const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
      expect(url).toEqual(
        `${requestOptions.url}/${requestOptions.featureId}/deleteAttachments`
      );
      expect(options.body).toContain("attachmentIds=1001");
      expect(options.body).toContain("returnEditMoment=true");
      expect(options.method).toBe("POST");
      expect(
        deleteAttachmentsResponse.deleteAttachmentResults[0].objectId
      ).toEqual(1001);
      expect(
        deleteAttachmentsResponse.deleteAttachmentResults[0].success
      ).toEqual(true);
      done();
    });
  });
});
