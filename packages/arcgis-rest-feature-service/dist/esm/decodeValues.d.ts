import { IRequestOptions, IField } from "@esri/arcgis-rest-request";
import { IQueryFeaturesResponse } from "./query.js";
/**
 * Request options to fetch a feature by id.
 */
export interface IDecodeValuesOptions extends IRequestOptions {
    /**
     * Layer service url.
     */
    url?: string;
    /**
     * Unique identifier of the feature.
     */
    queryResponse: IQueryFeaturesResponse;
    /**
     * * If a fieldset is provided, no internal metadata check will be issued to gather info about coded value domains.
     *
     * getFeatureService(url)
     *   .then(metadata => {
     *     queryFeatures({ url })
     *       .then(response => {
     *         decodeValues({
     *           url,
     *           queryResponse,
     *           fields: metadata.fields
     *         })
     *           .then(decodedResponse)
     *       })
     *   })
     */
    fields?: IField[];
}
/**
 * ```js
 * import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-service';
 * //
 * const url = `https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0`
 * queryFeatures({ url })
 *   .then(queryResponse => {
 *     decodeValues({
 *       url,
 *       queryResponse
 *     })
 *       .then(decodedResponse)
 *   })
 * ```
 * Replaces the raw coded domain values in a query response with descriptions (for legibility).
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
export declare function decodeValues(requestOptions: IDecodeValuesOptions): Promise<IQueryFeaturesResponse>;
