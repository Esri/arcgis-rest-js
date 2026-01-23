import { test, describe, expect } from "vitest";
import pbfToArcGIS from "../../src/pbf-parser/arcGISPbfParser.js";
import { readEnvironmentFileToArrayBuffer } from "../utils/readFileArrayBuffer.js";

describe("arcGISPbfParser unit tests ", () => {
  test("should convert a pbf single feature POLYGON to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const features = pbfToArcGIS(arrayBuffer);

    //console.log(features);

    // optional properties
    expect(features.objectIdFieldName).toBe("FID");
    expect(features.globalIdFieldName).toBe("");
    expect(features.displayFieldName).toBe(undefined);
    expect(features.geometryType).toBe("esriGeometryPolygon");
    expect(features.spatialReference.wkid).toBe(102100);
    expect(features.spatialReference.latestWkid).toBe(3857);
    expect(features.fields?.length).toBe(56);
    expect(features.fieldAliases).toBe(undefined);
    expect(features.hasZ).toBe(false);
    expect(features.hasM).toBe(false);
    expect(features.exceededTransferLimit).toBe(true);

    // required properties
    expect(features.features.length).toBe(1);

    // extra fields not on IFeatureSet
  });

  test("should convert a pbf single feature POINT to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPointResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const features = pbfToArcGIS(arrayBuffer);

    //console.log(features);

    // optional properties
    expect(features.objectIdFieldName).toBe("OBJECTID");
    expect(features.globalIdFieldName).toBe("");
    expect(features.displayFieldName).toBe(undefined);
    expect(features.geometryType).toBe("esriGeometryPoint");
    expect(features.spatialReference.wkid).toBe(102100);
    expect(features.spatialReference.latestWkid).toBe(3857);
    expect(features.fields?.length).toBe(8);
    expect(features.fieldAliases).toBe(undefined);
    expect(features.hasZ).toBe(false);
    expect(features.hasM).toBe(false);
    expect(features.exceededTransferLimit).toBe(true);

    // required properties
    expect(features.features.length).toBe(1);
  });

  test("should convert a pbf single feature LINE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFLineResponse.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const features = pbfToArcGIS(arrayBuffer);

    // optional properties
    expect(features.objectIdFieldName).toBe("OBJECTID");
    expect(features.globalIdFieldName).toBe("");
    expect(features.displayFieldName).toBe(undefined);
    expect(features.geometryType).toBe("esriGeometryPolyline");
    expect(features.spatialReference.wkid).toBe(102100);
    expect(features.spatialReference.latestWkid).toBe(3857);
    expect(features.fields?.length).toBe(14);
    expect(features.fieldAliases).toBe(undefined);
    expect(features.hasZ).toBe(false);
    expect(features.hasM).toBe(false);
    expect(features.exceededTransferLimit).toBe(true);

    // required properties
    expect(features.features.length).toBe(1);
  });

  test("should convert a pbf POLYGON PAGE to arcgis query features object", async () => {
    const path =
      "./packages/arcgis-rest-feature-service/test/mocks/pbf/PBFPolygonPage6Partial.pbf";
    const arrayBuffer = await readEnvironmentFileToArrayBuffer(path);
    const features = pbfToArcGIS(arrayBuffer);

    console.log(features);

    // optional properties
    expect(features.objectIdFieldName).toBe("FID");
    expect(features.globalIdFieldName).toBe("GlobalID");
    expect(features.displayFieldName).toBe(undefined);
    expect(features.geometryType).toBe("esriGeometryPolygon");
    expect(features.spatialReference.wkid).toBe(102100);
    expect(features.spatialReference.latestWkid).toBe(3857);
    expect(features.fields?.length).toBe(8);
    expect(features.fieldAliases).toBe(undefined);
    expect(features.hasZ).toBe(false);
    expect(features.hasM).toBe(false);
    expect(features.exceededTransferLimit).toBe(false);

    // required properties
    expect(features.features.length).toBe(131);

    // TODO: need to check fields for conversion integrity both against the fields decoder
    // and against the ArcGIS Json repsonse
  });
});
