import fetchMock from "fetch-mock";
import { GeoprocessingJob } from "../../src/index";
import {
  GPJobIdResponse,
  GPEndpointCall,
  mockResults,
  mockHotspot_Raster
} from "./mock-fetches";

import { EsriJobFailed } from "./errors";

describe("GeoprocessingJob Class", () => {
  describe("createJob", () => {
    it("should return a jobId", () => {
      fetchMock.mock("*", GPJobIdResponse);
      fetchMock.once("*", GPEndpointCall);
      GeoprocessingJob.createJob(GPEndpointCall).then((job) => {
        expect(job.jobId).toEqual(GPJobIdResponse.jobId);
      });
    });
    it("should trigger startEventMonitioring", () => {
      fetchMock.once("*", { jobStatus: "esriJobSubmitted" });
      fetchMock.once("*", { jobStatus: "esriJobExecuting" });
      fetchMock.once("*", { jobStatus: "esriJobSucceeded" });
      fetchMock.once("*", mockResults);
      fetchMock.once("*", GPEndpointCall);

      GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
        response.emitter.on("submitted", (result: any) =>
          expect(result).toEqual({ jobStatus: "esriJobSubmitted" })
        );
        response.emitter.on("executed", (result: any) =>
          expect(result).toEqual({ jobStatus: "esriJobExecuting" })
        );
        response.emitter.on("succeeded", (result: any) =>
          expect(result).toEqual({ jobStatus: "esriJobSucceeded" })
        );
      });
    });
    it("should return results once status is succeeded", () => {
      fetchMock.once("*", mockResults);
      fetchMock.once("*", GPEndpointCall);
      GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
        response.startEventMonitoring();
        response.emitter.on("succeeded", (results: any) =>
          expect(results).toEqual(mockResults)
        );
      });
    });
    it("should get specific result property from results", () => {
      fetchMock.once("*", mockHotspot_Raster);
      fetchMock.once("*", mockResults);
      fetchMock.once("*", GPEndpointCall);

      GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
        response.emitter.on("succeeded", () => {
          response
            .getResults("Hotspot_Raster")
            .then((results) => expect(results).toEqual(mockHotspot_Raster));
        });
      });
    });
    it("should get a failure message from the endpoint", () => {
      fetchMock.once("*", mockHotspot_Raster);
      fetchMock.once("*", mockResults);
      fetchMock.once("*", EsriJobFailed);
      fetchMock.once("*", GPEndpointCall);

      GeoprocessingJob.createJob(GPEndpointCall).then((response) => {
        response.emitter.on("failed", (error: any) => expect(error).toEqual(EsriJobFailed));
      });
    });
  });
});
