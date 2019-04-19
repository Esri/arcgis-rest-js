/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request } from "../../src/request";
import { IRequestOptions } from "../../src/utils/IRequestOptions";
import { withOptions } from "../../src/utils/with-options";

import * as fetchMock from "fetch-mock";

const SharingRestInfo = {
  owningSystemUrl: "http://www.arcgis.com",
  authInfo: {
    tokenServicesUrl: "https://www.arcgis.com/sharing/rest/generateToken",
    isTokenBasedSecurity: true
  }
};

describe("withOptions()", () => {
  afterEach(fetchMock.restore);

  it("should wrap a basic request with default options", done => {
    fetchMock.once("*", SharingRestInfo);
    const requestWithOptions = withOptions(
      {
        headers: {
          "Test-Header": "Test"
        }
      },
      request
    );

    requestWithOptions("https://www.arcgis.com/sharing/rest/info")
      .then(() => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch((e: any) => {
        fail(e);
      });
  });

  it("should wrap a custom request implementation with default options", done => {
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

    requestWithOptions({
      id: "foo"
    })
      .then(() => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch((e: any) => {
        fail(e);
      });
  });

  it("should wrap a custom request implementation with multiple parameters with a default URL", done => {
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

    requestWithOptions("foo")
      .then(() => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch((e: any) => {
        fail(e);
      });
  });
});
