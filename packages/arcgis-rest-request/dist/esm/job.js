import { request } from "./request.js";
import { cleanUrl } from "./utils/clean-url.js";
import { ArcGISJobError } from "./utils/ArcGISJobError.js";
import { JOB_STATUSES } from "./types/job-statuses.js";
import mitt from "mitt";
import { processJobParams } from "./utils/process-job-params.js";
const DefaultJobOptions = {
    pollingRate: 2000,
    startMonitoring: false
};
/**
 * Jobs represent long running processing tasks running on ArcGIS Services. Typically these represent complex analysis tasks such as [geoprocessing tasks](https://developers.arcgis.com/rest/services-reference/enterprise/submit-gp-job.htm), [logistics analysis such as fleet routing](https://developers.arcgis.com/rest/network/api-reference/vehicle-routing-problem-service.htm) or [spatial analysis tasks](https://developers.arcgis.com/rest/analysis/api-reference/tasks-overview.htm).
 *
 * To create a {@linkcode Job}, use the {@linkcode Job.submitJob} method which will return an instance of the {@linkcode Job} class with a unique id.
 *
 * If you have an existing job you can use {@linkcode Job.serialize} and {@linkcode Job.deserialize} to save job information as a string and recreate the job to get results later.
 *
 * ```js
 * import { Job,  JOB_STATUSES  } from "@esri/arcgis-rest-request";
 *
 * const job  = async Job.submitJob(options);
 *
 * // will automatically wait for job completion and get results when the job is finished.
 * job.getAllResults().then((results) => {console.log(results)})
 *
 * // watch for all status updates
 * job.on("status", ({jobStatus}) => {console.log(job.status)})
 * ```
 *
 * By default event monitoring is started when you call {@linkcode Job.waitForCompletion}, {@linkcode Job.getAllResults} or, {@linkcode Job.getResult} and stops automatically when those promises complete. Use {@linkcode Job.startEventMonitoring} and {@linkcode Job.stopEventMonitoring} to manually start and stop event monitoring outside those methods. Starting monitoring with {@linkcode Job.startEventMonitoring} will not stop monitoring when {@linkcode Job.waitForCompletion}, {@linkcode Job.getAllResults} or, {@linkcode Job.getResult} complete.
 */
export class Job {
    constructor(options) {
        /**
         * Function that calls the {@linkcode Job.getJobInfo} to check the job status, and emits the current job status. There are custom event emitters that
         * the user is able to listen based on the job status. Refer to {@linkcode JOB_STATUSES} to see the various enums of the job status.
         * To get results array from the job task, the job status must be {@linkcode JOB_STATUSES.Success}.
         *
         * These job statuses are based on what are returned from the job request task and have been into an enum type in {@linkcode JOB_STATUSES}.
         *
         * Reference https://developers.arcgis.com/rest/services-reference/enterprise/geoanalytics-checking-job-status.htm
         */
        this.executePoll = async () => {
            let result;
            try {
                result = await this.getJobInfo();
            }
            catch (error) {
                this.emitter.emit(JOB_STATUSES.Error, error);
                return;
            }
            this.emitter.emit(JOB_STATUSES.Status, result);
            this.emitter.emit(result.status, result);
        };
        const { url, id, pollingRate, authentication } = Object.assign(Object.assign({}, DefaultJobOptions), options);
        // Setup internal properties
        this.url = url;
        this.id = id;
        this.authentication = authentication;
        this._pollingRate = pollingRate;
        this.emitter = mitt();
        if (options.startMonitoring) {
            this.startEventMonitoring(pollingRate);
        }
    }
    static deserialize(serializeString, options) {
        const jobOptions = Object.assign(Object.assign(Object.assign({}, DefaultJobOptions), JSON.parse(serializeString)), options);
        return request(`${jobOptions.url}/jobs/${jobOptions.id}`, {
            authentication: jobOptions.authentication
        }).then(() => {
            return new Job(jobOptions);
        });
    }
    /**
     * Creates a new instance of {@linkcode Job} from an existing job id.
     *
     * @param options Requires request endpoint url and id from an existing job id.
     * @returns An new instance of Job class with options.
     */
    static fromExistingJob(options) {
        const jobOptions = Object.assign(Object.assign({}, DefaultJobOptions), options);
        const baseUrl = cleanUrl(jobOptions.url.replace(/\/submitJob\/?/, ""));
        return request(`${baseUrl}/jobs/${jobOptions.id}`, {
            authentication: jobOptions.authentication
        }).then(() => {
            return new Job(jobOptions);
        });
    }
    /**
     * Submits a job request that will return a new instance of {@linkcode Job}.
     *
     * @param requestOptions Requires url and params from requestOptions.
     * @returns An new instance of Job class with the returned job id from submitJob request and requestOptions;
     */
    static submitJob(requestOptions) {
        const { url, params, authentication, pollingRate, startMonitoring } = Object.assign(Object.assign({}, DefaultJobOptions), requestOptions);
        const processedParams = processJobParams(params);
        const baseUrl = cleanUrl(url.replace(/\/submitJob\/?/, ""));
        const submitUrl = baseUrl + "/submitJob";
        return request(submitUrl, {
            params: processedParams,
            authentication
        }).then((response) => new Job({
            url: baseUrl,
            authentication,
            id: response.jobId,
            startMonitoring,
            pollingRate
        }));
    }
    /**
     * Getter that appends the job id to the base url.
     */
    get jobUrl() {
        return `${this.url}/jobs/${this.id}`;
    }
    /**
     * Returns `true` if the job is polling for status changes.
     */
    get isMonitoring() {
        return !!this.setIntervalHandler;
    }
    /**
     * The rate at which event monitoring is occurring in milliseconds.
     */
    get pollingRate() {
        return this._pollingRate;
    }
    /**
     * Sets a new polling rate and restart polling for status changes.
     */
    set pollingRate(newRate) {
        this.stopEventMonitoring();
        this.startEventMonitoring(newRate);
    }
    /**
     * Retrieves the status of the current job.
     *
     * @returns An object with the job id and jobStatus.
     */
    getJobInfo() {
        return request(this.jobUrl, {
            authentication: this.authentication
        }).then((rawJobInfo) => {
            const info = Object.assign({
                id: rawJobInfo.jobId,
                status: undefined
            }, rawJobInfo);
            delete info.jobId;
            delete info.jobStatus;
            switch (rawJobInfo.jobStatus) {
                case "esriJobCancelled":
                    info.status = JOB_STATUSES.Cancelled;
                    break;
                case "esriJobCancelling":
                    info.status = JOB_STATUSES.Cancelling;
                    break;
                case "esriJobNew":
                    info.status = JOB_STATUSES.New;
                    break;
                case "esriJobWaiting":
                    info.status = JOB_STATUSES.Waiting;
                    break;
                case "esriJobExecuting":
                    info.status = JOB_STATUSES.Executing;
                    break;
                case "esriJobSubmitted":
                    info.status = JOB_STATUSES.Submitted;
                    break;
                case "esriJobTimedOut":
                    info.status = JOB_STATUSES.TimedOut;
                    break;
                case "esriJobFailed":
                    info.status = JOB_STATUSES.Failed;
                    break;
                case "expectedFailure":
                    info.status = JOB_STATUSES.Failure;
                    break;
                case "esriJobSucceeded":
                    info.status = JOB_STATUSES.Success;
                    break;
            }
            return info;
        });
    }
    /**
     * A handler that listens for an eventName and returns custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    on(eventName, handler) {
        this.emitter.on(eventName, handler);
    }
    /**
     * A handler that listens for an event once and returns a custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    once(eventName, handler) {
        const fn = (arg) => {
            this.emitter.off(eventName, fn);
            handler(arg);
        };
        this.emitter.on(eventName, fn);
        handler.__arcgis_job_once_original_function__ = fn;
    }
    /**
     * A handler that will remove a listener after its emitted and returns a custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    off(eventName, handler) {
        if (handler.__arcgis_job_once_original_function__) {
            this.emitter.off(eventName, handler.__arcgis_job_once_original_function__);
            return;
        }
        this.emitter.off(eventName, handler);
    }
    /**
     * Get the specific results of a successful job by result name. To get all results see {@linkcode Job.getAllResults}.
     *
     * If monitoring is disabled it will be enabled until the job classes resolves or rejects this promise.
     *
     * ```
     * Job.submitJob(options)
     *  .then((job) => {
     *    return job.getResult("result_name")
     *  }).then(result => {
     *    console.log(result);
     *  }).catch(e => {
     *    if(e.name === "ArcGISJobError") {
     *      console.log("Something went wrong while running the job", e.jobInfo);
     *    }
     *  })
     * ```
     *
     *  Will throw a {@linkcode ArcGISJobError} if it encounters a cancelled or failure status in the job.
     *
     * @param result The name of the result that you want to retrieve.
     * @returns An object representing the individual result of the job.
     */
    async getResult(result) {
        return this.waitForCompletion().then((jobInfo) => {
            return request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
                authentication: this.authentication
            });
        });
    }
    /**
     * Formats the requestOptions to JSON format.
     *
     * @returns The `Job` as a plain JavaScript object.
     */
    toJSON() {
        return {
            id: this.id,
            url: this.url,
            startMonitoring: this.isMonitoring,
            pollingRate: this.pollingRate
        };
    }
    /**
     * Converts the `Job` to a JSON string. You can rehydrate the state of the `Job` with {@linkcode Job.deserialize}.
     *
     * @returns A JSON string representing the `Job`.
     */
    serialize() {
        return JSON.stringify(this);
    }
    /**
     * Checks for job status and if the job status is successful it resolves the job information. Otherwise will throw a {@linkcode ArcGISJobError} if it encounters a cancelled or failure status in the job.
     *
     * ```
     * Job.submitJob(options)
     *  .then((job) => {
     *    return job.waitForCompletion();
     *  })
     * .then((jobInfo) => {
     *    console.log("job finished", e.jobInfo);
     *  })
     * .catch(e => {
     *    if(e.name === "ArcGISJobError") {
     *      console.log("Something went wrong while running the job", e.jobInfo);
     *    }
     *  })
     * ```
     *
     * @returns An object with a successful job status, id, and results.
     */
    async waitForCompletion() {
        const jobInfo = await this.getJobInfo();
        if (jobInfo.status === JOB_STATUSES.Success) {
            return Promise.resolve(jobInfo);
        }
        //if jobStatus comes back immediately with one of the statuses
        if (jobInfo.status === JOB_STATUSES.Cancelling ||
            jobInfo.status === JOB_STATUSES.Cancelled ||
            jobInfo.status === JOB_STATUSES.Failed ||
            jobInfo.status === JOB_STATUSES.Failure ||
            jobInfo.status === JOB_STATUSES.TimedOut) {
            this.stopInternalEventMonitoring();
            return Promise.reject(new ArcGISJobError("Job cancelled or failed.", jobInfo));
        }
        //waits to see what the status is if not immediate
        return new Promise((resolve, reject) => {
            this.startInternalEventMonitoring();
            this.once(JOB_STATUSES.Cancelled, (jobInfo) => {
                this.stopInternalEventMonitoring();
                reject(new ArcGISJobError("Job cancelled.", jobInfo));
            });
            this.once(JOB_STATUSES.TimedOut, (jobInfo) => {
                this.stopInternalEventMonitoring();
                reject(new ArcGISJobError("Job timed out.", jobInfo));
            });
            this.once(JOB_STATUSES.Failed, (jobInfo) => {
                this.stopInternalEventMonitoring();
                reject(new ArcGISJobError("Job failed.", jobInfo));
            });
            this.once(JOB_STATUSES.Success, (jobInfo) => {
                this.stopInternalEventMonitoring();
                resolve(jobInfo);
            });
        });
    }
    /**
     * Gets all the results from a successful job by ordering all the result paramUrl requests and calling each of them until all of them are complete and returns an object with all the results.
     *
     * If monitoring is disabled it will be enabled until the job classes resolves or rejects this promise.
     *
     * ```
     * Job.submitJob(options)
     *  .then((job) => {
     *    return job.getAllResults();
     *  }).then(allResults => {
     *    console.log(allResults);
     *  }).catch(e => {
     *    if(e.name === "ArcGISJobError") {
     *      console.log("Something went wrong while running the job", e.jobInfo);
     *    }
     *  })
     * ```
     *
     * Will throw a {@linkcode ArcGISJobError} if it encounters a cancelled or failure status in the job.
     *
     * @returns An object representing all the results from a job.
     */
    async getAllResults() {
        return this.waitForCompletion().then((jobInfo) => {
            const keys = Object.keys(jobInfo.results);
            const requests = keys.map((key) => {
                return request(this.jobUrl + "/" + jobInfo.results[key].paramUrl, {
                    authentication: this.authentication
                }).then((results) => {
                    return results;
                });
            });
            return Promise.all(requests).then((resultsArray) => {
                return keys.reduce((finalResults, key, index) => {
                    finalResults[keys[index]] = resultsArray[index];
                    return finalResults;
                }, {});
            });
        });
    }
    /**
     * Cancels the job request and voids the job.
     *
     * @returns An object that has job id, job status and messages array sequencing the status of the cancellation being submitted and completed.
     */
    cancelJob() {
        return request(this.jobUrl + "/cancel", {
            authentication: this.authentication,
            params: { id: this.id, returnMessages: false }
        }).then((response) => {
            this.emitter.emit("cancelled", response);
            return response;
        });
    }
    /**
     * An internal monitoring if the user specifies startMonitoring: false, we need to check the status to see when the results are returned.
     */
    startInternalEventMonitoring(pollingRate = DefaultJobOptions.pollingRate) {
        this._pollingRate = pollingRate;
        /* istanbul ignore else - if monitoring is already running do nothing */
        if (!this.isMonitoring) {
            this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
        }
    }
    /**
     * Stops the internal monitoring once the job has been successfully completed with results.
     */
    stopInternalEventMonitoring() {
        if (this.isMonitoring && !this.didUserEnableMonitoring) {
            clearTimeout(this.setIntervalHandler);
        }
    }
    /**
     * Starts the event polling if the user enables the startMonitoring param.
     *
     * @param pollingRate Able to pass in a specific number or will default to 5000.
     */
    startEventMonitoring(pollingRate = DefaultJobOptions.pollingRate) {
        this._pollingRate = pollingRate;
        this.didUserEnableMonitoring = true;
        /* istanbul ignore else - if not monitoring do nothing */
        if (!this.isMonitoring) {
            this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
        }
    }
    /**
     * Stops the event polling rate. This is can only be enabled if the user calls this method directly.
     */
    stopEventMonitoring() {
        /* istanbul ignore else - if not monitoring do nothing */
        if (this.isMonitoring && this.didUserEnableMonitoring) {
            clearTimeout(this.setIntervalHandler);
        }
    }
}
//# sourceMappingURL=job.js.map