/**
 * This code has been adapted from [arcgis-pbf-parser] ([https://github.com/rowanwins/arcgis-pbf-parser])
 * Modifications have been made for use in REST JS.
 */
import {
  ArcGISRequestError,
  GeometryType,
  IFeature,
  IField
} from "@esri/arcgis-rest-request";
import Pbf from "pbf";
import { IQueryFeaturesResponse } from "../query.js";
import {
  readFeatureCollectionPBuffer,
  FeatureCollectionPBufferFieldType,
  FeatureCollectionPBufferSQLType
} from "./PbfFeatureCollectionV2.js";

export default function pbfToArcGIS(
  featureCollectionBuffer: ArrayBuffer
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
  // Throw error if objectIdField does not exist in the fields
  if (
    out.fields.every(
      (field: any) => field.name !== featureResult.objectIdFieldName
    )
  ) {
    throw new ArcGISRequestError(
      `objectIdField '${featureResult.objectIdFieldName}' was not found.`,
      400
    );
  }

  // Get attribute and geometry transformations
  const attributeFields = featureResult.fields.map((field: any) => ({
    ...field,
    keyName: getKeyName(field)
  }));
  const geometryParser = getGeometryParser(geometryType);
  const hasZ = featureResult.hasZ === true;

  // Normalize Features
  out.features = featureResult.features.map(
    (f: any) =>
      ({
        attributes: collectAttributes(attributeFields, f.attributes),
        geometry:
          ((f.geometry && geometryParser(f, transform, hasZ)) as any) || null
      } as IFeature)
  );

  // 4. Purge all properties that are not part of IQueryFeaturesResponse from the output object (optionally retain some if needed)
  const queryFeaturesResponse = normalizeFeatureResponse(out);
  return queryFeaturesResponse;
}

export function decode(featureCollectionBuffer: ArrayBuffer): {
  value: string;
  queryResult: any;
} {
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
      return createPolyLine;
    case 0:
      return createPoint;
    /* istanbul ignore next --@preserve */
    default:
      throw new ArcGISRequestError("Geometry type not supported.", 501);
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
      throw new ArcGISRequestError("Geometry type not supported.", 501);
  }
}

function createPoint(f: any, transform: any, hasZ: boolean) {
  const dimensions = hasZ ? 3 : 2;
  const coordinates = transformTuple(
    f.geometry.coords.slice(0, dimensions),
    transform
  );

  const point: any = {
    x: coordinates[0],
    y: coordinates[1]
  };

  if (coordinates.length > 2) {
    point.z = coordinates[2];
  }

  return point;
}

function createPolyLine(f: any, transform: any, hasZ: boolean) {
  const paths = [];
  let startPoint = 0;
  const dimensions = hasZ ? 3 : 2;

  for (let i = 0; i < f.geometry.lengths.length; i++) {
    const stopPoint = startPoint + f.geometry.lengths[i] * dimensions;
    paths.push(
      genericPartDecoder(
        f.geometry.coords,
        transform,
        startPoint,
        stopPoint,
        dimensions
      )
    );
    startPoint = stopPoint;
  }

  return { paths };
}

function createPolygon(f: any, transform: any, hasZ: boolean) {
  const rings = [] as any[];
  const lengths = f.geometry.lengths.length;
  let startPoint = 0;
  const dimensions = hasZ ? 3 : 2;

  for (let index = 0; index < lengths; index++) {
    const stopPoint = startPoint + f.geometry.lengths[index] * dimensions;
    const ring = genericPartDecoder(
      f.geometry.coords,
      transform,
      startPoint,
      stopPoint,
      dimensions
    );

    if (ring.length > 0) {
      rings.push(closeRing(ring));
    }

    startPoint = stopPoint;
  }

  return { rings };
}

function genericPartDecoder(
  arr: number[],
  transform: any,
  startPoint: number,
  stopPoint: number,
  dimensions: number
) {
  const out = [] as any[];
  /* istanbul ignore if --@preserve */
  if (arr.length === 0) return out;

  const initialX = arr[startPoint];
  const initialY = arr[startPoint + 1];
  const initialZ = dimensions === 3 ? arr[startPoint + 2] : undefined;
  out.push(
    transformTuple(
      initialZ !== undefined
        ? [initialX, initialY, initialZ]
        : [initialX, initialY],
      transform
    )
  );
  let prevX = initialX;
  let prevY = initialY;
  let prevZ = initialZ;
  for (let i = startPoint + dimensions; i < stopPoint; i = i + dimensions) {
    const x = sum(prevX, arr[i]);
    const y = sum(prevY, arr[i + 1]);
    let z;
    if (dimensions === 3 && prevZ !== undefined) {
      z = sum(prevZ, arr[i + 2]);
    }
    const transformed = transformTuple(
      z !== undefined ? [x, y, z] : [x, y],
      transform
    );
    out.push(transformed);
    prevX = x;
    prevY = y;
    if (z !== undefined) {
      prevZ = z;
    }
  }
  return out;
}

function closeRing(ring: any[]) {
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last) return ring;
  if (first[0] === last[0] && first[1] === last[1]) return ring;
  return [...ring, [...first]];
}

/* istanbul ignore next --@preserve */
function transformTuple(coords: any, transform: any) {
  let x = coords[0];
  let y = coords[1];

  let z = coords.length > 2 && coords[2] !== null ? coords[2] : undefined;
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

function sum(a: any, b: any) {
  return a + b;
}
