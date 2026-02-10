/**
 * This code has been adapted from [arcgis-pbf-parser] ([https://github.com/rowanwins/arcgis-pbf-parser])
 * Modifications have been made for use in REST JS.
 */
import { GeometryType, IFeature, IField } from "@esri/arcgis-rest-request";
import Pbf from "pbf";
import { IQueryFeaturesResponse } from "../query.js";
import {
  readFeatureCollectionPBuffer,
  FeatureCollectionPBufferFieldType,
  FeatureCollectionPBufferSQLType
} from "./PbfFeatureCollectionV2.js";

export default function pbfToArcGIS(
  featureCollectionBuffer: ArrayBuffer | Uint8Array | Buffer
): IQueryFeaturesResponse {
  const decodedObject = decode(featureCollectionBuffer);

  const featureResult = decodedObject.queryResult.featureResult;
  const transform = decodedObject.queryResult.featureResult.transform;
  const geometryType = decodedObject.queryResult.featureResult.geometryType;

  // Assign all the top level properties
  const out: IQueryFeaturesResponse = {
    ...featureResult,
    geometryType: getGeometryType(geometryType)
    // fields and features will be constructed below
  };

  // istanbul ignore else --@preserve
  if (out.spatialReference) {
    // Remove any spatial reference fields with empty values
    out.spatialReference = removeEmptyValues(out.spatialReference);
  }

  // Normalize fields
  out.fields = decodeFields(featureResult.fields);

  // Get attribute and geometry transformations
  const attributeFields = featureResult.fields.map((field: any) => ({
    ...field,
    keyName: getKeyName(field)
  }));
  const geometryParser = getGeometryParser(geometryType);

  // Normalize Features
  out.features = featureResult.features.map(
    (f: any) =>
      ({
        attributes: collectAttributes(attributeFields, f.attributes),
        geometry: ((f.geometry && geometryParser(f, transform)) as any) || null
      } as IFeature)
  );

  // 4. Purge all properties that are not part of IQueryFeaturesResponse from the output object (optionally retain some if needed)
  const queryFeaturesResponse = normalizeFeatureResponse(out);
  return queryFeaturesResponse;
}

export function decode(
  featureCollectionBuffer: ArrayBuffer | Uint8Array | Buffer
): { value: string; queryResult: any } {
  let decodedObject;
  try {
    decodedObject = readFeatureCollectionPBuffer(
      new Pbf(featureCollectionBuffer)
    );
  } catch (error) {
    /* istanbul ignore next --@preserve */
    throw new Error(`Could not parse arcgis-pbf buffer: ${error}`);
  }
  if (!decodedObject.queryResult) {
    throw new Error("Could not parse arcgis-pbf buffer: Missing queryResult.");
  }
  return decodedObject;
}

export function decodeFields(fields: any[]) {
  // Build lookup maps
  const fieldTypeMap = buildKeyMap(FeatureCollectionPBufferFieldType);
  const sqlTypeMap = buildKeyMap(FeatureCollectionPBufferSQLType);

  return fields.map((field: any) =>
    // sqlMap exists on response on some feature services but not on the current REST JS IField interface
    decodeField(field, fieldTypeMap, sqlTypeMap)
  );
}

export function buildKeyMap(spec: any) {
  const map: Record<number, string> = {};
  for (const [key, val] of Object.entries(spec)) {
    map[val as number] = key;
  }
  return map;
}

// Fields: PbfFeatureCollection doesnt decode to IField
export function decodeField(
  field: any,
  fieldTypeMap: Record<number, string>,
  sqlTypeMap?: Record<number, string>
): IField {
  // configure getters that return arcgis json default values for optional props
  const optionalProps: Array<[string, (f: any) => any]> = [
    ["alias", (f) => f.alias],
    ["sqlType", (f) => sqlTypeMap[f.sqlType]],
    ["domain", (f) => (f.domain === "" ? null : JSON.parse(f.domain))],
    ["length", (f) => (f.length === 0 ? undefined : f.length)],
    ["editable", (f) => f.editable],
    ["exactMatch", (f) => f.exactMatch],
    ["nullable", (f) => f.nullable],
    ["defaultValue", (f) => (f.defaultValue === "" ? null : f.defaultValue)]
  ];

  // set required properties
  const out: any = {
    name: field.name,
    type: fieldTypeMap[field.fieldType]
  };

  // set optional properties
  for (const [key, getter] of optionalProps) {
    if (field[key] !== undefined) {
      const val = getter(field);
      if (val !== undefined) {
        out[key] = val;
      }
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

export function removeEmptyValues(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== 0 && value !== "")
  );
}

function normalizeFeatureResponse(featureResult: any): IQueryFeaturesResponse {
  // List of keys pbf decoder result that are not part of IQueryFeaturesResponse
  const excludeKeys: string[] = [
    "serverGens",
    "geohashFieldName",
    "transform",
    "values"
    // Add any other keys to exclude
  ];
  /**
   * Keys on arcGIS json response that are not part of IQueryFeaturesResponse that should probably not be excluded
   * uniqueIdField
   * geometryProperties
   */
  const out: Partial<IQueryFeaturesResponse> = {};
  Object.keys(featureResult).forEach((key) => {
    // only assign properties that are defined and on the IQueryFeaturesResponse
    if (!excludeKeys.includes(key) && featureResult[key] !== undefined) {
      (out as any)[key] = featureResult[key];
    }
  });
  return out as IQueryFeaturesResponse;
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
    // istanbul ignore next --@preserve
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
  // istanbul ignore if else --@preserve
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
  // https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polyline.html#paths
  return {
    paths: [l.coordinates]
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
