import { request } from "./request.js";
import { cleanUrl } from "./utils/clean-url.js";
import {
  ArcGISJobError,
  JOB_STATUSES,
  IAuthenticationManager
} from "./index.js";
import mitt from "mitt";

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
   * Automatically monitor the job for status changes once it is created. Defaults to `true`.
   */
  startMonitoring?: boolean;

  /**
   * Rate in milliseconds to poll for job status changes. Defaults to `5000`.
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
  params: any;
  url: string;
  startMonitoring?: boolean;
  pollingRate?: number;
  authentication?: IAuthenticationManager | string;
}

/**
 * Describes the status of a job. See the [GP Job documentation for more information](https://developers.arcgis.com/rest/services-reference/enterprise/gp-job.htm).
 */
export interface IJobInfo {
  id: string;
  status: JOB_STATUSES;
  results?: {
    [key: string]: {
      paramUrl: string;
    };
  };
  inputs?: {
    [key: string]: {
      paramUrl: string;
    };
  };
  messages?: Array<{
    type: string;
    description: string;
  }>;
  progress?: {
    type: string;
    message: string;
    percentage: number;
  };
}

/**
 * Jobs represent long running processing tasks running on ArcGIS Services. Typically these represent complex analysis tasks such as [geoprocessing tasks](https://developers.arcgis.com/rest/services-reference/enterprise/submit-gp-job.htm), [logistics analysis such as fleet routing](https://developers.arcgis.com/rest/network/api-reference/vehicle-routing-problem-service.htm) or [spatial analysis tasks](https://developers.arcgis.com/rest/analysis/api-reference/tasks-overview.htm).
 *
 * To create a {@linkcode Job} use the {@linkcode Job.submitJob} method which will return an instance of the  {@linkcode Job} class with a unique is.
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
 */
export class Job {
  static deserialize(serializeString: string, options?: IJobOptions) {
    const jobOptions: IJobOptions = {
      ...JSON.parse(serializeString),
      ...options
    };

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
  static fromExistingJob(options: IJobOptions) {
    const baseUrl = cleanUrl(options.url.replace(/\/submitJob\/?/, ""));
    return request(`${baseUrl}/jobs/${options.id}`, {
      authentication: options.authentication
    }).then(() => {
      return new Job(options);
    });
  }

  /**
   * Submits a job request that will return a new instance of {@linkcode Job}.
   *
   * @param requestOptions Requires url and params from requestOptions.
   * @returns An new instance of Job class with the returned job id from submitJob request and requestOptions;
   */
  static submitJob(requestOptions: ISubmitJobOptions) {
    const { url, params, startMonitoring, pollingRate, authentication } =
      requestOptions;
    const baseUrl = cleanUrl(url.replace(/\/submitJob\/?/, ""));
    const submitUrl = baseUrl + "/submitJob";
    return request(submitUrl, { params, authentication }).then(
      (response) =>
        new Job({
          url: baseUrl,
          authentication: authentication,
          id: response.jobId,
          startMonitoring,
          pollingRate
        })
    );
  }

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
  emitter: any;

  /**
   * Private pollingRate that is set if the user changes the pollingRate.
   */
  private _pollingRate: number;
  /**
   * Private boolean that checks to see if the user enables startMonitoring.
   */
  private didUserEnableMonitoring: any;
  /**
   * Internal handler for `setInterval()` used when polling.;
   */
  private setIntervalHandler: any;

  constructor(options: IJobOptions) {
    const { url, id, pollingRate }: Partial<IJobOptions> = {
      ...{ pollingRate: 5000, startMonitoring: true },
      ...options
    };

    /**
     * The base URL that is passed as part of {@linkcode ISubmitJobOptions}.
     */
    this.url = url;
    /**
     * Id that represents a string that is returned from a successful {@linkcode Job.submitJob}.
     */
    this.id = id; //saved from the response from the static create job
    /**
     * Privately used variable that will be set in {@linkcode Job.pollingRate}.
     */
    this._pollingRate = pollingRate;
    /**
     * Sets an instance of the mitt package within the class.
     */
    this.emitter = mitt();
    /**
     *
     * Authentication manager or access token to use for all job requests that is passed from {@linkcode Job.ISubmitJobOptions}.
     */
    this.authentication = options.authentication;

    /**
     * If the startMonitoring from the requestOptions is set to true, {@linkcode Job.executePoll} will be called inside the startEventMonitoring.
     */
    if (options.startMonitoring) {
      this.startEventMonitoring(pollingRate);
    }
  }

  /**
   * Getter that appends the job id to the base url.
   */
  private get jobUrl() {
    return `${this.url}/jobs/${this.id}`;
  }

  /**
   * Returns `true` is the job is polling for status changes.
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
  set pollingRate(newRate: number) {
    this.stopEventMonitoring();
    this.startEventMonitoring(newRate);
  }

  /**
   * Retrieves the status of the current job.
   *
   * @returns An object with the job id and jobStatus.
   */
  getJobInfo(): Promise<IJobInfo> {
    return request(this.jobUrl, {
      authentication: this.authentication
    }).then((rawJobInfo: any) => {
      const info: any = Object.assign(
        {
          id: rawJobInfo.jobId,
          status: undefined
        },
        rawJobInfo
      );

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

      return info as IJobInfo;
    });
  }

  /**
   * Function that calls the {@linkcode Job.getJobInfo} to check the job status, and emits the current job status. There are custom event emitters that
   * the user is able to listen based on the job status. Refer to {@linkcode JOB_STATUSES} to see the various enums of the job status.
   * To get results array from the job task, the job status must be {@linkcode JOB_STATUSES.Success}.
   *
   * These job statuses are based on what are returned from the job request task and have been into an enum type in {@linkcode JOB_STATUSES}.
   *
   * Reference {@link https://developers.arcgis.com/rest/services-reference/enterprise/checking-job-status.html}
   */
  private executePoll = async () => {
    let result;
    try {
      result = await this.getJobInfo();
    } catch (error) {
      this.emitter.emit(JOB_STATUSES.Error, error);
      return;
    }

    this.emitter.emit(JOB_STATUSES.Status, result);
    this.emitter.emit(result.status, result);
  };

  /**
   * A handler that listens for an eventName and returns custom handler.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  on(eventName: string, handler: (e: IJobInfo) => void) {
    this.emitter.on(eventName, handler);
  }

  /**
   * A handler that listens for a event once and returns a custom handler.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  once(eventName: string, handler: (e: IJobInfo) => void) {
    const fn = (arg: any) => {
      this.emitter.off(eventName, fn);
      handler(arg);
    };

    this.emitter.on(eventName, fn);

    (handler as any).__arcgis_job_once_original_function__ = fn;
  }

  /**
   * A handler that will remove a listener after its emitted and returns a custom handler.
   *
   * @param eventName A string of what event to listen for.
   * @param handler A function of what to do when eventName was called.
   */
  off(eventName: string, handler: (e: IJobInfo) => void) {
    if ((handler as any).__arcgis_job_once_original_function__) {
      this.emitter.off(
        eventName,
        (handler as any).__arcgis_job_once_original_function__
      );
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
  async getResult(result: string) {
    return this.waitForJobCompletion().then((jobInfo: any) => {
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
   *    return job.waitForJobCompletion();
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
  async waitForJobCompletion(): Promise<IJobInfo> {
    const jobInfo = await this.getJobInfo();
    if (jobInfo.status === JOB_STATUSES.Success) {
      return Promise.resolve(jobInfo);
    }
    //if jobStatus comes back immediately with one of the statuses
    if (
      jobInfo.status === JOB_STATUSES.Cancelling ||
      jobInfo.status === JOB_STATUSES.Cancelled ||
      jobInfo.status === JOB_STATUSES.Failed ||
      jobInfo.status === JOB_STATUSES.Failure ||
      jobInfo.status === JOB_STATUSES.TimedOut
    ) {
      this.stopInternalEventMonitoring();
      return Promise.reject(
        new ArcGISJobError("Job cancelled or failed.", jobInfo)
      );
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
    return this.waitForJobCompletion().then((jobInfo: any) => {
      const keys = Object.keys(jobInfo.results);

      const requests = keys.map((key) => {
        return request(this.jobUrl + "/" + jobInfo.results[key].paramUrl, {
          authentication: this.authentication
        }).then((results) => {
          return results;
        });
      });
      return Promise.all(requests).then((resultsArray: any) => {
        return keys.reduce((finalResults: any, key: string, index: number) => {
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
    }).then((response: any) => {
      this.emitter.emit("cancelled", response);
      return response;
    });
  }

  /**
   * An internal monitoring if the user specifies startMonitoring: false, we need to check the status to see when the results are returned.
   */
  private startInternalEventMonitoring() {
    /* istanbul ignore else - if monitoring is already running do nothing */
    if (!this.isMonitoring) {
      this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
    }
  }

  /**
   * Stops the internal monitoring once the job has been successfully completed with results.
   */
  private stopInternalEventMonitoring() {
    if (this.isMonitoring && !this.didUserEnableMonitoring) {
      clearTimeout(this.setIntervalHandler);
    }
  }

  /**
   * Starts the event polling if the user enables the startMonitoring param.
   *
   * @param pollingRate Able to pass in a specific number or will default to 5000.
   */
  startEventMonitoring(pollingRate = 5000) {
    this._pollingRate = pollingRate;
    this.didUserEnableMonitoring = true;

    /* istanbul ignore else - if not monitoring do nothing */
    if (!this.isMonitoring) {
      this.setIntervalHandler = setInterval(
        this.executePoll,
        this._pollingRate
      );
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
