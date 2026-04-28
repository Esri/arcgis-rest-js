/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
// This file should be removed with the completion of ArcGIS REST JS v5.0 release.
import { afterEach, describe, expect, test, vi } from "vitest";
import { request } from "../src/index.js";
import { warnOnDeprecatedRequestOptions } from "../src/utils/warn-deprecated-request-options.js";
import fetchMock from "fetch-mock";
import { SharingRestInfo } from "./mocks/sharing-rest-info.js";

describe("deprecated request option warnings", () => {
  test("should no-op when deprecated options are undefined", () => {
    const oldWarn = console.warn;
    const warnSpy = vi.fn();
    console.warn = warnSpy;

    warnOnDeprecatedRequestOptions(undefined);

    expect(warnSpy).not.toHaveBeenCalled();
    console.warn = oldWarn;
  });

  afterEach(() => {
    fetchMock.restore();
  });

  test("should warn when deprecated top-level request options are used", async () => {
    const oldWarn = console.warn;
    const warnSpy = vi.fn();
    console.warn = warnSpy;

    fetchMock.once("*", SharingRestInfo);

    const controller = new AbortController();
    await request("https://www.arcgis.com/sharing/rest/info", {
      httpMethod: "GET",
      rawResponse: false,
      hideToken: false,
      portal: "https://www.arcgis.com/sharing/rest",
      credentials: "include",
      maxUrlLength: 3000,
      headers: {
        "Test-Header": "test"
      },
      signal: controller.signal,
      suppressWarnings: false
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "httpMethod is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "rawResponse is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "hideToken is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "credentials is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "maxUrlLength is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "headers is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "signal is deprecated as a top-level request option"
      )
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "suppressWarnings is deprecated as a top-level request option"
      )
    );

    console.warn = oldWarn;
  });

  test("should warn when deprecated request override option is used", async () => {
    const oldWarn = console.warn;
    const warnSpy = vi.fn();
    console.warn = warnSpy;

    const customRequest = vi.fn().mockResolvedValue({ ok: true });
    const response = await request("https://www.arcgis.com/sharing/rest/info", {
      request: customRequest
    });

    expect(response).toEqual({ ok: true });
    expect(customRequest).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        "request is deprecated as a top-level request option"
      )
    );

    console.warn = oldWarn;
  });
});
