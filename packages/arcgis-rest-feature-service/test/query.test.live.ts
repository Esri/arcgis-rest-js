import fetchMock from "fetch-mock";
import { describe, afterEach, test, expect } from "vitest";
import {
  IQueryAllFeaturesOptions,
  IQueryFeaturesOptions,
  queryAllFeatures,
  queryFeatures
} from "../src/index.js";
import {
  ApiKeyManager,
  ArcGISAuthError,
  ArcGISJobError
} from "@esri/arcgis-rest-request";

describe("queryFeatures() and queryAllFeatures() live tests", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("queryFeatures()", () => {
    describe("with pbf-as-geojson", () => {
      // LIVE TEST: should decode a valid pbf-as-geojson response from public server without api key without fetchmock
      test("LIVE TEST (valid): should decode valid pbf as geojson from arrayBuffer without fetchmock", async () => {
        const testPublicFeatureServer: IQueryFeaturesOptions = {
          url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
          f: "pbf-as-geojson",
          objectIds: [49481],
          outFields: [
            "B12001_calc_numDivorcedE",
            "B12001_calc_numMarriedE",
            "B12001_calc_numNeverE",
            "B12001_calc_pctMarriedE",
            "County",
            "NAME",
            "OBJECTID"
          ],
          outSR: "102100",
          returnGeometry: false,
          spatialRel: "esriSpatialRelIntersects",
          where: "1=1"
        };

        const response = await queryFeatures(testPublicFeatureServer);

        expect((response as any).features.length).toBe(1);
        expect((response as any).features[0].properties.OBJECTID).toBe(49481);
        expect((response as any).features[0].properties.County).toBe(
          "Nassau County"
        );
        expect((response as any).features[0].id).toBe(49481);
      });

      // LIVE TEST W/Fetchmock: should decode a live pbf-as-geojson response when parsed and run through fetchmock for feature parity
      test("LIVE TEST w/fetch-mock (valid): should decode a live url pbf response when passed through fetchmock", async () => {
        // make live request for raw pbf data
        const testPublicFeatureServerUrl =
          "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2/query?f=pbf&objectIds=49481&outFields=B12001_calc_numDivorcedE%2CB12001_calc_numMarriedE%2CB12001_calc_numNeverE%2CB12001_calc_pctMarriedE%2CCounty%2CNAME%2COBJECTID&outSR=102100&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=1%3D1";

        const livePbfResponse = await fetch(testPublicFeatureServerUrl);

        fetchMock.once(
          "*",
          {
            status: 200,
            headers: { "content-type": "application/x-protobuf" },
            body: await livePbfResponse.arrayBuffer()
          },
          {
            sendAsJson: false
          }
        );

        const testPublicFeatureServer: IQueryFeaturesOptions = {
          url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Marital_Status_Boundaries/FeatureServer/2",
          f: "pbf-as-geojson",
          objectIds: [49481],
          outFields: [
            "B12001_calc_numDivorcedE",
            "B12001_calc_numMarriedE",
            "B12001_calc_numNeverE",
            "B12001_calc_pctMarriedE",
            "County",
            "NAME",
            "OBJECTID"
          ],
          outSR: "102100",
          returnGeometry: false,
          spatialRel: "esriSpatialRelIntersects",
          where: "1=1"
        };

        const response = await queryFeatures(testPublicFeatureServer);

        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(options.method).toBe("GET");
        expect((response as any).features.length).toBe(1);
        expect((response as any).features[0].properties.OBJECTID).toBe(49481);
        expect((response as any).features[0].properties.County).toBe(
          "Nassau County"
        );
        expect((response as any).features[0].id).toBe(49481);
      });

      // LIVE TEST: should handle live pbf-as-geojson response with geometries (testing authenticated response requires api key for live testing)
      test("LIVE TEST (valid): should return live pbf-as-geojson response with geometries", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects"
        };

        const response = await queryFeatures(docsPbfOptions);
        console.log(response);
      });

      test("LIVE TEST w/fetch-mock (valid): should return live pbf-as-geojson response with geometries when passed through fetchmock", async () => {
        const docsPbfUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
        const livePbfResponse = await fetch(docsPbfUrl);
        fetchMock.once(
          "*",
          {
            status: 200,
            headers: livePbfResponse.headers,
            body: await livePbfResponse.arrayBuffer()
          },
          {
            sendAsJson: false
          }
        );

        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects"
        };
        const response = await queryFeatures(docsPbfOptions);

        expect(fetchMock.called()).toBeTruthy();
        const [url, options] = fetchMock.lastCall("*");
        expect(options.method).toBe("GET");
        expect((response as any).features.length).toBe(3);
        expect((response as any).features[0].geometry).toHaveProperty("type");
        expect((response as any).features[0].geometry).toHaveProperty(
          "coordinates"
        );
      });

      // TODO: will want to return an ArcGIS Request Error from the request instead of letting the error fall through from the decoder
      test("LIVE TEST (invalid): should throw an error when pbf-as-geojson fails to decode", async () => {
        const docsPbfUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
        const livePbfResponse = await fetch(docsPbfUrl);
        fetchMock.once(
          "*",
          {
            status: 200,
            headers: livePbfResponse.headers,
            body: await livePbfResponse.blob()
          },
          {
            sendAsJson: false
          }
        );

        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects"
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          // right now this gets a fall-through error from the decoder library, but should probably be a request error.
          expect(error).toBeInstanceOf(Error);
          expect((error as any).message).toContain(
            "500: Error decoding PBF response"
          );
        }
      });

      // LIVE TEST: should handle live pbf response for unauthenticated pbf-as-geojson requests
      test("LIVE TEST (UNAUTHENTICATED): should return json response for unauthenticated pbf-as-geojson requests without fetchmock", async () => {
        const docsPbfUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";

        const badApiKey = "BAD_API_KEY";
        const docsUrlPbfWithBadKey = `${docsPbfUrl}&token=${badApiKey}`;
        const liveJsonErrorResponse = await fetch(docsUrlPbfWithBadKey);
        expect(liveJsonErrorResponse.status).toBe(200);
        expect(liveJsonErrorResponse.headers.get("content-type")).toBe(
          "application/json; charset=utf-8"
        );
        const errorJson = await liveJsonErrorResponse.json();
        expect(errorJson.error.code).toBe(498);
        expect(errorJson.error.message).toBe("Invalid token.");

        // set up options for live request through query features
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects",
          authentication: ApiKeyManager.fromKey(badApiKey)
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISAuthError);
          expect((error as any).message).toBe("498: Invalid token.");
        }
        // await expect(queryFeatures(docsPbfOptions)).rejects.toThrowError(ArcGISAuthError);
      });

      test("LIVE TEST (UNAUTHENTICATED) w/fetchmock: should return json response through fetchmock for unauthenticated pbf-as-geojson requests", async () => {
        const docsPbfUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";

        const badApiKey = "BAD_API_KEY";
        const docsUrlPbfWithBadKey = `${docsPbfUrl}&token=${badApiKey}`;
        const livePbfResponse = await fetch(docsUrlPbfWithBadKey);

        expect(livePbfResponse.headers.get("content-type")).toBe(
          "application/json; charset=utf-8"
        );

        fetchMock.once("*", {
          status: 200,
          headers: livePbfResponse.headers,
          body: await livePbfResponse.json()
        });

        // deconstruct docsPBFurl to query features options object
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects",
          authentication: ApiKeyManager.fromKey(badApiKey)
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISJobError);
          expect((error as any).message).toBe("498: Invalid token.");
        }
      });
    });

    describe("with pbf-as-arcgis", () => {
      test("LIVE TEST (valid): should fetch live pbf-as-arcgis json (convert pbf buffer to geojson to arcgis)", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-arcgis",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          geometry: {
            xmin: -13193261,
            ymin: 4028181.6,
            xmax: -13185072.9,
            ymax: 4035576.6,
            spatialReference: { wkid: 101200 }
          },
          geometryType: "esriGeometryEnvelope",
          spatialRel: "esriSpatialRelIntersects"
        };

        const response = await queryFeatures(docsPbfOptions);

        expect((response as any).features.length).toBe(3);
        expect((response as any).features[0]).toHaveProperty("attributes");
        expect((response as any).features[0]).toHaveProperty("geometry");
      });
    });
  });

  describe("queryAllFeatures()", () => {
    describe("with pbf-as-geojson", () => {
      test(
        "LIVE TEST LONG QUERY: should query all features as geojson objects under the maxRecordCount limit",
        { timeout: 10000 },
        async () => {
          // api key not necessary if we remove authentication from queryAllFeatures to mack queryFeatures functionality
          const apikey = `USE_API_KEY`;
          const docsPbfOptions: IQueryAllFeaturesOptions = {
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
            f: "json",
            authentication: ApiKeyManager.fromKey(apikey)
          };

          try {
            const response = await queryAllFeatures(docsPbfOptions);
          } catch (error) {
            console.error("Error querying docsPbfOptions:", error);
          }
        }
      );

      test("LIVE TEST: should query all features as geojson objects under the maxRecordCount limit", async () => {
        const apikey = `GOOD_API_KEY`;

        const docsPbfOptions: IQueryAllFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson"
        };

        const docsPbfUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=23400&resultRecordCount=2000&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";
        const docsJsonUrl =
          "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=json&where=1%3D1&outFields=*&resultOffset=23400&resultRecordCount=2000&geometry=%7B%22xmin%22%3A-13193261%2C%22ymin%22%3A4028181.6%2C%22xmax%22%3A-13185072.9%2C%22ymax%22%3A4035576.6%2C%22spatialReference%22%3A%7B%22wkid%22%3A101200%7D%7D&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects";

        let response = await fetch(docsPbfUrl);
        let json = await fetch(docsJsonUrl);
        let jsonData = await json.json();
        //console.log("jsonData", jsonData);
        let buff = await response.arrayBuffer();
        console.log("buff", buff);

        // const fs = await import("fs");
        // fs.writeFileSync(
        //   "./packages/arcgis-rest-feature-service/test/mocks/PbfResultsSet7Partial.pbf",
        //   Buffer.from(buff)
        // );

        const decode = (await import("../src/pbf/geoJSONPbfParser.js")).default;

        try {
          const geojson = decode(buff);
          console.log("geojson", geojson);
          console.log("exceededTransferLimit", geojson.exceededTransferLimit);
          console.log(
            "features length",
            geojson.featureCollection.features.length
          );
        } catch (error) {
          console.error("converting:", error);
        }

        // try {
        //   const response = await queryAllFeatures(docsPbfOptions);
        //   console.log("response", response);
        // } catch (error) {
        //   console.error("Error querying docsPbfOptions:", error);
        // }
      });
    });

    describe("with pbf-as-arcgis", () => {});
  });
});
