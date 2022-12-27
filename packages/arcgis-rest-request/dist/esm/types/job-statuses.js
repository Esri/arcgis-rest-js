/**
 * These statuses are based on what are returned from the job request task and have been into an enum type.
 *
 * Reference https://developers.arcgis.com/rest/services-reference/enterprise/geoanalytics-checking-job-status.htm
 */
export var JOB_STATUSES;
(function (JOB_STATUSES) {
    JOB_STATUSES["Success"] = "Succeeded";
    JOB_STATUSES["Failed"] = "Failed";
    JOB_STATUSES["Waiting"] = "Waiting";
    JOB_STATUSES["Cancelled"] = "Cancelled";
    JOB_STATUSES["Cancelling"] = "Cancelling";
    JOB_STATUSES["New"] = "New";
    JOB_STATUSES["Executing"] = "Executing";
    JOB_STATUSES["Submitted"] = "Submitted";
    JOB_STATUSES["Failure"] = "Failure";
    JOB_STATUSES["TimedOut"] = "TimedOut";
    JOB_STATUSES["Error"] = "Error";
    JOB_STATUSES["Status"] = "Etatus";
    JOB_STATUSES["Unknown"] = "Unknown";
})(JOB_STATUSES || (JOB_STATUSES = {}));
//# sourceMappingURL=job-statuses.js.map