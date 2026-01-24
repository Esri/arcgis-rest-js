import { describe, expect, test } from "vitest";
import {
  IQueryFeaturesOptions,
  IQueryFeaturesResponse,
  queryFeatures
} from "../../src/query.js";
import pbfToArcGIS from "../../src/pbf-parser/arcGISPbfParser.js";

describe("decode: arcGISPbfParser should decode each geometry type", () => {
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
    expect((pbfArcGIS as any).geometryProperties.shapeAreaFieldName).toBe("");

    expect(arcGIS.fields.length).toEqual(pbfArcGIS.fields.length);
    expect(arcGIS.features.length).toEqual(pbfArcGIS.features.length);
  });
});
