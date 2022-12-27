import { IRequestOptions, IGroup } from "@esri/arcgis-rest-request";
import { IItem } from "../helpers.js";
import { IItemDataOptions, IItemRelationshipOptions, IUserItemOptions, FetchReadMethodName } from "./helpers.js";
/**
 * ```
 * import { getItem } from "@esri/arcgis-rest-portal";
 * //
 * getItem("ae7")
 *   .then(response);
 * // or
 * getItem("ae7", { authentication })
 *   .then(response)
 * ```
 * Get an item by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item.htm) for more information.
 *
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the data from the response.
 */
export declare function getItem(id: string, requestOptions?: IRequestOptions): Promise<IItem>;
/**
 * Get the fully qualified base URL to the REST end point for an item.
 * @param id Item Id
 * @param portalUrlOrRequestOptions a portal URL or request options
 * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{id}`
 */
export declare const getItemBaseUrl: (id: string, portalUrlOrRequestOptions?: string | IRequestOptions) => string;
/**
 * ```
 * import { getItemData } from "@esri/arcgis-rest-portal";
 * //
 * getItemData("ae7")
 *   .then(response)
 * // or
 * getItemData("ae7", { authentication })
 *   .then(response)
 * ```
 * Get the /data for an item. If no data exists, returns `undefined`. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-data.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the json data for the item.
 */
export declare function getItemData(id: string, requestOptions?: IItemDataOptions): Promise<any>;
export interface IGetRelatedItemsResponse {
    total: number;
    relatedItems: IItem[];
}
/**
 * ```
 * import { getRelatedItems } from "@esri/arcgis-rest-portal";
 * //
 * getRelatedItems({
 *   id: "ae7",
 *   relationshipType: "Service2Layer" // or several ["Service2Layer", "Map2Area"]
 * })
 *   .then(response)
 * ```
 * Get the related items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/related-items.htm) for more information.
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export declare function getRelatedItems(requestOptions: IItemRelationshipOptions): Promise<IGetRelatedItemsResponse>;
/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export declare function getItemResources(id: string, requestOptions?: IRequestOptions): Promise<any>;
export interface IGetItemGroupsResponse {
    admin?: IGroup[];
    member?: IGroup[];
    other?: IGroup[];
}
export interface IGetItemResourceOptions extends IRequestOptions {
    /**
     * Name of the info file, optionally including the folder path
     */
    fileName: string;
    /**
     * How the fetch response should be read, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods
     */
    readAs?: FetchReadMethodName;
}
/**
 * Fetches an item resource and optionally parses it to the correct format.
 *
 * Provides JSON parse error protection by sanitizing out any unescaped control characters before parsing that would otherwise cause an error to be thrown.
 *
 * ```js
 * import { getItemResource } from "@esri/arcgis-rest-portal";
 *
 * // Parses contents as blob by default
 * getItemResource("3ef", { fileName: "resource.jpg", ...})
 *  .then(resourceContents => {});
 *
 * // Can override parse method
 * getItemResource("3ef", { fileName: "resource.json", readAs: 'json', ...})
 *  .then(resourceContents => {});
 *
 * // Get the response object instead
 * getItemResource("3ef",{ rawResponse: true, fileName: "resource.json" })
 *  .then(response => {})
 * ```
 *
 * @param {string} itemId
 * @param {IGetItemResourceOptions} requestOptions
 */
export declare function getItemResource(itemId: string, requestOptions: IGetItemResourceOptions): Promise<any>;
/**
 * Lists the groups of which the item is a part, only showing the groups that the calling user can access. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/groups.htm) for more information.
 *
 * ```js
 * import { getItemGroups } from "@esri/arcgis-rest-portal";
 *
 * getItemGroups("30e5fe3149c34df1ba922e6f5bbf808f")
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to query group association for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item groups.
 */
export declare function getItemGroups(id: string, requestOptions?: IRequestOptions): Promise<IGetItemGroupsResponse>;
export interface IItemStatusOptions extends IUserItemOptions {
    /**
     * The type of asynchronous job for which the status has to be checked. Default is none, which check the item's status.
     */
    jobType?: "publish" | "generateFeatures" | "export" | "createService";
    /**
     * The job ID returned during publish, generateFeatures, export, and createService calls.
     */
    jobId?: string;
    /**
     * The response format. The default and the only response format for this resource is HTML.
     */
    format?: "html";
}
export interface IGetItemStatusResponse {
    status: "partial" | "processing" | "failed" | "completed";
    statusMessage: string;
    itemId: string;
}
/**
 * Inquire about status when publishing an item, adding an item in async mode, or adding with a multipart upload. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/status.htm) for more information.
 *
 * ```js
 * import { getItemStatus } from "@esri/arcgis-rest-portal";
 *
 * getItemStatus({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to get status for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item status.
 */
export declare function getItemStatus(requestOptions: IItemStatusOptions): Promise<IGetItemStatusResponse>;
export interface IGetItemPartsResponse {
    parts: number[];
}
/**
 * Lists the part numbers of the file parts that have already been uploaded in a multipart file upload. This method can be used to verify the parts that have been received as well as those parts that were not received by the server. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/parts.htm) for more information.
 *
 * ```js
 * import { getItemParts } from "@esri/arcgis-rest-portal";
 *
 * getItemParts({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 *
 * @param id - The Id of the item to get part list.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item part list.
 */
export declare function getItemParts(requestOptions: IUserItemOptions): Promise<IGetItemPartsResponse>;
export interface IGetItemInfoOptions extends IRequestOptions {
    /**
     * Name of the info file, optionally including the folder path
     */
    fileName?: string;
    /**
     * How the fetch response should be read, see:
     * https://developer.mozilla.org/en-US/docs/Web/API/Body#Methods
     */
    readAs?: FetchReadMethodName;
}
/**
 * ```
 * import { getItemInfo } from "@esri/arcgis-rest-portal";
 * // get the "Info Card" for the item
 * getItemInfo("ae7")
 *   .then(itemInfoXml) // XML document as a string
 * // or get the contents of a specific file
 * getItemInfo("ae7", { fileName: "form.json", readAs: "json", authentication })
 *   .then(formJson) // JSON document as JSON
 * ```
 * Get an info file for an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/item-info-file.htm) for more information.
 * @param id - Item Id
 * @param requestOptions - Options for the request, including the file name which defaults to `iteminfo.xml`.
 * If the file is not a text file (XML, HTML, etc) you will need to specify the `readAs` parameter
 * @returns A Promise that will resolve with the contents of the info file for the item.
 */
export declare function getItemInfo(id: string, requestOptions?: IGetItemInfoOptions): Promise<any>;
/**
 * ```
 * import { getItemMetadata } from "@esri/arcgis-rest-portal";
 * // get the metadata for the item
 * getItemMetadata("ae7")
 *   .then(itemMetadataXml) // XML document as a string
 * // or with additional request options
 * getItemMetadata("ae7", { authentication })
 *   .then(itemMetadataXml) // XML document as a string
 * ```
 * Get the standard formal metadata XML file for an item (`/info/metadata/metadata.xml`)
 * @param id - Item Id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the contents of the metadata file for the item as a string.
 */
export declare function getItemMetadata(id: string, requestOptions?: IRequestOptions): Promise<any>;
