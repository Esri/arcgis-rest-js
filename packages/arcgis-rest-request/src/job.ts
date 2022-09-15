import { request } from "./request.js";
import { cleanUrl } from "./utils/clean-url.js";
import {
  IRequestOptions,
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
   * The base URL of the job.
   */
  url: string;

  /**
   * Automatically monitor the job for status changes once it is created.
   */
  startMonitoring?: boolean;

  /**
   * Rate in milliseconds to poll for job status changes.
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
    return new Job({
      ...JSON.parse(serializeString),
      ...options
    });
  }

  static fromExistingJob(options: IJobOptions) {
    return new Job(options);
  }

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

  readonly url: string;
  readonly id: string;
  readonly resultParams: any;
  readonly authentication: IAuthenticationManager | string;

  emitter: any;

  private _pollingRate: number;
  private didUserEnableMonitoring: any;
  private setIntervalHandler: any;

  constructor(options: IJobOptions) {
    const { url, id, pollingRate }: Partial<IJobOptions> = {
      ...{ pollingRate: 5000, startMonitoring: true },
      ...options
    };

    this.url = url; //user passes in the initial endpoint
    this.id = id; //saved from the response from the static create job
    this._pollingRate = pollingRate;
    this.emitter = mitt(); //interval between each polling request
    this.authentication = options.authentication;

    if (options.startMonitoring) {
      this.startEventMonitoring(pollingRate);
    }
  }

  private get jobUrl() {
    return this.url + `/jobs/${this.id}`;
  }

  get isMonitoring() {
    return !!this.setIntervalHandler;
  }

  get pollingRate() {
    return this._pollingRate;
  }

  set pollingRate(newRate: number) {
    this.stopEventMonitoring();
    this.startEventMonitoring(newRate);
  }

  getJobInfo() {
    return request(this.jobUrl, {
      authentication: this.authentication
    });
  }

  private executePoll = async () => {
    let result;
    try {
      result = await this.getJobInfo();
    } catch (error) {
      this.emitter.emit(JOB_STATUSES.Error, error);
      return;
    }
    this.emitter.emit(JOB_STATUSES.Status, result);

    switch (result.jobStatus) {
      case "esriJobCancelled":
        this.emitter.emit(JOB_STATUSES.Cancelled, result);
        break;
      case "esriJobCancelling":
        this.emitter.emit(JOB_STATUSES.Cancelling, result);
        break;
      case "esriJobNew":
        this.emitter.emit(JOB_STATUSES.New, result);
        break;
      case "esriJobWaiting":
        this.emitter.emit(JOB_STATUSES.Waiting, result);
        break;
      case "esriJobExecuting":
        this.emitter.emit(JOB_STATUSES.Executing, result);
        break;
      case "esriJobSubmitted":
        this.emitter.emit(JOB_STATUSES.Submitted, result);
        break;
      case "esriJobTimedOut":
        this.emitter.emit(JOB_STATUSES.TimedOut, result);
        break;
      case "esriJobFailed":
        this.emitter.emit(JOB_STATUSES.Failed, result);
        break;
      case "expectedFailure":
        this.emitter.emit(JOB_STATUSES.Failure, result);
        break;
      case "esriJobSucceeded":
        this.emitter.emit(JOB_STATUSES.Success, result);
        break;
    }
  };

  on(eventName: string, handler: (e: any) => void) {
    this.emitter.on(eventName, handler);
  }

  once(eventName: string, handler: (e: any) => void) {
    const fn = (arg: any) => {
      this.emitter.off(eventName, fn);
      handler(arg);
    };

    this.emitter.on(eventName, fn);

    (handler as any).__arcgis_job_once_original_function__ = fn;
  }

  off(eventName: string, handler: (e: any) => void) {
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
   *    return job.getResults("result_name")
   *  }).then(result => {
   *     console.log(result);
   *   })
   * ```
   *
   * @param result The name of the result that you want to retrieve.
   * @returns An object representing the result of the job.
   */
  async getResult(result: string) {
    return this.waitForJobCompletion().then((jobInfo) => {
      return request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
        authentication: this.authentication
      });
    });
  }

  toJSON() {
    return {
      id: this.id,
      url: this.url,
      startMonitoring: this.isMonitoring,
      pollingRate: this.pollingRate
    };
  }

  serialize() {
    return JSON.stringify(this);
  }

  async waitForJobCompletion() {
    const jobInfo = await this.getJobInfo();
    if (jobInfo.jobStatus === "esriJobSucceeded") {
      return Promise.resolve(jobInfo);
    }
    //if jobStatus comes back immediately with one of the statuses
    if (
      jobInfo.jobStatus === "esriJobTimeOut" ||
      jobInfo.jobStatus === "esriJobCancelled" ||
      jobInfo.jobStatus === "esriJobFailed"
    ) {
      this.stopInternalEventMonitoring();
      return Promise.reject(jobInfo);
    }
    //waits to see what the status is if not immediate
    return new Promise((resolve, reject) => {
      this.startInternalEventMonitoring();

      this.once(JOB_STATUSES.Cancelled, (jobInfo) => {
        this.stopInternalEventMonitoring();
        reject(jobInfo);
      });

      this.once(JOB_STATUSES.TimedOut, (jobInfo) => {
        this.stopInternalEventMonitoring();
        reject(jobInfo);
      });

      this.once(JOB_STATUSES.Failed, (jobInfo) => {
        this.stopInternalEventMonitoring();
        reject(jobInfo);
      });

      this.once(JOB_STATUSES.Success, (jobInfo) => {
        this.stopInternalEventMonitoring();
        resolve(jobInfo);
      });
    });
  }

  async getAllResults() {
    return this.waitForJobCompletion().then((jobInfo) => {
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

  cancelJob() {
    return request(this.jobUrl + "/cancel", {
      authentication: this.authentication,
      params: { id: this.id, returnMessages: false }
    }).then((response: any) => {
      this.emitter.emit("cancelled", response);
      return response;
    });
  }

  private startInternalEventMonitoring() {
    /* istanbul ignore else - if monitoring is already running do nothing */
    if (!this.isMonitoring) {
      this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
    }
  }

  //internal monitoring if the user specifies startMonitoring: false, we need to check the status to see when the results are returned
  private stopInternalEventMonitoring() {
    if (this.isMonitoring && !this.didUserEnableMonitoring) {
      clearTimeout(this.setIntervalHandler);
    }
  }

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

  stopEventMonitoring() {
    /* istanbul ignore else - if not monitoring do nothing */
    if (this.isMonitoring && this.didUserEnableMonitoring) {
      clearTimeout(this.setIntervalHandler);
    }
  }
}
