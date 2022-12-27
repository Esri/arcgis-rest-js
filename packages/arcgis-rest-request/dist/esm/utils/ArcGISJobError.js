/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
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
     * Create a new `ArcGISJobError` object.
     *
     * @param message - The error message from the API
     * @param jobInfo - The info of the job that is in an error state
     */
    constructor(message = "Unknown error", jobInfo) {
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
//# sourceMappingURL=ArcGISJobError.js.map