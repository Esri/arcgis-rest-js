/**
 * This code has been adapted from [arcgis-pbf-parser] ([https://github.com/rowanwins/arcgis-pbf-parser])
 * Modifications have been made for use in this project.
 */

import { GeometryType, IFeatureSet, IField } from "@esri/arcgis-rest-request";
import { FeatureCollectionPBuffer as EsriPbfBuffer } from "./PbfFeatureCollection.js";
import Pbf from "pbf";

export function pbfToArcGIS(featureCollectionBuffer: ArrayBuffer): IFeatureSet {
  let decodedObject;
  try {
    decodedObject = EsriPbfBuffer.read(new Pbf(featureCollectionBuffer));
  } catch (error) {
    /* istanbul ignore next --@preserve */
    throw new Error(`Could not parse arcgis-pbf buffer: ${error}`);
  }
  if (!decodedObject.queryResult) {
    throw new Error("Could not parse arcgis-pbf buffer: Missing queryResult.");
  }
  const featureResult: IFeatureSet = decodedObject.queryResult.featureResult;
  const transform = decodedObject.queryResult.featureResult.transform;
  const geometryType: number =
    decodedObject.queryResult.featureResult.geometryType;

  // 1. We want to decode and assign all the top level properties of IFeatureSet from featureResult
  const out: IFeatureSet = {
    ...featureResult,
    // decode geometry type
    geometryType: getGeometryType(geometryType)
  };

  // 2. We want to convert all the fields to match IFields
  // a. create a map of fieldType values to their string names using the EsriPbfBuffer.FieldType enum (which map to a property "type" instead of "fieldType").
  const fieldTypeMap: Record<number, string> = {};
  for (const [key, obj] of Object.entries(EsriPbfBuffer.FieldType)) {
    fieldTypeMap[(obj as any).value] = key;
  }
  // b. create a map of sqlType values to their string names using the EsriPbfBuffer.SQLType enum.
  const sqlTypeMap: Record<number, string> = {};
  for (const [key, obj] of Object.entries(EsriPbfBuffer.SQLType)) {
    sqlTypeMap[(obj as any).value] = key;
  }
  // c. decode a field object, mapping sqlType and fieldType, and normalizing domain/defaultValue
  const decodedFields = featureResult.fields.map((field: any) =>
    decodeField(field, fieldTypeMap, sqlTypeMap)
  );
  out.fields = decodedFields;

  // 3. We want to convert all the features to match IFeature
  // Put field keynames on each field objest so we can access the correct attribute value later
  //console.log("fields before keyName assignment:", decodedObject.queryResult.featureResult.fields);
  const fields = decodedObject.queryResult.featureResult.fields;
  for (let index = 0; index < fields.length; index++) {
    const field = fields[index];
    field.keyName = getKeyName(field);
  }
  // get geometry parser so we can decode geometries
  const geometryParser = getGeometryParser(geometryType);

  // build features with decoded attributes and geometry
  const featureLen = featureResult.features.length;
  const features = [] as any[];
  for (let index = 0; index < featureLen; index++) {
    const f = featureResult.features[index];
    features.push({
      attributes: collectAttributes(fields, f.attributes),
      geometry: ((f.geometry && geometryParser(f, transform)) as any) || null
    });
  }
  // assign features to output
  out.features = features;

  // 4. Finally, we want to purge all properties that are not part of IFeatureSet from the output object (optionally retain some if needed)
  const testOut = purgeIFeatureSetProps(out);
  // return out;
  return testOut;
}

// Fields: since the generated PbfFeatureCollection doesnt decode these in the same way I can either edit that or add functionality here to replace what it likely should be doing to decode field types
function decodeField(
  field: any,
  fieldTypeMap: Record<number, string>,
  sqlTypeMap?: Record<number, string>
): IField {
  const optionalProps: Array<[string, (f: any) => any]> = [
    ["alias", (f) => f.alias],
    // TODO: ? is domain a value that needs to be decoded similar to type?
    ["domain", (f) => (f.domain === "" ? null : f.domain)],
    ["editable", (f) => f.editable],
    ["exactMatch", (f) => f.exactMatch],
    ["length", (f) => f.length],
    ["nullable", (f) => f.nullable],
    ["defaultValue", (f) => (f.defaultValue === "" ? null : f.defaultValue)],
    /**
     * This property doesnt exist on interface but was returned on the ArcGIS json response
     * and by PbfFeatureCollection definition with a value.
     */
    ["sqlType", (f) => (sqlTypeMap ? sqlTypeMap[f.sqlType] : undefined)]
  ];

  const out: any = {
    name: field.name,
    type: fieldTypeMap[field.fieldType]
  };

  for (const [key, getter] of optionalProps) {
    if (field[key] !== undefined) {
      out[key] = getter(field);
    }
  }
  return out;
}

function getKeyName(fields: any) {
  switch (fields.fieldType) {
    case 1:
      return "sintValue";
    case 2:
      return "floatValue";
    case 3:
      return "doubleValue";
    case 4:
      return "stringValue";
    /* istanbul ignore next --@preserve */
    case 5:
      return "sint64Value";
    case 6:
      return "uintValue";
    default:
      return null;
  }
}

function collectAttributes(fields: any, featureAttributes: any) {
  const out = {} as { [key: string]: any };
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (featureAttributes[i][featureAttributes[i].value_type] !== undefined)
      out[f.name] = featureAttributes[i][featureAttributes[i].value_type];
    else out[f.name] = null;
  }
  return out;
}

function purgeIFeatureSetProps(featureResult: any): IFeatureSet {
  // List of keys on arcgis json and pbf response that are not part of IFeatureSet
  const excludeKeys: string[] = [
    "serverGens",
    "geohashFieldName",
    "transform",
    "values"
    // Add any other keys to exclude
  ];
  const out: Partial<IFeatureSet> = {};
  Object.keys(featureResult).forEach((key) => {
    if (!excludeKeys.includes(key)) {
      (out as any)[key] = featureResult[key];
    }
  });
  return out as IFeatureSet;
}

// * @property {number} esriGeometryTypePoint=0 esriGeometryTypePoint value
// * @property {number} esriGeometryTypeMultipoint=1 esriGeometryTypeMultipoint value
// * @property {number} esriGeometryTypePolyline=2 esriGeometryTypePolyline value
// * @property {number} esriGeometryTypePolygon=3 esriGeometryTypePolygon value
// * @property {number} esriGeometryTypeMultipatch=4 esriGeometryTypeMultipatch value
// * @property {number} esriGeometryTypeNone=127 esriGeometryTypeNone value
function getGeometryParser(featureType: number) {
  switch (featureType) {
    case 3:
      return createPolygon;
    case 2:
      return createLine;
    case 0:
      return createPoint;
    /* istanbul ignore next --@preserve */
    default:
      return createPolygon;
  }
}

function getGeometryType(featureType: number): GeometryType {
  switch (featureType) {
    case 0:
      return "esriGeometryPoint";
    case 2:
      return "esriGeometryPolyline";
    case 3:
      return "esriGeometryPolygon";
    default:
      throw new Error("Geometry type not supported.");
  }
}

function createPoint(f: any, transform: any) {
  const p = {
    type: "Point",
    coordinates: transformTuple(f.geometry.coords, transform)
  };
  const ret = {
    x: p.coordinates[0],
    y: p.coordinates[1]
  };
  // structure output according to arcgis point geometry spec
  if (p.coordinates.length > 2) {
    return { ...ret, z: p.coordinates[2] };
  }
  return ret;
}

function createLine(f: any, transform: any) {
  let l = null;
  const lengths = f.geometry.lengths.length;

  /* istanbul ignore else if --@preserve */
  if (lengths === 1) {
    l = {
      type: "LineString",
      coordinates: createLinearRing(
        f.geometry.coords,
        transform,
        0,
        f.geometry.lengths[0] * 2
      )
    };
  } else if (lengths > 1) {
    l = {
      type: "MultiLineString",
      coordinates: []
    };
    let startPoint = 0;
    for (let index = 0; index < lengths; index++) {
      const stopPoint = startPoint + f.geometry.lengths[index] * 2;
      const line = createLinearRing(
        f.geometry.coords,
        transform,
        startPoint,
        stopPoint
      );
      l.coordinates.push(line);
      startPoint = stopPoint;
    }
  }
  // structure output according to arcgis line geometry spec
  return {
    paths: l.coordinates
  };
}

function createPolygon(f: any, transform: any) {
  const lengths = f.geometry.lengths.length;

  const p = {
    type: "Polygon",
    coordinates: [] as any[]
  };

  if (lengths === 1) {
    p.coordinates.push(
      createLinearRing(
        f.geometry.coords,
        transform,
        0,
        f.geometry.lengths[0] * 2
      )
    );
  } else {
    p.type = "MultiPolygon";

    let startPoint = 0;
    for (let index = 0; index < lengths; index++) {
      const stopPoint = startPoint + f.geometry.lengths[index] * 2;
      const ring = createLinearRing(
        f.geometry.coords,
        transform,
        startPoint,
        stopPoint
      );

      // Check if the ring is clockwise, if so it's an outer ring
      // If it's counter-clockwise its a hole and so push it to the prev outer ring
      // This is perhaps a bit naive
      // see https://github.com/terraformer-js/terraformer/blob/master/packages/arcgis/src/geojson.js
      // for a fuller example of doing this
      /* istanbul ignore else if --@preserve */
      if (ringIsClockwise(ring)) {
        p.coordinates.push([ring]);
      } else if (p.coordinates.length > 0) {
        p.coordinates[p.coordinates.length - 1].push(ring);
      }
      startPoint = stopPoint;
    }
  }
  // structure output according to arcgis polygon geometry spec
  return {
    rings: p.coordinates
  };
}

function ringIsClockwise(ringToTest: any) {
  let total = 0;
  let i = 0;
  const rLength = ringToTest.length;
  let pt1 = ringToTest[i];
  let pt2;
  for (i; i < rLength - 1; i++) {
    pt2 = ringToTest[i + 1];
    total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
    pt1 = pt2;
  }
  return total >= 0;
}

function createLinearRing(
  arr: number[],
  transform: any,
  startPoint: number,
  stopPoint: number
) {
  const out = [] as any[];
  /* istanbul ignore if --@preserve */
  if (arr.length === 0) return out;

  const initialX = arr[startPoint];
  const initialY = arr[startPoint + 1];
  out.push(transformTuple([initialX, initialY], transform));
  let prevX = initialX;
  let prevY = initialY;
  for (let i = startPoint + 2; i < stopPoint; i = i + 2) {
    const x = difference(prevX, arr[i]);
    const y = difference(prevY, arr[i + 1]);
    const transformed = transformTuple([x, y], transform);
    out.push(transformed);
    prevX = x;
    prevY = y;
  }
  return out;
}

/* istanbul ignore next --@preserve */
function transformTuple(coords: any, transform: any) {
  let x = coords[0];
  let y = coords[1];

  let z = coords[2] ? coords[2] : undefined;
  if (transform.scale) {
    x *= transform.scale.xScale;
    y *= -transform.scale.yScale;
    if (undefined !== z) {
      z *= transform.scale.zScale;
    }
  }
  if (transform.translate) {
    x += transform.translate.xTranslate;
    y += transform.translate.yTranslate;
    if (undefined !== z) {
      z += transform.translate.zTranslate;
    }
  }
  const ret = [x, y];
  if (undefined !== z) {
    ret.push(z);
  }
  return ret;
}

function difference(a: any, b: any) {
  return a + b;
}
