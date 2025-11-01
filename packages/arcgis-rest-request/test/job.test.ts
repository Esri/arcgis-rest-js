import { describe, test, expect, beforeEach, vi } from "vitest";
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

  test("should return a jobId", async () => {
    const { submitOptions, jobSubmittedResponse } = createJobMocks(
      "basicJobId",
      "basicServiceName"
    );

    fetchMock.mock("*", jobSubmittedResponse);

    const job = await Job.submitJob(submitOptions);
    expect(job.id).toEqual(jobSubmittedResponse.jobId);
  });

  test("should trigger events when polling", async () => {
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
    const job = await Job.submitJob(submitOptions);

    await new Promise<void>((resolve) => {
      // 4. listen for the executing event, this will fire when we fake polling
      job.on(JOB_STATUSES.Executing, (jobInfo) => {
        // 7. this executes once the event from the fake poll in step 6 happens.
        expect(jobInfo.status).toEqual(JOB_STATUSES.Executing);
        expect(jobInfo.id).toEqual(jobId);

        // 8. Now we want to tell fetch mock how to respond to the next fake polling request
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

      // 5. listen for the succeeded event, this will happen AFTER we setup the request in the executing listener
      job.on(JOB_STATUSES.Success, (jobInfo) => {
        // 10. this happens after the fake polling request in step 9.
        expect(jobInfo.status).toEqual(JOB_STATUSES.Success);
        expect(jobInfo.id).toEqual(jobId);

        // 11. resolve the promise to finish the test
        resolve();
      });

      // 6. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
      (job as any).executePoll(); // fake a polling request
    });
  });

  test("should return results once status is succeeded", async () => {
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
    const job = await Job.submitJob(submitOptions);

    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Success, (jobInfo) => {
        // 3. this happens after the fake polling request in step 2.
        expect(jobInfo.id).toEqual(jobId);
        expect(jobInfo.status).toEqual(JOB_STATUSES.Success);
        expect(jobInfo.results).toEqual(jobInfoWithResults.results);

        // 4. resolve the promise to finish the test
        resolve();
      });

      // 2. fake a loop of the poll this will trigger a single response as opposed to MANY from setInterval
      (job as any).executePoll(); // fake a polling request
    });
  });

  test("should get specific result property from results and get all results", async () => {
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

    const job = await Job.submitJob({
      ...submitOptions,
      startMonitoring: false
    });
    const results = await job.getAllResults();
    expect(results).toEqual(mockAllResultsRequest);
  });

  test("should just do a getResult for one paramName", async () => {
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

    const job = await Job.submitJob(submitOptions);
    const results = await job.getResult("out_unassigned_stops");
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

  test("should call waitForCompletion get a timeout status and reject the job results promise", async () => {
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

    const job = await Job.submitJob({
      ...submitOptions,
      startMonitoring: false
    });
    await expect(job.waitForCompletion()).rejects.toMatchObject({
      name: "ArcGISJobError",
      status: JOB_STATUSES.TimedOut,
      jobInfo: expect.objectContaining({ id: jobId })
    });
  });

  describe("should cover waitForCompletion errors when non-terminal state transiently fails, such as when job status transitions from Waiting to TimedOut, Failed, or Cancelled", () => {
    test("waitForCompletion: should reject with Error when Cancelled event listener is triggered", async () => {
      const {
        submitOptions,
        jobSubmittedResponse,
        jobInfoUrl,
        jobSubmitUrl,
        jobId
      } = createJobMocks(
        "waitForCompletionCancelled",
        "waitForCompletionCancelledServiceName"
      );

      fetchMock.once(jobSubmitUrl, jobSubmittedResponse);
      // Start with a non-terminal (waiting) status
      fetchMock.once(jobInfoUrl, { jobId, jobStatus: "esriJobWaiting" });

      const job = await Job.submitJob({
        ...submitOptions,
        startMonitoring: false
      });

      const promise = job.waitForCompletion();
      setTimeout(() => {
        fetchMock.once(
          jobInfoUrl,
          { jobId, jobStatus: "esriJobCancelled" },
          { overwriteRoutes: true }
        );
        (job as any).executePoll();
      }, 10);

      await expect(promise).rejects.toMatchObject({
        name: "ArcGISJobError",
        status: JOB_STATUSES.Cancelled,
        jobInfo: expect.objectContaining({ id: jobId })
      });
    });

    test("waitForCompletion: should reject with Error when TimedOut event listener is triggered", async () => {
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
      fetchMock.once(jobInfoUrl, { jobId, jobStatus: "esriJobWaiting" });

      const job = await Job.submitJob({
        ...submitOptions,
        startMonitoring: false
      });

      const promise = job.waitForCompletion();
      setTimeout(() => {
        fetchMock.once(
          jobInfoUrl,
          { jobId, jobStatus: "esriJobTimedOut" },
          { overwriteRoutes: true }
        );
        (job as any).executePoll();
      }, 10);

      await expect(promise).rejects.toMatchObject({
        name: "ArcGISJobError",
        status: JOB_STATUSES.TimedOut,
        jobInfo: expect.objectContaining({ id: jobId })
      });
    });

    test("waitForCompletion: should reject with Error when Failed event listener is triggered", async () => {
      const {
        submitOptions,
        jobSubmittedResponse,
        jobInfoUrl,
        jobSubmitUrl,
        jobId
      } = createJobMocks(
        "waitForCompletionFailed",
        "waitForCompletionFailedServiceName"
      );

      fetchMock.once(jobSubmitUrl, jobSubmittedResponse);
      fetchMock.once(jobInfoUrl, { jobId, jobStatus: "esriJobWaiting" });

      const job = await Job.submitJob({
        ...submitOptions,
        startMonitoring: false
      });

      const promise = job.waitForCompletion();
      setTimeout(() => {
        fetchMock.once(
          jobInfoUrl,
          { jobId, jobStatus: "esriJobFailed" },
          { overwriteRoutes: true }
        );
        (job as any).executePoll();
      }, 10);

      await expect(promise).rejects.toMatchObject({
        name: "ArcGISJobError",
        status: JOB_STATUSES.Failed,
        jobInfo: expect.objectContaining({ id: jobId })
      });
    });
  });

  test("call method fromExistingJob", async () => {
    const { jobInfoWithAllResults, jobId, jobSubmitUrl, jobInfoUrl } =
      createJobMocks("fromExistingJobId", "fromExistingJobServiceName");
    fetchMock.once(jobInfoUrl, jobInfoWithAllResults);

    const job = await Job.fromExistingJob({
      id: jobId,
      url: jobSubmitUrl
    });
    expect(job instanceof Job).toBe(true);
    expect(job.id).toEqual(jobInfoWithAllResults.jobId);
  });

  test("should get a failed state after submitting jobId for the results", async () => {
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

    const job = await Job.submitJob(submitOptions);
    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Failed, (result) => {
        expect(result.status).toEqual(JOB_STATUSES.Failed);
        expect(result.id).toEqual(jobId);
        resolve();
      });

      job.stopEventMonitoring();
      (job as any).executePoll();
    });
  });

  test("create a new job and fire the new, submitted, waiting, and time-out states", async () => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobInfoUrl,
      jobSubmitUrl,
      jobId
    } = createJobMocks("allEventsJobId", "allEventsServiceName");
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.once(jobInfoUrl, { jobStatus: "esriJobNew" });

    const job = await Job.submitJob(submitOptions);
    await new Promise<void>((resolve) => {
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
        resolve();
      });

      (job as any).executePoll(); // fake a polling request
    });
  });

  test("should test if the polling rate has changed", async () => {
    const { submitOptions, jobSubmittedResponse, jobSubmitUrl } =
      createJobMocks("pollingRateJobId", "pollingRateServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    const job = await Job.submitJob(submitOptions);
    job.pollingRate = 5000;
    expect(job.pollingRate).toBe(5000);
    job.pollingRate = 1000;
    expect(job.pollingRate).toBe(1000);
    job.stopEventMonitoring();
    job.startEventMonitoring();
    expect(job.pollingRate).toBe(2000);
  });

  test("should call off method", async () => {
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

    const job = await Job.submitJob(submitOptions);
    const handler = (results: any) => results;

    job.on(JOB_STATUSES.Success, handler);
    job.off(JOB_STATUSES.Success, handler);
    expect((job as any).emitter.all.get(JOB_STATUSES.Success).length).toBe(0);

    job.once(JOB_STATUSES.Success, handler);
    job.off(JOB_STATUSES.Success, handler);
    expect((job as any).emitter.all.get(JOB_STATUSES.Success).length).toBe(0);

    job.stopEventMonitoring();
  });

  test("create a new job with a cancelled and cancelling state", async () => {
    const {
      submitOptions,
      jobSubmittedResponse,
      jobSubmitUrl,
      jobInfoUrl,
      jobId
    } = createJobMocks("cancelJobId", "cancelServiceName");

    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);
    fetchMock.once(jobInfoUrl, { jobStatus: "esriJobSubmitted" });

    const job = await Job.submitJob(submitOptions);

    await new Promise<void>((resolve) => {
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
        resolve();
      });

      (job as any).executePoll();
    });
  });

  test("submits a job and response returns an error from the results", async () => {
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

    const job = await Job.submitJob(submitOptions);
    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Error, (result: any) => {
        expect(new ArcGISRequestError(result) instanceof Error).toBe(true);
        resolve();
      });
      (job as any).executePoll();
    });
  });

  test("it gets the results however we wait for the job to succeeded then show the results", async () => {
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

    const job = await Job.submitJob({ ...submitOptions });
    expect(job.id).toEqual(jobId);
    const result = await job.getResult("Hotspot_Raster");
    expect(result).toEqual(mockHotspot_Raster);
  });

  test("it gets the results however we wait for the job to succeeded but the results return an error", async () => {
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

    const job = await Job.submitJob({
      ...submitOptions,
      startMonitoring: false,
      pollingRate: 100
    });

    await new Promise<void>((resolve) => {
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
        resolve();
      });
      (job as any).executePoll();
    });

    await expect(job.getResult("Hotspot_Raster")).rejects.toBeInstanceOf(Error);
  });

  test("it gets the results however it returns a timed out status", async () => {
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

    const job = await Job.submitJob({ ...submitOptions });

    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Waiting, () => {
        fetchMock.restore();
        fetchMock.mock(jobInfoUrl, {
          jobId,
          jobStatus: "esriJobTimedOut"
        });
        resolve();
      });
      (job as any).executePoll();
    });

    await expect(job.getResult("Hotspot_Raster")).rejects.toMatchObject({
      name: "ArcGISJobError",
      jobInfo: expect.objectContaining({ id: jobId }),
      status: JOB_STATUSES.TimedOut
    });
  });

  test("it gets the results however it returns a cancelled status", async () => {
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

    const job = await Job.submitJob({ ...submitOptions });

    await new Promise<void>((resolve) => {
      job.once(JOB_STATUSES.Waiting, () => {
        fetchMock.restore();
        fetchMock.mock(jobInfoUrl, {
          jobId: "CANCELATION_TEST_JOB_ID",
          jobStatus: "esriJobCancelled"
        });
        resolve();
      });
      (job as any).executePoll();
    });

    await expect(job.getResult("Hotspot_Raster")).rejects.toMatchObject({
      name: "ArcGISJobError",
      jobInfo: expect.objectContaining({ id: jobId }),
      status: JOB_STATUSES.Cancelled
    });
  });

  test("it gets the results however it returns a failed status", async () => {
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

    const job = await Job.submitJob({ ...submitOptions });

    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Waiting, () => {
        fetchMock.restore();
        fetchMock.mock(jobInfoUrl, {
          jobId,
          jobStatus: "esriJobFailed"
        });
        resolve();
      });
      (job as any).executePoll();
    });

    await expect(job.getResult("Hotspot_Raster")).rejects.toMatchObject({
      name: "ArcGISJobError",
      jobInfo: expect.objectContaining({ id: jobId }),
      status: JOB_STATUSES.Failed
    });
  });

  test("parses params if there is multi-value input", () => {
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

  test("calls toJSON, serialize and deserialize methods", async () => {
    const { submitOptions, jobInfoUrl, jobSubmitUrl, jobSubmittedResponse } =
      createJobMocks(
        "SERIALIZE_DESERIALIZE_TEST",
        "SERIALIZE_DESERIALIZE_SERVICE"
      );
    fetchMock.once(jobSubmitUrl, jobSubmittedResponse);

    fetchMock.mock(jobInfoUrl, mockAllResults);

    const job = await Job.submitJob(submitOptions);
    const json = job.toJSON();
    expect(json).toEqual(json);

    const serialized = job.serialize();
    expect(serialized).toEqual(serialized);

    const deserializedJob = await Job.deserialize(serialized);
    expect(deserializedJob.id).toEqual(json.id);
  });

  test("cancels a job", async () => {
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

    const job = await Job.submitJob(submitOptions);
    await job.cancelJob();
    (job as any).executePoll();

    await new Promise<void>((resolve) => {
      job.on(JOB_STATUSES.Cancelled, (result) => {
        expect(result.id).toEqual(jobId);
        expect(result.status).toEqual(JOB_STATUSES.Cancelled);
      });
      resolve();
    });
  });
});
