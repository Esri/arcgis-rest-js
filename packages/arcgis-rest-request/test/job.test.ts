import fetchMock from "fetch-mock";
import { Job, JOB_STATUSES, ArcGISRequestError } from "../src/index.js";
import { processJobParams } from "../src/utils/process-job-params.js";
import {
  GPJobIdResponse,
  GPEndpointCall,
  GPJobInfoWithResults,
  mockHotspot_Raster,
  failedState,
  mockCancelledState,
  mockAllResultsRequest,
  mockAllResults
} from "./mocks/job-mock-fetches.js";

describe("Job", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it("should return a jobId", () => {
    fetchMock.mock("*", GPJobIdResponse);
    return Job.submitJob(GPEndpointCall).then((job) => {
      expect(job.id).toEqual(GPJobIdResponse.jobId);
    });
  });

  it("should trigger events when polling", (done: any) => {
    // 1. when /submitJob gets called respond with the job id.
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    // 2. the first time we check the job status AFTER submitting the job respond with this
    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        jobStatus: "esriJobExecuting",
        jobId: "j4fa1db2338f042a19eb68856afabc27e"
      }
    );

    // 3. submit the job, this will get the response from #1.
    Job.submitJob(GPEndpointCall).then((job) => {
      // 4. listen for the executing event, this will fire when we fake polling
      job.on(JOB_STATUSES.Executing, (jobInfo) => {
        // 7. this executes once the event from the fake poll in step 6 happens.
        expect(jobInfo.status).toEqual(JOB_STATUSES.Executing);
        expect(jobInfo.id).toEqual("j4fa1db2338f042a19eb68856afabc27e");

        //8. Now we want to tell fetch mock how to respond to the next fake polling request
        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobStatus: "esriJobSucceeded",
            jobId: "j4fa1db2338f042a19eb68856afabc27e"
          },
          { overwriteRoutes: true }
        );

        // 9. fake another polling request
        (job as any).executePoll(); // fake a polling request
      });

      // 5. listen for the succeeded event, this will happen AFTER we setup the request in the execuritng listener
      job.on(JOB_STATUSES.Success, (jobInfo) => {
        // 10. this happens after the fake polling request in step 9.
        expect(jobInfo.status).toEqual(JOB_STATUSES.Success);
        expect(jobInfo.id).toEqual("j4fa1db2338f042a19eb68856afabc27e");

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

    // 1. submit the job, this will get the response from #1.
    Job.submitJob(GPEndpointCall).then((job) => {
      job.on(JOB_STATUSES.Success, (jobInfo) => {
        // 3. this happens after the fake polling request in step 2.
        expect(jobInfo.id).toEqual("j4fa1db2338f042a19eb68856afabc27e");
        expect(jobInfo.status).toEqual(JOB_STATUSES.Success);
        expect(jobInfo.results).toEqual(GPJobInfoWithResults.results);

        // 4. tell Karma we are done with this test.
        done();
      });

      // 2. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
      (job as any).executePoll(); // fake a polling request
    });
  });

  it("should get specific result property from results and get all results", () => {
    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
      GPJobIdResponse
    );

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      mockAllResults
    );

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_unassigned_stops",
      {
        paramName: "out_unassigned_stops",
        dataType: "GPRecordSet",
        value: {
          displayFieldName: "",
          fields: [] as any,
          features: [] as any,
          exceededTransferLimit: false
        }
      }
    );

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_stops",

      {
        paramName: "out_stops",
        dataType: "GPRecordSet",
        value: {
          displayFieldName: "",
          fields: [] as any,
          features: [] as any,
          exceededTransferLimit: false
        }
      }
    );

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_routes",
      {
        paramName: "out_routes",
        dataType: "GPFeatureRecordSetLayer",
        value: {
          displayFieldName: "",
          geometryType: "esriGeometryPolyline",
          spatialReference: [] as any,
          fields: [] as any,
          features: [] as any,
          exceededTransferLimit: false
        }
      }
    );

    return Job.submitJob({ ...GPEndpointCall, startMonitoring: false })
      .then((job) => job.getAllResults())
      .then((results) => {
        expect(results).toEqual(mockAllResultsRequest);
      });
  });

  it("should just do a getResult for one paramName", () => {
    fetchMock.mock(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      mockAllResults
    );

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_unassigned_stops",
      {
        paramName: "out_unassigned_stops",
        dataType: "GPRecordSet",
        value: {
          displayFieldName: "",
          fields: [] as any,
          features: [] as any,
          exceededTransferLimit: false
        }
      }
    );

    return Job.submitJob({ ...GPEndpointCall })
      .then((job) => job.getResult("out_unassigned_stops"))
      .then((results) => {
        expect(results).toEqual({
          paramName: "out_unassigned_stops",
          dataType: "GPRecordSet",
          value: {
            displayFieldName: "",
            fields: [] as any,
            features: [] as any,
            exceededTransferLimit: false
          }
        });
      });
  });

  it("should call waitForCompletion get a timeout status and reject the job results promise", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        jobId: "j4fa1db2338f042a19eb68856afabc27e",
        jobStatus: "esriJobTimedOut"
      }
    );

    Job.submitJob({ ...GPEndpointCall, startMonitoring: false })
      .then((job) => {
        return job.waitForCompletion();
      })
      .then(() => {
        fail("Should throw an error");
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.status).toEqual(JOB_STATUSES.TimedOut);
        expect(error.jobInfo.id).toEqual("j4fa1db2338f042a19eb68856afabc27e");
        done();
      });
  });

  it("call method fromExistingJob", () => {
    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      mockAllResults
    );

    return Job.fromExistingJob({
      id: "j4fa1db2338f042a19eb68856afabc27e",
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob"
    }).then((job) => {
      expect(job instanceof Job).toBe(true);
      expect(job.id).toEqual(mockAllResults.jobId);
    });
  });

  it("should get a failed state after submitting jobId for the results", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      failedState
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      job.on(JOB_STATUSES.Failed, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failed);
        expect(result.id).toEqual(failedState.jobId);
        done();
      });

      job.stopEventMonitoring();

      (job as any).executePoll();
    });
  });

  it("create a new job with the new, submitted, waiting, time-out", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      { jobStatus: "esriJobNew" }
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      job.on(JOB_STATUSES.New, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.New);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobWaiting" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Waiting, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Waiting);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobSubmitted" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Submitted, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Submitted);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobTimedOut" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });
      job.on(JOB_STATUSES.TimedOut, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.TimedOut);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "expectedFailure" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Failure, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failure);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobFailed" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Failed, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failed);

        done();
      });

      (job as any).executePoll(); // fake a polling request
    });
  });

  it("should test if the polling rate has changed", () => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    return Job.submitJob(GPEndpointCall).then((job) => {
      job.pollingRate = 5000;
      expect(job.pollingRate).toBe(5000);
      job.pollingRate = 1000;
      expect(job.pollingRate).toBe(1000);
      job.stopEventMonitoring();
      job.startEventMonitoring();
      expect(job.pollingRate).toBe(2000);
    });
  });

  it("should call off method", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        jobId: "j4fa1db2338f042a19eb68856afabc27e",
        jobStatus: "esriJobSucceeded"
      }
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      const handler = (results: any) => results;

      job.on(JOB_STATUSES.Success, handler);

      job.off(JOB_STATUSES.Success, handler);

      expect((job as any).emitter.all.get(JOB_STATUSES.Success).length).toBe(0);

      job.once(JOB_STATUSES.Success, handler);

      job.off(JOB_STATUSES.Success, handler);

      expect((job as any).emitter.all.get(JOB_STATUSES.Success).length).toBe(0);

      job.stopEventMonitoring();

      done();
    });
  });

  it("create a new job with a cancelled and cancelling state", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      { jobStatus: "esriJobSubmitted" }
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      job.on(JOB_STATUSES.Submitted, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Submitted);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobCancelling" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Cancelling, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Cancelling);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobCancelled" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Cancelled, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Cancelled);

        done();
      });
      (job as any).executePoll();
    });
  });

  it("submits a job and response returns an error from the results", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        error: {
          code: 400,
          message: "unable to get results",
          details: []
        }
      }
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      job.on(JOB_STATUSES.Error, (result: any) => {
        expect(new ArcGISRequestError(result) instanceof Error).toBe(true);
        done();
      });

      (job as any).executePoll();
    });
  });

  it("it gets the results however we wait for the job to succeeded them show the results", () => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        jobId: "j4fa1db2338f042a19eb68856afabc27e",
        jobStatus: "esriJobWaiting"
      }
    );

    return Job.submitJob({
      ...GPEndpointCall,
      pollingRate: 100
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            GPJobInfoWithResults
          );

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/hotspot_raster",
            mockHotspot_Raster
          );
        });
        return job.getResult("Hotspot_Raster");
      })
      .then((result) => {
        expect(result).toEqual(mockHotspot_Raster);
      });
  });

  it("it gets the results however we wait for the job to succeeded but the results return an error ", (done) => {
    fetchMock.mock(GPEndpointCall.url, {
      jobId: "WAIT_FOR_JOB_RESULTS_ERROR",
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/WAIT_FOR_JOB_RESULTS_ERROR",
      {
        jobId: "WAIT_FOR_JOB_RESULTS_ERROR",
        jobStatus: "esriJobWaiting"
      }
    );

    Job.submitJob({
      ...GPEndpointCall,
      startMonitoring: false,
      pollingRate: 100
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/WAIT_FOR_JOB_RESULTS_ERROR",
            GPJobInfoWithResults
          );

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/WAIT_FOR_JOB_RESULTS_ERROR/results/hotspot_raster",
            {
              error: {
                code: 400,
                message: "unable to retrieve results for hotspot_raster",
                details: []
              }
            }
          );
        });

        return job.getResult("Hotspot_Raster");
      })
      .then(() => {
        fail("Should throw and error");
        done();
      })
      .catch((result: any) => {
        expect(new ArcGISRequestError(result) instanceof Error).toBe(true);
        done();
      });
  });

  it("it gets the results however it returns a timed out status", (done) => {
    fetchMock.once(GPEndpointCall.url, {
      jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT",
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT",
      {
        jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT",
        jobStatus: "esriJobWaiting"
      }
    );

    Job.submitJob({
      ...GPEndpointCall,
      startMonitoring: false,
      pollingRate: 100
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();
          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT",
            {
              jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT",
              jobStatus: "esriJobTimedOut"
            }
          );
        });

        return job.getResult("Hotspot_Raster");
      })
      .then(() => {
        fail("Should throw an error");
        done();
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.jobInfo.id).toEqual(
          "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT"
        );
        expect(error.status).toEqual(JOB_STATUSES.TimedOut);
        done();
      });
  });

  it("it gets the results however it returns a cancelled status", (done) => {
    fetchMock.mock(GPEndpointCall.url, {
      jobId: "CANCELATION_TEST_JOB_ID",
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/CANCELATION_TEST_JOB_ID",
      {
        jobId: "CANCELATION_TEST_JOB_ID",
        jobStatus: "esriJobWaiting"
      }
    );

    Job.submitJob({
      ...GPEndpointCall,
      startMonitoring: false,
      pollingRate: 100
    })
      .then((job) => {
        job.once(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/CANCELATION_TEST_JOB_ID",
            {
              jobId: "CANCELATION_TEST_JOB_ID",
              jobStatus: "esriJobCancelled"
            }
          );
        });

        return job.getResult("Hotspot_Raster");
      })
      .then((result) => {
        console.log(result);
        fail("should throw an error");
        done();
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.jobInfo.id).toEqual("CANCELATION_TEST_JOB_ID");
        expect(error.status).toEqual(JOB_STATUSES.Cancelled);
        done();
      });
  }, 40000);

  it("it gets the results however it returns a failed status", (done) => {
    fetchMock.mock(GPEndpointCall.url, {
      jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
      {
        jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
        jobStatus: "esriJobWaiting"
      }
    );

    Job.submitJob({
      ...GPEndpointCall,
      startMonitoring: false,
      pollingRate: 100
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
            {
              jobId: "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
              jobStatus: "esriJobFailed"
            }
          );
        });
        return job.getResult("Hotspot_Raster");
      })
      .then(() => {
        fail("Should throw an error.");
        done();
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.jobInfo.id).toEqual(
          "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST"
        );
        expect(error.status).toEqual(JOB_STATUSES.Failed);
        done();
      });
  });

  it("makes sure to get isMonitoring function", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    Job.submitJob(GPEndpointCall).then((job) => {
      expect(job.isMonitoring).toEqual(true);
      done();
    });
  });

  it("parses params if there is multi-value input", () => {
    processJobParams({
      url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
      params: {
        summarizeType:
          "['CentralFeature', 'MeanCenter', 'MedianCenter', 'Ellipse']",
        weightField: "NUM_TREES",
        ellipseSize: "1 standard deviation",
        context: {
          extent: {
            xmin: -15034729.266472297,
            ymin: 5716733.479048933,
            xmax: -12070195.56146081,
            ymax: 7808050.572930799,
            spatialReference: { wkid: 102100, latestWkid: 3857 }
          }
        }
      }
    });

    expect(
      processJobParams({
        summarizeType: [
          "CentralFeature",
          "MeanCenter",
          "MedianCenter",
          "Ellipse"
        ],
        weightField: "NUM_TREES",
        ellipseSize: "1 standard deviation",
        context: {
          extent: {
            xmin: -15034729.266472297,
            ymin: 5716733.479048933,
            xmax: -12070195.56146081,
            ymax: 7808050.572930799,
            spatialReference: { wkid: 102100, latestWkid: 3857 }
          }
        }
      })
    ).toEqual({
      summarizeType: '["CentralFeature","MeanCenter","MedianCenter","Ellipse"]',
      weightField: "NUM_TREES",
      ellipseSize: "1 standard deviation",
      context: {
        extent: {
          xmin: -15034729.266472297,
          ymin: 5716733.479048933,
          xmax: -12070195.56146081,
          ymax: 7808050.572930799,
          spatialReference: { wkid: 102100, latestWkid: 3857 }
        }
      }
    });
  });

  it("calls toJSON, serialize and deserialize methods", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.mock(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      mockAllResults
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      const json = job.toJSON();
      expect(json).toEqual(json);

      const serialized = job.serialize();
      expect(serialized).toEqual(serialized);

      Job.deserialize(serialized).then((job) => {
        expect(job.id).toEqual(json.id);
        done();
      });
    });
  });

  it("cancels a job", (done) => {
    fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
      {
        jobStatus: "esriJobExecuting"
      }
    );

    fetchMock.once(
      "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/cancel",
      mockCancelledState
    );

    Job.submitJob(GPEndpointCall).then((job) => {
      job.cancelJob().then(() => {
        job.on(JOB_STATUSES.Cancelled, (result) => {
          expect(result.id).toEqual("j4fa1db2338f042a19eb68856afabc27e");
          expect(result.status).toEqual(JOB_STATUSES.Cancelled);
        });
        done();
      });
      (job as any).executePoll();
    });
  });
});
