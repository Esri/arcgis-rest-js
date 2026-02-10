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
import pbfToArcGIS from "../src/pbf-parser/arcGISPbfParser.js";
import { readEnvironmentFileToJSON } from "./utils/readFileArrayBuffer.js";
import {
  ApiKeyManager,
  ArcGISAuthError,
  ArcGISRequestError,
  IFeatureSet
} from "@esri/arcgis-rest-request";
import {
  compareProperties,
  CoordinateToleranceEnum,
  maxDifference
} from "./utils/parserTestHelpers.js";

describe("queryFeatures() and queryAllFeatures() live tests", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("queryFeatures()", () => {
    describe("with pbf-as-geojson", () => {
      // LIVE TEST: should decode a valid pbf-as-geojson response from public server without api key without fetchmock
      test("LIVE TEST (valid): should query pbf-as-geojson features from live server and decode into geojson from arrayBuffer (no geometries)", async () => {
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
          returnGeometry: false,
          spatialRel: "esriSpatialRelIntersects",
          where: "1=1"
        };

        const geojson = await queryFeatures(testPublicFeatureServer);
        expect((geojson as any).features.length).toBe(1);
        expect((geojson as any).features[0].properties.OBJECTID).toBe(49481);
        expect((geojson as any).features[0].properties.County).toBe(
          "Nassau County"
        );
        expect((geojson as any).features[0].id).toBe(49481);
        expect((geojson as any).properties.exceededTransferLimit).toBeDefined();
      });

      // testing public service with geometries without auth token (testing authenticated response requires api key for live testing)
      test("LIVE TEST (valid): should query pbf-as-geojson features from live service (with geometries)", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };

        const geojson = await queryFeatures(docsPbfOptions);
        expect((geojson as any).features.length).toBe(3);
        expect((geojson as any).features[0]).toHaveProperty("properties");
        expect((geojson as any).features[0].geometry).toHaveProperty("type");
        expect((geojson as any).features[0].geometry).toHaveProperty(
          "coordinates"
        );
        // expect polygon coordinates to be in lat/lon
        const coords = (geojson as any).features[0].geometry.coordinates[0][0];
        expect(coords[0]).toBeLessThan(180);
        expect(coords[0]).toBeGreaterThan(-180);
        expect(coords[1]).toBeLessThan(90);
        expect(coords[1]).toBeGreaterThan(-90);
        expect((geojson as any).properties.exceededTransferLimit).toBeDefined();
      });

      test("LIVE TEST w/fetch-mock (valid): should query pbf-as-geojson features from public service through fetchmock without corrupting the array buffer (test fetchmock)", async () => {
        const docsPbfUrl = `https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0/query?f=pbf&where=1%3D1&outFields=*&resultOffset=0&resultRecordCount=3&outSR=4326`;
        const livePbfResponse = await fetch(docsPbfUrl);

        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };

        // pre fetch-mock
        const liveGeoJSON = await queryFeatures(docsPbfOptions);

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

        // post fetch-mock
        const geoJson = await queryFeatures(docsPbfOptions);

        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(docsPbfUrl);
        expect(fetchMock.called()).toBeTruthy();
        expect(fetchMock.calls().length).toBe(1);
        expect(options.method).toBe("GET");
        expect(liveGeoJSON).toEqual(geoJson);
      });

      test("LIVE TEST (invalid outSR): should throw a 422 error when querying with invalid outSR parameters for nonstandard geojson format", async () => {
        const docsPbfOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "pbf-as-geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3,
          outSR: "3857"
        };

        try {
          await queryFeatures(docsPbfOptions);
          throw "Should throw error but did not.";
        } catch (error) {
          expect(error).toBeInstanceOf(ArcGISRequestError);
          expect((error as any).code).toBe(422);
          expect((error as any).message).toBe(
            "422: Unsupported outSR for GeoJSON requests."
          );
        }
      });

      // should handle the case where live service returns a json response with auth error instead of pbf arraybuffer
      test("LIVE TEST (invalid auth): should throw 498 arcgis auth error for live pbf-as-geojson queries when live service returns json object with error", async () => {
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

      test("LIVE TEST (file integrity): feature service geojson json should match file json geojson, and should equal pbf-as-geojson object", async () => {
        const parksPolygonsPbfOptions: IQueryFeaturesOptions = {
          url: `https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Parks_and_Open_Space_Styled/FeatureServer/0`,
          f: "geojson",
          where: "1=1",
          outFields: ["*"],
          resultRecordCount: 1
        };
        const parksPolygonsPbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          ...parksPolygonsPbfOptions,
          f: "pbf-as-geojson"
        };
        // query pure geojson
        const geoJSON = (await queryFeatures(
          parksPolygonsPbfOptions
        )) as GeoJSON.FeatureCollection;
        // query pbf-as-geojson
        const pbfGeojson = (await queryFeatures(
          parksPolygonsPbfAsGeoJSONOptions
        )) as GeoJSON.FeatureCollection;
        // query file io geojson for comparison
        const fileGeoJSON = await readEnvironmentFileToJSON(
          "./packages/arcgis-rest-feature-service/test/mocks/geojson/geoJSONPolygonResponse.json"
        );
        // check file IO geojson matches live geojson response
        expect(geoJSON).toEqual(fileGeoJSON);

        // check coordinates equality (5 decimal places) separately due to precision issues
        const geoJSONCoords = (geoJSON.features[0].geometry as any).coordinates;
        const pbfGeoJSONCoords = (pbfGeojson.features[0].geometry as any)
          .coordinates;

        const tolerance = CoordinateToleranceEnum.EPSG_4326; // .11 millimeters at the equator in EPSG:4326
        const maxDrift = maxDifference(geoJSONCoords, pbfGeoJSONCoords);
        console.log("maxDrift", maxDrift);
        expect(maxDrift.diff).toBeLessThan(tolerance);
        // check full object equality without precision conflicts from coordinates
        (geoJSON.features[0].geometry as any).coordinates = [];
        (pbfGeojson.features[0].geometry as any).coordinates = [];
        expect(geoJSON).toEqual(pbfGeojson);
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
        // single point coordinates objects should be equal as there is no drift from pbf decoding the origin point
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

        // check the max drift from geojson pbf coordinate decoding is within tolerance for lat/long degrees.
        const tolerance = CoordinateToleranceEnum.EPSG_4326; // .11 millimeters at the equator in EPSG:4326;
        const maxDrift = maxDifference(geoJSONCoords, pbfGeoJSONCoords);
        expect(maxDrift?.diff).toBeLessThan(tolerance);

        // One pbf property field varies from geojson at high precision so we will also check properties to a precision
        // Example:
        expect(geoJSONProps.LENGTH_MI).toBe(0.19);
        expect(pbfGeoJSONProps.LENGTH_MI).toBe(0.1899999976158142);
        expect(geoJSONProps.LENGTH_MI - pbfGeoJSONProps.LENGTH_MI).toBeLessThan(
          0.00000001
        ); // specific variability in miles (.016 mm)
        // check all value keys on the properties object
        expect(compareProperties(geoJSONProps, pbfGeoJSONProps, 6)).toBe(true);

        // empty coordinates and properties to allow full object equality check without precision conflicts
        geojsonLineResponse.features[0].geometry.coordinates = [];
        pbfAsGeoJSONLineResponse.features[0].geometry.coordinates = [];
        geojsonLineResponse.features[0].properties = {};
        pbfAsGeoJSONLineResponse.features[0].properties = {};
        // check equality on the rest of the object
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

        const tolerance = CoordinateToleranceEnum.EPSG_4326; // .11 millimeters at the equator in EPSG:4326;
        const maxDrift = maxDifference(geoJSONCoords, pbfGeoJSONCoords);
        expect(maxDrift?.diff).toBeLessThan(tolerance);

        geojsonPolygonResponse.features[0].geometry.coordinates = [];
        pbfAsGeoJSONPolygonResponse.features[0].geometry.coordinates = [];
        // check full object equality without coordinate precision conflicts
        expect(geojsonPolygonResponse).toEqual(pbfAsGeoJSONPolygonResponse);
      });

      test("LIVE TEST (output equality, multiple features): standard pbf-as-geojson response should match standard geojson response", async () => {
        const geojsonOptions: IQueryFeaturesOptions = {
          url: "https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Santa_Monica_public_parcels/FeatureServer/0",
          f: "geojson",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 3
        };
        const pbfAsGeoJSONOptions: IQueryFeaturesOptions = {
          ...geojsonOptions,
          f: "pbf-as-geojson"
        };

        const [geojsonResponse, pbfAsGeoJSONResponse] = await Promise.all([
          queryFeatures(geojsonOptions),
          queryFeatures(pbfAsGeoJSONOptions)
        ]);
        // standard response should not have crs property
        expect(geojsonResponse).not.toHaveProperty("crs");
        expect(pbfAsGeoJSONResponse).not.toHaveProperty("crs");
        // should have matching type
        expect(geojsonResponse).toHaveProperty("type", "FeatureCollection");
        expect(pbfAsGeoJSONResponse).toHaveProperty(
          "type",
          "FeatureCollection"
        );
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

        // should have matching feature count
        expect((pbfAsGeoJSONResponse as any).features.length).toBe(3);
        expect((geojsonResponse as any).features.length).toBe(3);
        for (let i = 0; i < (geojsonResponse as any).features.length; i++) {
          const geoJSONCoords = (geojsonResponse as any).features[i].geometry
            .coordinates;
          const pbfGeoJSONCoords = (pbfAsGeoJSONResponse as any).features[i]
            .geometry.coordinates;

          const tolerance = CoordinateToleranceEnum.EPSG_4326; // .11 millimeters at the equator in EPSG:4326;
          const maxDrift = maxDifference(geoJSONCoords, pbfGeoJSONCoords);
          expect(maxDrift?.diff).toBeLessThan(tolerance);
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

      test("LIVE TEST: should decode feature with domain in fields", async () => {
        const domainFeatureOptions: IQueryFeaturesOptions = {
          url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/BuildingDamageAssessments/FeatureServer/0",
          f: "json",
          where: "1=1",
          outFields: ["*"],
          resultOffset: 0,
          resultRecordCount: 1
        };
        const pbfAsArcGISOptions: IQueryFeaturesOptions = {
          ...domainFeatureOptions,
          f: "pbf-as-arcgis"
        };

        const response = await queryFeatures(domainFeatureOptions);
        const pbfAsArcGISResponse = await queryFeatures(pbfAsArcGISOptions);

        const jsonField = (response as IFeatureSet).fields[26];
        const pbfField = (pbfAsArcGISResponse as IFeatureSet).fields[26];
        expect(jsonField.domain).toEqual(pbfField.domain);
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
        expect(pbfArcGIS as any).not.toHaveProperty("geometryProperties");

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

  // The purpose of these long query tests is to check the value of exceededTransferLimit on large queries, total feature count, and general feature shape.
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
