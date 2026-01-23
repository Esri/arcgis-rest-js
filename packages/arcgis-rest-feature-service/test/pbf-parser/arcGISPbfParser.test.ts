import { test, describe, expect } from "vitest";
import pbfToArcGIS from "../../src/pbf-parser/arcGISPbfParser.js";
import { readEnvironmentFileToArrayBuffer } from "../utils/readFileArrayBuffer.js";

describe("arcGISPbfParser unit tests ", () => {
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

    console.log(arcgis.features);
  });
});
