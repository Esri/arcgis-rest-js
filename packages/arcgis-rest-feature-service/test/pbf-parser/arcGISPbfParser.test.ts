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
import pbfToGeoJSON from "../../src/pbf-parser/geoJSONPbfParser.js";

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
    expect(arcgis.hasZ).toBe(undefined);
    expect(arcgis.hasM).toBe(undefined);
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
    // inspect geometry for expected shape and properties
    expect(arcgis.features[0].geometry).toHaveProperty("rings");
    expect((arcgis.features[0].geometry as any).rings.length).toBe(1);
    expect((arcgis.features[0].geometry as any).rings[0].length).toBe(181);
    expect((arcgis.features[0].geometry as any).rings[0][0].length).toBe(2);
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
    expect(arcgis.hasZ).toBe(undefined);
    expect(arcgis.hasM).toBe(undefined);
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
    // inspect geometry for expected shape and properties
    expect(arcgis.features[0].geometry).toHaveProperty("x");
    expect(arcgis.features[0].geometry).toHaveProperty("y");
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
    expect(arcgis.hasZ).toBe(undefined);
    expect(arcgis.hasM).toBe(undefined);
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

    expect(arcgis.features[0].geometry).toHaveProperty("paths");
    expect((arcgis.features[0].geometry as any).paths.length).toBe(1);
    expect((arcgis.features[0].geometry as any).paths[0].length).toBe(22);
    expect((arcgis.features[0].geometry as any).paths[0][0].length).toBe(2);
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
    expect((pbfArcGIS4326.features[0].geometry as any).rings[0].length).toBe(
      30
    );
    expect((pbfArcGIS4326.features[0].geometry as any).rings[0][0].length).toBe(
      2
    );
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
    expect(arcgis.hasZ).toBe(undefined);
    expect(arcgis.hasM).toBe(undefined);
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

  test("should convert pbf POINT with M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    // expect hasM to be true in the decoded response
    expect(arcGIS.hasM).toBe(true);
    // expect null M values to decode to null
    expect((arcGIS.features[0].geometry as IPoint).m).toBeDefined();
    expect((arcGIS.features[0].geometry as IPoint).m).toBeNull();
    // expect 0 M values to decode to 0
    expect((arcGIS.features[1].geometry as IPoint).m).toBe(0);
    // expect floating point M values to decode within very high precision in web mercator
    expect((arcGIS.spatialReference as any).latestWkid).toBe(3857);
    expect((arcGIS.features[2].geometry as IPoint).m).toBeCloseTo(12.34, 9);
  });

  test("should convert pbf LINE with M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    // expect hasM to be true in the decoded response
    expect(arcGIS.hasM).toBe(true);
    // expect lines with M values to have 3 coordinates per point [x, y, m]
    expect(
      arcGIS.features.every(
        (feature) => (feature.geometry as any).paths[0][0].length === 3
      )
    ).toBe(true);
    // expect whole number M values to decode to whole numbers
    expect((arcGIS.features[0].geometry as any).paths[0][0][2]).toBe(3);
    expect((arcGIS.features[0].geometry as any).paths[0][1][2]).toBe(5);
    // expect floating point M values in LINES to decode within very high precision in web mercator
    expect((arcGIS.spatialReference as any).latestWkid).toBe(3857);
    expect((arcGIS.features[1].geometry as any).paths[0][0][2]).toBeCloseTo(
      2.3,
      9
    );
  });

  test("should convert pbf POLYGON with M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);

    expect(arcGIS.hasM).toBe(true);
    expect((arcGIS.features[2].geometry as any).rings[0].length).toBe(4);
    expect((arcGIS.features[2].geometry as any).rings[0][0].length).toBe(3);
    // expect M value to be present as 3rd coordinate in rings array
    expect((arcGIS.features[2].geometry as any).rings[0][2][2]).toBe(345);
    // expect closed ring M values to be the same
    expect((arcGIS.features[2].geometry as any).rings[0][0][2]).toBe(123);
    expect((arcGIS.features[2].geometry as any).rings[0][3][2]).toBe(123);
  });

  test("should convert 3D pbf POINT with Z values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasZ.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    // expect hasZ to be true in the decoded response
    expect(arcGIS.hasZ).toBe(true);
    expect((arcGIS.features[0].geometry as IPoint).z).toBeDefined();
    // expect 0 or null Z values to decode to 0 in Z coordinate
    expect((arcGIS.features[0].geometry as IPoint).z).toBe(0);
    // expect whole Z values to decode
    expect((arcGIS.features[1].geometry as IPoint).z).toBe(67);
    // expect floating point Z values to decode within very high precision in web mercator
    expect((arcGIS.spatialReference as any).latestWkid).toBe(3857);
    expect((arcGIS.features[2].geometry as IPoint).z).toBeCloseTo(123.45, 9);
  });

  test("should convert 3D pbf LINE with Z values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasZ.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    // expect hasZ to be true in the decoded response
    expect(arcGIS.hasZ).toBe(true);
    // expect lines with Z values to have 3 coordinates per point [x, y, z]
    expect(
      arcGIS.features.every(
        (feature) => (feature.geometry as any).paths[0][0].length === 3
      )
    ).toBe(true);
    // expect zero Z values to decode to 0 in Z coordinate
    expect((arcGIS.features[2].geometry as any).paths[0][0][2]).toBe(0);
    // expect null sentinel? value for M values to decode to real value in Z coordinate
    expect((arcGIS.features[2].geometry as any).paths[0][1][2]).toBe(
      1000000000
    );
    // expect 0 sentinel value for M values to decode to real value in Z coordinate
    expect((arcGIS.features[2].geometry as any).paths[0][3][2]).toBe(-100000);
    // expect whole Z values to decode
    expect((arcGIS.features[2].geometry as any).paths[0][7][2]).toBe(8);
  });

  test("should convert 3D pbf POLYGON with Z values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasZ.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);

    expect(arcGIS.hasZ).toBe(true);
    // expect Z coordinate to be present as 3rd coordinate in rings array
    expect((arcGIS.features[2].geometry as any).rings[0][0].length).toBe(3);
  });

  test("should convert pbf POINT with Z and M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasZM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    // expect hasZ to be true in the decoded response
    expect(arcGIS.hasZ).toBe(true);
    expect(arcGIS.hasM).toBe(true);
    expect((arcGIS.features[0].geometry as IPoint).z).toBeDefined();
    expect((arcGIS.features[0].geometry as IPoint).m).toBeDefined();
    // expect all Z values to decode correctly
    expect((arcGIS.features[0].geometry as IPoint).z).toBe(40);
    expect((arcGIS.features[1].geometry as IPoint).z).toBe(55);
    expect((arcGIS.features[2].geometry as IPoint).z).toBe(0);
    // expect all M values to decode correctly
    expect((arcGIS.features[0].geometry as IPoint).m).toBe(0);
    expect((arcGIS.features[1].geometry as IPoint).m).toBe(null);
    expect((arcGIS.features[2].geometry as IPoint).m).toBe(3);
  });

  test("should convert pbf LINE with Z and M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasZM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    expect(arcGIS.hasZ).toBe(true);
    expect(arcGIS.hasM).toBe(true);
    // expect lines with Z and M values to have 4 coordinates per point [x, y, z, m]
    expect(
      arcGIS.features.every(
        (feature) => (feature.geometry as any).paths[0][0].length === 4
      )
    ).toBe(true);
    // expect Z values to decode
    expect((arcGIS.features[0].geometry as any).paths[0][0][2]).toBe(5);
    expect((arcGIS.features[0].geometry as any).paths[0][1][2]).toBe(33);
    expect((arcGIS.features[0].geometry as any).paths[0][2][2]).toBe(77);
    // expect M values to decode
    expect((arcGIS.features[0].geometry as any).paths[0][0][3]).toBeCloseTo(
      53.35,
      9
    );
    expect((arcGIS.features[0].geometry as any).paths[0][1][3]).toBeCloseTo(
      3.5,
      9
    );
    expect((arcGIS.features[0].geometry as any).paths[0][2][3]).toBeCloseTo(
      5.3,
      9
    );
  });

  test("should convert pbf POLYGON with Z and M values to arcgis object", async () => {
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasZM.pbf"
    );
    const arcGIS = pbfToArcGIS(arrayBuffer);
    expect(arcGIS.hasZ).toBe(true);
    expect(arcGIS.hasM).toBe(true);
    // expect Z and M coordinates to be present as 3rd and 4th coordinates in rings array
    expect((arcGIS.features[2].geometry as any).rings[0][0].length).toBe(4);
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

  test("should compare ZM POINT pbf response with arcgis POINT ZM response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasZM.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PointHasZM.json";
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // parsed pbf has these properties
    arcGIS.exceededTransferLimit = false;
    (arcGIS as any).geometryFields = [];
    // arcGIS has length that pbf proto doesnt define
    pbfArcGIS.fields[1].length = 38;
    // expect top level propeerties to be the same
    const topPbfObject = {
      ...pbfArcGIS,
      features: [] as any[]
    };
    const topArcGISObject = {
      ...arcGIS,
      features: [] as any[]
    };

    expect(topArcGISObject).toEqual(topPbfObject);
    // expect features length and coordinates to be equal and present
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
    const arcGISGeometry = arcGIS.features[0].geometry as any;
    const pbfArcGISGeometry = pbfArcGIS.features[0].geometry as any;
    expect(arcGISGeometry).toHaveProperty("z");
    expect(arcGISGeometry).toHaveProperty("m");
    expect(pbfArcGISGeometry).toHaveProperty("z");
    expect(pbfArcGISGeometry).toHaveProperty("m");
    expect(arcGISGeometry.z).toEqual((pbfArcGISGeometry as any).z);
    expect(arcGISGeometry.m).toEqual((pbfArcGISGeometry as any).m);
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

  test("pbfToArcGIS M POINT geometry coordinate precisions with M values should closely match arcgis M POINT geometry coordinate precisions with M values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PointHasM.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfPoint = pbfArcGIS.features[0].geometry as IPoint;
    const arcGISPoint = arcGIS.features[0].geometry as IPoint;
    const arr1 = [pbfPoint.x, pbfPoint.y, pbfPoint.m];
    const arr2 = [arcGISPoint.x, arcGISPoint.y, arcGISPoint.m];
    const maxDrift = maxDifference(arr1, arr2);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS M LINE geometry coordinate precisions with M values should closely match arcgis M LINE geometry coordinate precisions with M values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/LineHasM.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous test
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[1].geometry as any).paths;
    const arcGISCoords = (arcGIS.features[1].geometry as any).paths;

    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS M POLYGON geometry coordinate precisions with M values should closely match arcgis M POLYGON geometry coordinate precisions with M values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PolygonHasM.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous tests
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[2].geometry as any).rings;
    const arcGISCoords = (arcGIS.features[2].geometry as any).rings;
    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS Z POINT geometry coordinate precisions with Z values should closely match arcgis Z POINT geometry coordinate precisions with Z values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasZ.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PointHasZ.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfPoint = pbfArcGIS.features[2].geometry as IPoint;
    const arcGISPoint = arcGIS.features[2].geometry as IPoint;
    const arr1 = [pbfPoint.x, pbfPoint.y, pbfPoint.z];
    const arr2 = [arcGISPoint.x, arcGISPoint.y, arcGISPoint.z];
    const maxDrift = maxDifference(arr1, arr2);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS Z LINE geometry coordinate precisions with Z values should closely match arcgis Z LINE geometry coordinate precisions with Z values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasZ.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/LineHasZ.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous test
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[2].geometry as any).paths;
    const arcGISCoords = (arcGIS.features[2].geometry as any).paths;
    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS Z POLYGON geometry coordinate precisions with Z values should closely match arcgis Z POLYGON geometry coordinate precisions with Z values", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasZ.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PolygonHasZ.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous tests
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[2].geometry as any).rings;
    const arcGISCoords = (arcGIS.features[2].geometry as any).rings;
    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS ZM POINT geometry coordinate precisions should closely match arcgis ZM POINT geometry coordinate precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPointHasZM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PointHasZM.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous tests
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfPoint = pbfArcGIS.features[0].geometry as IPoint;
    const arcGISPoint = arcGIS.features[0].geometry as IPoint;
    const arr1 = [pbfPoint.x, pbfPoint.y, pbfPoint.z, pbfPoint.m];
    const arr2 = [arcGISPoint.x, arcGISPoint.y, arcGISPoint.z, arcGISPoint.m];
    const maxDrift = maxDifference(arr1, arr2);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS ZM LINE geometry coordinate precisions should closely match arcgis ZM LINE geometry coordinate precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFLineHasZM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/LineHasZM.json";

    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);
    const arcGIS: IQueryFeaturesResponse = await readEnvironmentFileToJSON(
      pathJSON
    );

    // see precision comments in previous tests
    const tolerance = CoordinateToleranceEnum.EPSG_3857;
    const pbfCoords = (pbfArcGIS.features[0].geometry as any).paths;
    const arcGISCoords = (arcGIS.features[0].geometry as any).paths;

    const maxDrift = maxDifference(pbfCoords, arcGISCoords);
    expect(maxDrift?.diff).toBeLessThan(tolerance);
  });

  test("pbfToArcGIS ZM POLYGON geometry coordinate precisions should closely match arcgis ZM POLYGON geometry coordinate precisions", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/CRS3857/PBFPolygonHasZM.pbf";
    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/arcgis/PolygonHasZM.json";

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
