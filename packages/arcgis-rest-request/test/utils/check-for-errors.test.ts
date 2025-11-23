/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  checkForErrors,
  warn,
  ArcGISRequestError,
  ArcGISAuthError
} from "../../src/index.js";
import { SharingRestInfo } from "./../mocks/sharing-rest-info.js";
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
} from "./../mocks/errors.js";
import { describe, test, expect, vi } from "vitest";

describe("checkForErrors", () => {
  test("should pass if an error is not found", () => {
    expect(checkForErrors(SharingRestInfo)).toBe(SharingRestInfo);
  });

  test("should throw an ArcGISRequestError for an error from the ArcGIS REST API", () => {
    try {
      checkForErrors(ArcGISOnlineError);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe(
        "400: 'type' and 'title' property required."
      );
    }
  });

  test("should throw an ArcGISOnlineAuthError for an error from the ArcGIS REST API", () => {
    try {
      checkForErrors(ArcGISOnlineAuthError);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISAuthError);
      expect((err as ArcGISAuthError).message).toBe("498: Invalid token.");
    }
  });

  test("should throw an ArcGISRequestError for an error from the ArcGIS REST API that has no messageCode", () => {
    try {
      checkForErrors(ArcGISOnlineErrorNoMessageCode);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe(
        "403: You do not have permissions to access this resource or perform this operation."
      );
    }
  });

  test("should throw an ArcGISRequestError for an error from the ArcGIS REST API that has no code", () => {
    try {
      checkForErrors(ArcGISOnlineErrorNoCode);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe(
        "You do not have permissions to access this resource or perform this operation."
      );
    }
  });

  test("should throw an ArcGISRequestError for an error from the ArcGIS Online Billing Backend", () => {
    try {
      checkForErrors(BillingError);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe(
        "500: Error getting subscription info"
      );
    }
  });

  test("should throw an ArcGISRequestError for an error from the ArcGIS Online Billing Backend with a failure status", () => {
    try {
      checkForErrors(BillingErrorWithCode200);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe("UNKNOWN_ERROR");
    }
  });

  test("should throw an ArcGISRequestError for an error when checking long running tasks in ArcGIS REST API", () => {
    try {
      checkForErrors(TaskErrorWithJSON);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe(
        "400: Index was outside the bounds of the array."
      );
    }
  });

  test("should throw an ArcGISRequestError for an error when checking long running tasks in ArcGIS REST API without a JSON statusMessage", () => {
    try {
      checkForErrors(TaskError);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISRequestError);
      expect((err as ArcGISRequestError).message).toBe("failed");
    }
  });

  test("should throw an ArcGISAuthError instead of ArcGISRequestError for messageCode=GWM_0003", () => {
    try {
      checkForErrors(ArcGISServerTokenRequired);
      throw new Error("Did not throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ArcGISAuthError);
      expect((err as ArcGISAuthError).message).toBe("GWM_0003: Token Required");
    }
  });
});

describe("warn", () => {
  test("should bubble up deprecation warnings", () => {
    const warnSpy = vi.spyOn(console, "warn");
    warn("Danger Will Robinson!");
    expect(warnSpy).toHaveBeenCalledWith("Danger Will Robinson!");
    warnSpy.mockRestore();
  });
});

describe("warn", () => {
  test("should carry on gracefully when no console is available", () => {
    const realConsoleWarn = console.warn;
    console.warn = undefined;
    warn("Danger Will Robinson!");
    expect(console.warn).toBe(undefined);
    console.warn = realConsoleWarn;
  });
});
