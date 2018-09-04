/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISAuthError, IRetryAuthError, ErrorTypes } from "../../src/index";
import { ArcGISOnlineAuthError, ArcGISOnlineError } from "./../mocks/errors";
import * as fetchMock from "fetch-mock";

describe("ArcGISRequestError", () => {
  afterEach(fetchMock.restore);

  it("should be an instanceof Error", () => {
    expect(new ArcGISAuthError() instanceof Error).toBe(true);
  });

  it("should expose basic error properties", () => {
    const error = new ArcGISAuthError(
      ArcGISOnlineAuthError.error.message,
      ArcGISOnlineAuthError.error.code,
      ArcGISOnlineAuthError
    );

    expect(error.name).toBe("ArcGISAuthError");
    expect(error.message).toBe("498: Invalid token.");
    expect(error.code).toBe(498);
    expect(error.originalMessage).toBe("Invalid token.");
    expect(error.response).toEqual(ArcGISOnlineAuthError);
  });

  it("should still format without a message, code or response", () => {
    const error = new ArcGISAuthError();
    expect(error.message).toBe("AUTHENTICATION_ERROR");
    expect(error.code).toEqual("AUTHENTICATION_ERROR_CODE");
    expect(error.originalMessage).toBe("AUTHENTICATION_ERROR");
    expect(error.response).toEqual(undefined);
  });

  describe("retry", () => {
    const MockAuth: {
      portal: string;
      getToken: any;
      retryHandler: IRetryAuthError;
    } = {
      portal: "https://www.arcgis.com/sharing/rest",
      getToken() {
        return Promise.resolve("token");
      },
      retryHandler(url, options) {
        return Promise.resolve(MockAuth);
      }
    };

    it("should allow retrying a request with a new or updated session", done => {
      const error = new ArcGISAuthError(
        "Invalid token.",
        498,
        ArcGISAuthError,
        "http://www.arcgis.com/sharing/rest/content/users/caseyjones/addItem",
        {
          httpMethod: "POST",
          params: {
            title: "Test Map",
            tags: "foo",
            type: "Web Map",
            f: "json"
          }
        }
      );

      fetchMock.once("*", {
        success: true,
        id: "abc",
        folder: null
      });

      const retryHandlerSpy = spyOn(MockAuth, "retryHandler").and.callThrough();

      error
        .retry(MockAuth.retryHandler, 1)
        .then((response: any) => {
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "http://www.arcgis.com/sharing/rest/content/users/caseyjones/addItem"
          );
          expect(options.method).toEqual("POST");
          expect(retryHandlerSpy).toHaveBeenCalledTimes(1);
          expect(options.body).toContain("token=token");
          expect(options.body).toContain("tags=foo");
          expect(options.body).toContain("f=json");
          expect(response.success).toBe(true);
          expect(response.id).toBe("abc");
          expect(response.folder).toBe(null);
          done();
        })
        .catch((e: any) => {
          fail(e);
        });
    });

    it("should retry a request with a new or updated session up to the limit", done => {
      const error = new ArcGISAuthError(
        "Invalid token.",
        498,
        ArcGISAuthError,
        "http://www.arcgis.com/sharing/rest/content/users/caseyjones/addItem",
        {
          httpMethod: "POST",
          params: {
            title: "Test Map",
            tags: "foo",
            type: "Web Map",
            f: "json"
          }
        }
      );

      fetchMock.post("*", ArcGISOnlineAuthError);

      const retryHandlerSpy = spyOn(MockAuth, "retryHandler").and.callThrough();

      error.retry(MockAuth.retryHandler).catch((e: any) => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "http://www.arcgis.com/sharing/rest/content/users/caseyjones/addItem"
        );
        expect(options.method).toEqual("POST");
        expect(retryHandlerSpy).toHaveBeenCalledTimes(3);
        expect(options.body).toContain("token=token");
        expect(options.body).toContain("tags=foo");
        expect(options.body).toContain("f=json");
        expect(e.name).toBe(ErrorTypes.ArcGISAuthError);
        expect(e.message).toBe("498: Invalid token.");
        done();
      });
    });

    it("should throw an error if retrying throws a non-auth error", done => {
      const requestUrl =
        "http://www.arcgis.com/sharing/rest/content/users/caseyjones/addItem";
      const error = new ArcGISAuthError(
        "Invalid token.",
        498,
        ArcGISAuthError,
        requestUrl,
        {
          httpMethod: "POST",
          params: {
            type: "Web Map",
            f: "json"
          }
        }
      );

      fetchMock.post("*", ArcGISOnlineError);

      const retryHandlerSpy = spyOn(MockAuth, "retryHandler").and.callThrough();

      error.retry(MockAuth.retryHandler).catch((e: any) => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(requestUrl);
        expect(options.method).toEqual("POST");
        expect(retryHandlerSpy).toHaveBeenCalledTimes(1);
        expect(options.body).toContain("token=token");
        expect(options.body).toContain("f=json");
        expect(e.name).toBe(ErrorTypes.ArcGISRequestError);
        expect(e.message).toBe("400: 'type' and 'title' property required.");
        done();
      });
    });
  });
});
