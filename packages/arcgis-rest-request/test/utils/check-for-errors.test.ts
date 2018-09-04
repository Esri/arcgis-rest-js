/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  checkForErrors,
  warn,
  ArcGISRequestError,
  ArcGISAuthError
} from "../../src/index";
import { SharingRestInfo } from "./../mocks/sharing-rest-info";
import {
  ArcGISOnlineError,
  BillingError,
  TaskErrorWithJSON,
  TaskError,
  ArcGISOnlineErrorNoMessageCode,
  ArcGISOnlineErrorNoCode,
  ArcGISServerTokenRequired,
  ArcGISOnlineAuthError,
  BillingErrorWithCode200
} from "./../mocks/errors";

describe("checkForErrors", () => {
  it("should pass if an error is not found", () => {
    expect(checkForErrors(SharingRestInfo)).toBe(SharingRestInfo);
  });

  it("should throw an ArcGISRequestError for an error from the ArcGIS REST API", () => {
    expect(() => {
      checkForErrors(ArcGISOnlineError);
    }).toThrowError(
      ArcGISRequestError,
      "400: 'type' and 'title' property required."
    );
  });

  it("should throw an ArcGISOnlineAuthError for an error from the ArcGIS REST API", () => {
    expect(() => {
      checkForErrors(ArcGISOnlineAuthError);
    }).toThrowError(ArcGISAuthError, "498: Invalid token.");
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

  it("should throw an ArcGISRequestError for an error from the ArcGIS Online Billing Backend with a failure status", () => {
    expect(() => {
      checkForErrors(BillingErrorWithCode200);
    }).toThrowError(ArcGISRequestError, "UNKNOWN_ERROR");
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

  it("should throw an ArcGISAuthError instead of ArcGISRequestError for messageCode=GWM_0003", () => {
    expect(() => {
      checkForErrors(ArcGISServerTokenRequired);
    }).toThrowError(ArcGISAuthError, "GWM_0003: Token Required");
  });
});

describe("warn", () => {
  it("should bubble up deprecation warnings", () => {
    console.warn = jasmine.createSpy("warning");
    warn("Danger Will Robinson!");
    expect(console.warn).toHaveBeenCalledWith("Danger Will Robinson!");
  });
});

describe("warn", () => {
  it("should carry on gracefully when no console is available", () => {
    const realConsoleWarn = console.warn;
    console.warn = undefined;
    warn("Danger Will Robinson!");
    expect(console.warn).toBe(undefined);
    console.warn = realConsoleWarn;
  });
});
