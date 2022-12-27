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
export declare class ArcGISJobError extends Error {
    /**
     * The name of this error. Will always be `"ArcGISJobError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
     */
    name: string;
    /**
     * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
     */
    message: string;
    /**
     * The status of the job.
     */
    status: JOB_STATUSES;
    /**
     * The information about the current state of the job at the time of the error.
     */
    jobInfo: IJobInfo;
    /**
     * The job id.
     */
    id: string;
    /**
     * Create a new `ArcGISJobError` object.
     *
     * @param message - The error message from the API
     * @param jobInfo - The info of the job that is in an error state
     */
    constructor(message: string, jobInfo: IJobInfo);
}
