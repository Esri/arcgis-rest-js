import { checkForErrors, ArcGISRequestError } from "../src/index";
import { SharingRestInfo } from "./mocks/sharing-rest-info";
import {
  ArcGISOnlineError,
  BillingError,
  TaskErrorWithJSON,
  TaskError,
  ArcGISOnlineErrorNoMessageCode,
  ArcGISOnlineErrorNoCode
} from "./mocks/errors";

describe("checkForErrors", () => {
  it("should pass if an error is not found", () => {
    expect(checkForErrors(SharingRestInfo)).toBe(SharingRestInfo);
  });

  it("should throw an ArcGISRequestError for an error from the ArcGIS REST API", () => {
    expect(() => {
      checkForErrors(ArcGISOnlineError);
    }).toThrowError(
      ArcGISRequestError,
      "GWM_0003: You do not have permissions to access this resource or perform this operation."
    );
  });

  it("should throw an ArcGISRequestError for an error from the ArcGIS REST API that has no messageCode", () => {
    expect(() => {
      checkForErrors(ArcGISOnlineErrorNoMessageCode);
    }).toThrowError(
      ArcGISRequestError,
      "403: You do not have permissions to access this resource or perform this operation."
    );
  });

  it("should throw an ArcGISRequestError for an error from the ArcGIS REST API that has no code", () => {
    expect(() => {
      checkForErrors(ArcGISOnlineErrorNoCode);
    }).toThrowError(
      ArcGISRequestError,
      "You do not have permissions to access this resource or perform this operation."
    );
  });

  it("should throw an ArcGISRequestError for an error from the ArcGIS Online Billing Backend", () => {
    expect(() => {
      checkForErrors(BillingError);
    }).toThrowError(ArcGISRequestError, "500: Error getting subscription info");
  });

  it("should throw an ArcGISRequestError for an error when checking long running tasks in ArcGIS REST API", () => {
    expect(() => {
      checkForErrors(TaskErrorWithJSON);
    }).toThrowError(
      ArcGISRequestError,
      "400: Index was outside the bounds of the array."
    );
  });

  it("should throw an ArcGISRequestError for an error when checking long running tasks in ArcGIS REST API without a JSON statusMessage", () => {
    expect(() => {
      checkForErrors(TaskError);
    }).toThrowError(ArcGISRequestError, "failed");
  });
});
