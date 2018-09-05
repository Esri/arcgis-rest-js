/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISRequestError } from "../../src/index";
import { ArcGISOnlineError } from "./../mocks/errors";

describe("ArcGISRequestError", () => {
  it("should be an instanceof Error", () => {
    expect(new ArcGISRequestError() instanceof Error).toBe(true);
  });

  it("should expose basic error properties", () => {
    const error = new ArcGISRequestError(
      ArcGISOnlineError.error.message,
      ArcGISOnlineError.error.code,
      ArcGISOnlineError,
      "https://example.com",
      {
        params: {
          f: "json"
        },
        httpMethod: "POST"
      }
    );

    expect(error.name).toBe("ArcGISRequestError");
    expect(error.message).toBe("400: 'type' and 'title' property required.");
    expect(error.code).toBe(400);
    expect(error.originalMessage).toBe("'type' and 'title' property required.");
    expect(error.response).toEqual(ArcGISOnlineError);
    expect(error.url).toBe("https://example.com");
    expect(error.options.params).toEqual({ f: "json" });
    expect(error.options.httpMethod).toEqual("POST");
  });

  it("should still format without a message, code or response", () => {
    const error = new ArcGISRequestError();
    expect(error.message).toBe("UNKNOWN_ERROR");
    expect(error.code).toEqual("UNKNOWN_ERROR_CODE");
    expect(error.originalMessage).toBe("UNKNOWN_ERROR");
    expect(error.response).toEqual(undefined);
  });

  it("should still format with a null or empty string message or code", () => {
    const error = new ArcGISRequestError(null, "");
    expect(error.message).toBe("UNKNOWN_ERROR");
    expect(error.code).toEqual("UNKNOWN_ERROR_CODE");
    expect(error.originalMessage).toBe("UNKNOWN_ERROR");
    expect(error.response).toEqual(undefined);
  });
});
