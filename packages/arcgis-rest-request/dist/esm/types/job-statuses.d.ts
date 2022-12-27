/**
 * These statuses are based on what are returned from the job request task and have been into an enum type.
 *
 * Reference https://developers.arcgis.com/rest/services-reference/enterprise/geoanalytics-checking-job-status.htm
 */
export declare enum JOB_STATUSES {
    Success = "Succeeded",
    Failed = "Failed",
    Waiting = "Waiting",
    Cancelled = "Cancelled",
    Cancelling = "Cancelling",
    New = "New",
    Executing = "Executing",
    Submitted = "Submitted",
    Failure = "Failure",
    TimedOut = "TimedOut",
    Error = "Error",
    Status = "Etatus",
    Unknown = "Unknown"
}
