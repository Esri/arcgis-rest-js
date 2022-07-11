// import {createJob, getJobParameters, GeoprocessingJob} from "@esri/arcgis-rest-geoprocessing";

// // start the job and start polling
// const job = await createJob({
//    url: "https://",
//    monitorEvents: true, // start polling for results by default, defaults to true.
//    monitorEventRate: 5000,
//    params: {
//       // ...
//     }
// });

// // events
// job.on("status", (status)=> {
//   // triggers every time we get the status of the job via polling
// });

// job.on("error", (error)=> {
//   // triggers when status polling finds an error status via polling
// });

// job.on("success", ()=> {
//   // triggers when status polling finds an success status via polling does NOT get results
//   // user should call `getResults`.
// });

// job.on("complete", ()=> {
//   // triggers when status polling finds an success or error via polling
// });

// // get all results
// job.getResults().then((results)=>{
//   console.log("Results from server", results)
// }).catch((error)=>{
//   console.log("Error on Server", error)
// });

// // the class that represents the job on the server
class GeoprocessingJob extends EventEmitter {
  //   pollingRate: number;
  
  //   readonly url: string;
  //   readonly params: IRequestOptions;
  //   readonly jobId: string;
  //   readonly isPolling: boolean;
  //   readonly executionType: "sync" | "async";
  
  //   static fromJobId (jobId: string) : Promise<GeoprocessingJob>{
  //     return createJob({ /* ... */});
  //   }
  
  //   constructor (options: any) {
  //     super();
  //     this.url = options.url;
  //     this.jobId = options.jobId;
  //     this.isPolling = options.isPolling;
  //     this.pollingRate = options.pollingRate;
  //     this.params = options.params;
  //     this.executionType = options.sync;
  
  //     if(options.monitorEvents) {
  //       this.startEventMonitoring(/*...*/)
  //     }
  //   }
  
  //   getStatus(): Promise<any> {
  //     /* get the current status of the job */
  //   }
  
  //   getResults (paramName?: string[] | string, requestOptions?: IRequestOptions) : Promise<any> {
  //     /* get the results for paramNames or all results by default */
  //   }
  //   cancelJob(requestOptions?: IRequestOptions): Promise<void> {
  //     // cancel request on server, stop polling, and throw error in any pending getResults Promise.
  //   }
  //   startEventMonitoring(errorHandler?, requestOptions?: IRequestOptions) : Promise<void> {
  //     // start polling again at the polling rate, trigger events
  //   }
  //   stopEventMonitoring(requestOptions?: IRequestOptions) {
  //    // stop polling for results
  //   }
  }