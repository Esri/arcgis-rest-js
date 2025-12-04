import decode from "./geoJSONPbfParser.js";

// may need to specify this return type, may want to convert to a promise as well
export const pbfToGeoJSON = (arrayBuffer: ArrayBuffer): any => {
  return decode(arrayBuffer);
};
