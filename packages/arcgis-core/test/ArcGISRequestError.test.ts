import { ArcGISRequestError } from "../src/index";
import { ArcGISOnlineError, BillingError, TaskError } from "./mocks/errors";

describe("ArcGISRequestError", () => {
  it("should be an instanceof Error", () => {
    expect(new ArcGISRequestError() instanceof Error).toBe(true);
  });

  it("should expose basic error properties", () => {
    const error = new ArcGISRequestError(
      ArcGISOnlineError.error.message,
      ArcGISOnlineError.error.messageCode,
      ArcGISOnlineError
    );

    expect(error.name).toBe("ArcGISRequestError");
    expect(error.message).toBe(
      "GWM_0003: You do not have permissions to access this resource or perform this operation."
    );
    expect(error.code).toBe("GWM_0003");
    expect(error.originalMessage).toBe(
      "You do not have permissions to access this resource or perform this operation."
    );
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
