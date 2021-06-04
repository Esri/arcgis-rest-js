/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  request,
  IRequestOptions,
  appendCustomParams,
} from "@esri/arcgis-rest-request";
import { IItem, IGroup } from "@esri/arcgis-rest-types";

import { getPortalUrl } from "../util/get-portal-url";
import { scrubControlChars } from "../util/scrub-control-chars";
import {
  IItemDataOptions,
  IItemRelationshipOptions,
  IUserItemOptions,
  determineOwner,
  FetchReadMethodName,
} from "./helpers";

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
export function getItem(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IItem> {
  const url = getItemBaseUrl(id, requestOptions);

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions,
  };
  return request(url, options);
}

/**
 * Get the fully qualified base URL to the REST end point for an item.
 * @param id Item Id
 * @param portalUrlOrRequestOptions a portal URL or request options
 * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{id}`
 */
export const getItemBaseUrl = (
  id: string,
  portalUrlOrRequestOptions?: string | IRequestOptions
) => {
  const portalUrl =
    typeof portalUrlOrRequestOptions === "string"
      ? portalUrlOrRequestOptions
      : getPortalUrl(portalUrlOrRequestOptions);
  return `${portalUrl}/content/items/${id}`;
};

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
export function getItemData(
  id: string,
  requestOptions?: IItemDataOptions
): Promise<any> {
  const url = `${getItemBaseUrl(id, requestOptions)}/data`;
  // default to a GET request
  const options: IItemDataOptions = {
    ...{ httpMethod: "GET", params: {} },
    ...requestOptions,
  };

  if (options.file) {
    options.params.f = null;
  }

  return request(url, options).catch((err) => {
    /* if the item doesn't include data, the response will be empty
       and the internal call to response.json() will fail */
    const emptyResponseErr = RegExp(
      /The string did not match the expected pattern|(Unexpected end of (JSON input|data at line 1 column 1))/i
    );
    /* istanbul ignore else */
    if (emptyResponseErr.test(err.message)) {
      return;
    } else throw err;
  });
}

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
export function getRelatedItems(
  requestOptions: IItemRelationshipOptions
): Promise<IGetRelatedItemsResponse> {
  const url = `${getItemBaseUrl(
    requestOptions.id,
    requestOptions
  )}/relatedItems`;

  const options: IItemRelationshipOptions = {
    httpMethod: "GET",
    params: {
      direction: requestOptions.direction,
    },
    ...requestOptions,
  };

  if (typeof requestOptions.relationshipType === "string") {
    options.params.relationshipType = requestOptions.relationshipType;
  } else {
    options.params.relationshipTypes = requestOptions.relationshipType;
  }

  delete options.direction;
  delete options.relationshipType;

  return request(url, options);
}

/**
 * Get the resources associated with an item
 *
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item resources.
 */
export function getItemResources(
  id: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  const url = `${getItemBaseUrl(id, requestOptions)}/resources`;

  // Mix in num:1000 with any user supplied params
  // Key thing - we don't want to mutate the passed in requestOptions
  // as that may be used in other (subsequent) calls in the course
  // of a long promise chains
  const options: IRequestOptions = {
    ...requestOptions,
  };
  options.params = { num: 1000, ...options.params };

  return request(url, options);
}

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
 * Fetches an item resource and optionally parses it to the correct format.
 *
 * Note: provides JSON parse error protection by sanitizing out any unescaped control
 * characters before parsing that would otherwise cause an error to be thrown
 *
 * @param {string} itemId
 * @param {IGetItemResourceOptions} requestOptions
 */
export function getItemResource(
  itemId: string,
  requestOptions: IGetItemResourceOptions
) {
  const readAs = requestOptions.readAs || "blob";
  return getItemFile(
    itemId,
    `/resources/${requestOptions.fileName}`,
    readAs,
    requestOptions
  );
}

/**
 * ```js
 * import { getItemGroups } from "@esri/arcgis-rest-portal";
 * //
 * getItemGroups("30e5fe3149c34df1ba922e6f5bbf808f")
 *   .then(response)
 * ```
 * Lists the groups of which the item is a part, only showing the groups that the calling user can access. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/groups.htm) for more information.
 *
 * @param id - The Id of the item to query group association for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get some item groups.
 */
export function getItemGroups(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IGetItemGroupsResponse> {
  const url = `${getItemBaseUrl(id, requestOptions)}/groups`;

  return request(url, requestOptions);
}

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
 * ```js
 * import { getItemStatus } from "@esri/arcgis-rest-portal";
 * //
 * getItemStatus({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Inquire about status when publishing an item, adding an item in async mode, or adding with a multipart upload. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/status.htm) for more information.
 *
 * @param id - The Id of the item to get status for.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item status.
 */
export function getItemStatus(
  requestOptions: IItemStatusOptions
): Promise<IGetItemStatusResponse> {
  return determineOwner(requestOptions).then((owner) => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/status`;

    const options = appendCustomParams<IItemStatusOptions>(
      requestOptions,
      ["jobId", "jobType"],
      { params: { ...requestOptions.params } }
    );

    return request(url, options);
  });
}

export interface IGetItemPartsResponse {
  parts: number[];
}

/**
 * ```js
 * import { getItemParts } from "@esri/arcgis-rest-portal";
 * //
 * getItemParts({
 *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
 *   authentication
 * })
 *   .then(response)
 * ```
 * Lists the part numbers of the file parts that have already been uploaded in a multipart file upload. This method can be used to verify the parts that have been received as well as those parts that were not received by the server. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/parts.htm) for more information.
 *
 * @param id - The Id of the item to get part list.
 * @param requestOptions - Options for the request
 * @returns A Promise to get the item part list.
 */
export function getItemParts(
  requestOptions: IUserItemOptions
): Promise<IGetItemPartsResponse> {
  return determineOwner(requestOptions).then((owner) => {
    const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${
      requestOptions.id
    }/parts`;
    return request(url, requestOptions);
  });
}

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
export function getItemInfo(
  id: string,
  requestOptions?: IGetItemInfoOptions
): Promise<any> {
  const { fileName = "iteminfo.xml", readAs = "text" } = requestOptions || {};
  const options: IRequestOptions = {
    httpMethod: "GET",
    ...requestOptions,
  };
  return getItemFile(id, `/info/${fileName}`, readAs, options);
}

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
export function getItemMetadata(
  id: string,
  requestOptions?: IRequestOptions
): Promise<any> {
  const options = {
    ...requestOptions,
    fileName: "metadata/metadata.xml",
  } as IGetItemInfoOptions;
  return getItemInfo(id, options);
}

// overrides request()'s default behavior for reading the response
// which is based on `params.f` and defaults to JSON
// Also adds JSON parse error protection by sanitizing out any unescaped control characters before parsing
function getItemFile(
  id: string,
  // NOTE: fileName should include any folder/subfolders
  fileName: string,
  readMethod: FetchReadMethodName,
  requestOptions?: IRequestOptions
): Promise<any> {
  const url = `${getItemBaseUrl(id, requestOptions)}${fileName}`;
  // preserve escape hatch to let the consumer read the response
  // and ensure the f param is not appended to the query string
  const options: IRequestOptions = {
    params: {},
    ...requestOptions,
  };
  const justReturnResponse = options.rawResponse;
  options.rawResponse = true;
  options.params.f = null;

  return request(url, options).then((response) => {
    if (justReturnResponse) {
      return response;
    }
    return readMethod !== "json"
      ? response[readMethod]()
      : response
          .text()
          .then((text: string) => JSON.parse(scrubControlChars(text)));
  });
}
