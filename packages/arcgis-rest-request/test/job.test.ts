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
import { RemoveItemResourceResponse } from "@esri/arcgis-rest-portal/test/mocks/items/resources.js";

function createJobMocks(
  jobId: string = "MOCK_JOB_ID",
  serviceName: string = "MOCK_SERVICE"
) {
  const baseUrl = `https://www.arcgis.com/arcgis/rest/services/${serviceName}/GPServer/Task/`;
  const jobInfoUrl = `${baseUrl}jobs/${jobId}`;
  const jobSubmitUrl = `${baseUrl}submitJob`;

  return {
    submitOptions: {
      ...JSON.parse(JSON.stringify({ ...GPEndpointCall, url: jobSubmitUrl }))
    },
    jobSubmittedResponse: JSON.parse(
      JSON.stringify({ ...GPJobIdResponse, jobId })
    ),
    jobInfoFailure: JSON.parse(JSON.stringify({ ...failedState, jobId })),
    jobInfoWithResults: JSON.parse(
      JSON.stringify({ ...GPJobInfoWithResults, jobId })
    ),
    jobInfoWithAllResults: JSON.parse(
      JSON.stringify({ ...mockAllResults, jobId })
    ),
    jobInfoWithFailedState: JSON.parse(
      JSON.stringify({ ...failedState, jobId })
    ),
    jobInfoUrl,
    jobSubmitUrl,
    jobId,
    baseUrl
  };
}

describe("Job", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it("should return a jobId", () => {
    const { submitOptions, jobSubmittedResponse } = createJobMocks(
      "basicJobId",
      "basicServiceName"
    );

    fetchMock.mock("*", jobSubmittedResponse);

    return Job.submitJob(submitOptions).then((job) => {
      expect(job.id).toEqual(jobSubmittedResponse.jobId);
    });
  });

  it("should trigger events when polling", (done: any) => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId
    } = createJobMocks("triggerEventsJobId", "triggerEventsServiceName");

    // 1. when /submitJob gets called respond with the job id.
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    // 2. the first time we check the job status AFTER submitting the job respond with this
    fetchMock.once(jobInfoUrl, {
      jobStatus: "esriJobExecuting",
      jobId
    });

    // 3. submit the job, this will get the response from #1.
    Job.submitJob(submitOptions).then((job) => {
      // 4. listen for the executing event, this will fire when we fake polling
      job.on(JOB_STATUSES.Executing, (jobInfo) => {
        // 7. this executes once the event from the fake poll in step 6 happens.
        expect(jobInfo.status).toEqual(JOB_STATUSES.Executing);
        expect(jobInfo.id).toEqual(jobId);

        //8. Now we want to tell fetch mock how to respond to the next fake polling request
        fetchMock.once(
          jobInfoUrl,
          {
            jobStatus: "esriJobSucceeded",
            jobId
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
        expect(jobInfo.id).toEqual(jobId);

        // 11. tell Karma we are done with this test.
        done();
      });

      // 6. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
      (job as any).executePoll(); // fake a polling request
    });
  });

  it("should return results once status is succeeded", (done) => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId,
      jobInfoWithResults
    } = createJobMocks("returnsResults", "returnsResultsServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, jobInfoWithResults);

    // 1. submit the job, this will get the response from #1.
    Job.submitJob(submitOptions).then((job) => {
      job.on(JOB_STATUSES.Success, (jobInfo) => {
        // 3. this happens after the fake polling request in step 2.
        expect(jobInfo.id).toEqual(jobId);
        expect(jobInfo.status).toEqual(JOB_STATUSES.Success);
        expect(jobInfo.results).toEqual(jobInfoWithResults.results);

        // 4. tell Karma we are done with this test.
        done();
      });

      // 2. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
      (job as any).executePoll(); // fake a polling request
    });
  });

  it("should get specific result property from results and get all results", () => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobInfoWithAllResults
    } = createJobMocks("getResults", "getResultsServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, jobInfoWithAllResults);

    fetchMock.once(`${jobInfoUrl}/results/out_unassigned_stops`, {
      paramName: "out_unassigned_stops",
      dataType: "GPRecordSet",
      value: {
        displayFieldName: "",
        fields: [] as any,
        features: [] as any,
        exceededTransferLimit: false
      }
    });

    fetchMock.once(`${jobInfoUrl}/results/out_stops`, {
      paramName: "out_stops",
      dataType: "GPRecordSet",
      value: {
        displayFieldName: "",
        fields: [] as any,
        features: [] as any,
        exceededTransferLimit: false
      }
    });

    fetchMock.once(`${jobInfoUrl}/results/out_routes`, {
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
    });

    return Job.submitJob({ ...submitOptions, startMonitoring: false })
      .then((job) => job.getAllResults())
      .then((results) => {
        expect(results).toEqual(mockAllResultsRequest);
      });
  });

  it("should just do a getResult for one paramName", () => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobInfoWithAllResults
    } = createJobMocks("getResultsSingle", "getResultsSingleServiceName");

    fetchMock.mock(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.mock(jobInfoUrl, jobInfoWithAllResults);

    fetchMock.mock(`${jobInfoUrl}/results/out_unassigned_stops`, {
      paramName: "out_unassigned_stops",
      dataType: "GPRecordSet",
      value: {
        displayFieldName: "",
        fields: [] as any,
        features: [] as any,
        exceededTransferLimit: false
      }
    });

    return Job.submitJob(submitOptions)
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
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId
    } = createJobMocks(
      "waitForCompletionTimedOut",
      "waitForCompletionTimedOutServiceName"
    );
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, {
      jobId,
      jobStatus: "esriJobTimedOut"
    });

    Job.submitJob({ ...submitOptions, startMonitoring: false })
      .then((job) => {
        return job.waitForCompletion();
      })
      .then(() => {
        fail("Should throw an error");
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.status).toEqual(JOB_STATUSES.TimedOut);
        expect(error.jobInfo.id).toEqual(jobId);
        done();
      });
  });

  it("call method fromExistingJob", () => {
    const { jobInfoWithAllResults, jobId, jobSubmitUrl, jobInfoUrl } =
      createJobMocks("fromExistingJobId", "fromExistingJobServiceName");
    fetchMock.once(jobInfoUrl, jobInfoWithAllResults);

    return Job.fromExistingJob({
      id: jobId,
      url: jobSubmitUrl
    }).then((job) => {
      expect(job instanceof Job).toBe(true);
      expect(job.id).toEqual(jobInfoWithAllResults.jobId);
    });
  });

  it("should get a failed state after submitting jobId for the results", (done) => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId,
      jobInfoWithFailedState
    } = createJobMocks("failedStateJobId", "failedStateServiceName");
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, jobInfoWithFailedState);

    Job.submitJob(submitOptions).then((job) => {
      job.on(JOB_STATUSES.Failed, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failed);
        expect(result.id).toEqual(jobId);
        done();
      });

      job.stopEventMonitoring();

      (job as any).executePoll();
    });
  });

  it("create a new job and fire the new, submitted, waiting and time-out states", (done) => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId
    } = createJobMocks("allEventsJobId", "allEventsServiceName");
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, { jobStatus: "esriJobNew" });

    Job.submitJob(submitOptions).then((job) => {
      job.on(JOB_STATUSES.New, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.New);

        fetchMock.once(
          jobInfoUrl,
          { jobStatus: "esriJobWaiting" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Waiting, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Waiting);

        fetchMock.once(
          jobInfoUrl,
          { jobStatus: "esriJobSubmitted" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Submitted, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Submitted);

        fetchMock.once(
          jobInfoUrl,
          { jobStatus: "esriJobTimedOut" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });
      job.on(JOB_STATUSES.TimedOut, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.TimedOut);

        fetchMock.once(
          jobInfoUrl,
          { jobStatus: "expectedFailure" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Failure, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failure);

        fetchMock.once(
          jobInfoUrl,
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
    const { submitOptions, jobSubmittedResponse, jobSubmitUrl } =
      createJobMocks("pollingRateJobId", "pollingRateServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    return Job.submitJob(submitOptions).then((job) => {
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
    const {
      submitOptions,
      jobSubmittedResponse,
      jobSubmitUrl,
      jobInfoUrl,
      jobId
    } = createJobMocks("offMethodJobId", "offMethodServiceName");
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, {
      jobId,
      jobStatus: "esriJobSucceeded"
    });

    Job.submitJob(submitOptions).then((job) => {
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
    const {
      submitOptions,
      jobSubmittedResponse,
      jobSubmitUrl,
      jobInfoUrl,
      jobId
    } = createJobMocks("cancelJobId", "cancelServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, { jobStatus: "esriJobSubmitted" });

    Job.submitJob(submitOptions).then((job) => {
      job.on(JOB_STATUSES.Submitted, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Submitted);

        fetchMock.once(
          jobInfoUrl,
          { jobStatus: "esriJobCancelling" },
          { overwriteRoutes: true }
        );

        (job as any).executePoll();
      });

      job.on(JOB_STATUSES.Cancelling, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Cancelling);

        fetchMock.once(
          jobInfoUrl,
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
    const { submitOptions, jobSubmittedResponse, jobInfoUrl, jobSubmitUrl } =
      createJobMocks(
        "errorGettingResultsJobId",
        "errorGettingResultsServiceName"
      );
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, {
      error: {
        code: 400,
        message: "unable to get results",
        details: []
      }
    });

    Job.submitJob(submitOptions).then((job) => {
      job.on(JOB_STATUSES.Error, (result: any) => {
        expect(new ArcGISRequestError(result) instanceof Error).toBe(true);
        done();
      });

      (job as any).executePoll();
    });
  });

  it("it gets the results however we wait for the job to succeeded them show the results", () => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobSubmitUrl,
      jobInfoUrl,
      jobId,
      jobInfoWithResults
    } = createJobMocks(
      "getResultsWaitingJobId",
      "getResultsWaitingServiceName"
    );
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);
    let callCount = 0;

    fetchMock.mock("*", (url, options) => {
      if (url === `${jobInfoUrl}/results/hotspot_raster`) {
        return Promise.resolve(mockHotspot_Raster);
      }

      if (url === jobSubmitUrl) {
        return Promise.resolve(jobSubmittedResponse);
      }

      if (url === jobInfoUrl) {
        if (callCount > 0) {
          return Promise.resolve(jobInfoWithResults);
        }
        callCount++;
        return Promise.resolve({
          jobId,
          jobStatus: "esriJobWaiting"
        });
      }
    });

    return Job.submitJob({
      ...submitOptions
    })
      .then((job) => {
        expect(job.id).toEqual(jobId);
        return job.getResult("Hotspot_Raster");
      })
      .then((result) => {
        expect(result).toEqual(mockHotspot_Raster);
      });
  });

  it("it gets the results however we wait for the job to succeeded but the results return an error ", (done) => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobSubmitUrl,
      jobInfoUrl,
      jobInfoWithResults
    } = createJobMocks(
      "WAIT_FOR_JOB_RESULTS_ERROR",
      "WAIT_FOR_JOB_RESULTS_ERROR"
    );
    fetchMock.mock(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.mock(jobInfoUrl, {
      jobId: "WAIT_FOR_JOB_RESULTS_ERROR",
      jobStatus: "esriJobWaiting"
    });

    Job.submitJob({
      ...submitOptions,
      startMonitoring: false,
      pollingRate: 100
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(jobInfoUrl, jobInfoWithResults);

          fetchMock.mock(`${jobInfoUrl}/results/hotspot_raster`, {
            error: {
              code: 400,
              message: "unable to retrieve results for hotspot_raster",
              details: []
            }
          });
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
    const { submitOptions, jobInfoUrl, jobSubmitUrl, jobId } = createJobMocks(
      "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT_ID",
      "GET_RESULTS_WAITING_FOR_COMPLETION_TIMED_OUT_SERVICE"
    );

    fetchMock.once(jobSubmitUrl, {
      jobId,
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(jobInfoUrl, {
      jobId,
      jobStatus: "esriJobWaiting"
    });

    Job.submitJob({
      ...submitOptions
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();
          fetchMock.mock(jobInfoUrl, {
            jobId,
            jobStatus: "esriJobTimedOut"
          });
        });

        return job.getResult("Hotspot_Raster");
      })
      .then(() => {
        fail("Should throw an error");
        done();
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.jobInfo.id).toEqual(jobId);
        expect(error.status).toEqual(JOB_STATUSES.TimedOut);
        done();
      });
  });

  it("it gets the results however it returns a cancelled status", (done) => {
    const { submitOptions, jobInfoUrl, jobSubmitUrl, jobId } = createJobMocks(
      "CANCELATION_TEST_JOB_ID",
      "CANCELATION_TEST_SERVICE"
    );

    fetchMock.mock(jobSubmitUrl, {
      jobId,
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(jobInfoUrl, {
      jobId,
      jobStatus: "esriJobWaiting"
    });

    Job.submitJob({
      ...submitOptions
    })
      .then((job) => {
        job.once(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(jobInfoUrl, {
            jobId: "CANCELATION_TEST_JOB_ID",
            jobStatus: "esriJobCancelled"
          });
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
        expect(error.jobInfo.id).toEqual(jobId);
        expect(error.status).toEqual(JOB_STATUSES.Cancelled);
        done();
      });
  });

  it("it gets the results however it returns a failed status", (done) => {
    const { submitOptions, jobInfoUrl, jobSubmitUrl, jobId } = createJobMocks(
      "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_TEST",
      "GET_RESULTS_WAITING_FOR_COMPLETION_FAILED_SERVICE"
    );

    fetchMock.mock(jobSubmitUrl, {
      jobId,
      jobStatus: "esriJobSubmitted"
    });

    fetchMock.mock(jobInfoUrl, {
      jobId,
      jobStatus: "esriJobWaiting"
    });

    Job.submitJob({
      ...submitOptions
    })
      .then((job) => {
        job.on(JOB_STATUSES.Waiting, () => {
          fetchMock.restore();

          fetchMock.mock(jobInfoUrl, {
            jobId,
            jobStatus: "esriJobFailed"
          });
        });
        return job.getResult("Hotspot_Raster");
      })
      .then(() => {
        fail("Should throw an error.");
        done();
      })
      .catch((error) => {
        expect(error.name).toEqual("ArcGISJobError");
        expect(error.jobInfo.id).toEqual(jobId);
        expect(error.status).toEqual(JOB_STATUSES.Failed);
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
    const { submitOptions, jobInfoUrl, jobSubmitUrl, jobSubmittedResponse } =
      createJobMocks(
        "SERIALIZE_DESERIALIZE_TEST",
        "SERIALIZE_DESERIALIZE_SERVICE"
      );
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.mock(jobInfoUrl, mockAllResults);

    Job.submitJob(submitOptions).then((job) => {
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
    const {
      submitOptions,
      jobInfoUrl,
      jobSubmitUrl,
      jobId,
      jobSubmittedResponse
    } = createJobMocks("CANCEL_JOB_TEST", "CANCEL_JOB_SERVICE");
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, {
      jobStatus: "esriJobExecuting"
    });

    fetchMock.once(`${jobInfoUrl}/cancel`, mockCancelledState);

    Job.submitJob(submitOptions).then((job) => {
      job.cancelJob().then(() => {
        job.on(JOB_STATUSES.Cancelled, (result) => {
          expect(result.id).toEqual(jobId);
          expect(result.status).toEqual(JOB_STATUSES.Cancelled);
        });
        done();
      });
      (job as any).executePoll();
    });
  });
});
