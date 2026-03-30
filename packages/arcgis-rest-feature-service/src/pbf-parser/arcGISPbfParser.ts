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
  const hasM = featureResult.hasM === true;

  // Normalize Features
  out.features = featureResult.features.map(
    (f: any) =>
      ({
        attributes: collectAttributes(attributeFields, f.attributes),
        geometry:
          ((f.geometry && geometryParser(f, transform, hasZ, hasM)) as any) ||
          null
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

function getCoordinateDimensions(hasZ: boolean, hasM: boolean) {
  if (hasZ && hasM) {
    return 4;
  }
  if (hasZ || hasM) {
    return 3;
  }
  return 2;
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

function createPoint(f: any, transform: any, hasZ: boolean, hasM: boolean) {
  const dimensions = getCoordinateDimensions(hasZ, hasM);
  const coordinates = transformTuple(
    f.geometry.coords.slice(0, dimensions),
    transform,
    hasZ,
    hasM
  );

  const point: any = {
    x: coordinates[0],
    y: coordinates[1]
  };

  if (coordinates.length > 2) {
    if (hasZ) {
      point.z = coordinates[2];
    }
    if (hasM) {
      point.m = coordinates[hasZ ? 3 : 2];
    }
  }

  return point;
}

function createPolyLine(f: any, transform: any, hasZ: boolean, hasM: boolean) {
  const paths = [];
  let startPoint = 0;
  const dimensions = getCoordinateDimensions(hasZ, hasM);

  for (let i = 0; i < f.geometry.lengths.length; i++) {
    const stopPoint = startPoint + f.geometry.lengths[i] * dimensions;
    paths.push(
      genericPartDecoder(
        f.geometry.coords,
        transform,
        startPoint,
        stopPoint,
        dimensions,
        hasZ,
        hasM
      )
    );
    startPoint = stopPoint;
  }

  return { paths };
}

function createPolygon(f: any, transform: any, hasZ: boolean, hasM: boolean) {
  const rings = [] as any[];
  const lengths = f.geometry.lengths.length;
  let startPoint = 0;
  const dimensions = getCoordinateDimensions(hasZ, hasM);

  for (let index = 0; index < lengths; index++) {
    const stopPoint = startPoint + f.geometry.lengths[index] * dimensions;
    const ring = genericPartDecoder(
      f.geometry.coords,
      transform,
      startPoint,
      stopPoint,
      dimensions,
      hasZ,
      hasM
    );

    /* istanbul ignore else --@preserve */
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
  dimensions: number,
  hasZ: boolean,
  hasM: boolean
) {
  const out = [] as any[];
  /* istanbul ignore if --@preserve */
  if (arr.length === 0) return out;

  let prevCoords = arr.slice(startPoint, startPoint + dimensions);
  if (prevCoords.length < 2) return out;

  out.push(transformTuple(prevCoords, transform, hasZ, hasM));

  for (let i = startPoint + dimensions; i < stopPoint; i = i + dimensions) {
    const delta = arr.slice(i, i + dimensions);
    if (delta.length < 2) {
      continue;
    }

    const currentCoords = prevCoords.map((coordinate, index) =>
      // x and y values are relative to the previous coordinate, while z and m values are absolute
      // if idx is >= 2, we are handling z or m values so we should return the value only
      // if idx is < 2, we are handling x and y values so we should sum the delta to the previous coordinate value
      // since x and y values are encoded as deltas in the pbf
      index < 2 ? sum(coordinate, delta[index]) : delta[index]
    );

    const transformed = transformTuple(currentCoords, transform, hasZ, hasM);
    out.push(transformed);
    prevCoords = currentCoords;
  }
  return out;
}

function closeRing(ring: any[]) {
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (!first || !last) return ring;
  /* istanbul ignore else --@preserve */
  if (first[0] === last[0] && first[1] === last[1]) return ring;
  return [...ring, [...first]];
}

/* istanbul ignore next --@preserve */
function transformTuple(
  coords: any,
  transform: any,
  hasZ: boolean,
  hasM: boolean
) {
  const scale = transform?.scale || {};
  const translate = transform?.translate || {};

  const xScale = scale.xScale ?? 1;
  const yScale = scale.yScale ?? 1;
  const zScale = scale.zScale ?? 1;
  const mScale = scale.mScale ?? 1;

  const xTranslate = translate.xTranslate ?? 0;
  const yTranslate = translate.yTranslate ?? 0;
  const zTranslate = translate.zTranslate ?? 0;
  const mTranslate = translate.mTranslate ?? 0;

  let x = coords[0];
  let y = coords[1];

  let z = hasZ ? coords[2] : undefined;
  let m = hasM ? coords[hasZ ? 3 : 2] : undefined;

  x = x * xScale + xTranslate;
  y = y * -yScale + yTranslate;

  if (undefined !== z) {
    z = z * zScale + zTranslate;
  }

  if (undefined !== m) {
    if (m === 0) {
      m = null;
    } else {
      m = m * mScale + mTranslate;
    }
  }

  const ret = [x, y];
  if (undefined !== z) {
    ret.push(z);
  }
  if (undefined !== m) {
    ret.push(m);
  }
  return ret;
}

function sum(a: any, b: any) {
  return a + b;
}
