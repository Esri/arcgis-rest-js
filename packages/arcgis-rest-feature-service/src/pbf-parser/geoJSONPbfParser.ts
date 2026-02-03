/**
 * This code has been adapted from [arcgis-pbf-parser] ([https://github.com/rowanwins/arcgis-pbf-parser])
 * Modifications have been made for use in this project.
 */

import { FeatureCollectionPBuffer as EsriPbfBuffer } from "./PbfFeatureCollection.js";
import Pbf from "pbf";

export interface EsriGeoJSONFeatureCollection {
  type: "FeatureCollection";
  // optional coordinate reference system that may not be necessary
  crs?: {
    type: "name";
    properties: {
      name: string; // e.g., "EPSG:4326", "EPSG:3857"
    };
  };
  features: any[];
  properties?: {
    exceededTransferLimit?: boolean;
  };
}

export default function pbfToGeoJSON(
  arrayBuffer: ArrayBuffer | Uint8Array | Buffer
): EsriGeoJSONFeatureCollection {
  // return decoded pbf as geojson structure
  const decoded = decode(arrayBuffer);
  return decoded;
}

export function decode(featureCollectionBuffer: any) {
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
  const featureResult = decodedObject.queryResult.featureResult;
  const transform = featureResult.transform;
  const geometryType = featureResult.geometryType;
  const objectIdField = featureResult.objectIdFieldName;

  const out: EsriGeoJSONFeatureCollection = {
    type: "FeatureCollection",
    features: []
  };

  // if the spatial reference is web mercator, add the crs property
  // otherwise default to assuming WGS84 (ESPG:4326) per geojson
  // if feature service returns wkid 102100, latestWkid will be 3857
  if (
    featureResult.spatialReference?.wkid === 3857 ||
    featureResult.spatialReference?.latestWkid === 3857
  ) {
    out.crs = {
      type: "name",
      properties: {
        name: "EPSG:3857"
      }
    };
  }
  out.properties = {
    exceededTransferLimit: featureResult.exceededTransferLimit
  };

  const geometryParser = getGeometryParser(geometryType);

  // decode the field keynames
  const fields = featureResult.fields;
  fields.forEach((field: any) => {
    field.keyName = getKeyName(field);
  });

  const featureLen = featureResult.features.length;
  for (let index = 0; index < featureLen; index++) {
    const f = featureResult.features[index];
    out.features.push({
      type: "Feature",
      // deliberately not setting feature id here to improve performance
      properties: collectAttributes(fields, f.attributes),
      geometry: (f.geometry && geometryParser(f, transform)) || null
    });
  }
  // set feature ids after the fact here
  // collect attributes must be called first to ensure properties are populated
  out.features.forEach((feature, idx) => {
    feature.id = feature.properties[objectIdField];
  });

  return out;
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

function createPoint(f: any, transform: any) {
  const p = {
    type: "Point",
    coordinates: transformTuple(f.geometry.coords, transform)
  };
  return p;
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
  return l;
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
  return p;
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
