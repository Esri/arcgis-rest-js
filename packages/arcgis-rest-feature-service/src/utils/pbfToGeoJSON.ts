import decode from "../pbf-parser/geoJSONPbfParser.js";
import { IDecodedPbf } from "./IDecodedPbf.js";

// may need to specify this return type, may want to convert to a promise as well
export const pbfToGeoJSON = (arrayBuffer: ArrayBuffer): IDecodedPbf => {
  return decode(arrayBuffer) as IDecodedPbf;
};
