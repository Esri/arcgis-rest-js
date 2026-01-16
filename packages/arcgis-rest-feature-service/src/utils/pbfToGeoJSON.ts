import decode from "../pbf-parser/geoJSONPbfParser.js";

export interface IPbfToGeoJSON {
  featureCollection: {
    type: "FeatureCollection";
    features: GeoJSON.Feature[];
  };
  exceededTransferLimit?: boolean;
}

export interface EsriGeoJSONFeatureCollection
  extends GeoJSON.FeatureCollection {
  properties?: {
    exceededTransferLimit?: boolean;
  };
}

export const pbfToGeoJSON = (
  arrayBuffer: ArrayBuffer
): EsriGeoJSONFeatureCollection => {
  // return decoded pbf as geojson structure
  const decoded = decode(arrayBuffer) as IPbfToGeoJSON;

  return {
    type: decoded.featureCollection.type,
    properties: {
      exceededTransferLimit: decoded.exceededTransferLimit
    },
    features: decoded.featureCollection.features
  };
};
