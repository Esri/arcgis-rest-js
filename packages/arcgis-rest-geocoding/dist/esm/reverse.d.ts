import { IPoint, ILocation } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
export interface IReverseGeocodeResponse {
    address: {
        [key: string]: any;
    };
    location: IPoint;
}
/**
 * Used to determine the address of a [location](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-reverse-geocode.htm).
 *
 * ```js
 * import { reverseGeocode } from '@esri/arcgis-rest-geocoding';
 * //
 * reverseGeocode([-118.409,33.943 ]) // long, lat
 *   .then((response) => {
 *     response.address.PlaceName; // => "LA Airport"
 *   });
 * // or
 * reverseGeocode({ long: -118.409, lat: 33.943 })
 * reverseGeocode({ latitude: 33.943, latitude: -118.409 })
 * reverseGeocode({ x: -118.409, y: 33.9425 }) // wgs84 is assumed
 * reverseGeocode({ x: -13181226, y: 4021085, spatialReference: { wkid: 3857 })
 * ```
 *
 * @param coordinates - the location you'd like to associate an address with.
 * @param requestOptions - Additional options for the request including authentication.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function reverseGeocode(coords: IPoint | ILocation | [number, number], requestOptions?: IEndpointOptions): Promise<IReverseGeocodeResponse>;
declare const _default: {
    reverseGeocode: typeof reverseGeocode;
};
export default _default;
