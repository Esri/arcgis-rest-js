import { test, describe, expect } from "vitest";
import pbfToArcGIS, {
  decodeFields
} from "../../src/pbf-parser/arcGISPbfParser.js";
import {
  readEnvironmentFileToArrayBuffer,
  readEnvironmentFileToJSON
} from "../utils/readFileArrayBuffer.js";
import { IQueryFeaturesResponse } from "../../src/query.js";
import { IDomain, IPoint } from "@esri/arcgis-rest-request";
import {
  CoordinateToleranceEnum,
  maxDifference
} from "../utils/parserTestHelpers.js";

describe("decode: arcGISPbfParser should convert pbf arraybuffers to arcGIS JSON objects", () => {
  test("should convert a pbf single feature POLYGON to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

    // optional IFeatureproperties
    expect(arcgis.objectIdFieldName).toBe("FID");
    expect(arcgis.globalIdFieldName).toBe("");
    expect(arcgis.displayFieldName).toBe(undefined);
    expect(arcgis.geometryType).toBe("esriGeometryPolygon");
    expect(arcgis.spatialReference.wkid).toBe(102100);
    expect(arcgis.spatialReference.latestWkid).toBe(3857);
    expect(arcgis.fields.length).toBe(56);
    expect(arcgis.fieldAliases).toBe(undefined);
    expect(arcgis.hasZ).toBe(false);
    expect(arcgis.hasM).toBe(false);
    expect(arcgis.exceededTransferLimit).toBe(true);
    // inspect IField object for required props
    expect(arcgis.fields[0].name).toBe("FID");
    expect(arcgis.fields[0].type).toBe("esriFieldTypeOID");
    // expected defined properties
    expect(arcgis.fields[0].alias).toBe("FID");
    expect(arcgis.fields[0].domain).toBe(null);
    expect(arcgis.fields[0].defaultValue).toBe(null);
    // expected undefined properties
    expect(arcgis.fields[0].nullable).toBe(undefined);
    expect(arcgis.fields[0].editable).toBe(undefined);
    // sqlType not on IFields interface at the moment
    expect((arcgis.fields[0] as any).sqlType).toBe("sqlTypeInteger");
    // required IFeature properties (features)
    expect(arcgis.features.length).toBe(1);
  });

  test("should convert a pbf single feature POINT to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

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
    // required properties
    expect(arcgis.features.length).toBe(1);

    // inspect fields for required props
    expect(arcgis.fields[3].name).toBe("STATE");
    expect(arcgis.fields[3].type).toBe("esriFieldTypeString");
    // expected defined properties
    expect(arcgis.fields[3].alias).toBe("State Abbreviation");
    expect(arcgis.fields[3].domain).toBe(null);
    expect(arcgis.fields[3].defaultValue).toBe(null);
    // expected undefined properties
    expect(arcgis.fields[3].nullable).toBe(undefined);
    expect(arcgis.fields[3].editable).toBe(undefined);
    expect(arcgis.fields[3].length).toBe(undefined);
    // sqlType not on IFields interface at the moment
    expect((arcgis.fields[3] as any).sqlType).toBe("sqlTypeOther");
  });

  test("should convert a pbf single feature LINE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

    // optional properties
    expect(arcgis.objectIdFieldName).toBe("OBJECTID");
    expect(arcgis.globalIdFieldName).toBe("");
    expect(arcgis.displayFieldName).toBe(undefined);
    expect(arcgis.geometryType).toBe("esriGeometryPolyline");
    expect(arcgis.spatialReference.wkid).toBe(102100);
    expect(arcgis.spatialReference.latestWkid).toBe(3857);
    expect(arcgis.fields?.length).toBe(14);
    expect(arcgis.fieldAliases).toBe(undefined);
    expect(arcgis.hasZ).toBe(false);
    expect(arcgis.hasM).toBe(false);
    expect(arcgis.exceededTransferLimit).toBe(true);
    // required properties
    expect(arcgis.features.length).toBe(1);

    // inspect IField obj for required props
    expect(arcgis.fields[4].name).toBe("ELEV_MAX");
    expect(arcgis.fields[4].type).toBe("esriFieldTypeInteger");
    // expected defined properties
    expect(arcgis.fields[4].alias).toBe("ELEV_MAX");
    expect(arcgis.fields[4].domain).toBe(null);
    expect(arcgis.fields[4].defaultValue).toBe(null);
    // expected undefined properties
    expect(arcgis.fields[4].nullable).toBe(undefined);
    expect(arcgis.fields[4].editable).toBe(undefined);
    // sqlType not on IFields interface at the moment
    expect((arcgis.fields[4] as any).sqlType).toBe("sqlTypeInteger");
  });

  test("should convert a pbf single feature MULTIPOLYGON to arcgis query features object", async () => {
    const path3857 =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFMultiPolygonResponseCRS3857.pbf";
    const path4326 =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS4326/PBFMultiPolygonResponseCRS4326.pbf";

    const arrBuff3857 = await readEnvironmentFileToArrayBuffer(path3857);
    const arrBuff4326 = await readEnvironmentFileToArrayBuffer(path4326);
    const pbfArcGIS3857 = pbfToArcGIS(arrBuff3857);
    const pbfArcGIS4326 = pbfToArcGIS(arrBuff4326);

    console.log("pbfArcGIS", JSON.stringify(pbfArcGIS4326, null, 2));
    expect((pbfArcGIS3857 as any).geometryProperties.units).toBe(
      "esriDecimalDegrees"
    );
    expect(pbfArcGIS3857.spatialReference.wkid).toBe(102100);
    expect(pbfArcGIS3857.spatialReference.latestWkid).toBe(3857);
    expect(pbfArcGIS3857.geometryType).toBe("esriGeometryPolygon");

    expect((pbfArcGIS4326 as any).geometryProperties.units).toBe(
      "esriDecimalDegrees"
    );
    expect(pbfArcGIS4326.spatialReference.wkid).toBe(4326);
    expect(pbfArcGIS4326.spatialReference.latestWkid).toBe(4326);
    expect(pbfArcGIS4326.geometryType).toBe("esriGeometryPolygon");
    expect((pbfArcGIS4326.features[0].geometry as any).rings.length).toBe(7);
    expect((pbfArcGIS4326.features[0].geometry as any).rings[0].length).toBe(1);
    expect((pbfArcGIS4326.features[0].geometry as any).rings[0][0].length).toBe(
      30
    );
    expect(
      (pbfArcGIS4326.features[0].geometry as any).rings[0][0][0].length
    ).toBe(2);
  });

  test("should convert a pbf POLYGON PAGE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonPage6Partial.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

    // inspect optional IFeature properties
    expect(arcgis.objectIdFieldName).toBe("FID");
    expect(arcgis.globalIdFieldName).toBe("GlobalID");
    expect(arcgis.displayFieldName).toBe(undefined);
    expect(arcgis.geometryType).toBe("esriGeometryPolygon");
    expect(arcgis.spatialReference.wkid).toBe(102100);
    expect(arcgis.spatialReference.latestWkid).toBe(3857);
    expect(arcgis.fields?.length).toBe(8);
    expect(arcgis.fieldAliases).toBe(undefined);
    expect(arcgis.hasZ).toBe(false);
    expect(arcgis.hasM).toBe(false);
    expect(arcgis.exceededTransferLimit).toBe(false);
    // inspect required IFeature properties (features)
    expect(arcgis.features.length).toBe(131);

    // inspect IField for required props
    expect(arcgis.fields[7].name).toBe("GlobalID");
    expect(arcgis.fields[7].type).toBe("esriFieldTypeGlobalID");
    // expected defined properties
    expect(arcgis.fields[7].alias).toBe("GlobalID");
    expect(arcgis.fields[7].domain).toBe(null);
    expect(arcgis.fields[7].defaultValue).toBe("NEWID() WITH VALUES");
    // expected undefined properties
    expect(arcgis.fields[7].nullable).toBe(undefined);
    expect(arcgis.fields[7].editable).toBe(undefined);
    expect((arcgis.fields[7] as any).sqlType).toBe("sqlTypeOther");
  });

  test("should properly decode a pbf that has populated domain in fields", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFWithDomainResponse.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    const decodedFieldWithDomain: IDomain = arcGIS.fields[26].domain;

    expect(decodedFieldWithDomain.type).toBe("codedValue");
    expect(decodedFieldWithDomain.name).toBe("YesNo");
    expect(decodedFieldWithDomain.codedValues.length).toBe(2);
    expect(decodedFieldWithDomain.codedValues[0].name).toBe("Yes");
    expect(decodedFieldWithDomain.codedValues[0].code).toBe("Yes");
    expect(decodedFieldWithDomain.codedValues[1].name).toBe("No");
    expect(decodedFieldWithDomain.codedValues[1].code).toBe("No");
  });
});

// this test is covering decodeFields/decodeField which was custom made to match the way ArcGIS JSON Fields object represents empty values.
// if we regenerate the decoder with a new Esri Feature Collection proto spec in the future, this test and transformations may need to be updated.
describe("decodeFields/decodeField: optional property handling", () => {
  test("should handle domain, editable, exactMatch, length, nullable, defaultValue", () => {
    // IField-like object from the decoder to be transformed into IField.
    const mockFields = [
      {
        // empty object
      },
      {
        // required IField props only
        name: "field1",
        fieldType: 1
      },
      {
        name: "field2",
        fieldType: 2,
        domain: "",
        editable: true,
        exactMatch: false,
        length: 0,
        nullable: true,
        defaultValue: ""
      },
      {
        name: "field3",
        fieldType: 3,
        domain:
          '{"type":"codedValue","name":"YesNo","codedValues":[{"name":"Yes","code":"Yes"},{"name":"No","code":"No"}]}',
        editable: false,
        exactMatch: true,
        length: 255,
        nullable: false,
        defaultValue: "default"
      }
    ];
    const decoded = decodeFields(mockFields);
    // required properties keys should be populated
    expect(decoded[0].name).toBeUndefined();
    expect(decoded[0].type).toBeUndefined();
    expect(decoded[0] as any).not.toHaveProperty("sqlType");
    // required properties should be decoded properly
    expect(decoded[1].name).toBe("field1");
    expect(decoded[1].type).toBe("esriFieldTypeInteger");
    // optional properties should be decoded situationally:
    // or not present on the object if not defined
    expect(decoded[2].domain).toBe(null);
    expect(decoded[2].defaultValue).toBe(null);
    expect(decoded[2].editable).toBe(true);
    expect(decoded[2].exactMatch).toBe(false);
    expect(decoded[2].nullable).toBe(true);
    expect(decoded[2]).not.toHaveProperty("length");
    // optional properties should be decoded properly when defined
    expect(decoded[3].editable).toBe(false);
    expect(decoded[3].exactMatch).toBe(true);
    expect(decoded[3].length).toBe(255);
    expect(decoded[3].nullable).toBe(false);
    expect(decoded[3].defaultValue).toBe("default");
    expect(decoded[3].domain).toEqual({
      type: "codedValue",
      name: "YesNo",
      codedValues: [
        {
          name: "Yes",
          code: "Yes"
        },
        {
          name: "No",
          code: "No"
        }
      ]
    });
  });
});

describe("equality: pbfToArcGIS objects should closely match ArcGIS JSON response objects", () => {
  test("should compare pbfToArcGIS POLYGON response with arccgis POLYGON response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISPolygonResponse.json";
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );
    // check for object equality
    expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
    expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
    expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
    expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
    expect(arcGIS.exceededTransferLimit).toEqual(
      pbfArcGIS.exceededTransferLimit
    );
    expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

    // properties not on IFeature interface
    expect((arcGIS as any).uniqueIdField).toEqual(
      (pbfArcGIS as any).uniqueIdField
    );
    expect((arcGIS as any).geometryProperties).toEqual(
      (pbfArcGIS as any).geometryProperties
    );

    // the current pbf decoder does not define length property on String FieldTypes
    expect(arcGIS.fields[3].length).toEqual(100);
    expect(pbfArcGIS.fields[3].length).toBeUndefined();

    // check that fields are equal for both
    expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
    // check that features are equal for both
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
  });

  test("should compare pbfToArcGIS POINT response with arcgis POINT response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISPointResponse.json";
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // check for object differences
    expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
    expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
    expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
    expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
    expect(arcGIS.exceededTransferLimit).toEqual(
      pbfArcGIS.exceededTransferLimit
    );
    expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

    // properties not on IFeature interface
    expect((arcGIS as any).uniqueIdField).toEqual(
      (pbfArcGIS as any).uniqueIdField
    );
    expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);

    // decoder does not define length property on fields
    expect(pbfArcGIS.fields[1].length).toBeUndefined();
    expect(arcGIS.fields[1].length).toBe(10);
    // decoder does not define description property on fields
    expect((pbfArcGIS.fields[1] as any).description).toBeUndefined();
    expect((arcGIS.fields[1] as any).description).toBeDefined();
    //
    expect(arcGIS.fields[1].type).toBe("esriFieldTypeString");
    expect((arcGIS.fields[1] as any).sqlType).toBe("sqlTypeOther");
  });

  test("should compare pbfToArcGIS LINE response with arcgis LINE response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISLineResponse.json";
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // check for object equality
    expect(arcGIS.objectIdFieldName).toEqual(pbfArcGIS.objectIdFieldName);
    expect(arcGIS.globalIdFieldName).toEqual(pbfArcGIS.globalIdFieldName);
    expect(arcGIS.displayFieldName).toEqual(pbfArcGIS.displayFieldName);
    expect(arcGIS.spatialReference).toEqual(pbfArcGIS.spatialReference);
    expect(arcGIS.exceededTransferLimit).toEqual(
      pbfArcGIS.exceededTransferLimit
    );
    expect(arcGIS.geometryType).toEqual(pbfArcGIS.geometryType);

    // properties not on IFeature interface
    expect((arcGIS as any).uniqueIdField).toEqual(
      (pbfArcGIS as any).uniqueIdField
    );
    expect((arcGIS as any).geometryProperties.units).toEqual(
      (pbfArcGIS as any).geometryProperties.units
    );
    // since LINE has only one dimension, arcgis returns one dimension while the decoder returns both with an empty dimension
    expect((arcGIS as any).geometryProperties.shapeLengthFieldName).toEqual(
      (pbfArcGIS as any).geometryProperties.shapeLengthFieldName
    );
    expect(
      (arcGIS as any).geometryProperties.shapeAreaFieldName
    ).toBeUndefined();
    expect((pbfArcGIS as any).geometryProperties.shapeAreaFieldName).toBe("");

    expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
  });
});

describe("precision: pbfToArcGIS geometries should closely match ArcGIS JSON response geometries up to an acceptable precision tolerance", () => {
  test("pbfToArcGIS POINT geometry shape and precisions should closely match arcgis POINT geometry shape and precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointResponse.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISPointResponse.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // (Web Mercator - max distance at equator)
    // 1 decimal: 10 meters
    // 2 decimals: 1 meter
    // 3 decimals: 0.1 meter (10 centimeters)
    // 4 decimals: 0.01 meter (1 centimeter)
    // 5 decimals: 0.001 meter (1 millimeter)
    // 6 decimals: 0.0001 meter (0.1 millimeter, or 100 micrometers at equator)
    const pbfPoint = pbfArcGIS.features[0].geometry as IPoint;
    const arcGISPoint = arcGIS.features[0].geometry as IPoint;
    const tolerance = CoordinateToleranceEnum.EPSG_3857; // .1 millimeters at equator in Web Mercator
    const arr1 = [pbfPoint.x, pbfPoint.y];
    const arr2 = [arcGISPoint.x, arcGISPoint.y];
    const maxDrift = maxDifference(arr1, arr2);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS LINE geometry shape and precisions should closely match arcgis LINE geometry shape and precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineResponse.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISLineResponse.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous test
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[0].geometry as any).paths;
    const arcGISCoords = (arcGIS.features[0].geometry as any).paths;

    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS POLYGON geometry shape and precisions should closely match arcgis POLYGON geometry shape and precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonResponse.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/arcGISPolygonResponse.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous tests
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[0].geometry as any).rings;
    const arcGISCoords = (arcGIS.features[0].geometry as any).rings;
    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });
});
