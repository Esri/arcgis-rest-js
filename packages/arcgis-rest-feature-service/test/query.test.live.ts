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
  ArcGISRequestError
} from "@esri/arcgis-rest-request";

describe("queryFeatures() and queryAllFeatures() live tests", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("queryFeatures()", () => {
    describe("with pbf-as-geojson", () => {
      // LIVE TEST: should decode a valid pbf-as-geojson response from public server without api key without fetchmock
      test("LIVE TEST (valid): should query pbf-as-geojson features from live server and decode into geojson from arrayBuffer", async () => {
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

      test("LIVE TEST w/fetch-mock (valid): should query pbf-as-geojson features and decode pbf correctly when passed through fetchmock", async () => {
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

      // testing no auth public service without auth token (testing authenticated response requires api key for live testing)
      test("LIVE TEST (valid): should query pbf-as-geojson features with geometries from live service", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };

        const response = await queryFeatures(docsPbfOptions);
        expect((response as any).features.length).toBe(3);
        expect((response as any).features[0].geometry).toHaveProperty("type");
        expect((response as any).features[0].geometry).toHaveProperty(
          "coordinates"
        );
      });

      test("LIVE TEST w/fetch-mock (valid): should query pbf-as-geojson features from public service through fetchmock without corrupting the array buffer (test fetchmock)", async () => {
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
          resultRecordCount: 3
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

      test("LIVE TEST (error): should throw an arcgis request error when pbf-as-geojson fails to decode", async () => {
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
          resultRecordCount: 3
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISRequestError);
          expect((error as any).message).toContain(
            "500: Error decoding PBF response"
          );
        }
      });

      // should handle the case where live service returns a json response with auth error instead of pbf arraybuffer
      test("LIVE TEST (invalid auth): should throw arcgis auth error for live pbf-as-geojson queries when live service returns json object with error", async () => {
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

        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          authentication: ApiKeyManager.fromKey(badApiKey)
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISAuthError);
          expect((error as any).message).toBe("498: Invalid token.");
        }
      });

      test("LIVE TEST (invalid auth w/fetchmock): should return same json response through fetchmock for unauthenticated pbf-as-geojson requests as live service", async () => {
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

        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          authentication: ApiKeyManager.fromKey(badApiKey)
        };

        try {
          await queryFeatures(docsPbfOptions);
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISAuthError);
          expect((error as any).message).toBe("498: Invalid token.");
        }
      });
    });

    describe("with pbf-as-arcgis", () => {
      test("LIVE TEST (valid): should fetch live pbf-as-arcgis response (convert pbf buffer to geojson to arcgis)", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-arcgis",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };

        const response = await queryFeatures(docsPbfOptions);

        expect((response as any).features.length).toBe(3);
        expect((response as any).features[0]).toHaveProperty("attributes");
        expect((response as any).features[0]).toHaveProperty("geometry");
      });
    });
  });

  describe("queryAllFeatures() (LONG QUERIES)", () => {
    describe("with geojson", () => {
      test(
        "LIVE TEST LONG QUERY: should query all geojson objects",
        // run time may be longer on slower networks or when data is not cached
        { timeout: 15000 },
        async () => {
          const docsPbfOptions: IQueryAllFeaturesOptions = {
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
            f: "geojson"
          };
          const response = await queryAllFeatures(docsPbfOptions);
          expect((response as any).type).toBe("FeatureCollection");
          expect((response as any).features.length).toBeGreaterThan(20000);
          expect((response as any).properties.exceededTransferLimit).toBe(true);
        }
      );
    });

    describe("with json (arcgis)", () => {
      test(
        "LIVE TEST LONG QUERY: should query all arcgis json objects",
        // run time may be longer on slower networks or when data is not cached
        { timeout: 15000 },
        async () => {
          const docsPbfOptions: IQueryAllFeaturesOptions = {
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
            f: "json"
          };

          const response = await queryAllFeatures(docsPbfOptions);

          expect((response as any).features[0]).toHaveProperty("attributes");
          expect((response as any).features[0]).toHaveProperty("geometry");

          // assert feature count and exceeded limit
          expect((response as any).features.length).toBeGreaterThan(20000);
          expect((response as any).exceededTransferLimit).toBe(true);
        }
      );
    });

    describe("with pbf-as-geojson", () => {
      test(
        "LIVE TEST LONG QUERY GeoJSON: should query all pbf-as-geojson objects",
        // run time may be longer on slower networks or when data is not cached
        { timeout: 15000 },
        async () => {
          const docsPbfOptions: IQueryAllFeaturesOptions = {
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
            f: "pbf-as-geojson"
          };

          const response = await queryAllFeatures(docsPbfOptions);
          expect((response as any).features.length).toBeGreaterThan(20000);
          expect((response as any).exceededTransferLimit).toBe(true);
        }
      );
    });

    describe("with pbf-as-arcgis", () => {
      test(
        "LIVE TEST LONG QUERY ArcGIS: should query all pbf-as-arcgis objects",
        // run time may be longer on slower networks or when data is not cached
        { timeout: 15000 },
        async () => {
          const docsPbfOptions: IQueryAllFeaturesOptions = {
            url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
            f: "pbf-as-arcgis"
          };
          const response = await queryAllFeatures(docsPbfOptions);
          expect((response as any).features.length).toBeGreaterThan(20000);
          expect((response as any).exceededTransferLimit).toBe(true);
          expect((response as any).features[0]).toHaveProperty("attributes");
          expect((response as any).features[0]).toHaveProperty("geometry");
        }
      );
    });
  });
});
