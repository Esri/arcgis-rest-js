/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IJobInfo } from "../job.js";
import { JOB_STATUSES } from "../types/job-statuses.js";

/**
 * This represents a generic error from a {@linkcode Job}. There will be details about the error in the {@linkcode ArcGISJobError.jobInfo}.
 *
 * ```js
 * job.getAllResults().catch(e => {
 *   if(e.name === "ArcGISJobError") {
 *     console.log("Something went wrong with the job", e);
 *     console.log("Full job info", e.jobInfo);
 *   }
 * })
 * ```
 */
export class ArcGISJobError extends Error {
  /**
   * The name of this error. Will always be `"ArcGISJobError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
   */
  public name: string;

  /**
   * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
   */
  public message: string;

  /**
   * The status of the job.
   */
  public status: JOB_STATUSES;

  /**
   * The information about the current state of the job at the time of the error.
   */
  public jobInfo: IJobInfo;

  /**
   * The job id.
   */
  public id: string;

  /**
   * Create a new `ArcGISJobError` object.
   *
   * @param message - The error message from the API
   * @param jobInfo - The info of the job that is in an error state
   */
  constructor(message = "Unknown error", jobInfo: IJobInfo) {
    // 'Error' breaks prototype chain here
    super(message);

    // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
    // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);

    this.name = "ArcGISJobError";
    this.message = `${jobInfo.status}: ${message}`;
    this.status = jobInfo.status;
    this.id = jobInfo.id;
    this.jobInfo = jobInfo;
  }
}
