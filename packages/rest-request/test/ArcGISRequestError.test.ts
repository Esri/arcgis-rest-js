import { ArcGISRequestError } from "../src/index";
import { ArcGISOnlineError } from "./mocks/errors";

describe("ArcGISRequestError", () => {
  it("should be an instanceof Error", () => {
    expect(new ArcGISRequestError() instanceof Error).toBe(true);
  });

  it("should expose basic error properties", () => {
    const error = new ArcGISRequestError(
      ArcGISOnlineError.error.message,
      ArcGISOnlineError.error.code,
      ArcGISOnlineError
    );

    expect(error.name).toBe("ArcGISRequestError");
    expect(error.message).toBe("400: 'type' and 'title' property required.");
    expect(error.code).toBe(400);
    expect(error.originalMessage).toBe("'type' and 'title' property required.");
    expect(error.originalResponse).toEqual(ArcGISOnlineError);
  });

  it("should still format without a message, code or response", () => {
    const error = new ArcGISRequestError();
    expect(error.message).toBe("UNKNOWN_ERROR");
    expect(error.code).toEqual("UNKNOWN_ERROR_CODE");
    expect(error.originalMessage).toBe("UNKNOWN_ERROR");
    expect(error.originalResponse).toEqual(undefined);
  });
});
