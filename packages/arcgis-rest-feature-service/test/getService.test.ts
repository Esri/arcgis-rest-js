/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, afterEach, test, expect } from "vitest";
import fetchMock from "fetch-mock";
import { getService } from "../src/getService.js";
import { getFeatureServerResponse } from "./mocks/service.js";

const serviceUrl =
  "https://services.arcgis.com/f8b/arcgis/rest/services/Custom/FeatureServer";

describe("getServer()", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  test("should fetch feature server metadata", async () => {
    fetchMock.once("*", getFeatureServerResponse);

    const response = await getService({ url: serviceUrl });

    expect(fetchMock.called()).toBeTruthy();
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(serviceUrl);
    expect(options.method).toBe("POST");
    expect(response).toEqual(getFeatureServerResponse);
  });

  test("should request the service when passed a layer url", async () => {
    fetchMock.once("*", getFeatureServerResponse);

    const response = await getService({ url: `${serviceUrl}/0` });

    expect(fetchMock.called()).toBeTruthy();
    const [url] = fetchMock.lastCall("*");
    expect(url).toEqual(serviceUrl);
    expect(response).toEqual(getFeatureServerResponse);
  });

  test("should clean whitespace and trailing slashes from the url", async () => {
    fetchMock.once("*", getFeatureServerResponse);

    await getService({ url: ` ${serviceUrl}/0/ ` });

    expect(fetchMock.called()).toBeTruthy();
    const [url] = fetchMock.lastCall("*");
    expect(url).toEqual(serviceUrl);
  });
});
