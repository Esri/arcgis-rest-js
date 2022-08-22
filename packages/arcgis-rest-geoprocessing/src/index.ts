import { request, cleanUrl, ApiKeyManager } from "@esri/arcgis-rest-request";

import mitt from "mitt";

interface IJobOptions {
  id: string;
  url: string;
  params?: any;
  startMonitoring: boolean;
  pollingRate: number;
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
    this.params = options.params;
    this.url = options.url; //user passes in the initial endpoint
    this.jobId = options.params.jobId; //saved from the response from the static create job
    this.authentication = options.params.authentication; //saved from the static create job
    this.pollingRate = options.pollingRate || 5000;
    this.emitter = mitt(); //interval between each polling request
    this.jobUrl = this.url.replace("submitJob", `jobs/${this.jobId}`);

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
    const { url, params, startMonitoring, pollingRate } = requestOptions;
    return request(cleanUrl(url), { params }).then(
      (response) =>
        new Job({
          url,
          params: {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            authentication: params.authentication
          },
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
      result = await this.getStatus();
    } catch (error) {
      this.emitter.emit("error", error);
      return;
    }
    this.emitter.emit("status", result);

    switch (result.jobStatus) {
      case "esriJobCancelled":
        this.emitter.emit("cancelled", result);
        break;
      case "esriJobCancelling":
        this.emitter.emit("cancelling", result);
        break;
      case "esriJobNew":
        this.emitter.emit("new", result);
        break;
      case "esriJobWaiting":
        this.emitter.emit("waiting", result);
        break;
      case "esriJobExecuting":
        this.emitter.emit("executing", result);
        break;
      case "esriJobSubmitted":
        this.emitter.emit("submitted", result);
        break;
      case "esriJobTimedOut":
        this.emitter.emit("timed-out", result);
        break;
      case "esriJobFailed":
        this.emitter.emit("failed", result);
        break;
      case "expectedFailure":
        this.emitter.emit("failed", result);
        break;
      case "esriJobSucceeded":
        this.emitter.emit("succeeded", result);
        break;
    }
  };

  //getAllResults

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
    )(handler as any).__arcgis_geoprocessing_job_once_original_function__ = fn;
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

  getStatus() {
    return request(this.jobUrl, {
      authentication: this.authentication,
      params: { jobId: this.jobId, authentication: this.authentication }
    });
  }

  async getResults(result: string) {
    const jobInfo = await this.getJobInfo();

    if (jobInfo.jobStatus === "esriJobSucceeded") {
      return request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
        authentication: this.authentication
      });
    } else {
      return new Promise((resolve, reject) => {
        this.startInternalEventMonitoring();

        this.once("succeeded", (jobInfo) => {
          request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
            authentication: this.authentication
          })
            .then((result) => resolve(result))
            .catch((e) => reject(e));
        });

        this.once("cancelled", (jobInfo) => {
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once("timed-out", (jobInfo) => {
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once("failed", (jobInfo) => {
          this.stopInternalEventMonitoring();
          reject(jobInfo);
        });

        this.once("succeeded", (jobInfo) => {
          // we should error if the job succeeded but the users desired result wasn't found i.e. due to a typo
          request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
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

// GeoprocessingJob.createJob({
//   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
//   params: { Query: `"DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')`},
//   didTurnMonitoringOn: true,
//   pollingRate: 5000
// })
//   .then((job) => {
//     // console.log(job);
//     job.getJobInfo()
//     job.emitter.on("succeeded", () => {
//       job
//         .getResults("Output_Features")
//         .then((results: any) => console.log(results, "Output_Features"));
//       // job
//       //     .getResults("Hotspot_Raster")
//       //     .then((results: any) => console.log(results, "Hotspot_Raster"));
//       //   job.stopEventMonitoring();
//     });
//     job.emitter.on("status", (status: any) => console.log(status));
//   });

// // this should be the end user custom code
// // GeoprocessingJob.createJob("https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob", { Query: 'THROW ERROR' }).then(job => {
// //     job.getResults("Output_Features").then((results: any) => console.log(results))
// // });
