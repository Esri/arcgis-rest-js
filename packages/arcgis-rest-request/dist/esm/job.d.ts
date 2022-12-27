import { JOB_STATUSES } from "./types/job-statuses.js";
import { IAuthenticationManager } from "./utils/IAuthenticationManager.js";
/**
 * Options for creating a new {@linkcode Job}.
 */
export interface IJobOptions {
    /**
     * The ID of the job. Can be used to rehydrate an instance of {@linkcode Job} with {@linkcode Job.fromExistingJob} or {@linkcode Job.deserialize}.
     */
    id: string;
    /**
     * The base URL of the job without `/submitJob` or a trailing job id.
     */
    url: string;
    /**
     * Automatically monitor the job for status changes once it is created. Defaults to `false`.
     */
    startMonitoring?: boolean;
    /**
     * Rate in milliseconds to poll for job status changes. Defaults to `2000`.
     */
    pollingRate?: number;
    /**
     * Authentication manager or access token to use for all job requests.
     */
    authentication?: IAuthenticationManager | string;
}
/**
 * Options for {@linkcode Job.submitJob}.
 */
export interface ISubmitJobOptions {
    /**
     * Parameters necessary that are passed to the {@linkcode Job.submitJob} method.
     */
    params: any;
    /**
     * The base URL of the job without `/submitJob` or a trailing job id.
     */
    url: string;
    /**
     * Automatically monitor the job for status changes once it is created. Defaults to `false`.
     */
    startMonitoring?: boolean;
    /**
     * Rate in milliseconds to poll for job status changes. Defaults to `2000`.
     */
    pollingRate?: number;
    /**
     * Authentication manager or access token to use for all job requests.
     */
    authentication?: IAuthenticationManager | string;
}
/**
 * Describes the status of a job. See the [GP Job documentation for more information](https://developers.arcgis.com/rest/services-reference/enterprise/gp-job.htm).
 */
export interface IJobInfo {
    /**
     * The ID of the job. Can be used to rehydrate an instance of {@linkcode Job} with {@linkcode Job.fromExistingJob} or {@linkcode Job.deserialize}.
     */
    id: string;
    /**
     * Represents the status of the current job.
     */
    status: JOB_STATUSES;
    /**
     * A results property that are returned from a successful job.
     */
    results?: {
        [key: string]: {
            paramUrl: string;
        };
    };
    /**
     * An input property that are returned from a successful job.
     */
    inputs?: {
        [key: string]: {
            paramUrl: string;
        };
    };
    /**
     * A message property that are returned from a successful job.
     */
    messages?: Array<{
        type: string;
        description: string;
    }>;
    /**
     * A progress property that is returned while the job status is {@linkcode JOB_STATUSES.Executing}
     */
    progress?: {
        type: string;
        message: string;
        percentage: number;
    };
}
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
export declare class Job {
    static deserialize(serializeString: string, options?: IJobOptions): Promise<Job>;
    /**
     * Creates a new instance of {@linkcode Job} from an existing job id.
     *
     * @param options Requires request endpoint url and id from an existing job id.
     * @returns An new instance of Job class with options.
     */
    static fromExistingJob(options: IJobOptions): Promise<Job>;
    /**
     * Submits a job request that will return a new instance of {@linkcode Job}.
     *
     * @param requestOptions Requires url and params from requestOptions.
     * @returns An new instance of Job class with the returned job id from submitJob request and requestOptions;
     */
    static submitJob(requestOptions: ISubmitJobOptions): Promise<Job>;
    /**
     * The base URL of the job.
     */
    readonly url: string;
    /**
     * The job id indicating the specific job.
     */
    readonly id: string;
    /**
     * Authentication manager or access token to use for all job requests.
     */
    readonly authentication: IAuthenticationManager | string;
    /**
     * Internal instance of [`mitt`](https://github.com/developit/mitt) used for event handlers. It is recommended to use {@linkcode Job.on}, {@linkcode Job.off} or {@linkcode Job.once} instead of `emitter.`
     */
    private emitter;
    /**
     * Private pollingRate that is set if the user changes the pollingRate.
     */
    private _pollingRate;
    /**
     * Private boolean that checks to see if the user enables startMonitoring.
     */
    private didUserEnableMonitoring;
    /**
     * Internal handler for `setInterval()` used when polling.;
     */
    private setIntervalHandler;
    constructor(options: IJobOptions);
    /**
     * Getter that appends the job id to the base url.
     */
    private get jobUrl();
    /**
     * Returns `true` if the job is polling for status changes.
     */
    get isMonitoring(): boolean;
    /**
     * The rate at which event monitoring is occurring in milliseconds.
     */
    get pollingRate(): number;
    /**
     * Sets a new polling rate and restart polling for status changes.
     */
    set pollingRate(newRate: number);
    /**
     * Retrieves the status of the current job.
     *
     * @returns An object with the job id and jobStatus.
     */
    getJobInfo(): Promise<IJobInfo>;
    /**
     * Function that calls the {@linkcode Job.getJobInfo} to check the job status, and emits the current job status. There are custom event emitters that
     * the user is able to listen based on the job status. Refer to {@linkcode JOB_STATUSES} to see the various enums of the job status.
     * To get results array from the job task, the job status must be {@linkcode JOB_STATUSES.Success}.
     *
     * These job statuses are based on what are returned from the job request task and have been into an enum type in {@linkcode JOB_STATUSES}.
     *
     * Reference https://developers.arcgis.com/rest/services-reference/enterprise/geoanalytics-checking-job-status.htm
     */
    private executePoll;
    /**
     * A handler that listens for an eventName and returns custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    on(eventName: string, handler: (e: IJobInfo) => void): void;
    /**
     * A handler that listens for an event once and returns a custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    once(eventName: string, handler: (e: IJobInfo) => void): void;
    /**
     * A handler that will remove a listener after its emitted and returns a custom handler.
     *
     * @param eventName A string of what event to listen for.
     * @param handler A function of what to do when eventName was called.
     */
    off(eventName: string, handler: (e: IJobInfo) => void): void;
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
    getResult(result: string): Promise<any>;
    /**
     * Formats the requestOptions to JSON format.
     *
     * @returns The `Job` as a plain JavaScript object.
     */
    toJSON(): IJobOptions;
    /**
     * Converts the `Job` to a JSON string. You can rehydrate the state of the `Job` with {@linkcode Job.deserialize}.
     *
     * @returns A JSON string representing the `Job`.
     */
    serialize(): string;
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
    waitForCompletion(): Promise<IJobInfo>;
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
    getAllResults(): Promise<any>;
    /**
     * Cancels the job request and voids the job.
     *
     * @returns An object that has job id, job status and messages array sequencing the status of the cancellation being submitted and completed.
     */
    cancelJob(): Promise<any>;
    /**
     * An internal monitoring if the user specifies startMonitoring: false, we need to check the status to see when the results are returned.
     */
    private startInternalEventMonitoring;
    /**
     * Stops the internal monitoring once the job has been successfully completed with results.
     */
    private stopInternalEventMonitoring;
    /**
     * Starts the event polling if the user enables the startMonitoring param.
     *
     * @param pollingRate Able to pass in a specific number or will default to 5000.
     */
    startEventMonitoring(pollingRate?: number): void;
    /**
     * Stops the event polling rate. This is can only be enabled if the user calls this method directly.
     */
    stopEventMonitoring(): void;
}
