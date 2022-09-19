/**
 * These statuses are based on what are returned from the job request task and have been into an enum type.
 * 
 * Reference {@link https://developers.arcgis.com/rest/services-reference/enterprise/checking-job-status.html}
 */
export enum JOB_STATUSES {
  Success = "succeeded",
  Failed = "failed",
  Waiting = "waiting",
  Cancelled = "cancelled",
  Cancelling = "cancelling",
  New = "new",
  Executing = "executing",
  Submitted = "submitted",
  Failure = "failure",
  TimedOut = "timed-out",
  Error = "error",
  Status = "status"
}
