import { ArcGISAuthError } from "../src/index";
import { ArcGISOnlineAuthError } from "./mocks/errors";

describe("ArcGISRequestError", () => {
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
});
