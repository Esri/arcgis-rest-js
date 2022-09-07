import { inviteGroupUsers } from "@esri/arcgis-rest-portal";
import { resolve } from "dns";
import fetchMock, { done, mock } from "fetch-mock";
import { Job, JOB_STATUSES, ArcGISRequestError } from "../src/index.js";
import {
  GPJobIdResponse,
  GPEndpointCall,
  GPJobInfoWithResults,
  mockHotspot_Raster,
  failedState,
  mockCancelledState,
  mockAllResultsRequest,
  mockAllResults,
} from "./mocks/job-mock-fetches.js";

describe("Job Class", () => {
  afterEach(fetchMock.restore);

  describe("createJob", () => {
    it("should return a jobId", () => {
      fetchMock.mock("*", GPJobIdResponse);
      fetchMock.once("*", GPEndpointCall);
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
        { jobStatus: "esriJobExecuting" }
      );

      // 3. submit the job, this will get the response from #1.
      Job.submitJob(GPEndpointCall).then((job) => {
        // 4. listen for the executing event, this will fire when we fake polling
        job.on(JOB_STATUSES.Executing, (result: any) => {
          // 7. this executes once the event from the fake poll in step 6 happens.
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
    it("should get specific result property from results and get all results", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        mockAllResults
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_unassigned_stops",
        {
          paramName: 'out_unassigned_stops',
          dataType: 'GPRecordSet',
          value: {
            displayFieldName: '',
            fields: [Array],
            features: [] as any,
            exceededTransferLimit: false
          }
        }
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_stops",

        {
          paramName: 'out_stops',
          dataType: 'GPRecordSet',
          value: {
            displayFieldName: '',
            fields: [Array],
            features: [Array],
            exceededTransferLimit: false
          }
        }
      );
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_routes",
        {
          paramName: 'out_routes',
          dataType: 'GPFeatureRecordSetLayer',
          value: {
            displayFieldName: '',
            geometryType: 'esriGeometryPolyline',
            spatialReference: [Object],
            fields: [Array],
            features: [Array],
            exceededTransferLimit: false
          }
        }
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        mockAllResultsRequest
      );


      Job.submitJob({ ...GPEndpointCall, startMonitoring: false }).then((job) => {

        job.getAllResults().then(results => {
          expect(results).toEqual(mockAllResultsRequest)
          done();
        });

      });
    });
    it("should just do a getResults for one paramName", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        mockAllResults
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/out_unassigned_stops",
        {
          paramName: 'out_unassigned_stops',
          dataType: 'GPRecordSet',
          value: {
            displayFieldName: '',
            fields: ["1", "2", "3"],
            features: [] as any,
            exceededTransferLimit: false
          }
        }
      );
      Job.submitJob({ ...GPEndpointCall, startMonitoring: false }).then((job) => {

        job.getResults("out_unassigned_stops").then(results => {
          console.log(results);
          expect(results).toEqual({
            paramName: 'out_unassigned_stops',
            dataType: 'GPRecordSet',
            value: {
              displayFieldName: '',
              fields: ["1", "2", "3"],
              features: [] as any,
              exceededTransferLimit: false
            }
          });
          done();
        });

      });
    });
    it("should call waitForCompletion get a timeout status and reject the job results promise", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);
      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        {
          jobId: "j4fa1db2338f042a19eb68856afabc27e",
          jobStatus: "esriJobTimeOut"
        }
      );
      Job.submitJob({ ...GPEndpointCall, startMonitoring: false }).then((job) => {
        job.waitForJobCompletion()
          .then((res) => {
            done();
          }, function (error) {
            expect(error).toEqual({
              jobId: "j4fa1db2338f042a19eb68856afabc27e",
              jobStatus: "esriJobTimeOut"
            });
            done();
          }
          );

      });
    });

    it("call method fromExistingJob", () => {

      const fromExisting = Job.fromExistingJob({
        id: "j4fa1db2338f042a19eb68856afabc27e",
        url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/submitJob",
        params: {
          Query: `"DATE" > date '1998-01-01 00:00:00' AND "DATE" < date '1998-01-31 00:00:00') AND ("Day" = 'SUN' OR "Day"= 'SAT')
        `
        },
        startMonitoring: true,
        pollingRate: 5000
      });

      expect(fromExisting).toEqual(fromExisting);
    });
    it("should get a failed state after submitting jobId for the results", (done) => {
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
        job.on(JOB_STATUSES.New, (result: any) => {
          expect(result).toEqual({ jobStatus: "esriJobNew" });

          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobWaiting" }
          );

          (job as any).executePoll();
        });

        job.on(JOB_STATUSES.Waiting, (result: any) => {
          expect(result).toEqual({ jobStatus: "esriJobWaiting" });
          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobSubmitted" }
          );
          (job as any).executePoll();
        });

        job.on(JOB_STATUSES.Submitted, (result: any) => {

          expect(result).toEqual({ jobStatus: "esriJobSubmitted" });

          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobTimedOut" });

          (job as any).executePoll();
        });
        job.on(JOB_STATUSES.TimedOut, (result: any) => {
          expect(result).toEqual({ jobStatus: "esriJobTimedOut" });
          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "expectedFailure" });


          (job as any).executePoll();
        });

        job.on(JOB_STATUSES.Failure, (result: any) => {
          expect(result).toEqual({ jobStatus: "expectedFailure" });
          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobFailed" });

          (job as any).executePoll();
        });

        job.on(JOB_STATUSES.Failed, (result: any) => {
          expect(result).toEqual({ jobStatus: "esriJobFailed" });

            done();
        });

        (job as any).executePoll(); // fake a polling request
      });
    });
    fit("should call off method", (done) => {
      fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        { jobStatus: "esriJobWaiting" }
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        { jobStatus: "esriJobExecuting" }
      );

      fetchMock.once(
        "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
        { jobStatus: "esriJobSucceeded" }
      );

      Job.submitJob(GPEndpointCall).then((job) => {
        job.on(JOB_STATUSES.Success, (result: any) => {
          expect(job.emitter.all.get(JOB_STATUSES.Success)).toBeTruthy();

          fetchMock.once(
            "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
            { jobStatus: "esriJobFailed" }
          );

          (job as any).executePoll();
        });

        job.off(JOB_STATUSES.Failed  , (result: any) => {
          expect(job.emitter.all.get(JOB_STATUSES.Failed)).toBeFalsy();

          done();
        });

        (job as any).executePoll();
        
      });
    })
      it("create a new job with a cancelled and cancelling state", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          { jobStatus: "esriJobSubmitted" }
        );

        Job.submitJob(GPEndpointCall).then((job) => {
          job.on(JOB_STATUSES.Submitted, (result: any) => {
            expect(result).toEqual({ jobStatus: "esriJobSubmitted" });

            fetchMock.once(
              "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
              { jobStatus: "esriJobCancelling" }
            );

            (job as any).executePoll();
          });

          job.on(JOB_STATUSES.Cancelling, (result: any) => {
            expect(result).toEqual({ jobStatus: "esriJobCancelling" });
            fetchMock.once(
              "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
              { jobStatus: "esriJobCancelled" }
            );
            (job as any).executePoll();
          });

          job.on(JOB_STATUSES.Cancelled, (result: any) => {

            expect(result).toEqual({ jobStatus: "esriJobCancelled" });

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

      it("it gets the results however we wait for the job to succeeded them show the results ", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          GPJobInfoWithResults
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/hotspot_raster",
          mockHotspot_Raster
        );

        Job.submitJob({ ...GPEndpointCall, startMonitoring: false, pollingRate: 10 }).then((job) => {
          job.getResults("Hotspot_Raster").then(result => {

            expect(result).toEqual(mockHotspot_Raster)

            done();
          })
        });
      });

      it("it gets the results however we wait for the job to succeeded but the results return an error ", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          GPJobInfoWithResults
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e/results/hotspot_raster",
          {
            error: {
              code: 400,
              message: "unable to retrieve results for hotspot_raster",
              details: []
            }
          }
        );

        Job.submitJob({ ...GPEndpointCall, startMonitoring: false, pollingRate: 10 }).then((job) => {
          job.getResults("Hotspot_Raster").catch((result: any) => {
            expect(new ArcGISRequestError(result) instanceof Error).toBe(true);
            done();
          });
        });
      });
      it("it gets the results however it returns a timed out status", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );


        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobTimedOut"
          }
        );

        Job.submitJob({ ...GPEndpointCall, startMonitoring: false, pollingRate: 10 }).then((job) => {
          job.getResults("Hotspot_Raster").catch(error => {
            expect(error).toEqual({
              jobId: "j4fa1db2338f042a19eb68856afabc27e",
              jobStatus: "esriJobTimedOut"
            })
            done();
          })
        });
      });
      it("it gets the results however it returns a cancelled status", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );


        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobCancelled"
          }
        );

        Job.submitJob({ ...GPEndpointCall, startMonitoring: false, pollingRate: 10 }).then((job) => {
          job.getResults("Hotspot_Raster").catch(error => {
            expect(error).toEqual({
              jobId: "j4fa1db2338f042a19eb68856afabc27e",
              jobStatus: "esriJobCancelled"
            })
            done();
          })
        });
      });

      it("it gets the results however it returns a failed status", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );


        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobWaiting"
          }
        );

        fetchMock.once(
          "https://sampleserver6.arcgisonline.com/arcgis/rest/services/911CallsHotspot/GPServer/911%20Calls%20Hotspot/jobs/j4fa1db2338f042a19eb68856afabc27e",
          {
            jobId: "j4fa1db2338f042a19eb68856afabc27e",
            jobStatus: "esriJobFailed"
          }
        );

        Job.submitJob({ ...GPEndpointCall, startMonitoring: false, pollingRate: 10 }).then((job) => {
          job.getResults("Hotspot_Raster").catch(error => {
            expect(error).toEqual({
              jobId: "j4fa1db2338f042a19eb68856afabc27e",
              jobStatus: "esriJobFailed"
            })
            done();
          })
        });
      });
      it("makes sure to get isMonitoring function", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        Job.submitJob(GPEndpointCall).then((job) => {
          expect(job.isMonitoring).toEqual(true);
          done();
        });
      })
      it("calls toJSON, serialize and deserialize methods", (done) => {
        fetchMock.once(GPEndpointCall.url, GPJobIdResponse);

        Job.submitJob(GPEndpointCall).then((job) => {
          const json = job.toJSON();
          expect(json).toEqual(json);

          const serialized = job.serialize()
          expect(serialized).toEqual(serialized);
          const deserialized = Job.deserialize(serialized);
          expect(deserialized).toEqual(deserialized);


          done();
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
            job.on(JOB_STATUSES.Cancelled, result => {
              expect(result).toEqual(mockCancelledState);
            })
            done();
          });
          (job as any).executePoll();
        });

      });
    });
  });

