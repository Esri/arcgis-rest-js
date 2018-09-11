/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import {
  getAttachments,
  IGetAttachmentsOptions,
  addAttachment,
  IAddAttachmentOptions,
  updateAttachment,
  IUpdateAttachmentOptions,
  deleteAttachments,
  IDeleteAttachmentsOptions
} from "../src/index";

import {
  getAttachmentsResponse,
  addAttachmentResponse,
  updateAttachmentResponse,
  deleteAttachmentsResponse,
  genericInvalidResponse
} from "./mocks/feature";

export function attachmentFile() {
  if (typeof File !== "undefined" && File) {
    return new File(["foo"], "foo.txt", { type: "text/plain" });
  } else {
    const fs = require("fs");
    return fs.createReadStream(
      "./packages/arcgis-rest-feature-service/test/mocks/foo.txt"
    );
  }
}

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("attachment methods", () => {
  afterEach(fetchMock.restore);

  it("should return an array of attachmentInfos for a feature by id", done => {
    const requestOptions = {
      url: serviceUrl,
      featureId: 42,
      params: {
        gdbVersion: "SDE.DEFAULT"
      },
      httpMethod: "GET"
    } as IGetAttachmentsOptions;
    fetchMock.once("*", getAttachmentsResponse);
    getAttachments(requestOptions)
      .then(() => {
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
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return objectId of the added attachment and a truthy success", done => {
    const requestOptions = {
      url: serviceUrl,
      featureId: 42,
      attachment: attachmentFile(),
      params: {
        returnEditMoment: true
      }
    } as IAddAttachmentOptions;
    fetchMock.once("*", addAttachmentResponse);
    addAttachment(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/${requestOptions.featureId}/addAttachment`
        );
        expect(options.method).toBe("POST");

        const params = options.body as FormData;
        expect(params instanceof FormData).toBeTruthy();
        // we can introspect FormData in Chrome this way, but not Node.js
        // more info: https://github.com/form-data/form-data/issues/124
        if (params.get) {
          expect(params.get("returnEditMoment")).toEqual("true");
        }
        expect(addAttachmentResponse.addAttachmentResult.objectId).toEqual(
          1001
        );
        expect(addAttachmentResponse.addAttachmentResult.success).toEqual(true);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return an error for a service/feature which does not have attachments", done => {
    const requestOptions = {
      url:
        "https://services.arcgis.com/f8b/arcgis/rest/services/NoAttachments/FeatureServer/0",
      featureId: 654,
      attachment: attachmentFile(),
      params: {
        returnEditMoment: true
      }
    } as IAddAttachmentOptions;
    fetchMock.once("*", genericInvalidResponse);
    addAttachment(requestOptions)
      .then(() => {
        // nothing to test here forcing error
        fail();
      })
      .catch(error => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/${requestOptions.featureId}/addAttachment`
        );
        expect(options.method).toBe("POST");
        expect(error.response.error.code).toEqual(400);
        expect(error.response.error.message).toEqual(
          "Invalid or missing input parameters."
        );
        done();
      });
  });

  it("should return objectId of the updated attachment and a truthy success", done => {
    const requestOptions = {
      url: serviceUrl,
      featureId: 42,
      attachmentId: 1001,
      attachment: attachmentFile(),
      params: {
        returnEditMoment: true
      }
    } as IUpdateAttachmentOptions;
    fetchMock.once("*", updateAttachmentResponse);
    updateAttachment(requestOptions)
      .then(() => {
        expect(fetchMock.called()).toBeTruthy();
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `${requestOptions.url}/${requestOptions.featureId}/updateAttachment`
        );
        expect(options.method).toBe("POST");
        expect(
          updateAttachmentResponse.updateAttachmentResult.objectId
        ).toEqual(1001);
        expect(updateAttachmentResponse.updateAttachmentResult.success).toEqual(
          true
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should return objectId of the deleted attachment and a truthy success", done => {
    const requestOptions = {
      url: serviceUrl,
      featureId: 42,
      attachmentIds: [1001],
      params: {
        returnEditMoment: true
      }
    } as IDeleteAttachmentsOptions;
    fetchMock.once("*", deleteAttachmentsResponse);
    deleteAttachments(requestOptions)
      .then(() => {
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
      })
      .catch(e => {
        fail(e);
      });
  });
});
