import { request, cleanUrl, ApiKeyManager } from "@esri/arcgis-rest-request";
import { S_IFBLK } from "constants";
import { resolve } from "dns";

import mitt from "mitt";

const createJob = (url: string, params: any) => {
  return request(url, params)
    .then((response: any) => response)
    .then((result: {}) => result);
  // // const submitJobUrlCheck = url.endsWith("submitJob?")
  // //   ? url
  // //   : url.concat("submitJob?");

  // // return request(cleanUrl(submitJobUrlCheck), params).then(
  // //   (response) =>
  // //     new GeoprocessingJob({
  // //       url,
  // //       jobId: response.jobId,
  // //       authenticaion: params.authenticaion
  // //     })
  // // );
};

// const details = { f: "json", authentication: ApiKeyManager.fromKey("AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH"), facilities: "-117.133163,34.022445", defaultBreaks:"2.5", travelDirection:"esriNATravelDirectionToFacility", travelMode: "{'attributeParameterValues':[{'attributeName':'Avoid Private Roads','parameterName':'Restriction Usage','value':'AVOID_MEDIUM'},{'attributeName':'Walking','parameterName':'Restriction Usage','value':'PROHIBITED'},{'attributeName':'Preferred for Pedestrians','parameterName':'Restriction Usage','value':'PREFER_LOW'},{'attributeName':'WalkTime','parameterName':'Walking Speed (km/h)','value':5},{'attributeName':'Avoid Roads Unsuitable for Pedestrians','parameterName':'Restriction Usage','value':'AVOID_HIGH'}],'description':'Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.','distanceAttributeName':'Kilometers','id':'yFuMFwIYblqKEefX','impedanceAttributeName':'Kilometers','name':'Walking Distance','restrictionAttributeNames':['Avoid Private Roads','Avoid Roads Unsuitable for Pedestrians','Preferred for Pedestrians','Walking'],'simplificationTolerance':2,'simplificationToleranceUnits':'esriMeters','timeAttributeName':'WalkTime','type':'WALK','useHierarchy':false,'uturnAtJunctions':'esriNFSBAllowBacktrack'}"}

// const details = {
//   f: "json", Input_Observation_Point: {
//     "displayFieldName": "",
//     "geometryType": "esriGeometryPoint",
//     "spatialReference": {
//       "wkid": 54003,
//       "latestWkid": 54003
//     },
//     "fields": [
//       {
//         "name": "OBJECTID",
//         "type": "esriFieldTypeOID",
//         "alias": "OBJECTID"
//       },
//       {
//         "name": "OffsetA",
//         "type": "esriFieldTypeSmallInteger",
//         "alias": "OffsetA"
//       }
//     ],
//     "features": [],
//     "exceededTransferLimit": false
//   }, Viewshed_Distance: {
//     "distance": 15000,
//     "units": "esriMeters"
//   }, elev_raster: "elevation"
// };

// function buildDefinitionQuery() {
//   let defQuery;
//   // get dates and build definition expression

//   const startDate = '1998-01-01 00:00:00';
//   const endDate = '1998-05-31 00:00:00';
//   const def = [];
//   def.push("(Date >= date '" + startDate + "' and Date <= date '" + endDate + "')");

//   if (def.length > 1) {
//     defQuery = def.join(" AND ");
//   }
//   return defQuery;
// }
// const details = {
//     Query: buildDefinitionQuery()
// }
// request("https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/Output_Features").then((results: any) => console.log(results.value));

export class GeoprocessingJob {
  readonly pollingRate: number;
  readonly url: string;
  readonly jobId: string;
  readonly isPolling: boolean;
  readonly resultParams: any;
  readonly authentication: any;
  readonly jobUrl: string;
  // readonly submitResultsUrl: string;
  // readonly cancelJobRequestUrl: string
  static jobId: any;
  static authentication: string;
  static jobUrl: string;
  static cancelJobRequest: string;
  setIntervalHandler: any;
  emitter: any;
  didTurnMonitoringOn: boolean;

  constructor(options: any) {
    this.url = options.url; //user passes in the initial endpoint
    this.jobId = options.jobId; //saved from the response from the static create job
    this.authentication = options.authentication; //saved from the static create job
    this.jobUrl = options.url.replace("submitJob", `jobs/${this.jobId}`);
    this.isPolling = options.isPolling; // boolean async request that checks to see if it has or has not returned something
    this.pollingRate = options.pollingRate || 5000;
    this.emitter = mitt(); //interval between each polling request
    this.didTurnMonitoringOn = false;

    //params is a object
  }

  getJobInfo() {
    return request(this.jobUrl, {
      authentication: this.authentication
    });
  }
  //takes params object
  static createJob(url: string, params: any) {
    return request(cleanUrl(url), params).then(
      (response) =>
        new GeoprocessingJob({
          url,
          jobId: response.jobId,
          authenticaion: params.authenticaion
        })
    );
  }

  //if the user already has a jobId and doesn't need the original call for the submitJob
  static fromJobId() {
    return request(this.jobUrl, {
      authentication: this.authentication,
      params: { jobId: this.jobId, returnMessages: true }
    });
  }

  executePoll = async () => {
    this.didTurnMonitoringOn = true;
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

  getStatus() {
    return request(this.jobUrl, {
      authentication: this.authentication,
      params: { jobId: this.jobId, returnMessages: true }
    });
  }

  async getResults(result: string) {
    // if(!this.didTurnMonitoringOn) {
    //   this.startEventMonitoring();
    // }

    const jobInfo = await this.getJobInfo();
    if (jobInfo.jobStatus === "esriJobSucceeded") {
      return request(this.jobUrl + "/" + jobInfo.results[result].paramUrl, {
        authentication: this.authentication
      });
    }
  }

  cancelJob(requestOptions: any) {
    return request(this.jobUrl + "/cancel", {
      authentication: this.authentication,
      params: { jobId: this.jobId, returnMessages: false }
    }).then((response) => this.emitter.emit("cancelled", response));
  }

  //start ny
  startEventMonitoring() {
    if (!this.setIntervalHandler) {
      this.setIntervalHandler = setInterval(this.executePoll, this.pollingRate);
    }
  }

  //if we trigger it we stop it
  //if user triggers it we don't stop monitoring
  stopEventMonitoring() {
    if (this.setIntervalHandler) {
      clearTimeout(this.setIntervalHandler);
    }
  }
}

GeoprocessingJob.createJob(
  "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
  { Query: "THROW ERROR" }
).then((job) => {
  job.startEventMonitoring();
  // job.getJobInfo()
  // job.getResults("Output_Features").then(results => console.log(results))
  job.emitter.on("succeeded", () => {
    console.log("success!!!!");
    job
      .getResults("Output_Features")
      .then((results: any) => console.log(results));
    job.stopEventMonitoring();
  });
  job.emitter.on("status", (status: any) => console.log(status));
});

// this should be the end user custom code
// GeoprocessingJob.createJob("https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob", { Query: 'THROW ERROR' }).then(job => {
//     job.getResults("Output_Features").then((results: any) => console.log(results))
// });
