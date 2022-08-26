import fetchMock from "fetch-mock";
import { resourceLimits } from "worker_threads";
import { Job, JOB_STATUSES} from "../src/index.js";
import {
  GPJobIdResponse,
  GPEndpointCall,
  GPJobInfoWithResults,
  mockHotspot_Raster,
  failedState
} from "./mocks/job-mock-fetches.js";

describe("Job Class", () => {
  afterEach(fetchMock.restore);

  describe("createJob", () => {
    it("should return a jobId", () => {
      fetchMock.mock("*", GPJobIdResponse);
      fetchMock.once("*", GPEndpointCall);
      return Job.submitJob(GPEndpointCall).then((job) => {
        expect(job.jobId).toEqual(GPJobIdResponse.jobId);
      });
    });

    it("should trigger events when polling", (done: any) => {
      // 1. when /submitJob gets called respond with the job id.
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      // 2. the first time we check the job status AFTER submitting the job respond with this
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        { jobStatus: "esriJobExecuting" }
      );

      // 3. submit the job, this will get the response from #1.
      Job.submitJob(GPEndpointCall).then((job) => {
        // 4. listen for the executing event, this will fire when we fake polling
        job.on(JOB_STATUSES.Executing, (result: any) => {
          console.log(result);
          // 7. this executes once teh event from the fake poll in step 6 happens.
          expect(result).toEqual({ jobStatus: "esriJobExecuting" });

          //8. Now we want to tell fetch mock how to respond to the next fake polling request
          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobSucceeded" }
          );

          // 9. fake another polling request
          (job as any).executePoll(); // fake a polling request
        });

        // 5. listen for the succeeded event, this will happen AFTER we setup the request in the execuritng listener
        job.on(JOB_STATUSES.Success, (result: any) => {
          // 10. this happens after the fake polling request in step 9.
          expect(result).toEqual({ jobStatus: "esriJobSucceeded" });

          // 11. tell Karma we are done with this test.
          done();
        });

        // 6. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
        (job as any).executePoll(); // fake a polling request
      });
    });

    it("should return results once status is succeeded", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        GPJobInfoWithResults
      );
  
      // 3. submit the job, this will get the response from #1.
      Job.submitJob(GPEndpointCall).then((job) => {

        job.on(JOB_STATUSES.Success, (result: any) => {
          // 10. this happens after the fake polling request in step 9.
          expect(result).toEqual(GPJobInfoWithResults);

          // 11. tell Karma we are done with this test.
          done();
        });

        // 6. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
        (job as any).executePoll(); // fake a polling request
      });
    });
    it("should get specific result property from results", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        GPJobInfoWithResults
      );
  
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/hotspot_raster",
        mockHotspot_Raster
      );
  
      // 3. submit the job, this will get the response from #1.
      Job.submitJob({ ...GPEndpointCall, startMonitoring: false }).then((job) => {      

        job.getResults("Hotspot_Raster").then(item => {
          expect(item).toEqual(mockHotspot_Raster);
          done();
        })
      });
    });
    fit("should get a failure message from the endpoint", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);
  
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        failedState
      );
  
      Job.submitJob(GPEndpointCall).then((job) => {      

        job.on(JOB_STATUSES.Failed, (result: any) => {
          expect(result).toEqual(failedState);
          done();
        });

        (job as any).executePoll();
      });
    });
  });
});
