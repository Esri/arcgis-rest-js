import { request } from "./request.js";
import { cleanUrl } from "./utils/clean-url.js";
import { IRequestOptions, JOB_STATUSES} from "./index.js";
import mitt from "mitt";

interface IJobOptions extends IRequestOptions {
  id?: string;
  url?: string;
  params?: any;
  startMonitoring?: boolean;
  pollingRate?: number;
  token?: string;
}
type ISubmitJobOptions = Omit<IJobOptions, "id">;

export class Job {
  pollingRate: number;
  readonly url: string;
  readonly jobId: string;
  readonly resultParams: any;
  readonly authentication: any;
  readonly jobUrl: string;

  static jobId: any;
  static authentication: string;
  static jobUrl: string;
  static cancelJobRequest: string;

  emitter: any;

  private didUserEnableMonitoring: any;
  private setIntervalHandler: any;

  params: any;

  constructor(options: any) {
    this.params = options.requestOptions;
    this.url = options.url; //user passes in the initial endpoint
    this.jobId = options.jobId; //saved from the response from the static create job
    this.pollingRate = options.pollingRate || 5000;
    this.emitter = mitt(); //interval between each polling request
    this.jobUrl = this.url.replace("submitJob", `jobs/${this.jobId}`);
    this.authentication = options.authentication;

    if (options.startMonitoring) {
      this.startEventMonitoring();
    }
  }

  get isMonitoring() {
    return !!this.setIntervalHandler;
  }
  getJobInfo() {
    return request(this.jobUrl, {
      authentication: this.authentication
    });
  }

  static submitJob(requestOptions: ISubmitJobOptions) {
    const { url, params, startMonitoring, pollingRate, authentication } =
      requestOptions;
    return request(cleanUrl(url), { params, authentication }).then(
      (response) =>
        new Job({
          url,
          authentication: authentication,
          jobId: response.jobId,
          startMonitoring,
          pollingRate
        })
    );
  }

  //if the user already has a jobId and doesn't need the original call for the submitJob
  static fromExistingJob() {
    return request(this.jobUrl, {
      authentication: this.authentication,
      params: { jobId: this.jobId, returnMessages: true }
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

    this.emitter.on(
      eventName,
      fn
    ); 
    
    (handler as any).__arcgis_geoprocessing_job_once_original_function__ = fn;
  }

  off(eventName: string, handler: (e: any) => void) {
    if ((handler as any).__arcgis_geoprocessing_job_once_original_function__) {
      this.emitter.off(
        eventName,
        (handler as any).__arcgis_geoprocessing_job_once_original_function__
      );
      return;
    }
    this.emitter.off(eventName, handler);
  }

  // getStatus() {
  //   return request(this.jobUrl, {
  //     authentication: this.authentication,
  //     params: { jobId: this.jobId, authentication: this.authentication }
  //   });
  // }

  async getResults(result: string) {
    const jobInfo = await this.getJobInfo();

    if (jobInfo.jobStatus === "esriJobSucceeded") {
      return request(this.jobUrl + "/" + jobInfo.results[0][result].paramUrl, {
        authentication: this.authentication
      });
    } else {
      return new Promise((resolve, reject) => {
        this.startInternalEventMonitoring();

        this.once(JOB_STATUSES.Cancelled, (jobInfo) => {
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once(JOB_STATUSES.TimedOut, (jobInfo) => {
          console.log(jobInfo, "info");
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once(JOB_STATUSES.Failed, (jobInfo) => {
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once(JOB_STATUSES.Success, (jobInfo) => {
          // we should error if the job succeeded but the users desired result wasn't found i.e. due to a typo
          request(this.jobUrl + "/" + jobInfo.results[0][result].paramUrl, {
            authentication: this.authentication
          })
            .then((result) => {
              this.stopInternalEventMonitoring();
              resolve(result);
            })
            .catch((e) => {
              this.stopInternalEventMonitoring();
              reject(e);
            });
        });
      });
    }
  }

  cancelJob() {
    return request(this.jobUrl + "/cancel", {
      authentication: this.authentication,
      params: { jobId: this.jobId, returnMessages: false }
    }).then((response) => this.emitter.emit("cancelled", response));
  }
  private startInternalEventMonitoring() {
    if (!this.setIntervalHandler) {
      this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
    }
  }

  //if we trigger it we stop it
  //if user triggers it we don't stop monitoring
  private stopInternalEventMonitoring() {
    if (this.setIntervalHandler && !this.didUserEnableMonitoring) {
      clearTimeout(this.setIntervalHandler);
    }
  }

  startEventMonitoring(internal?: boolean) {
    this.didUserEnableMonitoring = true;
    if (!this.setIntervalHandler) {
      this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
    }
  }

  //if we trigger it we stop it
  //if user triggers it we don't stop monitoring
  stopEventMonitoring() {
    if (this.setIntervalHandler && this.didUserEnableMonitoring) {
      clearTimeout(this.setIntervalHandler);
    }
  }
}
