/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import { attachmentFile } from "../../../scripts/test-helpers.js";
import {
  getAttachments,
  IGetAttachmentsOptions,
  addAttachment,
  IAddAttachmentOptions,
  updateAttachment,
  IUpdateAttachmentOptions,
  deleteAttachments,
  IDeleteAttachmentsOptions,
  queryAttachments,
  IQueryAttachmentsOptions
} from "../src/index.js";
import {
  getAttachmentsResponse,
  addAttachmentResponse,
  updateAttachmentResponse,
  deleteAttachmentsResponse,
  queryAttachmentsResponse,
  genericInvalidResponse
} from "./mocks/feature.js";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer/0";

describe("attachment methods", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should return an array of attachmentInfos for a feature by id", async () => {
    const requestOptions: IGetAttachmentsOptions = {
      url: serviceUrl,
      featureId: 42,
      params: { gdbVersion: "SDE.DEFAULT" }
    };
    fetchMock.once("*", getAttachmentsResponse);
    const response = await getAttachments(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/${requestOptions.featureId}/attachments?f=json&gdbVersion=SDE.DEFAULT`
    );
    expect(options.method).toBe("GET");
    expect(response.attachmentInfos).toHaveLength(2);
    expect(response.attachmentInfos[0].id).toBe(409);
  });

  test("should return objectId of the added attachment and a success state", async () => {
    const requestOptions: IAddAttachmentOptions = {
      url: serviceUrl,
      featureId: 42,
      attachment: attachmentFile(),
      params: { returnEditMoment: true }
    };
    fetchMock.once("*", addAttachmentResponse);
    const response = await addAttachment(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
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
    expect(response.addAttachmentResult.objectId).toBe(1001);
    expect(response.addAttachmentResult.success).toBe(true);
  });

  test("should return an error for a service/feature which does not have attachments", async () => {
    const requestOptions: IAddAttachmentOptions = {
      url: "https://services.arcgis.com/f8b/arcgis/rest/services/NoAttachments/FeatureServer/0",
      featureId: 654,
      attachment: attachmentFile(),
      params: { returnEditMoment: true }
    };
    fetchMock.once("*", genericInvalidResponse);
    await expect(addAttachment(requestOptions)).rejects.toMatchObject({
      response: expect.objectContaining({
        error: expect.objectContaining({
          code: 400,
          message: "Invalid or missing input parameters."
        })
      })
    });
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/${requestOptions.featureId}/addAttachment`
    );
    expect(options.method).toBe("POST");
  });

  test("should return objectId of the updated attachment and a success state", async () => {
    const requestOptions: IUpdateAttachmentOptions = {
      url: serviceUrl,
      featureId: 42,
      attachmentId: 1001,
      attachment: attachmentFile(),
      params: { returnEditMoment: true }
    };
    fetchMock.once("*", updateAttachmentResponse);
    const response = await updateAttachment(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/${requestOptions.featureId}/updateAttachment`
    );
    expect(options.method).toBe("POST");
    expect(response.updateAttachmentResult.objectId).toBe(1001);
    expect(response.updateAttachmentResult.success).toBe(true);
  });

  test("should return objectId of the deleted attachment and a success state", async () => {
    const requestOptions: IDeleteAttachmentsOptions = {
      url: serviceUrl,
      featureId: 42,
      attachmentIds: [1001],
      params: { returnEditMoment: true }
    };
    fetchMock.once("*", deleteAttachmentsResponse);
    const response = await deleteAttachments(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `${requestOptions.url}/${requestOptions.featureId}/deleteAttachments`
    );
    expect(options.body).toContain("attachmentIds=1001");
    expect(options.body).toContain("returnEditMoment=true");
    expect(options.method).toBe("POST");
    expect(response.deleteAttachmentResults[0].objectId).toBe(1001);
    expect(response.deleteAttachmentResults[0].success).toBe(true);
  });

  test("should return attachment groups when queried by objectIds", async () => {
    const requestOptions: IQueryAttachmentsOptions = {
      url: serviceUrl,
      objectIds: [2, 4],
      returnUrl: true
    };
    fetchMock.once("*", queryAttachmentsResponse);
    const response = await queryAttachments(requestOptions);
    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toContain(`${serviceUrl}/queryAttachments`);
    expect(url).toContain("objectIds=2%2C4");
    expect(url).toContain("returnUrl=true");
    expect(url).toContain("f=json");
    expect(options.method).toBe("GET");
    expect(response.attachmentGroups).toHaveLength(2);
    expect(response.attachmentGroups[0].parentObjectId).toBe(2);
    expect(response.attachmentGroups[0].attachmentInfos[0].id).toBe(1204);
  });
});
