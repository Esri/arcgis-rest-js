import fetchMock from "fetch-mock";
import { describe, afterEach, test, expect } from "vitest";
import {
  IQueryAllFeaturesOptions,
  IQueryAllFeaturesResponse,
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  queryAllFeatures,
  queryFeatures
} from "../src/index.js";
import pbfToGeoJSON from "../src/pbf-parser/geoJSONPbfParser.js";
import pbfToArcGIS from "../src/pbf-parser/arcGISPbfParser.js";
import { readEnvironmentFileToJSON } from "./utils/readFileArrayBuffer.js";
import {
  ApiKeyManager,
  ArcGISAuthError,
  ArcGISRequestError
} from "@esri/arcgis-rest-request";
import {
  compareCoordinates,
  compareProperties
} from "./utils/geoJsonTestHelpers.js";

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

      test("LIVE TEST (output equality): standard CRS pbf-as-geojson response should match standard geojson response", async () => {
        const geojsonOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };
        // default geojson requests return lat/lon (4326)
        // default pbf-as-geojson requests with outSR: 4326 parameter to return lat/lon geometry coordinates
        const pbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          ...geojsonOptions,
          f: "pbf-as-geojson"
        };

        const [geojsonResponse, pbfAsGeoJSONResponse] = await Promise.all([
          queryFeatures(geojsonOptions),
          queryFeatures(pbfAsGeoJSONOptions)
        ]);

        // TODO?: equality check breaks at features geometry decimal precision level (around 8-9)
        // expect(pbfAsGeoJSONResponse).toEqual(geojsonResponse);

        // standard response should not have crs property
        expect(geojsonResponse).not.toHaveProperty("crs");
        expect(pbfAsGeoJSONResponse).not.toHaveProperty("crs");
        // should have matching type
        expect(geojsonResponse).toHaveProperty("type", "FeatureCollection");
        expect(pbfAsGeoJSONResponse).toHaveProperty(
          "type",
          "FeatureCollection"
        );
        // should have matching feature count
        expect((pbfAsGeoJSONResponse as any).features.length).toBe(3);
        expect((geojsonResponse as any).features.length).toBe(3);
        // should have same exceededTransferLimit value
        expect((geojsonResponse as any).properties).toEqual(
          (pbfAsGeoJSONResponse as any).properties
        );
        expect((geojsonResponse as any).features[0].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[0].properties
        );
        expect((geojsonResponse as any).features[1].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[1].properties
        );
        expect((geojsonResponse as any).features[2].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[2].properties
        );
      });

      test("LIVE TEST (output equality): non-standard CRS pbf-as-geojson response should match non-standard geojson response", async () => {
        const geojsonOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          outSR: "102100"
        };
        const pbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          ...geojsonOptions,
          f: "pbf-as-geojson"
        };

        const [geojsonResponse, pbfAsGeoJSONResponse] = await Promise.all([
          queryFeatures(geojsonOptions),
          queryFeatures(pbfAsGeoJSONOptions)
        ]);

        // TODO?: equality check breaks at features geometry decimal precision level (around 4-5)
        // expect(pbfAsGeoJSONResponse).toEqual(geojsonResponse);

        // standard response should not have crs property
        expect(geojsonResponse).toHaveProperty("crs");
        expect(pbfAsGeoJSONResponse).toHaveProperty("crs");
        expect((geojsonResponse as any).crs).toEqual(
          (pbfAsGeoJSONResponse as any).crs
        );
        // should have matching type
        expect(geojsonResponse).toHaveProperty("type", "FeatureCollection");
        expect(pbfAsGeoJSONResponse).toHaveProperty(
          "type",
          "FeatureCollection"
        );
        // should have matching feature count
        expect((pbfAsGeoJSONResponse as any).features.length).toBe(3);
        expect((geojsonResponse as any).features.length).toBe(3);
        // should have same exceededTransferLimit value
        expect((geojsonResponse as any).properties).toEqual(
          (pbfAsGeoJSONResponse as any).properties
        );
        expect((geojsonResponse as any).features[0].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[0].properties
        );
        expect((geojsonResponse as any).features[1].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[1].properties
        );
        expect((geojsonResponse as any).features[2].properties).toEqual(
          (pbfAsGeoJSONResponse as any).features[2].properties
        );
      });

      test("LIVE TEST (output equality): POINT pbf-as-geojson response should match geojson POINT response", async () => {
        const zipCodePointsPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const zipCodeGeoJSONOptions: IQueryFeaturesOptions = {
          ...zipCodePointsPbfAsGeoJSONOptions,
          f: "geojson"
        };

        const [geojsonPointResponse, pbfAsGeoJSONPointResponse] =
          await Promise.all([
            queryFeatures(zipCodeGeoJSONOptions),
            queryFeatures(zipCodePointsPbfAsGeoJSONOptions)
          ]);
        expect(geojsonPointResponse).toEqual(pbfAsGeoJSONPointResponse);
      });

      test("LIVE TEST (output equality): LINE pbf-as-geojson response should match geojson LINE response", async () => {
        const trailsLinesPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const trailsLinesGeoJSONOptions: IQueryFeaturesOptions = {
          ...trailsLinesPbfAsGeoJSONOptions,
          f: "geojson"
        };

        const [geojsonLineResponse, pbfAsGeoJSONLineResponse] =
          (await Promise.all([
            queryFeatures(trailsLinesGeoJSONOptions),
            queryFeatures(trailsLinesPbfAsGeoJSONOptions)
          ])) as [any, any];

        const geoJSONCoords =
          geojsonLineResponse.features[0].geometry.coordinates;
        const pbfGeoJSONCoords =
          pbfAsGeoJSONLineResponse.features[0].geometry.coordinates;
        const geoJSONProps = geojsonLineResponse.features[0].properties;
        const pbfGeoJSONProps = pbfAsGeoJSONLineResponse.features[0].properties;

        // make cure geojson coords match pbf-as-geojson coords within 5 decimal places
        expect(
          compareCoordinates(geoJSONCoords, pbfGeoJSONCoords, 5).length
        ).toBe(0);
        // in this case coordinates match except on one property field at high precision so we will also check properties to a precision
        // Example:
        expect(geoJSONProps.LENGTH_MI).toBe(0.19);
        expect(pbfGeoJSONProps.LENGTH_MI).toBe(0.1899999976158142);
        expect(geoJSONProps.LENGTH_MI).toBeCloseTo(
          pbfGeoJSONProps.LENGTH_MI,
          5
        );
        expect(compareProperties(geoJSONProps, pbfGeoJSONProps, 5)).toBe(true);

        // nuke coordinates and properties to allow full object equality check without precision conflicts
        geojsonLineResponse.features[0].geometry.coordinates = [];
        pbfAsGeoJSONLineResponse.features[0].geometry.coordinates = [];
        geojsonLineResponse.features[0].properties = {};
        pbfAsGeoJSONLineResponse.features[0].properties = {};
        expect(geojsonLineResponse).toEqual(pbfAsGeoJSONLineResponse);
      });

      test("LIVE TEST (output equality): POLYGON pbf-as-geojson response should match geojson POLYGON response", async () => {
        const parcelsPolygonPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0`,
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const parcelsPolygonGeoJSONOptions: IQueryFeaturesOptions = {
          ...parcelsPolygonPbfAsGeoJSONOptions,
          f: "geojson"
        };

        const [geojsonPolygonResponse, pbfAsGeoJSONPolygonResponse] =
          (await Promise.all([
            queryFeatures(parcelsPolygonGeoJSONOptions),
            queryFeatures(parcelsPolygonPbfAsGeoJSONOptions)
          ])) as [any, any];

        const geoJSONCoords =
          geojsonPolygonResponse.features[0].geometry.coordinates;
        const pbfGeoJSONCoords =
          pbfAsGeoJSONPolygonResponse.features[0].geometry.coordinates;
        expect(
          compareCoordinates(geoJSONCoords, pbfGeoJSONCoords, 6).length
        ).toBe(0);

        geojsonPolygonResponse.features[0].geometry.coordinates = [];
        pbfAsGeoJSONPolygonResponse.features[0].geometry.coordinates = [];

        expect(geojsonPolygonResponse).toEqual(pbfAsGeoJSONPolygonResponse);
      });

      test("LIVE TEST: should decode zip code service POINT pbf to geojson", async () => {
        // handcraft pbf query to test pbfToGeoJSON output
        const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // pbf requests return data in web mercator by default (102100, EPSG:3857)
          // geojson crs format standard is EPSG:4326 lat/lon so we manually specify for pbf for pbf-as-geojson requests
          outSR: "4326"
        };
        const response = await queryFeatures(zipCodePointsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);
        expect(geoJSON.type).toBe("FeatureCollection");
        expect(geoJSON.features.length).toBe(1);
        expect(geoJSON.properties).toHaveProperty("exceededTransferLimit");
        // verify geometry type
        expect(geoJSON.features[0].geometry.type).toBe("Point");
        // verify coordinates are lat/lon
        const coords = geoJSON.features[0].geometry.coordinates;
        expect(coords[0]).toBeLessThan(180);
        expect(coords[0]).toBeGreaterThan(-180);
        expect(coords[1]).toBeLessThan(90);
        expect(coords[1]).toBeGreaterThan(-90);
      });

      test("LIVE TEST: should decode landmark service POINT pbf to geojson", async () => {
        const landmarksPointsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services9.arcgis.com/CAVmSZdRT9pdZgEk/arcgis/rest/services/Ball_Ground_Landmarks/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // geojson format should be EPSG:4326 lat/lon
          outSR: "4326"
        };
        const response = await queryFeatures(landmarksPointsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);
        expect(geoJSON.features.length).toBe(1);
        expect(geoJSON.type).toBe("FeatureCollection");
        expect(geoJSON.properties).toHaveProperty("exceededTransferLimit");
        expect(geoJSON.features[0].type).toBe("Feature");
        expect(geoJSON.features[0].geometry.type).toBe("Point");
        // verify coordinates are lat/lon
        const coords = geoJSON.features[0].geometry.coordinates;
        expect(coords[0]).toBeLessThan(180);
        expect(coords[0]).toBeGreaterThan(-180);
        expect(coords[1]).toBeLessThan(90);
        expect(coords[1]).toBeGreaterThan(-90);
      });

      test("LIVE TEST: should decode LINE pbf to geojson", async () => {
        const trailsLinesPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // geojson format should be EPSG:4326 lat/lon
          outSR: "4326"
        };
        const response = await queryFeatures(trailsLinesPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);
        expect(geoJSON.features.length).toBe(1);
        expect(geoJSON.features[0]).toHaveProperty("properties");
        // expect line shape
        expect(geoJSON.features[0].geometry.type).toBe("LineString");
        expect(geoJSON.features[0].geometry.coordinates.length).toBe(22);
        const firstCoordSet = geoJSON.features[0].geometry.coordinates[0];
        // expect line coords to be lat/lon
        expect(firstCoordSet[0]).toBeLessThan(180);
        expect(firstCoordSet[0]).toBeGreaterThan(-180);
        expect(firstCoordSet[1]).toBeLessThan(90);
        expect(firstCoordSet[1]).toBeGreaterThan(-90);
      });

      test("LIVE TEST: should decode POLYGON pbf to geojson", async () => {
        const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // geojson format should be EPSG:4326 lat/lon
          outSR: "4326"
        };
        const response = await queryFeatures(parksPolygonsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);

        expect(geoJSON.features.length).toBe(1);
        expect(geoJSON.features[0]).toHaveProperty("properties");
        // expect polygon shape
        expect(geoJSON.features[0].geometry.type).toBe("Polygon");
        expect(geoJSON.features[0].geometry.coordinates.length).toBe(1);
        expect(geoJSON.features[0].geometry.coordinates[0].length).toBe(181);
        const firstCoordSet = geoJSON.features[0].geometry.coordinates[0][0];
        // expect polygoon coords to be lat/lon
        expect(firstCoordSet[0]).toBeLessThan(180);
        expect(firstCoordSet[0]).toBeGreaterThan(-180);
        expect(firstCoordSet[1]).toBeLessThan(90);
        expect(firstCoordSet[1]).toBeGreaterThan(-90);
      });

      test("LIVE TEST: standard lat/long pbfToGeoJSON request should not include crs property in geojson object", async () => {
        const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // must specify pbf request to use crs of EPSG:4326 lat/lon for geojson standard
          // or default web mercator will be used
          outSR: "4326"
        };
        const response = await queryFeatures(zipCodePointsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);

        // standard geojson response should not have crs property and should default to EPSG:4326 coordinates
        expect(geoJSON).not.toHaveProperty("crs");
        expect(geoJSON.features[0].geometry.type).toBe("Point");
        const coords = geoJSON.features[0].geometry.coordinates;
        // test specific values in this case
        expect(coords[0]).toBe(-73.045075);
        expect(coords[1]).toBe(40.816799);
      });

      test("LIVE TEST: web-mercator specified pbfToGeoJSON request should include crs property in geojson object", async () => {
        const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true,
          // specify web mercator in this case
          outSR: "102100"
        };
        const response = await queryFeatures(zipCodePointsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();

        const geoJSON = pbfToGeoJSON(arrBuffer);
        // geojson response should have crs property for web mercator
        expect(geoJSON).toHaveProperty("crs");
        expect(geoJSON.crs?.properties.name).toBe("EPSG:3857");
        expect(geoJSON.features[0].geometry.type).toBe("Point");
        const coords = geoJSON.features[0].geometry.coordinates;
        // test specific values in this case
        expect(coords[0]).toBe(-8131340.554);
        expect(coords[1]).toBe(4985356.9969);
      });

      test("LIVE TEST: polygon geojson should match server json should match pbf-as-geojson decoded geojson", async () => {
        const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
          f: "geojson",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const geoJSONResponse = await queryFeatures(parksPolygonsPbfOptions);
        const geoJSON = geoJSONResponse as GeoJSON.FeatureCollection;

        const parksPolygonsPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          ...parksPolygonsPbfOptions,
          f: "pbf-as-geojson"
        };
        const pbfGeojson = (await queryFeatures(
          parksPolygonsPbfAsGeoJSONOptions
        )) as GeoJSON.FeatureCollection;
        const fileGeoJSON = await readEnvironmentFileToJSON(
          "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPolygonResponse.json"
        );

        // make sure file IO geojson matches live geojson response
        expect(geoJSON).toEqual(fileGeoJSON);

        // check coordinates equality separately due to precision issues
        const geoJSONCoords = (geoJSON.features[0].geometry as any).coordinates;
        const pbfGeoJSONCoords = (pbfGeojson.features[0].geometry as any)
          .coordinates;

        // make cure geojson coords match pbf-as-geojson coords within 5 decimal places
        expect(
          compareCoordinates(geoJSONCoords, pbfGeoJSONCoords, 5).length
        ).toBe(0);

        // nuke coordinates to allow full object equality check without precision conflicts
        (geoJSON.features[0].geometry as any).coordinates = [];
        (pbfGeojson.features[0].geometry as any).coordinates = [];

        // make sure live geojson matches pbf-as-geojson decoded geojson besides coordinate estimated matching.
        expect(geoJSON).toEqual(pbfGeojson);
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

      test("LIVE TEST: should decode POINT pbf to arcgis", async () => {
        const zipCodePointsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_ZIP_Code_Points_analysis/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true
        };
        const response = await queryFeatures(zipCodePointsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();
        const arcgis = pbfToArcGIS(arrBuffer);

        // required properties
        expect(arcgis.features.length).toBe(1);

        // optional properties
        expect(arcgis.objectIdFieldName).toBe("OBJECTID");
        expect(arcgis.globalIdFieldName).toBe("");
        expect(arcgis.displayFieldName).toBe(undefined);
        expect(arcgis.geometryType).toBe("esriGeometryPoint");
        expect(arcgis.spatialReference.wkid).toBe(102100);
        expect(arcgis.spatialReference.latestWkid).toBe(3857);
        expect(arcgis.fields.length).toBe(8);
        expect(arcgis.fieldAliases).toBe(undefined);
        expect(arcgis.hasZ).toBe(false);
        expect(arcgis.hasM).toBe(false);
        expect(arcgis.exceededTransferLimit).toBe(true);
        // properties not on interface
        expect((arcgis as any).uniqueIdField?.name).toBe("OBJECTID");
        expect((arcgis as any).uniqueIdField?.isSystemMaintained).toBe(true);
        expect((arcgis as any).geometryProperties).toBe(null);

        // inspect fields for required props
        expect(arcgis.fields[0].name).toBe("OBJECTID");
        expect(arcgis.fields[0].type).toBe("esriFieldTypeOID");

        expect(arcgis.features[0]).toHaveProperty("geometry");
        expect(arcgis.features[0]).toHaveProperty("attributes");
        // point geometry should have x, y
        expect(arcgis.features[0].geometry).toHaveProperty("x");
        expect(arcgis.features[0].geometry).toHaveProperty("y");
      });

      test("LIVE TEST: should decode LINE pbf to arcgis", async () => {
        const trailsLinesPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true
        };
        const response = await queryFeatures(trailsLinesPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();
        const arcgis = pbfToArcGIS(arrBuffer);

        // required properties
        expect(arcgis.features.length).toBe(1);
        expect(arcgis.fields.length).toBe(14);

        // properties not on interface
        expect((arcgis as any).uniqueIdField?.name).toBe("OBJECTID");
        expect((arcgis as any).uniqueIdField?.isSystemMaintained).toBe(true);
        // top level geometry properties (checks for line-specific props)
        expect((arcgis as any).geometryProperties.shapeAreaFieldName).toBe("");
        expect((arcgis as any).geometryProperties.shapeLengthFieldName).toBe(
          "Shape__Length"
        );
        expect((arcgis as any).geometryProperties.units).toBe("esriMeters");

        // inspect fields for required props
        expect(arcgis.fields[0].name).toBe("OBJECTID");
        expect(arcgis.fields[0].type).toBe("esriFieldTypeOID");
        // line-specific geometry property is paths instead of x,y
        expect(arcgis.features[0].geometry).toHaveProperty("paths");
      });

      test("LIVE TEST: should decode POLYGON pbf to arcgis", async () => {
        const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
          f: "pbf",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1,
          rawResponse: true
        };
        const response = await queryFeatures(parksPolygonsPbfOptions);
        const arrBuffer = await (response as any).arrayBuffer();
        const arcgis = pbfToArcGIS(arrBuffer);
        // required properties
        expect(arcgis.features.length).toBe(1);
        // properties not on interface
        expect((arcgis as any).uniqueIdField?.name).toBe("FID");
        expect((arcgis as any).uniqueIdField?.isSystemMaintained).toBe(true);
        // check for polygon-specific props (area and length)
        expect((arcgis as any).geometryProperties.shapeAreaFieldName).toBe(
          "Shape__Area"
        );
        expect((arcgis as any).geometryProperties.shapeLengthFieldName).toBe(
          "Shape__Length"
        );
        expect((arcgis as any).geometryProperties.units).toBe("esriMeters");
        // polygon-specific geometry property is rings
        expect(arcgis.features[0].geometry).toHaveProperty("rings");
      });
    });

    describe("equality: pbfToArcGIS objects should closely match ArcGIS JSON response objects", () => {
      test("LIVE TEST: should compare pbfToArcGIS POLYGON response with arccgis POLYGON response", async () => {
        const parksPolygonsJsonOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
          f: "json",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const parksPolygonsPbfAsArcGISOptions: IQueryFeaturesOptions = {
          ...parksPolygonsJsonOptions,
          f: "pbf-as-arcgis"
        };

        const arcGIS = (await queryFeatures(
          parksPolygonsJsonOptions
        )) as IQueryFeaturesResponse;
        const pbfArcGIS = (await queryFeatures(
          parksPolygonsPbfAsArcGISOptions
        )) as IQueryFeaturesResponse;

        // check for object differences
        expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
        expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
        expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
        expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
        expect(arcGIS.exceededTransferLimit).toEqual(
          pbfArcGIS.exceededTransferLimit
        );
        expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

        // properties not on interface
        expect((arcGIS as any).uniqueIdField).toEqual(
          (pbfArcGIS as any).uniqueIdField
        );
        expect((arcGIS as any).geometryProperties).toEqual(
          (pbfArcGIS as any).geometryProperties
        );

        // the current pbf decoder does not return length on String FieldTypes
        expect(arcGIS.fields[3].length).toEqual(100);
        expect(pbfArcGIS.fields[3].length).toBeUndefined();

        // check that fields are equal for both
        expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
        // check that features are equal for both
        expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
      });

      test("LIVE TEST: should compare pbfToArcGIS POINT response with arcgis POINT response", async () => {
        const landmarksPointsJsonOptions: IQueryFeaturesOptions = {
          url: `https://services9.arcgis.com/CAVmSZdRT9pdZgEk/arcgis/rest/services/Ball_Ground_Landmarks/FeatureServer/0`,
          f: "json",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const landmarksPointsPbfAsArcGISOptions: IQueryFeaturesOptions = {
          ...landmarksPointsJsonOptions,
          f: "pbf-as-arcgis"
        };

        const arcGIS = (await queryFeatures(
          landmarksPointsJsonOptions
        )) as IQueryFeaturesResponse;
        const pbfArcGIS = (await queryFeatures(
          landmarksPointsPbfAsArcGISOptions
        )) as IQueryFeaturesResponse;

        // check for object differences
        expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
        expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
        expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
        expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
        expect(arcGIS.exceededTransferLimit).toEqual(
          pbfArcGIS.exceededTransferLimit
        );
        expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

        // properties not on interface
        expect((arcGIS as any).uniqueIdField).toEqual(
          (pbfArcGIS as any).uniqueIdField
        );
        // pbf decoder adds null geometry properties when geometryProperties are absent
        expect(arcGIS as any).not.toHaveProperty("geometryProperties");
        expect((pbfArcGIS as any).geometryProperties).toBe(null);

        expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
        expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);

        // decoder does not return length on Other FieldTypes
        expect(arcGIS.fields[1].length).toBe(38);
        expect(arcGIS.fields[1].type).toBe("esriFieldTypeGlobalID");
        expect((arcGIS.fields[1] as any).sqlType).toBe("sqlTypeOther");
        expect(pbfArcGIS.fields[1].length).toBeUndefined();
      });

      test("LIVE TEST: should compare pbfToArcGIS LINE response with arcgis LINE response", async () => {
        const trailsLinesJsonOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trails/FeatureServer/0`,
          f: "json",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };

        const trailsLinesPbfAsArcGISOptions: IQueryFeaturesOptions = {
          ...trailsLinesJsonOptions,
          f: "pbf-as-arcgis"
        };

        const arcGIS = (await queryFeatures(
          trailsLinesJsonOptions
        )) as IQueryFeaturesResponse;
        const pbfArcGIS = (await queryFeatures(
          trailsLinesPbfAsArcGISOptions
        )) as IQueryFeaturesResponse;

        // check for object differences
        expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
        expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
        expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
        expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
        expect(arcGIS.exceededTransferLimit).toEqual(
          pbfArcGIS.exceededTransferLimit
        );
        expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

        // properties not on interface
        expect((arcGIS as any).uniqueIdField).toEqual(
          (pbfArcGIS as any).uniqueIdField
        );
        // since LINE has only one dimension arcgis returns one dimentsion while the decoder returns both with an empty dimension
        expect((arcGIS as any).geometryProperties.shapeLengthFieldName).toEqual(
          (pbfArcGIS as any).geometryProperties.shapeLengthFieldName
        );
        expect((arcGIS as any).geometryProperties.units).toEqual(
          (pbfArcGIS as any).geometryProperties.units
        );
        expect(
          (arcGIS as any).geometryProperties.shapeAreaFieldName
        ).toBeUndefined();
        expect((pbfArcGIS as any).geometryProperties.shapeAreaFieldName).toBe(
          ""
        );

        expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
        expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
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
          expect((response as any).properties.exceededTransferLimit).toBe(true);
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
