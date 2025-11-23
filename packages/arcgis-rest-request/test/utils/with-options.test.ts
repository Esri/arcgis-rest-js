/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "../../src/request.js";
import { IRequestOptions } from "../../src/utils/IRequestOptions.js";
import { withOptions } from "../../src/utils/with-options.js";
import fetchMock from "fetch-mock";
import { describe, test, expect, afterEach } from "vitest";

const SharingRestInfo = {
  owningSystemUrl: "http://www.arcgis.com",
  authInfo: {
    tokenServicesUrl: "https://www.arcgis.com/sharing/rest/generateToken",
    isTokenBasedSecurity: true
  }
};

describe("withOptions()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should wrap a basic request with default options", async () => {
    fetchMock.once("*", SharingRestInfo);
    const requestWithOptions = withOptions(
      {
        headers: {
          "Test-Header": "Test"
        }
      },
      request
    );

    await requestWithOptions("https://www.arcgis.com/sharing/rest/info");
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect((options.headers as any)["Test-Header"]).toBe("Test");
  });

  test("should wrap a custom request implementation with default options", async () => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomOptions extends IRequestOptions {
      id: string;
    }

    interface ICustomResponse {
      test: string;
    }

    function customRequest(options: ICustomOptions): Promise<ICustomResponse> {
      options.params = {
        id: options.id
      };
      return request("https://www.arcgis.com/sharing/rest/info", options);
    }

    const requestWithOptions = withOptions(
      {
        headers: {
          "Test-Header": "Test"
        }
      },
      customRequest
    );

    await requestWithOptions({
      id: "foo"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.body).toContain("id=foo");
    expect((options.headers as any)["Test-Header"]).toBe("Test");
  });

  test("should wrap a custom request implementation with multiple parameters with a default URL", async () => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomResponse {
      test: string;
    }

    function customRequest(
      id: string,
      options: IRequestOptions = {}
    ): Promise<ICustomResponse> {
      options = {
        ...options,
        ...{ params: { ...options.params, ...{ id } } }
      };
      return request("https://www.arcgis.com/sharing/rest/info", options);
    }

    const requestWithOptions = withOptions(
      {
        headers: {
          "Test-Header": "Test"
        }
      },
      customRequest
    );

    await requestWithOptions("foo");
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
    expect(options.body).toContain("id=foo");
    expect((options.headers as any)["Test-Header"]).toBe("Test");
  });
});
