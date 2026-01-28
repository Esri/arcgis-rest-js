import { test, describe, expect } from "vitest";
import pbfToArcGIS from "../../src/pbf-parser/arcGISPbfParser.js";
import {
  readEnvironmentFileToArrayBuffer,
  readEnvironmentFileToJSON
} from "../utils/readFileArrayBuffer.js";
import { IQueryFeaturesResponse } from "../../src/query.js";

describe("decode: arcGISPbfParser should convert pbf-as-arcgis arraybuffers to arcGIS JSON objects", () => {
  test("should convert a pbf single feature POLYGON to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

    // optional properties
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
    // required properties
    expect(arcgis.features.length).toBe(1);

    // inspect fields for required props
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
    expect((arcgis.fields[0] as any).sqlType).toBe(undefined);
  });

  test("should convert a pbf single feature POINT to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPointResponse.pbf";
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
    expect((arcgis.fields[3] as any).sqlType).toBe(undefined);
  });

  test("should convert a pbf single feature LINE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFLineResponse.pbf";
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

    // inspect fields for required props
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
    expect((arcgis.fields[4] as any).sqlType).toBe(undefined);
  });

  test("should convert a pbf POLYGON PAGE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage6Partial.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const arcgis = pbfToArcGIS(arrayBuffer);

    // optional properties
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
    // required properties
    expect(arcgis.features.length).toBe(131);

    // inspect fields for required props
    expect(arcgis.fields[7].name).toBe("GlobalID");
    expect(arcgis.fields[7].type).toBe("esriFieldTypeGlobalID");
    // expected defined properties
    expect(arcgis.fields[7].alias).toBe("GlobalID");
    expect(arcgis.fields[7].domain).toBe(null);
    expect(arcgis.fields[7].defaultValue).toBe("NEWID() WITH VALUES");
    // expected undefined properties
    expect(arcgis.fields[7].nullable).toBe(undefined);
    expect(arcgis.fields[7].editable).toBe(undefined);
    // sqlType not on IFields interface at the moment
    expect((arcgis.fields[7] as any).sqlType).toBe(undefined);
  });
});

describe("equality: pbfToArcGIS objects should closely match ArcGIS JSON response objects", () => {
  test("should compare pbfToArcGIS POLYGON response with arccgis POLYGON response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/polygon/arcGISPolygonResponse.json";
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

  test("should compare pbfToArcGIS POINT response with arcgis POINT response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPointResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/point/arcGISPointResponse.json";
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

    // properties not on interface
    expect((arcGIS as any).uniqueIdField).toEqual(
      (pbfArcGIS as any).uniqueIdField
    );
    // pbf decoder adds null geometry properties when geometryProperties are absent
    expect(arcGIS as any).not.toHaveProperty("geometryProperties");
    expect((pbfArcGIS as any).geometryProperties).toBe(null);

    expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);

    // decoder does not return length on fields
    expect(pbfArcGIS.fields[1].length).toBeUndefined();
    expect(arcGIS.fields[1].length).toBe(10);
    // decoder does not return description on fields
    expect((pbfArcGIS.fields[1] as any).description).toBeUndefined();
    expect((arcGIS.fields[1] as any).description).toBeDefined();
    //
    expect(arcGIS.fields[1].type).toBe("esriFieldTypeString");
    expect((arcGIS.fields[1] as any).sqlType).toBe("sqlTypeOther");
  });

  test("should compare pbfToArcGIS LINE response with arcgis LINE response", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFLineResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const pbfArcGIS = pbfToArcGIS(arrayBuffer);

    const pathJSON =
      "./packages/arcgis-rest-feature-service/test/mocks/line/arcGISLineResponse.json";
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

    // properties not on interface
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
