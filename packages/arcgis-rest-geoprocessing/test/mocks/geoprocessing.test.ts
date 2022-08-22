import fetchMock from "fetch-mock";
import { Job } from "../../src/index.js";
import {
  GPJobIdResponse,
  GPEndpointCall,
  GPJobInfoWithResults
  // mockHotspot_Raster,
  // mockResults
} from "./mock-fetches.js";

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
        job.on("executing", (result: any) => {
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
        job.on("succeeded", (result: any) => {
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

      // 2. the first time we check the job status AFTER submitting the job respond with this
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        GPJobInfoWithResults // add jobID and status + everything else to mockResults
      );

      Job.submitJob(GPEndpointCall).then((job) => {
        (job as any).executePoll(); // fake a polling request

        job.on("succeeded", (results: any) => {
          expect(results).toEqual(GPJobInfoWithResults);
          done();
        });
      });
    });
    // it("should get specific result property from results", () => {
    //   fetchMock.once("*", mockHotspot_Raster);
    //   fetchMock.once("*", mockResults);
    //   fetchMock.once("*", GPEndpointCall);

    //   GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
    //     response.emitter.on("succeeded", () => {
    //       response
    //         .getResults("Hotspot_Raster")
    //         .then((results) => expect(results).toEqual(mockHotspot_Raster));
    //     });
    //   });
    // });
    // it("should get a failure message from the endpoint", () => {
    //   fetchMock.once("*", mockHotspot_Raster);
    //   fetchMock.once("*", mockResults);
    //   fetchMock.once("*", EsriJobFailed);
    //   fetchMock.once("*", GPEndpointCall);

    //   GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
    //     response.emitter.on("failed", (error: any) =>
    //       expect(error).toEqual(EsriJobFailed)
    //     );
    //   });
    // });
  });
});
