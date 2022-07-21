//create a method called createJob that takes in a some options
import { request, cleanUrl } from "@esri/arcgis-rest-request";

export const createJob = (url: string, params: {}) => {
  const submitJobUrlCheck = url.endsWith("submitJob?")
    ? url
    : url.concat("submitJob?");
  // const token = "AAPK094b7ef1c5da49a4b8f34a1f601845ab5_vWmRc7gHN8pIiEuZABbXyBqCA3crscYLmem3oR9BNcvheqSoe4Llgk4vPkfdGE"

  const headers = {
    Accept: "application/json",
    Authorization:
      "token=AAPK094b7ef1c5da49a4b8f34a1f601845ab5_vWmRc7gHN8pIiEuZABbXyBqCA3crscYLmem3oR9BNcvheqSoe4Llgk4vPkfdGE"
  };

  const options = {
    headers: headers,
    method: "GET",
    payload: params as {},
    dataType: "application/json"
  };

  const response = request(cleanUrl(submitJobUrlCheck), options)
    .then((response: any) => response.json())
    .then((results: any) => results);

  return response;
  // return {
  //   //make sure the url has the submitJob? appended to the url
  //   url: cleanUrl(submitJobUrlCheck),
  //   monitorEvents: monitorEvents, // start polling for results by default, defaults to true.
  //   monitorEventRate: monitorEventRate,
  //   //params any be anything so long as the object is formated correctly with a correct property name and string value
  //   //example params: {name: "911 calls", dataType: "JSON", keywords: ["Hotspot", "911", "Calls"]}
  //   params: params
  // }
};

const details = {
  headers: {
    Accept: "application/json",
    Authorization:
      "token=AAPK094b7ef1c5da49a4b8f34a1f601845ab5_vWmRc7gHN8pIiEuZABbXyBqCA3crscYLmem3oR9BNcvheqSoe4Llgk4vPkfdGE"
  },
  method: "GET",
  payload: {
    defaultBreaks: "2.5",
    travelDirection: "esriNATravelDirectionToFacility",
    travelMode:
      "{'attributeParameterValues':[{'attributeName':'Avoid Private Roads','parameterName':'Restriction Usage','value':'AVOID_MEDIUM'},{'attributeName':'Walking','parameterName':'Restriction Usage','value':'PROHIBITED'},{'attributeName':'Preferred for Pedestrians','parameterName':'Restriction Usage','value':'PREFER_LOW'},{'attributeName':'WalkTime','parameterName':'Walking Speed (km/h)','value':5},{'attributeName':'Avoid Roads Unsuitable for Pedestrians','parameterName':'Restriction Usage','value':'AVOID_HIGH'}],'description':'Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.','distanceAttributeName':'Kilometers','id':'yFuMFwIYblqKEefX','impedanceAttributeName':'Kilometers','name':'Walking Distance','restrictionAttributeNames':['Avoid Private Roads','Avoid Roads Unsuitable for Pedestrians','Preferred for Pedestrians','Walking'],'simplificationTolerance':2,'simplificationToleranceUnits':'esriMeters','timeAttributeName':'WalkTime','type':'WALK','useHierarchy':false,'uturnAtJunctions':'esriNFSBAllowBacktrack'}"
  },
  dataType: "json"
};

console.log(
  createJob(
    "https://logistics.arcgis.com/arcgis/rest/services/World/ServiceAreas/GPServer/GenerateServiceAreas/submitJob?",
    details
  ),
  "hello"
);

//params
// {
//   defaultBreaks:"2.5",
//   travelDirection: "esriNATravelDirectionToFacility",
//   travelMode: "{'attributeParameterValues':[{'attributeName':'Avoid Private Roads','parameterName':'Restriction Usage','value':'AVOID_MEDIUM'},{'attributeName':'Walking','parameterName':'Restriction Usage','value':'PROHIBITED'},{'attributeName':'Preferred for Pedestrians','parameterName':'Restriction Usage','value':'PREFER_LOW'},{'attributeName':'WalkTime','parameterName':'Walking Speed (km/h)','value':5},{'attributeName':'Avoid Roads Unsuitable for Pedestrians','parameterName':'Restriction Usage','value':'AVOID_HIGH'}],'description':'Follows paths and roads that allow pedestrian traffic and finds solutions that optimize travel distance.','distanceAttributeName':'Kilometers','id':'yFuMFwIYblqKEefX','impedanceAttributeName':'Kilometers','name':'Walking Distance','restrictionAttributeNames':['Avoid Private Roads','Avoid Roads Unsuitable for Pedestrians','Preferred for Pedestrians','Walking'],'simplificationTolerance':2,'simplificationToleranceUnits':'esriMeters','timeAttributeName':'WalkTime','type':'WALK','useHierarchy':false,'uturnAtJunctions':'esriNFSBAllowBacktrack'}"
// }

//once that call is made
//job ID job status

// class GeoprocessingJob extends EventEmitter {
//   pollingRate: number;

//   readonly url: string;
//   readonly params: any;
//   readonly jobId: string;
//   readonly isPolling: boolean;
//   readonly executionType: "sync" | "async";
//   readonly monitorEvents: boolean;
//   readonly monitorEventRate: number;

//   static fromJobId(): Promise<GeoprocessingJob> {
//     //get the param inputs and options returned from the createJob request
//     //return all the necessary propertiers, call them options
//   }

//   constructor(options: any) {
//     super();
//     this.url = options.url;
//     this.jobId = options.jobId;
//     this.isPolling = options.isPolling;
//     this.pollingRate = options.pollingRate;
//     this.params = options.params;
//     this.executionType = options.sync;

//     if (options.monitorEvents) {
//       this.startEventMonitoring(/*...*/)
//     }
//   }

//   //   getStatus(): Promise<any> {
//   //     /* get the current status of the job */
//   //   }

//   //   getResults (paramName?: string[] | string, requestOptions?: IRequestOptions) : Promise<any> {
//   //     /* get the results for paramNames or all results by default */
//   //   }
//   //   cancelJob(requestOptions?: IRequestOptions): Promise<void> {
//   //     // cancel request on server, stop polling, and throw error in any pending getResults Promise.
//   //   }
//   //   startEventMonitoring(errorHandler?, requestOptions?: IRequestOptions) : Promise<void> {
//   //     // start polling again at the polling rate, trigger events
//   //   }
//   //   stopEventMonitoring(requestOptions?: IRequestOptions) {
//   //    // stop polling for results
//   //   }
// }
