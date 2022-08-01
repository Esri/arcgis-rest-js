import { request, cleanUrl, ApiKeyManager } from "@esri/arcgis-rest-request";

import mitt from "mitt";

const emitter = mitt();

const createJob = (url, params) => {
  return request(url, params).then(response => response).then(result => result);
  // const submitJobUrlCheck = url.endsWith("submitJob?")
  //   ? url
  //   : url.concat("submitJob?");

  // return request(cleanUrl(submitJobUrlCheck), params).then(
  //   (response) =>
  //     new GeoprocessingJob({
  //       url,
  //       jobId: response.jobId,
  //       authenticaion: params.authenticaion
  //     })
  // );
};

// const details = { f: "json", authentication: ApiKeyManager.fromKey("AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH"), facilities: "-117.133163,34.022445", defaultBreaks:"2.5", travelDirection:"esriNATravelDirectionToFacility", travelMode: "{'attributeParameterValues':[{'attributeName':'Avoid Private Roads','parameterName':'Restriction Usage','value':'AVOID_MEDIUM'},{'attributeName':'Walking','parameterName':'Restriction Usage','value':'PROHIBITED'},{'attributeName':'Preferred for Pedestrians','parameterName':'Restriction Usage','value':'PREFER_LOW'},{'attributeName':'WalkTime','parameterName':'Walking Speed (km/h)','value':5},{'attributeName':'Avoid Roads Unsuitable for Pedestrians','parameterName':'Restriction Usage','value':'AVOID_HIGH'}],'description':'Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.','distanceAttributeName':'Kilometers','id':'yFuMFwIYblqKEefX','impedanceAttributeName':'Kilometers','name':'Walking Distance','restrictionAttributeNames':['Avoid Private Roads','Avoid Roads Unsuitable for Pedestrians','Preferred for Pedestrians','Walking'],'simplificationTolerance':2,'simplificationToleranceUnits':'esriMeters','timeAttributeName':'WalkTime','type':'WALK','useHierarchy':false,'uturnAtJunctions':'esriNFSBAllowBacktrack'}"}


const details = { f: "json", authentication: ApiKeyManager.fromKey("AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH"), Input_Observation_Point: {
  "displayFieldName": "",
  "geometryType": "esriGeometryPoint",
  "spatialReference": {
   "wkid": 54003,
   "latestWkid": 54003
  },
  "fields": [
   {
    "name": "OBJECTID",
    "type": "esriFieldTypeOID",
    "alias": "OBJECTID"
   },
   {
    "name": "OffsetA",
    "type": "esriFieldTypeSmallInteger",
    "alias": "OffsetA"
   }
  ],
  "features": [],
  "exceededTransferLimit": false
 }, Viewshed_Distance: {
  "distance": 15000,
  "units": "esriMeters"
 }, elev_raster: "elevation"};

createJob("https://logistics.arcgis.com/arcgis/rest/services/Viewshed/GPServer/Viewshed/submitJob?", details).then(response => request(`https://logistics.arcgis.com/arcgis/rest/services/Viewshed/GPServer/Viewshed/jobs/${response}?f=json&token=AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH`)).then(results => console.log(results));

// export class GeoprocessingJob {
//   pollingRate;
//   url;
//   params;
//   jobId;
//   isPolling;
//   executionType;
//   monitorEvents;
//   monitorEventRate;
//   resultParams;

//   static createJob(url, params) {
//     const submitJobUrlCheck = url.endsWith("submitJob?")
//       ? url
//       : url.concat("submitJob?");

//     return request(cleanUrl(submitJobUrlCheck), params).then(
//       (response) =>
//         new GeoprocessingJob({
//           url,
//           jobId: response.jobId,
//           authenticaion: params.authenticaion
//         })
//     );
//   }

//   //if the user already has a jobId and doesn't need the original call for the submitJob
//   static fromJobId() {
//     return request(this.submitJobIdUrl, {
//       authentication: this.authentication,
//       params: { jobId: this.jobId, returnMessages: true }
//     });
//   }

//   constructor(options) {
//     this.url = options.url; //user passes in the initial endpoint
//     this.jobId = options.jobId; //saved from the response from the static create job
//     this.authentication = options.authentication; //saved from the static create job
//     this.submitJobIdUrl = options.url.replace(
//       "submitJob?",
//       `/jobs/${this.jobId}`
//     );
//     this.submitResultsUrl = options.submitJobIdUrl.concat(
//       `/${this.resultParams.paramUrl}`
//     ); //paramUrl has the ending url
//     this.cancelJobRequest = options.url.replace(
//       "submitJob?",
//       `/jobs/${this.jobId}/cancel`
//     );
//     this.isPolling = options.isPolling; // boolean async request that checks to see if it has or has not returned something
//     this.pollingRate = options.pollingRate; //interval between each polling request
//   }

//   pollingFunction = (errorHandler) => {
//     const executePoll = async (resolve, reject) => {
//       let result;
//       try {
//         result = await this.getStatus();
//       } catch (error) {
//         errorHandler();
//         emitter.emit("error", () => console.log("error has occured"));
//       }

//       if (result.status !== "esriJobSucceeded") {
//         emitter.emit("status", () => console.log(result.status));
//       } else if (result.status === "esriJobSucceeded") {
//         emitter.emit("success", () => console.log("job has been completed"));
//         resolve(result);
//       } else if (result.status === "esriJobTimedOut") {
//         emitter.emit("complete", () => console.log("job has timedout"));
//         errorHandler();
//       } else {
//         setTimeout(executePoll, this.pollingRate);
//       }
//       return;
//     };
//   };
//   getStatus(){
//     return request(this.submitJobIdUrl, {
//       authentication: this.authentication,
//       params: { jobId: this.jobId, returnMessages: true }
//     });
//   }

//   getResults(resultParams, requestOptions) {
//     return request(this.submitResultsUrl, {
//       requestOptions,
//       authentication: this.authentication,
//       params: { jobId: this.jobId, paramName: resultParams }
//     });
//   }

//   cancelJob(requestOptions) {
//     return request(this.cancelJobRequest, {
//       requestOptions,
//       authentication: this.authentication,
//       params: { jobId: this.jobId, returnMessages: false }
//     })
//       .then(
//         emitter.emit("cancelled", () => console.log("job has been cancelled"))
//       )
//       .then(
//         emitter.emit("success", () =>
//           console.log("job has been sucessfully cancelled")
//         )
//       );
//   }
//   startEventMonitoring(errorHandler) {
//     this.pollingFunction(errorHandler);
//   }

//   stopEventMonitoring() {
//     emitter.off("stop monitoring", () =>
//       console.log("monitoring for job has been stopped")
//     );
//   }
// }
