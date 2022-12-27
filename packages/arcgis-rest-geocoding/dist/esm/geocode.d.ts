import { IExtent, ISpatialReference, IPoint } from "@esri/arcgis-rest-request";
import { IEndpointOptions } from "./helpers.js";
export interface IGeocodeOptions extends IEndpointOptions {
    /**
     * use this if all your address info is contained in a single string.
     */
    singleLine?: string;
    address?: string;
    address2?: string;
    address3?: string;
    neighborhood?: string;
    city?: string;
    subregion?: string;
    outFields?: "*" | string[];
    /**
     * The World Geocoding Service expects US states to be passed in as a 'region'.
     */
    region?: string;
    postal?: number;
    postalExt?: number;
    countryCode?: string;
    /**
     * You can create an autocomplete experience by making a call to suggest with partial text and then passing through the magicKey and complete address that are returned to geocode.
     *
     * ```js
     * import { suggest, geocode } from '@esri/arcgis-rest-geocoding';
     *
     * suggest("LAX")
     *   .then((response) => {
     *     geocode({
     *       singleLine: response.suggestions[1].text,
     *       magicKey: response.suggestions[0].magicKey
     *     })
     *   })
     * ```
     */
    magicKey?: string;
}
export interface IGeocodeResponse {
    spatialReference: ISpatialReference;
    candidates: Array<{
        address: string;
        location: IPoint;
        extent?: IExtent;
        score: number;
        attributes: object;
    }>;
    geoJson?: {
        type: string;
        features: Array<{
            type: string;
            geometry: object;
            properties: any;
        }>;
    };
}
/**
 * Used to determine the location of a single address or point of interest. See the [REST Documentation](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-find-address-candidates.htm) for more information.
 *
 *  ```js
 * import { geocode } from '@esri/arcgis-rest-geocoding';
 *
 * geocode("LAX")
 *   .then((response) => {
 *     response.candidates[0].location; // => { x: -118.409, y: 33.943, spatialReference: ...  }
 *   });
 *
 * geocode({
 *   address: "1600 Pennsylvania Ave",
 *   postal: 20500,
 *   countryCode: "USA"
 * })
 *   .then((response) => {
 *     response.candidates[1].location; // => { x: -77.036533, y: 38.898719, spatialReference: ... }
 *   });
 * ```
 *
 * @param address String representing the address or point of interest or RequestOptions to pass to the endpoint.
 * @returns A Promise that will resolve with address candidates for the request. The spatial reference will be added to candidate locations and extents unless `rawResponse: true` was passed.
 */
export declare function geocode(address: string | IGeocodeOptions): Promise<IGeocodeResponse>;
