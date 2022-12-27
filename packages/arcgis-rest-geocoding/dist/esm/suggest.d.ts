import { IEndpointOptions } from "./helpers.js";
export interface ISuggestResponse {
    suggestions: Array<{
        text: string;
        magicKey: string;
        isCollection: boolean;
    }>;
}
/**
 * Used to return a placename [suggestion](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-suggest.htm) for a partial string.
 *
 * ```js
 * import { suggest } from '@esri/arcgis-rest-geocoding';
 * //
 * suggest("Starb")
 *   .then(response) // response.text === "Starbucks"
 * ```
 *
 * @param requestOptions - Options for the request including authentication and other optional parameters.
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function suggest(partialText: string, requestOptions?: IEndpointOptions): Promise<ISuggestResponse>;
declare const _default: {
    suggest: typeof suggest;
};
export default _default;
