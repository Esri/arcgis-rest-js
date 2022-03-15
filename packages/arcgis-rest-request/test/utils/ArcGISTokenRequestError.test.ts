/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  ArcGISTokenRequestError,
  ArcGISTokenRequestErrorCodes
} from "../../src/index.js";
import { RefreshTokenError } from "./../mocks/errors.js";

describe("ArcGISTokenRequestError", () => {
  it("should be an instanceof Error", () => {
    expect(new ArcGISTokenRequestError() instanceof Error).toBe(true);
  });

  it("should expose basic error properties", () => {
    const error = new ArcGISTokenRequestError(
      RefreshTokenError.error.message,
      ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED,
      RefreshTokenError,
      "https://example.com",
      {
        params: {
          f: "json"
        },
        httpMethod: "POST"
      }
    );

    expect(error.name).toBe("ArcGISTokenRequestError");
    expect(error.message).toBe(
      "REFRESH_TOKEN_EXCHANGE_FAILED: refresh_token expired"
    );
    expect(error.code).toBe(
      ArcGISTokenRequestErrorCodes.REFRESH_TOKEN_EXCHANGE_FAILED
    );
    expect(error.originalMessage).toBe("refresh_token expired");
    expect(error.response).toEqual(RefreshTokenError);
    expect(error.url).toBe("https://example.com");
    expect(error.options.params).toEqual({ f: "json" });
    expect(error.options.httpMethod).toEqual("POST");
  });

  it("should still format without a message, code or response", () => {
    const error = new ArcGISTokenRequestError();
    expect(error.message).toBe("UNKNOWN_ERROR_CODE: UNKNOWN_ERROR");
    expect(error.code).toEqual("UNKNOWN_ERROR_CODE");
    expect(error.originalMessage).toBe("UNKNOWN_ERROR");
    expect(error.response).toEqual(undefined);
  });
});
