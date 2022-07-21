//create a method called createJob that takes in a some options
import { request, cleanUrl, ApiKeyManager } from "@esri/arcgis-rest-request"
import mitt from 'mitt'

const emitter = mitt();

// export const createJob = (url, params) => {
//   // const submitJobUrlCheck = url.endsWith("submitJob?") ? url : url.concat("submitJob?");
//   // const token = "AAPK094b7ef1c5da49a4b8f34a1f601845ab5_vWmRc7gHN8pIiEuZABbXyBqCA3crscYLmem3oR9BNcvheqSoe4Llgk4vPkfdGE"
//   return request(cleanUrl(url), params).then(response => response.jobId);

//   // return {
//   //   //make sure the url has the submitJob? appended to the url
//   //   url: cleanUrl(submitJobUrlCheck),
//   //   monitorEvents: monitorEvents, // start polling for results by default, defaults to true.
//   //   monitorEventRate: monitorEventRate,
//   //   //params any be anything so long as the object is formated correctly with a correct property name and string value
//   //   //example params: {name: "911 calls", dataType: "JSON", keywords: ["Hotspot", "911", "Calls"]}
//   //   params: params
//   // }

// }


const details = { f: "json", authentication: ApiKeyManager.fromKey("AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH"), facilities: "-117.133163,34.022445", defaultBreaks:"2.5", travelDirection:"esriNATravelDirectionToFacility", travelMode: "{'attributeParameterValues':[{'attributeName':'Avoid Private Roads','parameterName':'Restriction Usage','value':'AVOID_MEDIUM'},{'attributeName':'Walking','parameterName':'Restriction Usage','value':'PROHIBITED'},{'attributeName':'Preferred for Pedestrians','parameterName':'Restriction Usage','value':'PREFER_LOW'},{'attributeName':'WalkTime','parameterName':'Walking Speed (km/h)','value':5},{'attributeName':'Avoid Roads Unsuitable for Pedestrians','parameterName':'Restriction Usage','value':'AVOID_HIGH'}],'description':'Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.','distanceAttributeName':'Kilometers','id':'yFuMFwIYblqKEefX','impedanceAttributeName':'Kilometers','name':'Walking Distance','restrictionAttributeNames':['Avoid Private Roads','Avoid Roads Unsuitable for Pedestrians','Preferred for Pedestrians','Walking'],'simplificationTolerance':2,'simplificationToleranceUnits':'esriMeters','timeAttributeName':'WalkTime','type':'WALK','useHierarchy':false,'uturnAtJunctions':'esriNFSBAllowBacktrack'}"}

createJob("https://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas/submitJob?", details).then(response => request(`https://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas/jobs/${response}?f=json&token=AAPK59244520da284b68bc5d426a1c22d08fp9HQo6v2E2xWsNgC39us1eQQvnrCLxBEYUAI_qR6xaHgU-S7osfaONVFd0YEi9dH`)).then(results => console.log(results));

// curl https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve? \
// -d "f=json"
// -d "token=<ACCESS_TOKEN>"
// -d "stops=-122.68782,45.51238;-122.690176,45.522054;-122.614995,45.526201"
// -d "startTime=now"
// -d "returnDirections=true"
// -d "directionsLanguage=es"

//once that call is made 
//job ID job status

// esriJobSubmitted
// esriJobWaiting
// esriJobExecuting
// esriJobSucceeded
// esriJobFailed
// esriJobTimedOut
// esriJobCancelling
// esriJobCancelled

const pollingFunction = () => {
  if(emitter.on("esriJobExecuting")) {
  return emitter.emit("excuting"
  )
  }
  
}

emitter.on("esriJobSubmitted", (status) => {
  emitter.emit("Esri job submitted", status);
});

// emitter.on("error", (error)=> {
//   // triggers when status polling finds an error status via polling
// });

// emitter.on("success", ()=> {
//   // triggers when status polling finds an success status via polling does NOT get results
//   // user should call `getResults`.
// });

// emitter.on("complete", ()=> {
//   // triggers when status polling finds an success or error via polling
// });

export class GeoprocessingJob {
  pollingRate;
  url;
  params;
  jobId;
  isPolling;
  executionType;
  monitorEvents;
  monitorEventRate;

  static createJob(url, params) {
    return request(cleanUrl(url), params).then(response => new GeoprocessingJob({url, jobId: response.jobId, authenticaion: params.authenticaion}));
  }

  constructor(options) {
    this.url = options.url;
    this.jobId = options.jobId;
    this.authentication = options.authentication;
    this.submitJobIdUrl = options.url.replace("submitJob?", `/jobs/${this.jobId}`)
    this.isPolling = options.isPolling;
    this.pollingRate = options.pollingRate;
    this.params = options.params;
    this.executionType = options.sync;

    // if (options.monitorEvents) {
      this.startEventMonitoring(/*...call getStatus until there are results and then call stopEventMonitoring*/)
    // }
  }

    getStatus() {
      return request(this.submitJobIdUrl, { authentication: this.authentication, params: { jobId : this.jobId, returnMessages: true }});
    }

  //   getResults (paramName?: string[] | string, requestOptions?: IRequestOptions) : Promise<any> {
  //     /* get the results for paramNames or all results by default */
  //   }
  //   cancelJob(requestOptions?: IRequestOptions): Promise<void> {
  //     // cancel request on server, stop polling, and throw error in any pending getResults Promise.
  //   }
    startEventMonitoring(errorHandler, requestOptions){
      this.getStatus();
    }
  //   stopEventMonitoring(requestOptions?: IRequestOptions) {
  //    // stop polling for results
  //   }
}
