import decode from "../pbf-parser/geoJSONPbfParser.js";

export interface IPbfToGeoJSON {
  featureCollection: {
    type: "FeatureCollection";
    features: GeoJSON.Feature[];
  };
  exceededTransferLimit?: boolean;
}

export const pbfToGeoJSON = (arrayBuffer: ArrayBuffer): IPbfToGeoJSON => {
  // return decoded pbf as geojson structure
  return decode(arrayBuffer) as IPbfToGeoJSON;
};
