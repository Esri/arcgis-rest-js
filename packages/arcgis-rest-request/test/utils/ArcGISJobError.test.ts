/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISJobError, JOB_STATUSES } from "../../src/index.js";
import { describe, test, expect } from "vitest";

describe("ArcGISJobError", () => {
  test("should be an instanceof Error", () => {
    expect(
      new ArcGISJobError("Job failed", {
        id: "abc",
        status: JOB_STATUSES.Failed
      }) instanceof Error
    ).toBe(true);
  });

  test("should expose basic error properties", () => {
    const error = new ArcGISJobError("Job failed", {
      id: "abc",
      status: JOB_STATUSES.Failed
    });

    expect(error.id).toEqual("abc");
    expect(error.status).toEqual(JOB_STATUSES.Failed);
    expect(error.jobInfo).toEqual({ id: "abc", status: JOB_STATUSES.Failed });
    expect(error.message).toEqual("Failed: Job failed");
  });

  test("should default to an unknown error message", () => {
    const error = new ArcGISJobError(undefined, {
      id: "abc",
      status: JOB_STATUSES.Failed
    });

    expect(error.message).toEqual("Failed: Unknown error");
  });
});
