/* @preserve
* @esri/arcgis-rest-portal - v4.1.0 - Apache-2.0
* Copyright (c) 2017-2022 Esri, Inc.
* Tue Dec 27 2022 09:24:40 GMT-0800 (Pacific Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request')) :
  typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-request'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest));
})(this, (function (exports, arcgisRestRequest) { 'use strict';

  /* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Helper that returns the appropriate portal url for a given request. `requestOptions.portal` is given
   * precedence over `authentication.portal`. If neither `portal` nor `authentication` is present,
   * `www.arcgis.com/sharing/rest` is returned.
   *
   * @param requestOptions - Request options that may have authentication manager
   * @returns Portal url to be used in API requests
   */
  function getPortalUrl(requestOptions = {}) {
      // use portal in options if specified
      if (requestOptions.portal) {
          return arcgisRestRequest.cleanUrl(requestOptions.portal);
      }
      // if auth was passed, use that portal
      if (requestOptions.authentication &&
          typeof requestOptions.authentication !== "string") {
          // the portal url is already scrubbed in the auth package
          return requestOptions.authentication.portal;
      }
      // default to arcgis.com
      return "https://www.arcgis.com/sharing/rest";
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * `requestOptions.owner` is given priority, `requestOptions.item.owner` will be checked next. If neither are present, `authentication.getUserName()` will be used instead.
   */
  function determineOwner(requestOptions) {
      if (requestOptions.owner) {
          return Promise.resolve(requestOptions.owner);
      }
      else if (requestOptions.item && requestOptions.item.owner) {
          return Promise.resolve(requestOptions.item.owner);
      }
      else if (requestOptions.authentication &&
          requestOptions.authentication.getUsername) {
          return requestOptions.authentication.getUsername();
      }
      else {
          return Promise.reject(new Error("Could not determine the owner of this item. Pass the `owner`, `item.owner`, or `authentication` option."));
      }
  }
  /**
   * checks if the extent is a valid BBox (2 element array of coordinate pair arrays)
   * @param extent
   * @returns
   */
  function isBBox(extent) {
      return (Array.isArray(extent) &&
          Array.isArray(extent[0]) &&
          Array.isArray(extent[1]));
  }
  /**
   * Given a Bbox, convert it to a string. Some api endpoints expect a string
   *
   * @param {BBox} extent
   * @return {*}  {string}
   */
  function bboxToString(extent) {
      return extent.join(",");
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update an Item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm) for more information.
   *
   * ```js
   * import { updateItem } from "@esri/arcgis-rest-portal";
   *
   * updateItem({
   *   item: {
   *     id: "3ef",
   *     description: "A three hour tour"
   *   },
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that updates an item.
   */
  function updateItem(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = requestOptions.folderId
              ? `${getPortalUrl(requestOptions)}/content/users/${owner}/${requestOptions.folderId}/items/${requestOptions.item.id}/update`
              : `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.item.id}/update`;
          // serialize the item into something Portal will accept
          requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.item);
          // convert extent, if present, into a string from bbox
          // processParams was previously doing this sort of work,
          // however now we need to let array of arrays through
          // Thus for extents we need to move this logic here
          if (requestOptions.params.extent && isBBox(requestOptions.params.extent)) {
              requestOptions.params.extent = bboxToString(requestOptions.params.extent);
          }
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Update an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
   *
   * ```js
   * import { updateItemInfo } from "@esri/arcgis-rest-portal";
   *
   * updateItemInfo({
   *   id: '3ef',
   *   file: file,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that updates an item info file.
   */
  function updateItemInfo(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateinfo`;
          // mix in user supplied params
          requestOptions.params = Object.assign({ folderName: requestOptions.folderName, file: requestOptions.file }, requestOptions.params);
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Update an info file associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-info.htm) for more information.
   *
   * ```js
   * import { updateItemResource } from "@esri/arcgis-rest-portal";
   *
   * updateItemResource({
   *   id: '3ef',
   *   resource: file,
   *   name: 'bigkahuna.jpg',
   *   authentication
   * })
   *   .then(response)
   * ```
   * Update a resource associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-resources.htm) for more information.
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that updates an item resource.
   */
  function updateItemResource(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/updateResources`;
          // mix in user supplied params
          requestOptions.params = Object.assign({ file: requestOptions.resource, fileName: requestOptions.name, resourcesPrefix: requestOptions.prefix, text: requestOptions.content }, requestOptions.params);
          // only override the access specified previously if 'private' is passed explicitly
          if (typeof requestOptions.private !== "undefined") {
              requestOptions.params.access = requestOptions.private
                  ? "private"
                  : "inherit";
          }
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Move an item to a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/move-item.htm) for more information.
   *
   * ```js
   * import { moveItem } from "@esri/arcgis-rest-portal";
   * //
   * moveItem({
   *   itemId: "3ef",
   *   folderId: "7c5",
   *   authentication: ArcGISIdentityManager
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that resolves with owner and folder details once the move has been completed
   */
  function moveItem(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.itemId}/move`;
          let folderId = requestOptions.folderId;
          if (!folderId) {
              folderId = "/";
          }
          requestOptions.params = Object.assign({ folder: folderId }, requestOptions.params);
          return arcgisRestRequest.request(url, requestOptions);
      });
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Send a file or blob to an item to be stored as the `/data` resource. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-item.htm) for more information.
   *
   * ```js
   * import { addItemData } from "@esri/arcgis-rest-portal";
   *
   * addItemData({
   *   id: '3ef',
   *   data: file,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with an object reporting
   *        success/failure and echoing the item id.
   */
  function addItemData(requestOptions) {
      const options = Object.assign({ item: {
              id: requestOptions.id,
              text: requestOptions.text,
              file: requestOptions.file
          } }, requestOptions);
      delete options.id;
      delete options.data;
      return updateItem(options);
  }
  /**
   * Add a relationship between two items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-relationship.htm) for more information.
   *
   * ```js
   * import { addItemRelationship } from "@esri/arcgis-rest-portal";
   *
   * addItemRelationship({
   *   originItemId: '3ef',
   *   destinationItemId: 'ae7',
   *   relationshipType: 'Service2Layer',
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to add item resources.
   */
  function addItemRelationship(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/addRelationship`;
          const options = arcgisRestRequest.appendCustomParams(requestOptions, ["originItemId", "destinationItemId", "relationshipType"], { params: Object.assign({}, requestOptions.params) });
          return arcgisRestRequest.request(url, options);
      });
  }
  /**
   * Add a resource associated with an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-resources.htm) for more information.
   *
   * ```js
   * import { addItemResource } from "@esri/arcgis-rest-portal";
   *
   * // Add a file resource
   * addItemResource({
   *   id: '3ef',
   *   resource: file,
   *   name: 'bigkahuna.jpg',
   *   authentication
   * })
   *   .then(response)
   *
   * // Add a text resource
   * addItemResource({
   *   id: '4fg',
   *   content: "Text content",
   *   name: 'bigkahuna.txt',
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to add item resources.
   */
  function addItemResource(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/addResources`;
          requestOptions.params = Object.assign({ file: requestOptions.resource, fileName: requestOptions.name, resourcesPrefix: requestOptions.prefix, text: requestOptions.content, access: requestOptions.private ? "private" : "inherit" }, requestOptions.params);
          return arcgisRestRequest.request(url, requestOptions);
      });
  }

  /**
   * Returns a listing of the user's content. If the `username` is not supplied, it defaults to the username of the authenticated user. If `start` is not specified it defaults to the first page.
   *
   * If the `num` is not supplied it is defaulted to 10. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-content.htm) for more information.
   *
   * ```js
   * import { getUserContent } from "@esri/arcgis-rest-portal";
   *
   * getUserContent({
   *    owner: 'geemike',
   *    folderId: 'bao7',
   *    start: 1,
   *    num: 20,
   *    authentication
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise<IUserContentResponse>
   */
  const getUserContent = (requestOptions) => {
      const { folderId: folder, start = 1, num = 10, authentication } = requestOptions;
      const suffix = folder ? `/${folder}` : "";
      return determineOwner(requestOptions)
          .then((owner) => `${getPortalUrl(requestOptions)}/content/users/${owner}${suffix}`)
          .then((url) => arcgisRestRequest.request(url, {
          httpMethod: "GET",
          authentication,
          params: {
              start,
              num
          }
      }));
  };

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Create a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/create-folder.htm) for more information.
   *
   * ```js
   * import { createFolder } from "@esri/arcgis-rest-portal";
   *
   * createFolder({
   *   title: 'Map Collection',
   *   authentication: ArcGISIdentityManager
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that resolves with folder details once the folder has been created
   */
  function createFolder(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
          const url = `${baseUrl}/createFolder`;
          requestOptions.params = Object.assign({ title: requestOptions.title }, requestOptions.params);
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Create an item in a folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
   *
   * ```js
   * import { createItemInFolder } from "@esri/arcgis-rest-portal";
   *
   * createItemInFolder({
   *   item: {
   *     title: "The Amazing Voyage",
   *     type: "Web Map"
   *   },
   *   folderId: 'fe8',
   *   authentication
   * })
   * ```
   *
   * @param requestOptions = Options for the request
   */
  function createItemInFolder(requestOptions) {
      if (requestOptions.multipart && !requestOptions.filename) {
          return Promise.reject(new Error("The filename is required for a multipart request."));
      }
      return determineOwner(requestOptions).then((owner) => {
          const baseUrl = `${getPortalUrl(requestOptions)}/content/users/${owner}`;
          let url = `${baseUrl}/addItem`;
          if (requestOptions.folderId) {
              url = `${baseUrl}/${requestOptions.folderId}/addItem`;
          }
          requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.item);
          // convert extent, if present, into a string from bbox
          // processParams was previously doing this sort of work,
          // however now we need to let array of arrays through
          // Thus for extents we need to move this logic here
          if (requestOptions.params.extent && isBBox(requestOptions.params.extent)) {
              requestOptions.params.extent = bboxToString(requestOptions.params.extent);
          }
          // serialize the item into something Portal will accept
          const options = arcgisRestRequest.appendCustomParams(requestOptions, [
              "owner",
              "folderId",
              "file",
              "dataUrl",
              "text",
              "async",
              "multipart",
              "filename",
              "overwrite"
          ], {
              params: Object.assign({}, requestOptions.params)
          });
          return arcgisRestRequest.request(url, options);
      });
  }
  /**
   * Create an Item in the user's root folder. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item.htm) for more information.
   *
   * ```js
   * import { createItem } from "@esri/arcgis-rest-portal";
   *
   * createItem({
   *   item: {
   *     title: "The Amazing Voyage",
   *     type: "Web Map"
   *   },
   *   authentication
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that creates an item.
   */
  function createItem(requestOptions) {
      // delegate to createItemInFolder placing in the root of the filestore
      const options = Object.assign({ folderId: null }, requestOptions);
      return createItemInFolder(options);
  }

  /**
   * Exports an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/export-item.htm) for more information.
   *
   * ```js
   * import { exportItem } from "@esri/arcgis-rest-portal";
   *
   * exportItem({
   *   id: '3daf',
   *   owner: 'geemike',
   *   exportFormat: 'CSV',
   *   exportParameters: {
   *     layers: [
   *       { id: 0 },
   *       { id: 1, where: 'POP1999 > 100000' }
   *     ]
   *   },
   *   authentication,
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise<IExportItemResponse>
   */
  const exportItem = (requestOptions) => {
      const { authentication, id: itemId, title, exportFormat, exportParameters } = requestOptions;
      return determineOwner(requestOptions)
          .then((owner) => `${getPortalUrl(requestOptions)}/content/users/${owner}/export`)
          .then((url) => arcgisRestRequest.request(url, {
          httpMethod: "POST",
          authentication,
          params: {
              itemId,
              title,
              exportFormat,
              exportParameters
          }
      }));
  };

  // eslint-disable-next-line no-control-regex
  const CONTROL_CHAR_MATCHER = /[\x00-\x1F\x7F-\x9F\xA0]/g;
  /**
   * Returns a new string with all control characters removed.
   *
   * Doesn't remove characters from input string.
   *
   * @param str - the string to scrub
   */
  function scrubControlChars(str) {
      return str.replace(CONTROL_CHAR_MATCHER, "");
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
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
  function getItem(id, requestOptions) {
      const url = getItemBaseUrl(id, requestOptions);
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Get the fully qualified base URL to the REST end point for an item.
   * @param id Item Id
   * @param portalUrlOrRequestOptions a portal URL or request options
   * @returns URL to the item's REST end point, defaults to `https://www.arcgis.com/sharing/rest/content/items/{id}`
   */
  const getItemBaseUrl = (id, portalUrlOrRequestOptions) => {
      const portalUrl = typeof portalUrlOrRequestOptions === "string"
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
  function getItemData(id, requestOptions) {
      const url = `${getItemBaseUrl(id, requestOptions)}/data`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET", params: {} }, requestOptions);
      if (options.file) {
          options.params.f = null;
      }
      return arcgisRestRequest.request(url, options).catch((err) => {
          /* if the item doesn't include data, the response will be empty
             and the internal call to response.json() will fail */
          const emptyResponseErr = RegExp(/The string did not match the expected pattern|(Unexpected end of (JSON input|data at line 1 column 1))/i);
          /* istanbul ignore else */
          if (emptyResponseErr.test(err.message)) {
              return;
          }
          else
              throw err;
      });
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
  function getRelatedItems(requestOptions) {
      const url = `${getItemBaseUrl(requestOptions.id, requestOptions)}/relatedItems`;
      const options = Object.assign({ httpMethod: "GET", params: {
              direction: requestOptions.direction
          } }, requestOptions);
      if (typeof requestOptions.relationshipType === "string") {
          options.params.relationshipType = requestOptions.relationshipType;
      }
      else {
          options.params.relationshipTypes = requestOptions.relationshipType;
      }
      delete options.direction;
      delete options.relationshipType;
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Get the resources associated with an item
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to get some item resources.
   */
  function getItemResources(id, requestOptions) {
      const url = `${getItemBaseUrl(id, requestOptions)}/resources`;
      // Mix in num:1000 with any user supplied params
      // Key thing - we don't want to mutate the passed in requestOptions
      // as that may be used in other (subsequent) calls in the course
      // of a long promise chains
      const options = Object.assign({}, requestOptions);
      options.params = Object.assign({ num: 1000 }, options.params);
      return arcgisRestRequest.request(url, options);
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
  function getItemResource(itemId, requestOptions) {
      const readAs = requestOptions.readAs || "blob";
      return getItemFile(itemId, `/resources/${requestOptions.fileName}`, readAs, requestOptions);
  }
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
  function getItemGroups(id, requestOptions) {
      const url = `${getItemBaseUrl(id, requestOptions)}/groups`;
      return arcgisRestRequest.request(url, requestOptions);
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
  function getItemStatus(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/status`;
          const options = arcgisRestRequest.appendCustomParams(requestOptions, ["jobId", "jobType"], { params: Object.assign({}, requestOptions.params) });
          return arcgisRestRequest.request(url, options);
      });
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
  function getItemParts(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/parts`;
          return arcgisRestRequest.request(url, requestOptions);
      });
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
  function getItemInfo(id, requestOptions) {
      const { fileName = "iteminfo.xml", readAs = "text" } = requestOptions || {};
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
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
  function getItemMetadata(id, requestOptions) {
      const options = Object.assign(Object.assign({}, requestOptions), { fileName: "metadata/metadata.xml" });
      return getItemInfo(id, options);
  }
  // overrides request()'s default behavior for reading the response
  // which is based on `params.f` and defaults to JSON
  // Also adds JSON parse error protection by sanitizing out any unescaped control characters before parsing
  function getItemFile(id, 
  // NOTE: fileName should include any folder/subfolders
  fileName, readMethod, requestOptions) {
      const url = `${getItemBaseUrl(id, requestOptions)}${fileName}`;
      // preserve escape hatch to let the consumer read the response
      // and ensure the f param is not appended to the query string
      const options = Object.assign({ params: {} }, requestOptions);
      const justReturnResponse = options.rawResponse;
      options.rawResponse = true;
      options.params.f = null;
      return arcgisRestRequest.request(url, options).then((response) => {
          if (justReturnResponse) {
              return response;
          }
          return readMethod !== "json"
              ? response[readMethod]()
              : response
                  .text()
                  .then((text) => JSON.parse(scrubControlChars(text)));
      });
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Protect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect.htm) for more information.
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to protect an item.
   */
  function protectItem(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/protect`;
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Unprotect an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect.htm) for more information.
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to unprotect an item.
   */
  function unprotectItem(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/unprotect`;
          return arcgisRestRequest.request(url, requestOptions);
      });
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Fetch a group using its id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group.htm) for more information.
   *
   * ```js
   * import { getGroup } from "@esri/arcgis-rest-portal";
   * //
   * getGroup("fxb988") // id
   *   .then(response)
   * ```
   *
   * @param id - Group Id
   * @param requestOptions  - Options for the request
   * @returns  A Promise that will resolve with the data from the response.
   */
  function getGroup(id, requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${id}`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Gets the category schema set on a group
   *
   * @param id - Group Id
   * @param requestOptions  - Options for the request
   * @returns A promise that will resolve with JSON of group's category schema
   * @see https://developers.arcgis.com/rest/users-groups-and-items/group-category-schema.htm
   */
  function getGroupCategorySchema(id, requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/categorySchema`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Returns the content of a Group. Since the group may contain 1000s of items
   * the requestParams allow for paging.
   * @param id - Group Id
   * @param requestOptions  - Options for the request, including paging parameters.
   * @returns  A Promise that will resolve with the content of the group.
   */
  function getGroupContent(id, requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/content/groups/${id}`;
      // default to a GET request
      const options = Object.assign(Object.assign({ httpMethod: "GET" }, { params: { start: 1, num: 100 } }), requestOptions);
      // is this the most concise way to mixin with the defaults above?
      if (requestOptions && requestOptions.paging) {
          options.params = Object.assign({}, requestOptions.paging);
      }
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Get the usernames of the admins and members. Does not return actual 'User' objects. Those must be
   * retrieved via separate calls to the User's API.
   * @param id - Group Id
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with arrays of the group admin usernames and the member usernames
   */
  function getGroupUsers(id, requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/users`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Search the users in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-users-list.htm) for more information.
   *
   * ```js
   * import { searchGroupUsers } from "@esri/arcgis-rest-portal";
   *
   * searchGroupUsers('abc123')
   *   .then(response)
   * ```
   *
   * @param id - The group id
   * @param searchOptions - Options for the request, including paging parameters.
   * @returns A Promise that will resolve with the data from the response.
   */
  function searchGroupUsers(id, searchOptions) {
      const url = `${getPortalUrl(searchOptions)}/community/groups/${id}/userlist`;
      const options = arcgisRestRequest.appendCustomParams(searchOptions || {}, ["name", "num", "start", "sortField", "sortOrder", "joined", "memberType"], {
          httpMethod: "GET"
      });
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function getSharingUrl(requestOptions) {
      const username = requestOptions.authentication.username;
      const owner = requestOptions.owner || username;
      return `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(owner)}/items/${requestOptions.id}/share`;
  }
  function isItemOwner(requestOptions) {
      const username = requestOptions.authentication.username;
      const owner = requestOptions.owner || username;
      return owner === username;
  }
  /**
   * Check it the user is a full org_admin
   * @param requestOptions
   * @returns Promise resolving in a boolean indicating if the user is an ArcGIS Organization administrator
   */
  function isOrgAdmin(requestOptions) {
      const session = requestOptions.authentication;
      return session.getUser(requestOptions).then((user) => {
          return user && user.role === "org_admin" && !user.roleId;
      });
  }
  /**
   * Get the User Membership for a particular group. Use this if all you have is the groupId.
   * If you have the group object, check the `userMembership.memberType` property instead of calling this method.
   *
   * @param requestOptions
   * @returns A Promise that resolves with "owner" | "admin" | "member" | "nonmember"
   */
  function getUserMembership(requestOptions) {
      // fetch the group...
      return getGroup(requestOptions.groupId, requestOptions)
          .then((group) => {
          return group.userMembership.memberType;
      })
          .catch(() => {
          return "none";
      });
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Reassign an item from one user to another. Caller must be an org admin or the request will fail. `currentOwner` and `targetUsername` must be in the same organization or the request will fail
   *
   * ```js
   * import { reassignItem } from '@esri/arcgis-rest-portal';
   *
   * reassignItem({
   *   id: "abc123",
   *   currentOwner: "charles",
   *   targetUsername: "leslie",
   *   authentication
   * })
   * ```
   *
   * @param reassignOptions - Options for the request
   */
  function reassignItem(reassignOptions) {
      return isOrgAdmin(reassignOptions).then((isAdmin) => {
          if (!isAdmin) {
              throw Error(`Item ${reassignOptions.id} can not be reassigned because current user is not an organization administrator.`);
          }
          // we're operating as an org-admin
          const url = `${getPortalUrl(reassignOptions)}/content/users/${reassignOptions.currentOwner}/items/${reassignOptions.id}/reassign`;
          const opts = {
              params: {
                  targetUsername: reassignOptions.targetUsername,
                  targetFolderName: reassignOptions.targetFolderName
              },
              authentication: reassignOptions.authentication
          };
          return arcgisRestRequest.request(url, opts);
      });
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Delete an item from the portal. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-item.htm) for more information.
   *
   * ```js
   * import { removeItem } from "@esri/arcgis-rest-portal";
   *
   * removeItem({
   *   id: "3ef",
   *   authentication
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that deletes an item.
   */
  function removeItem(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/delete`;
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Remove a relationship between two items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-relationship.htm) for more information.
   *
   * ```js
   * import { removeItemRelationship } from "@esri/arcgis-rest-portal";
   *
   * removeItemRelationship({
   *   originItemId: '3ef',
   *   destinationItemId: 'ae7',
   *   relationshipType: 'Service2Layer',
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to add item resources.
   */
  function removeItemRelationship(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/deleteRelationship`;
          const options = arcgisRestRequest.appendCustomParams(requestOptions, ["originItemId", "destinationItemId", "relationshipType"], { params: Object.assign({}, requestOptions.params) });
          return arcgisRestRequest.request(url, options);
      });
  }
  /**
   * Remove a resource associated with an item
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that deletes an item resource.
   */
  function removeItemResource(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/removeResources`;
          // mix in user supplied params
          requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { resource: requestOptions.resource });
          // only override the deleteAll param specified previously if it is passed explicitly
          if (typeof requestOptions.deleteAll !== "undefined") {
              requestOptions.params.deleteAll = requestOptions.deleteAll;
          }
          return arcgisRestRequest.request(url, requestOptions);
      });
  }
  /**
   * Delete a non-root folder and all the items it contains. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-folder.htm) for more information.
   *
   * ```js
   * import { removeFolder } from "@esri/arcgis-rest-portal";
   *
   * removeFolder({
   *   folderId: "fe4",
   *   owner: "c@sey",
   *   authentication
   * })
   *   .then(response)
   *
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that deletes a folder
   */
  function removeFolder(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${encodeURIComponent(owner)}/${requestOptions.folderId}/delete`;
          return arcgisRestRequest.request(url, requestOptions);
      });
  }

  /* Copyright (c) 2018-2021 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * `SearchQueryBuilder` can be used to construct the `q` param for {@linkcode searchItems} or {@linkcode searchGroups}.
   *
   * By chaining methods, it helps build complex search queries.
   *
   * ```js
   * const startDate = new Date("2020-01-01");
   * const endDate = new Date("2020-09-01");
   * const query = new SearchQueryBuilder()
   *  .match("Patrick")
   *  .in("owner")
   *  .and()
   *  .from(startDate)
   *  .to(endDate)
   *  .in("created")
   *  .and()
   *  .startGroup()
   *    .match("Web Mapping Application")
   *    .in("type")
   *    .or()
   *    .match("Mobile Application")
   *    .in("type")
   *    .or()
   *    .match("Application")
   *    .in("type")
   *  .endGroup()
   *  .and()
   *  .match("Demo App");
   *
   * searchItems(query).then((res) => {
   *   console.log(res.results);
   * });
   * ```
   *
   * Will search for items matching
   * ```
   * "owner: Patrick AND created:[1577836800000 TO 1598918400000] AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application) AND Demo App"
   * ```
   */
  class SearchQueryBuilder {
      /**
       * @param q An existing query string to start building from.
       */
      constructor(q = "") {
          this.termStack = [];
          this.rangeStack = [];
          this.openGroups = 0;
          this.q = q;
      }
      /**
       * Defines strings to search for.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .match("My Layer")
       * ```
       *
       * @param terms strings to search for.
       */
      match(...terms) {
          this.termStack = this.termStack.concat(terms);
          return this;
      }
      /**
       * Defines fields to search in. You can pass `"*"` or call this method without arguments to search a default set of fields
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .match("My Layer")
       *   .in("title")
       * ```
       *
       * @param field The field to search for the previous match in.
       */
      in(field) {
          const fn = `\`in(${field ? `"${field}"` : ""})\``;
          if (!this.hasRange && !this.hasTerms) {
              arcgisRestRequest.warn(
              // apparently-p-rettier-ignore causes some
              `${fn} was called with no call to \`match(...)\` or \`from(...)\`/\`to(...)\`. Your query was not modified.`);
              return this;
          }
          if (field && field !== "*") {
              this.q += `${field}:`;
          }
          return this.commit();
      }
      /**
       * Starts a new search group.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .startGroup()
       *     .match("Lakes")
       *     .in("title")
       *   .endGroup()
       *   .or()
       *   .startGroup()
       *     .match("Rivers")
       *     .in("title")
       *   .endGroup()
       * ```
       */
      startGroup() {
          this.commit();
          if (this.openGroups > 0) {
              this.q += " ";
          }
          this.openGroups++;
          this.q += "(";
          return this;
      }
      /**
       * Ends a search group.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .startGroup()
       *     .match("Lakes")
       *     .in("title")
       *   .endGroup()
       *   .or()
       *   .startGroup()
       *     .match("Rivers")
       *     .in("title")
       *   .endGroup()
       * ```
       */
      endGroup() {
          if (this.openGroups <= 0) {
              arcgisRestRequest.warn(`\`endGroup(...)\` was called without calling \`startGroup(...)\` first. Your query was not modified.`);
              return this;
          }
          this.commit();
          this.openGroups--;
          this.q += ")";
          return this;
      }
      /**
       * Joins two sets of queries with an `AND` clause.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .match("Lakes")
       *   .in("title")
       *   .and()
       *   .match("Rivers")
       *   .in("title")
       * ```
       */
      and() {
          return this.addModifier("and");
      }
      /**
       * Joins two sets of queries with an `OR` clause.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .match("Lakes")
       *   .in("title")
       *   .or()
       *   .match("Rivers")
       *   .in("title")
       * ```
       */
      or() {
          return this.addModifier("or");
      }
      /**
       * Joins two sets of queries with a `NOT` clause. Another option for filtering results is the [prohibit operator '-'](https://developers.arcgis.com/rest/users-groups-and-items/search-reference.htm#ESRI_SECTION1_5C6C35DB9E4A4F4492C5B937BDA2BF67).
       *
       * ```js
       * // omit results with "Rivers" in their title
       * const query = new SearchQueryBuilder()
       *   .not()
       *   .match("Rivers")
       *   .in("title")
       *
       * // equivalent
       * const query = new SearchQueryBuilder()
       *   .match("Rivers")
       *   .in("-title")
       * ```
       */
      not() {
          return this.addModifier("not");
      }
      /**
       * Begins a new range query.
       *
       * ```js
       *
       * const NEWYEARS = new Date("2020-01-01")
       * const TODAY = new Date()
       *
       * const query = new SearchQueryBuilder()
       *   .from(NEWYEARS)
       *   .to(TODAY)
       *   .in("created")
       * ```
       */
      from(term) {
          if (this.hasTerms) {
              arcgisRestRequest.warn(
              // apparently-p*rettier-ignore causes prettier to strip *all* comments O_o
              `\`from(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Optionally, you may see this because dates are incorrectly formatted. Dates should be a primative Date value, aka a number in milliseconds or Date object, ie new Date("2020-01-01").  Your query was not modified.`);
              return this;
          }
          this.rangeStack[0] = term;
          return this;
      }
      /**
       * Ends a range query.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .from(yesterdaysDate)
       *   .to(todaysDate)
       *   .in("created")
       * ```
       */
      to(term) {
          if (this.hasTerms) {
              arcgisRestRequest.warn(
              // apparently-p*rettier-ignore causes prettier to strip *all* comments O_o
              `\`to(...)\` is not allowed after \`match(...)\` try using \`.from(...).to(...).in(...)\`. Optionally, you may see this because dates are incorrectly formatted. Dates should be a primative Date value, aka a number in milliseconds or Date object, ie new Date("2020-01-01"). Your query was not modified.`);
              return this;
          }
          this.rangeStack[1] = term;
          return this;
      }
      /**
       * Boosts the previous term to increase its rank in the results.
       *
       * ```js
       * const query = new SearchQueryBuilder()
       *   .match("Lakes")
       *   .in("title")
       *   .or()
       *   .match("Rivers")
       *   .in("title")
       *   .boost(3)
       * ```
       */
      boost(num) {
          this.commit();
          this.q += `^${num}`;
          return this;
      }
      /**
       * Returns the current query string. Called internally when the request is made.
       */
      toParam() {
          this.commit();
          this.cleanup();
          return this.q;
      }
      /**
       * Returns a new instance of `SearchQueryBuilder` based on the current instance.
       */
      clone() {
          this.commit();
          this.cleanup();
          return new SearchQueryBuilder(this.q + "");
      }
      addModifier(modifier) {
          if (this.currentModifer) {
              arcgisRestRequest.warn(
              // apparently-p*rettier-ignore causes prettier to strip *all* comments O_o
              `You have called \`${this.currentModifer}()\` after \`${modifier}()\`. Your current query was not modified.`);
              return this;
          }
          this.commit();
          if (this.q === "" && modifier !== "not") {
              arcgisRestRequest.warn(`You have called \`${modifier}()\` without calling another method to modify your query first. Try calling \`match()\` first.`);
              return this;
          }
          this.currentModifer = modifier;
          this.q += this.q === "" ? "" : " ";
          this.q += `${modifier.toUpperCase()} `;
          return this;
      }
      hasWhiteSpace(s) {
          return /\s/g.test(s);
      }
      formatTerm(term) {
          if (term instanceof Date) {
              return term.getTime();
          }
          if (typeof term === "string" && this.hasWhiteSpace(term)) {
              return `"${term}"`;
          }
          return term;
      }
      commit() {
          this.currentModifer = undefined;
          if (this.hasRange) {
              this.q += `[${this.formatTerm(this.rangeStack[0])} TO ${this.formatTerm(this.rangeStack[1])}]`;
              this.rangeStack = [undefined, undefined];
          }
          if (this.hasTerms) {
              this.q += this.termStack
                  .map((term) => {
                  return this.formatTerm(term);
              })
                  .join(" ");
              this.termStack = [];
          }
          return this;
      }
      get hasTerms() {
          return this.termStack.length > 0;
      }
      get hasRange() {
          return this.rangeStack.length && this.rangeStack[0] && this.rangeStack[1];
      }
      cleanup() {
          // end a group if we have started one
          if (this.openGroups > 0) {
              arcgisRestRequest.warn(
              // apparently-p*rettier-ignore causes prettier to strip *all* comments O_o
              `Automatically closing ${this.openGroups} group(s). You can use \`endGroup(...)\` to remove this warning.`);
              while (this.openGroups > 0) {
                  this.q += ")";
                  this.openGroups--;
              }
          }
          const oldQ = this.q;
          this.q = oldQ.replace(/( AND ?| NOT ?| OR ?)*$/, "");
          if (oldQ !== this.q) {
              arcgisRestRequest.warn(`\`startGroup(...)\` was called without calling \`endGroup(...)\` first. Your query was not modified.`);
          }
          // clear empty groups
          this.q = this.q.replace(/(\(\))*/, "");
      }
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function genericSearch(search, searchType) {
      let options;
      if (typeof search === "string" || search instanceof SearchQueryBuilder) {
          options = {
              httpMethod: "GET",
              params: {
                  q: search
              }
          };
      }
      else {
          // searchUserAccess has one (known) valid value: "groupMember"
          options = arcgisRestRequest.appendCustomParams(search, [
              "q",
              "num",
              "start",
              "sortField",
              "sortOrder",
              "searchUserAccess",
              "searchUserName",
              "filter",
              "countFields",
              "countSize",
              "categories",
              "categoryFilters"
          ], {
              httpMethod: "GET"
          });
      }
      let path;
      switch (searchType) {
          case "item":
              path = "/search";
              break;
          case "group":
              path = "/community/groups";
              break;
          case "groupContent":
              // Need to have groupId property to do group contents search,
              // cso filter out all but ISearchGroupContentOptions
              if (typeof search !== "string" &&
                  !(search instanceof SearchQueryBuilder) &&
                  search.groupId) {
                  path = `/content/groups/${search.groupId}/search`;
              }
              else {
                  return Promise.reject(new Error("you must pass a `groupId` option to `searchGroupContent`"));
              }
              break;
          default:
              // "users"
              path = "/portals/self/users/search";
              break;
      }
      const url = getPortalUrl(options) + path;
      // send the request
      return arcgisRestRequest.request(url, options).then((r) => {
          if (r.nextStart && r.nextStart !== -1) {
              r.nextPage = function () {
                  let newOptions;
                  if (typeof search === "string" ||
                      search instanceof SearchQueryBuilder) {
                      newOptions = {
                          q: search,
                          start: r.nextStart
                      };
                  }
                  else {
                      newOptions = search;
                      newOptions.start = r.nextStart;
                  }
                  return genericSearch(newOptions, searchType);
              };
          }
          return r;
      });
  }

  /* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Search a portal for items. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/search.htm) for more information.
   *
   * ```js
   * import { searchItems } from "@esri/arcgis-rest-portal";
   *
   * searchItems('water')
   *   .then(response) // response.total => 355
   * ```
   *
   * @param search - A string or RequestOptions object to pass through to the endpoint.
   * @returns A Promise that will resolve with the data from the response.
   */
  function searchItems(search) {
      return genericSearch(search, "item");
  }

  /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Add Item Part allows the caller to upload a file part when doing an add or update item operation in multipart mode. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-item-part.htm) for more information.
   *
   * ```js
   * import { addItemPart } from "@esri/arcgis-rest-portal";
   *
   * addItemPart({
   *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
   *   file: data,
   *   partNum: 1,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to add the item part status.
   */
  function addItemPart(requestOptions) {
      const partNum = requestOptions.partNum;
      if (!Number.isInteger(partNum) || partNum < 1 || partNum > 10000) {
          return Promise.reject(new Error("The part number must be an integer between 1 to 10000, inclusive."));
      }
      return determineOwner(requestOptions).then((owner) => {
          // AGO adds the "partNum" parameter in the query string, not in the body
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/addPart?partNum=${partNum}`;
          const options = arcgisRestRequest.appendCustomParams(requestOptions, ["file"], { params: Object.assign({}, requestOptions.params) });
          return arcgisRestRequest.request(url, options);
      });
  }
  /**
   * Commit is called once all parts are uploaded during a multipart Add Item or Update Item operation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/commit.htm) for more information.
   *
   * ```js
   * import { commitItemUpload } from "@esri/arcgis-rest-portal";
   * //
   * commitItemUpload({
   *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to get the commit result.
   */
  function commitItemUpload(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/commit`;
          const options = arcgisRestRequest.appendCustomParams(requestOptions, [], {
              params: Object.assign(Object.assign({}, requestOptions.params), requestOptions.item)
          });
          return arcgisRestRequest.request(url, options);
      });
  }
  /**
   * Cancels a multipart upload on an item. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/cancel.htm) for more information.
   *
   * ```js
   * import { cancelItemUpload } from "@esri/arcgis-rest-portal";
   * //
   * cancelItemUpload({
   *   id: "30e5fe3149c34df1ba922e6f5bbf808f",
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise to get the commit result.
   */
  function cancelItemUpload(requestOptions) {
      return determineOwner(requestOptions).then((owner) => {
          const url = `${getPortalUrl(requestOptions)}/content/users/${owner}/items/${requestOptions.id}/cancel`;
          return arcgisRestRequest.request(url, requestOptions);
      });
  }

  /* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function chunk(array, size) {
      if (array.length === 0) {
          return [];
      }
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
          chunks.push(array.slice(i, i + size));
      }
      return chunks;
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm) for more information.
   *
   * ```js
   * import { addGroupUsers } from "@esri/arcgis-rest-portal";
   * //
   * addGroupUsers({
   *   id: groupId,
   *   users: ["username1", "username2"],
   *   admins: ["username3"],
   *   authentication
   * })
   * .then(response);
   * ```
   *
   * @param requestOptions  - Options for the request
   * @returns A Promise
   */
  function addGroupUsers(requestOptions) {
      const id = requestOptions.id;
      const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/addUsers`;
      const baseOptions = Object.assign({}, requestOptions, {
          admins: undefined,
          users: undefined
      });
      const batchRequestOptions = [
          ..._prepareRequests("users", requestOptions.users, baseOptions),
          ..._prepareRequests("admins", requestOptions.admins, baseOptions)
      ];
      const promises = batchRequestOptions.map((options) => _sendSafeRequest$2(url, options));
      return Promise.all(promises).then(_consolidateRequestResults);
  }
  function _prepareRequests(type, usernames, baseOptions) {
      if (!usernames || usernames.length < 1) {
          return [];
      }
      // the ArcGIS REST API only allows to add no more than 25 users per request,
      // see https://developers.arcgis.com/rest/users-groups-and-items/add-users-to-group.htm
      const userChunks = chunk(usernames, 25);
      return userChunks.map((users) => _generateRequestOptions$2(type, users, baseOptions));
  }
  function _generateRequestOptions$2(type, usernames, baseOptions) {
      return Object.assign({}, baseOptions, {
          [type]: usernames,
          params: Object.assign(Object.assign({}, baseOptions.params), { [type]: usernames })
      });
  }
  // this request is safe since the request error will be handled
  function _sendSafeRequest$2(url, requestOptions) {
      return arcgisRestRequest.request(url, requestOptions).catch((error) => {
          return {
              errors: [error]
          };
      });
  }
  function _consolidateRequestResults(results) {
      const notAdded = results
          .filter((result) => result.notAdded)
          .reduce((collection, result) => collection.concat(result.notAdded), []);
      const errors = results
          .filter((result) => result.errors)
          .reduce((collection, result) => collection.concat(result.errors), []);
      const consolidated = { notAdded };
      if (errors.length > 0) {
          consolidated.errors = errors;
      }
      return consolidated;
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Add users to a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm) for more information.
   *
   * ```js
   * import { removeGroupUsers } from "@esri/arcgis-rest-portal";
   *
   * removeGroupUsers({
   *   id: groupId,
   *   users: ["username1", "username2"],
   *   authentication
   * })
   * .then(response);
   * ```
   *
   * @param requestOptions  - Options for the request
   * @returns A Promise
   */
  function removeGroupUsers(requestOptions) {
      const { id, users: usersToRemove } = requestOptions;
      const url = `${getPortalUrl(requestOptions)}/community/groups/${id}/removeUsers`;
      const safeSend = (users) => {
          const options = Object.assign(Object.assign({}, requestOptions), { users, params: { users } });
          return arcgisRestRequest.request(url, options).catch((error) => ({ errors: [error] }));
      };
      // the ArcGIS REST API only allows to add no more than 25 users per request,
      // see https://developers.arcgis.com/rest/users-groups-and-items/remove-users-from-group.htm
      const promises = chunk(usersToRemove, 25).map((usersChunk) => safeSend(usersChunk));
      return Promise.all(promises).then((results) => {
          const filtered = (propName) => results
              .filter((result) => result[propName])
              .reduce((collection, result) => collection.concat(result[propName]), []);
          const errors = filtered("errors");
          const consolidated = {
              notRemoved: filtered("notRemoved")
          };
          return errors.length ? Object.assign(Object.assign({}, consolidated), { errors }) : consolidated;
      });
  }

  /**
   * Invites users to join a group. Operation success will be indicated by a flag on the return object. If there are any errors, they will be placed in an errors array on the return object.
   *
   * ```js
   * const authentication: IAuthenticationManager; // Typically passed into to the function
   *
   * const options: IInviteGroupUsersOptions = {
   *  id: 'group_id',
   *  users: ['ed', 'edd', 'eddy'],
   *  role: 'group-member',
   *  expiration: 20160,
   *  authentication
   * }
   *
   * const result = await inviteGroupUsers(options);
   *
   * const if_success_result_looks_like = {
   *  success: true
   * }
   *
   * const if_failure_result_looks_like = {
   *  success: false,
   *  errors: [ArcGISRequestError]
   * }
   * ```
   *
   * @param {IInviteGroupUsersOptions} options
   * @returns {Promise<IAddGroupUsersResult>}
   */
  function inviteGroupUsers(options) {
      const id = options.id;
      const url = `${getPortalUrl(options)}/community/groups/${id}/invite`;
      const batches = _generateBatchRequests$1(options);
      const promises = batches.map((batch) => _sendSafeRequest$1(url, batch));
      return Promise.all(promises).then(_combineResults$1);
  }
  /**
   * @private
   */
  function _generateBatchRequests$1(options) {
      const userBatches = chunk(options.users, 25);
      return userBatches.map((users) => _generateRequestOptions$1(users, options));
  }
  /**
   * @private
   */
  function _generateRequestOptions$1(users, baseOptions) {
      const requestOptions = Object.assign({}, baseOptions);
      requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { users, role: requestOptions.role, expiration: requestOptions.expiration });
      return requestOptions;
  }
  /**
   * @private
   */
  function _sendSafeRequest$1(url, requestOptions) {
      return arcgisRestRequest.request(url, requestOptions).catch((error) => ({ errors: [error] }));
  }
  /**
   * @private
   */
  function _combineResults$1(responses) {
      const success = responses.every((res) => res.success);
      const errors = responses.reduce((collection, res) => collection.concat(res.errors || []), []);
      const combined = { success };
      if (errors.length > 0) {
          combined.errors = errors;
      }
      return combined;
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Create a new Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/create-group.htm) for more information.
   *
   * ```js
   * import { createGroup } from "@esri/arcgis-rest-portal";
   *
   * createGroup({
   *   group: {
   *     title: "No Homers",
   *     access: "public"
   *   },
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * Note: The group name must be unique within the user's organization.
   * @param requestOptions  - Options for the request, including a group object
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function createGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/createGroup`;
      requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
      return arcgisRestRequest.request(url, requestOptions);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Create a group notification.
   *
   * ```js
   * import { createGroupNotification } from '@esri/arcgis-rest-portal';
   * // send an email to an entire group
   * createGroupNotification({
   *   authentication: ArcGISIdentityManager,
   *   subject: "hello",
   *   message: "world!",
   *   id: groupId
   * })
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function createGroupNotification(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/createNotification`;
      const options = Object.assign({ params: Object.assign({ subject: requestOptions.subject, message: requestOptions.message, users: requestOptions.users, notificationChannelType: requestOptions.notificationChannelType || "email", clientId: requestOptions.clientId, silentNotification: requestOptions.silentNotification, notifyAll: !requestOptions.users || requestOptions.users.length === 0 }, requestOptions.params) }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Protect a group to avoid accidental deletion. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/protect-group.htm) for more information.
   *
   * ```js
   * import { protectGroup } from '@esri/arcgis-rest-portal';
   *
   * protectGroup({
   *   id: groupId,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function protectGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/protect`;
      return arcgisRestRequest.request(url, requestOptions);
  }
  /**
   * Unprotect a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/unprotect-group.htm) for more information.
   *
   * ```js
   * import { unprotectGroup } from '@esri/arcgis-rest-portal';
   *
   * unprotectGroup({
   *   id: groupId,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function unprotectGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/unprotect`;
      return arcgisRestRequest.request(url, requestOptions);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Delete a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/delete-group.htm) for more information.
   *
   * ```js
   * import { removeGroup } from '@esri/arcgis-rest-portal';
   * //
   * removeGroup({
   *   id: groupId,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function removeGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/delete`;
      const options = Object.assign({}, requestOptions);
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Search a portal for groups. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-search.htm) for more information.
   *
   * ```js
   * import { searchGroups } from "@esri/arcgis-rest-portal";
   *
   * searchGroups('water')
   *   .then(response) // response.total => 355
   * ```
   *
   * @param search - A string or RequestOptions object to pass through to the endpoint.
   * @returns A Promise that will resolve with the data from the response.
   */
  function searchGroups(search) {
      return genericSearch(search, "group");
  }
  /**
   * Search a portal for items in a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/group-content-search.htm) for more information.
   *
   * ```js
   * import { searchGroupContent } from "@esri/arcgis-rest-portal";
   *
   * searchGroupContent('water')
   *   .then(response) // response.total => 355
   * ```
   *
   * @param options - RequestOptions object amended with search parameters.
   * @returns A Promise that will resolve with the data from the response.
   */
  function searchGroupContent(options) {
      return genericSearch(options, "groupContent");
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update the properties of a group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-group.htm) for more information.
   *
   * ```js
   * import { updateGroup } from '@esri/arcgis-rest-portal';
   *
   * updateGroup({
   *   group: { id: "fgr344", title: "new" }
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request, including the group
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function updateGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.group.id}/update`;
      requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), requestOptions.group);
      return arcgisRestRequest.request(url, requestOptions);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Change the user membership levels of existing users in a group
   *
   * ```js
   * import { updateUserMemberships } from "@esri/arcgis-rest-portal";
   *
   * updateUserMemberships({
   *   id: groupId,
   *   admins: ["username3"],
   *   authentication
   * })
   * .then(response);
   * ```
   *
   * @param requestOptions  - Options for the request
   * @returns A Promise
   */
  function updateUserMemberships(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/updateUsers`;
      const opts = {
          authentication: requestOptions.authentication,
          params: {}
      };
      // add the correct params depending on the type of membership we are changing to
      if (requestOptions.newMemberType === "admin") {
          opts.params.admins = requestOptions.users;
      }
      else {
          opts.params.users = requestOptions.users;
      }
      // make the request
      return arcgisRestRequest.request(url, opts);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Make a request as the authenticated user to join a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/join-group.htm) for more information.
   *
   * ```js
   * import { joinGroup } from '@esri/arcgis-rest-portal';
   * //
   * joinGroup({
   *   id: groupId,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
   */
  function joinGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/join`;
      return arcgisRestRequest.request(url, requestOptions);
  }
  /**
   * Make a request as the authenticated user to leave a Group. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/leave-group.htm) for more information.
   *
   * ```js
   * import { leaveGroup } from '@esri/arcgis-rest-portal';
   *
   * leaveGroup({
   *   id: groupId,
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request and the groupId.
   */
  function leaveGroup(requestOptions) {
      const url = `${getPortalUrl(requestOptions)}/community/groups/${requestOptions.id}/leave`;
      return arcgisRestRequest.request(url, requestOptions);
  }

  /**
   * Send a notification to members of the requesting user's org. Operation success will be indicated by a flag on the return object. If there are any errors, they will be placed in an errors array on the return object
   *
   * ```js
   * const authentication: IAuthenticationManager; // Typically passed into to the function
   *
   * const options: IInviteGroupUsersOptions = {
   *  id: 'group_id',
   *  users: ['larry', 'curly', 'moe'],
   *  notificationChannelType: 'email',
   *  expiration: 20160,
   *  authentication
   * }
   *
   * const result = await createOrgNotification(options);
   *
   * const if_success_result_looks_like = {
   *  success: true
   * }
   *
   * const if_failure_result_looks_like = {
   *  success: false,
   *  errors: [ArcGISRequestError]
   * }
   * ```
   *
   * @param {ICreateOrgNotificationOptions} options
   * @returns {ICreateOrgNotificationResult}
   */
  function createOrgNotification(options) {
      const url = `${getPortalUrl(options)}/portals/self/createNotification`;
      const batches = _generateBatchRequests(options);
      const promises = batches.map((batch) => _sendSafeRequest(url, batch));
      return Promise.all(promises).then(_combineResults);
  }
  /**
   * @private
   */
  function _generateBatchRequests(options) {
      const userBatches = chunk(options.users, options.batchSize || 25);
      return userBatches.map((users) => _generateRequestOptions(users, options));
  }
  /**
   * @private
   */
  function _generateRequestOptions(users, baseOptions) {
      const requestOptions = Object.assign({}, baseOptions);
      requestOptions.params = Object.assign(Object.assign({}, requestOptions.params), { users, subject: baseOptions.subject, message: baseOptions.message, notificationChannelType: requestOptions.notificationChannelType });
      return requestOptions;
  }
  /**
   * @private
   */
  function _sendSafeRequest(url, requestOptions) {
      return arcgisRestRequest.request(url, requestOptions).catch((error) => ({ errors: [error] }));
  }
  /**
   * @private
   */
  function _combineResults(responses) {
      const success = responses.every((res) => res.success);
      const errors = responses.reduce((collection, res) => collection.concat(res.errors || []), []);
      const combined = { success };
      if (errors.length > 0) {
          combined.errors = errors;
      }
      return combined;
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Get information about a user. This method has proven so generically useful that you can also call {@linkcode ArcGISIdentityManager.getUser}.
   *
   * ```js
   * import { getUser } from '@esri/arcgis-rest-portal';
   * //
   * getUser("jsmith")
   *   .then(response)
   * // => { firstName: "John", lastName: "Smith",tags: ["GIS Analyst", "City of Redlands"] }
   * ```
   *
   * @param requestOptions - options to pass through in the request
   * @returns A Promise that will resolve with metadata about the user
   */
  function getUser(requestOptions) {
      let url;
      let options = { httpMethod: "GET" };
      // if a username is passed, assume ArcGIS Online
      if (typeof requestOptions === "string") {
          url = `https://www.arcgis.com/sharing/rest/community/users/${requestOptions}`;
      }
      else {
          // if an authenticated session is passed, default to that user/portal unless another username is provided manually
          const username = requestOptions.username || requestOptions.authentication.username;
          url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}`;
          options = Object.assign(Object.assign({}, requestOptions), options);
      }
      // send the request
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Users tag the content they publish in their portal via the add and update item calls. This resource lists all the tags used by the user along with the number of times the tags have been used. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-tags.htm) for more information.
   *
   * ```js
   * import { getUserTags } from '@esri/arcgis-rest-portal';
   *
   * getUserTags({
   *   username: "jsmith",
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param IGetUserOptions - options to pass through in the request
   * @returns A Promise that will resolve with the user tag array
   */
  function getUserTags(requestOptions) {
      const username = requestOptions.username || requestOptions.authentication.username;
      const url = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/tags`;
      // send the request
      return arcgisRestRequest.request(url, requestOptions);
  }

  /* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Helper that returns the [user](https://developers.arcgis.com/rest/users-groups-and-items/user.htm) for a given portal.
   *
   * @param session
   * @returns User url to be used in API requests.
   */
  function getUserUrl(session) {
      return `${getPortalUrl(session)}/community/users/${encodeURIComponent(session.username)}`;
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Get all invitations for a user. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitations.htm) for more information.
   *
   * ```js
   * import { getUserInvitations } from '@esri/arcgis-rest-portal';
   *
   * getUserInvitations({ authentication })
   *   .then(response) // response.userInvitations.length => 3
   * ```
   *
   * @param requestOptions - options to pass through in the request
   * @returns A Promise that will resolve with the user's invitations
   */
  function getUserInvitations(requestOptions) {
      let options = { httpMethod: "GET" };
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/invitations`;
      options = Object.assign(Object.assign({}, requestOptions), options);
      // send the request
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Get an invitation for a user by id. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/user-invitation.htm) for more information.
   *
   * ```js
   * import { getUserInvitation } from '@esri/arcgis-rest-portal';
   * // username is inferred from ArcGISIdentityManager
   * getUserInvitation({
   *   invitationId: "3ef",
   *   authentication
   * })
   *   .then(response) // => response.accepted => true
   * ```
   *
   * @param requestOptions - options to pass through in the request
   * @returns A Promise that will resolve with the invitation
   */
  function getUserInvitation(requestOptions) {
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}`;
      let options = { httpMethod: "GET" };
      options = Object.assign(Object.assign({}, requestOptions), options);
      // send the request
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Accept an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/accept-invitation.htm) for more information.
   *
   * ```js
   * import { acceptInvitation } from '@esri/arcgis-rest-portal';
   *
   * acceptInvitation({
   *   invitationId: "3ef",
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function acceptInvitation(requestOptions) {
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/accept`;
      const options = Object.assign({}, requestOptions);
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Decline an invitation. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/decline-invitation.htm) for more information.
   *
   * ```js
   * import { declineInvitation } from '@esri/arcgis-rest-portal';
   * // username is inferred from ArcGISIdentityManager
   * declineInvitation({
   *   invitationId: "3ef",
   *   authentication
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function declineInvitation(requestOptions) {
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/invitations/${requestOptions.invitationId}/decline`;
      const options = Object.assign({}, requestOptions);
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Get notifications for a user.
   *
   * ```js
   * import { getUserNotifications } from '@esri/arcgis-rest-portal';
   *
   * getUserNotifications({ authentication })
   *   .then(results) // results.notifications.length) => 3
   * ```
   *
   *
   * @param requestOptions - options to pass through in the request
   * @returns A Promise that will resolve with the user's notifications
   */
  function getUserNotifications(requestOptions) {
      let options = { httpMethod: "GET" };
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/notifications`;
      options = Object.assign(Object.assign({}, requestOptions), options);
      // send the request
      return arcgisRestRequest.request(url, options);
  }
  /**
   * Delete a notification.
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the success/failure status of the request
   */
  function removeNotification(requestOptions) {
      const username = encodeURIComponent(requestOptions.authentication.username);
      const portalUrl = getPortalUrl(requestOptions);
      const url = `${portalUrl}/community/users/${username}/notifications/${requestOptions.id}/delete`;
      return arcgisRestRequest.request(url, requestOptions);
  }

  /**
   * Search a portal for users.
   *
   * ```js
   * import { searchItems } from "@esri/arcgis-rest-portal";
   * //
   * searchUsers({ q: 'tommy', authentication })
   *   .then(response) // response.total => 355
   * ```
   *
   * @param search - A RequestOptions object to pass through to the endpoint.
   * @returns A Promise that will resolve with the data from the response.
   */
  function searchUsers(search) {
      return genericSearch(search, "user");
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update a user profile. The username will be extracted from the authentication session unless it is provided explicitly. See the [REST Documentation](https://developers.arcgis.com/rest/users-groups-and-items/update-user.htm) for more information.
   *
   * ```js
   * import { updateUser } from '@esri/arcgis-rest-portal';
   *
   * // any user can update their own profile
   * updateUser({
   *   authentication,
   *   user: { description: "better than the last one" }
   * })
   *   .then(response)
   *
   * // org administrators must declare the username that will be updated explicitly
   * updateUser({
   *   authentication,
   *   user: { username: "c@sey", description: "" }
   * })
   *   .then(response)
   * // => { "success": true, "username": "c@sey" }
   * ```
   *
   * @param requestOptions - options to pass through in the request
   * @returns A Promise that will resolve with metadata about the user
   */
  function updateUser(requestOptions) {
      // default to the authenticated username unless another username is provided manually
      const username = requestOptions.user.username || requestOptions.authentication.username;
      const updateUrl = `${getPortalUrl(requestOptions)}/community/users/${encodeURIComponent(username)}/update`;
      // mixin custom params and the user information, then drop the user info
      requestOptions.params = Object.assign(Object.assign({}, requestOptions.user), requestOptions.params);
      delete requestOptions.user;
      // send the request
      return arcgisRestRequest.request(updateUrl, requestOptions);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Change who is able to access an item.
   *
   * ```js
   * import { setItemAccess } from "@esri/arcgis-rest-portal";
   *
   * setItemAccess({
   *   id: "abc123",
   *   access: "public", // 'org' || 'private'
   *   authentication: session
   * })
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the data from the response.
   */
  function setItemAccess(requestOptions) {
      const url = getSharingUrl(requestOptions);
      if (isItemOwner(requestOptions)) {
          // if the user owns the item, proceed
          return updateItemAccess(url, requestOptions);
      }
      else {
          // otherwise we need to check to see if they are an organization admin
          return isOrgAdmin(requestOptions).then((admin) => {
              if (admin) {
                  return updateItemAccess(url, requestOptions);
              }
              else {
                  // if neither, updating the sharing isnt possible
                  throw Error(`This item can not be shared by ${requestOptions.authentication.username}. They are neither the item owner nor an organization admin.`);
              }
          });
      }
  }
  function updateItemAccess(url, requestOptions) {
      requestOptions.params = Object.assign({ org: false, everyone: false }, requestOptions.params);
      // if the user wants to make the item private, it needs to be unshared from any/all groups as well
      if (requestOptions.access === "private") {
          requestOptions.params.groups = " ";
      }
      if (requestOptions.access === "org") {
          requestOptions.params.org = true;
      }
      // if sharing with everyone, share with the entire organization as well.
      if (requestOptions.access === "public") {
          // this is how the ArcGIS Online Home app sets public access
          // setting org = true instead of account = true will cancel out all sharing
          requestOptions.params.account = true;
          requestOptions.params.everyone = true;
      }
      return arcgisRestRequest.request(url, requestOptions);
  }

  /**
   * Find out whether or not an item is already shared with a group.
   *
   * ```js
   * import { isItemSharedWithGroup } from "@esri/arcgis-rest-portal";
   *
   * isItemSharedWithGroup({
   *   groupId: 'bc3,
   *   itemId: 'f56,
   *   authentication
   * })
   * .then(isShared => {})
   * ```
   
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns Promise that will resolve with true/false
   */
  function isItemSharedWithGroup(requestOptions) {
      const searchOpts = {
          q: `id: ${requestOptions.id} AND group: ${requestOptions.groupId}`,
          start: 1,
          num: 10,
          sortField: "title",
          authentication: requestOptions.authentication,
          httpMethod: "POST"
      };
      return searchItems(searchOpts).then((searchResponse) => {
          let result = false;
          if (searchResponse.total > 0) {
              result = searchResponse.results.some((itm) => {
                  return itm.id === requestOptions.id;
              });
              return result;
          }
      });
  }

  /**
   * Share an item with a group, either as an [item owner](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-item-owner-.htm), [group admin](https://developers.arcgis.com/rest/users-groups-and-items/share-item-as-group-admin-.htm) or organization admin.
   *
   * Sharing the item as an Admin will use the `/content/users/:ownername/items/:itemid/share` end-point
   *
   * ```js
   * import { shareItemWithGroup } from '@esri/arcgis-rest-portal';
   *
   * shareItemWithGroup({
   *   id: "abc123",
   *   groupId: "xyz987",
   *   owner: "some-owner",
   *   authentication
   * })
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the data from the response.
   */
  function shareItemWithGroup(requestOptions) {
      return isItemSharedWithGroup(requestOptions)
          .then((isShared) => {
          if (isShared) {
              // already shared, exit early with success response
              return {
                  itemId: requestOptions.id,
                  shortcut: true,
                  notSharedWith: []
              };
          }
          const { authentication: { username }, owner, confirmItemControl } = requestOptions;
          const itemOwner = owner || username;
          // non-item owner
          if (itemOwner !== username) {
              // need to track if the user is an admin
              let isAdmin = false;
              // track if the admin & owner are in the same org
              let isCrossOrgSharing = false;
              // next perform any necessary membership adjustments for
              // current user and/or item owner
              return Promise.all([
                  getUser({
                      username,
                      authentication: requestOptions.authentication
                  }),
                  getUser({
                      username: itemOwner,
                      authentication: requestOptions.authentication
                  }),
                  getUserMembership(requestOptions)
              ])
                  .then(([currentUser, ownerUser, membership]) => {
                  const isSharedEditingGroup = !!confirmItemControl;
                  isAdmin = currentUser.role === "org_admin" && !currentUser.roleId;
                  isCrossOrgSharing = currentUser.orgId !== ownerUser.orgId;
                  return getMembershipAdjustments(currentUser, isSharedEditingGroup, membership, isAdmin, ownerUser, requestOptions);
              })
                  .then((membershipAdjustments) => {
                  const [{ revert } = {
                      promise: Promise.resolve({ notAdded: [] }),
                      revert: (sharingResults) => {
                          return Promise.resolve(sharingResults);
                      }
                  }] = membershipAdjustments;
                  // perform all membership adjustments
                  return Promise.all(membershipAdjustments.map(({ promise }) => promise))
                      .then(() => {
                      // then attempt the share
                      return shareToGroup(requestOptions, isAdmin, isCrossOrgSharing);
                  })
                      .then((sharingResults) => {
                      // lastly, if the admin user was added to the group,
                      // remove them from the group. this is a no-op that
                      // immediately resolves the sharingResults when no
                      // membership adjustment was needed
                      return revert(sharingResults);
                  });
              });
          }
          // item owner, let it call through
          return shareToGroup(requestOptions);
      })
          .then((sharingResponse) => {
          if (sharingResponse.notSharedWith.length) {
              throw Error(`Item ${requestOptions.id} could not be shared to group ${requestOptions.groupId}.`);
          }
          else {
              // all is well
              return sharingResponse;
          }
      });
  }
  function getMembershipAdjustments(currentUser, isSharedEditingGroup, membership, isAdmin, ownerUser, requestOptions) {
      const membershipGuarantees = [];
      if (requestOptions.groupId !== currentUser.favGroupId) {
          if (isSharedEditingGroup) {
              if (!isAdmin) {
                  // abort and reject promise
                  throw Error(`This item can not be shared to shared editing group ${requestOptions.groupId} by ${currentUser.username} as they not the item owner or org admin.`);
              }
              membershipGuarantees.push(
              // admin user must be a group member to share, should be reverted afterwards
              ensureMembership(currentUser, currentUser, false, `Error adding ${currentUser.username} as member to edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions), 
              // item owner must be a group admin
              ensureMembership(currentUser, ownerUser, true, membership === "none"
                  ? `Error adding user ${ownerUser.username} to edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`
                  : `Error promoting user ${ownerUser.username} to admin in edit group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions));
          }
          else if (isAdmin) {
              // admin user must be a group member to share, should be reverted afterwards
              membershipGuarantees.push(ensureMembership(currentUser, currentUser, false, `Error adding ${currentUser.username} as member to view group ${requestOptions.groupId}. Consequently item ${requestOptions.id} was not shared to the group.`, requestOptions));
          }
          else if (membership === "none") {
              // all other non-item owners must be a group member
              throw new Error(`This item can not be shared by ${currentUser.username} as they are not a member of the specified group ${requestOptions.groupId}.`);
          }
      }
      return membershipGuarantees;
  }
  function shareToGroup(requestOptions, isAdmin = false, isCrossOrgSharing = false) {
      const username = requestOptions.authentication.username;
      const itemOwner = requestOptions.owner || username;
      // decide what url to use
      // default to the non-owner url...
      let url = `${getPortalUrl(requestOptions)}/content/items/${requestOptions.id}/share`;
      // but if they are the owner, or org_admin, use this route
      // Note: When using this end-point as an admin, apparently the admin does not need to be a member of the group (the itemOwner does)
      // Note: Admin's can only use this route when the item is in the same org they are admin for
      if (itemOwner === username || (isAdmin && !isCrossOrgSharing)) {
          url = `${getPortalUrl(requestOptions)}/content/users/${itemOwner}/items/${requestOptions.id}/share`;
      }
      // now its finally time to do the sharing
      requestOptions.params = {
          groups: requestOptions.groupId,
          confirmItemControl: requestOptions.confirmItemControl
      };
      return arcgisRestRequest.request(url, requestOptions);
  }
  function ensureMembership(currentUser, ownerUser, shouldPromote, errorMessage, requestOptions) {
      const ownerGroups = ownerUser.groups || [];
      const group = ownerGroups.find((g) => {
          return g.id === requestOptions.groupId;
      });
      // if they are in different orgs, eject
      if (currentUser.orgId !== ownerUser.orgId) {
          throw Error(`User ${ownerUser.username} is not a member of the same org as ${currentUser.username}. Consequently they can not be added added to group ${requestOptions.groupId} nor can item ${requestOptions.id} be shared to the group.`);
      }
      // if owner is not a member, and has 512 groups
      if (!group && ownerGroups.length > 511) {
          throw Error(`User ${ownerUser.username} already has 512 groups, and can not be added to group ${requestOptions.groupId}. Consequently item ${requestOptions.id} can not be shared to the group.`);
      }
      let promise;
      let revert;
      // decide if we need to add them or upgrade them
      if (group) {
          // they are in the group...
          // check member type
          if (shouldPromote && group.userMembership.memberType === "member") {
              // promote them
              promise = updateUserMemberships({
                  id: requestOptions.groupId,
                  users: [ownerUser.username],
                  newMemberType: "admin",
                  authentication: requestOptions.authentication
              })
                  .then((results) => {
                  // convert the result into the right type
                  const notAdded = results.results.reduce((acc, entry) => {
                      if (!entry.success) {
                          acc.push(entry.username);
                      }
                      return acc;
                  }, []);
                  // and return it
                  return Promise.resolve({ notAdded });
              })
                  .catch(() => ({ notAdded: [ownerUser.username] }));
              revert = (sharingResults) => updateUserMemberships({
                  id: requestOptions.groupId,
                  users: [ownerUser.username],
                  newMemberType: "member",
                  authentication: requestOptions.authentication
              })
                  .then(() => sharingResults)
                  .catch(() => sharingResults);
          }
          else {
              // they are already an admin in the group
              // return the same response the API would if we added them
              promise = Promise.resolve({ notAdded: [] });
              revert = (sharingResults) => Promise.resolve(sharingResults);
          }
      }
      else {
          // attempt to add user to group
          const userType = shouldPromote ? "admins" : "users";
          // can't currently determine if the group is within the admin's
          // org without performing a search, so attempt to add and handle
          // the api error
          promise = addGroupUsers({
              id: requestOptions.groupId,
              [userType]: [ownerUser.username],
              authentication: requestOptions.authentication
          })
              .then((results) => {
              // results.errors includes an ArcGISAuthError when the group
              // is in a different org, but notAdded is empty, throw here
              // to normalize the results in below catch
              if (results.errors && results.errors.length) {
                  throw results.errors[0];
              }
              return results;
          })
              .catch(() => ({ notAdded: [ownerUser.username] }));
          revert = (sharingResults) => {
              return removeGroupUsers({
                  id: requestOptions.groupId,
                  users: [ownerUser.username],
                  authentication: requestOptions.authentication
              }).then(() => {
                  // always resolves, suppress any resolved errors
                  return sharingResults;
              });
          };
      }
      return {
          promise: promise.then((membershipResponse) => {
              if (membershipResponse.notAdded.length) {
                  throw new Error(errorMessage);
              }
              return membershipResponse;
          }),
          revert
      };
  }

  /**
   * Stop sharing an item with a group, either as an
   * [item owner](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-item-owner-.htm),
   * [group admin](https://developers.arcgis.com/rest/users-groups-and-items/unshare-item-as-group-admin-.htm) or
   * organization admin.
   *
   * ```js
   * import { unshareItemWithGroup } from '@esri/arcgis-rest-portal';
   *
   * unshareItemWithGroup({
   *   id: "abc123",
   *   groupId: "xyz987",
   *   owner: "some-owner",
   *   authentication: session
   * })
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the data from the response.
   */
  function unshareItemWithGroup(requestOptions) {
      return isItemSharedWithGroup(requestOptions).then((isShared) => {
          // not shared
          if (!isShared) {
              // exit early with success response
              return Promise.resolve({
                  itemId: requestOptions.id,
                  shortcut: true,
                  notUnsharedFrom: []
              });
          }
          const { authentication: { username }, owner } = requestOptions;
          // next check if the user is a member of the group
          return Promise.all([
              getUserMembership(requestOptions),
              getUser({
                  username,
                  authentication: requestOptions.authentication
              })
          ])
              .then(([membership, currentUser]) => {
              const itemOwner = owner || username;
              const isItemOwner = itemOwner === username;
              const isAdmin = currentUser.role === "org_admin" && !currentUser.roleId;
              if (!isItemOwner &&
                  !isAdmin &&
                  ["admin", "owner"].indexOf(membership) < 0) {
                  // abort and reject promise
                  throw Error(`This item can not be unshared from group ${requestOptions.groupId} by ${username} as they not the item owner, an org admin, group admin or group owner.`);
              }
              // let the sharing call go
              return unshareFromGroup(requestOptions);
          })
              .then((sharingResponse) => {
              if (sharingResponse.notUnsharedFrom.length) {
                  throw Error(`Item ${requestOptions.id} could not be unshared to group ${requestOptions.groupId}`);
              }
              else {
                  // all is well
                  return sharingResponse;
              }
          });
      });
  }
  function unshareFromGroup(requestOptions) {
      const username = requestOptions.authentication.username;
      const itemOwner = requestOptions.owner || username;
      // decide what url to use
      // default to the non-owner url...
      let url = `${getPortalUrl(requestOptions)}/content/items/${requestOptions.id}/unshare`;
      // but if they are the owner, we use a different path...
      if (itemOwner === username) {
          url = `${getPortalUrl(requestOptions)}/content/users/${itemOwner}/items/${requestOptions.id}/unshare`;
      }
      // now its finally time to do the sharing
      requestOptions.params = {
          groups: requestOptions.groupId
      };
      return arcgisRestRequest.request(url, requestOptions);
  }

  /* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Determine if a specific service name is available in the current user's organization
   *
   * @export
   * @param {string} name
   * @param {ArcGISIdentityManager} session
   * @return {*}  {Promise<IServiceNameAvailable>}
   */
  function isServiceNameAvailable(name, type, session) {
      const url = `${session.portal}/portals/self/isServiceNameAvailable`;
      return arcgisRestRequest.request(url, {
          params: {
              name,
              type
          },
          httpMethod: "GET",
          authentication: session
      });
  }

  /* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Given a starting name, return a service name that is unique within
   * the current users organization
   *
   * @export
   * @param {string} name
   * @param {ArcGISIdentityManager} session
   * @param {number} step
   * @return {*}  {Promise<string>}
   */
  function getUniqueServiceName(name, type, session, step) {
      let nameToCheck = name;
      if (step) {
          nameToCheck = `${name}_${step}`;
      }
      return isServiceNameAvailable(nameToCheck, type, session).then((response) => {
          if (response.available) {
              return nameToCheck;
          }
          else {
              step = step + 1;
              return getUniqueServiceName(name, type, session, step);
          }
      });
  }

  /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Get the portal
   * @param requestOptions
   */
  function getSelf(requestOptions) {
      // just delegate to getPortal w/o an id
      return getPortal(null, requestOptions);
  }
  /**
   * Fetch information about the specified portal by id. If no id is passed, portals/self will be called.
   *
   * If you intend to request a portal by id and it is different from the portal specified by options.authentication, you must also pass options.portal.
   *
   *  ```js
   * import { getPortal } from "@esri/arcgis-rest-portal";
   * //
   * getPortal()
   * getPortal("fe8")
   * getPortal(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
   * ```
   *
   * @param id
   * @param requestOptions
   */
  function getPortal(id, requestOptions) {
      // construct the search url
      const idOrSelf = id ? id : "self";
      const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      // send the request
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Fetch the settings for the current portal by id. If no id is passed, portals/self/settings will be called
   *
   * ```js
   * import { getPortalSettings } from "@esri/arcgis-rest-portal";
   *
   * getPortalSettings()
   * getPortalSettings("fe8")
   * getPortalSettings(null, { portal: "https://custom.maps.arcgis.com/sharing/rest/" })
   * ```
   *
   * @param id
   * @param requestOptions
   */
  function getPortalSettings(id, requestOptions) {
      // construct the search url
      const idOrSelf = id ? id : "self";
      const url = `${getPortalUrl(requestOptions)}/portals/${idOrSelf}/settings`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      // send the request
      return arcgisRestRequest.request(url, options);
  }

  exports.SearchQueryBuilder = SearchQueryBuilder;
  exports.acceptInvitation = acceptInvitation;
  exports.addGroupUsers = addGroupUsers;
  exports.addItemData = addItemData;
  exports.addItemPart = addItemPart;
  exports.addItemRelationship = addItemRelationship;
  exports.addItemResource = addItemResource;
  exports.bboxToString = bboxToString;
  exports.cancelItemUpload = cancelItemUpload;
  exports.commitItemUpload = commitItemUpload;
  exports.createFolder = createFolder;
  exports.createGroup = createGroup;
  exports.createGroupNotification = createGroupNotification;
  exports.createItem = createItem;
  exports.createItemInFolder = createItemInFolder;
  exports.createOrgNotification = createOrgNotification;
  exports.declineInvitation = declineInvitation;
  exports.determineOwner = determineOwner;
  exports.ensureMembership = ensureMembership;
  exports.exportItem = exportItem;
  exports.getGroup = getGroup;
  exports.getGroupCategorySchema = getGroupCategorySchema;
  exports.getGroupContent = getGroupContent;
  exports.getGroupUsers = getGroupUsers;
  exports.getItem = getItem;
  exports.getItemBaseUrl = getItemBaseUrl;
  exports.getItemData = getItemData;
  exports.getItemGroups = getItemGroups;
  exports.getItemInfo = getItemInfo;
  exports.getItemMetadata = getItemMetadata;
  exports.getItemParts = getItemParts;
  exports.getItemResource = getItemResource;
  exports.getItemResources = getItemResources;
  exports.getItemStatus = getItemStatus;
  exports.getPortal = getPortal;
  exports.getPortalSettings = getPortalSettings;
  exports.getPortalUrl = getPortalUrl;
  exports.getRelatedItems = getRelatedItems;
  exports.getSelf = getSelf;
  exports.getSharingUrl = getSharingUrl;
  exports.getUniqueServiceName = getUniqueServiceName;
  exports.getUser = getUser;
  exports.getUserContent = getUserContent;
  exports.getUserInvitation = getUserInvitation;
  exports.getUserInvitations = getUserInvitations;
  exports.getUserMembership = getUserMembership;
  exports.getUserNotifications = getUserNotifications;
  exports.getUserTags = getUserTags;
  exports.getUserUrl = getUserUrl;
  exports.inviteGroupUsers = inviteGroupUsers;
  exports.isBBox = isBBox;
  exports.isItemOwner = isItemOwner;
  exports.isItemSharedWithGroup = isItemSharedWithGroup;
  exports.isOrgAdmin = isOrgAdmin;
  exports.isServiceNameAvailable = isServiceNameAvailable;
  exports.joinGroup = joinGroup;
  exports.leaveGroup = leaveGroup;
  exports.moveItem = moveItem;
  exports.protectGroup = protectGroup;
  exports.protectItem = protectItem;
  exports.reassignItem = reassignItem;
  exports.removeFolder = removeFolder;
  exports.removeGroup = removeGroup;
  exports.removeGroupUsers = removeGroupUsers;
  exports.removeItem = removeItem;
  exports.removeItemRelationship = removeItemRelationship;
  exports.removeItemResource = removeItemResource;
  exports.removeNotification = removeNotification;
  exports.scrubControlChars = scrubControlChars;
  exports.searchGroupContent = searchGroupContent;
  exports.searchGroupUsers = searchGroupUsers;
  exports.searchGroups = searchGroups;
  exports.searchItems = searchItems;
  exports.searchUsers = searchUsers;
  exports.setItemAccess = setItemAccess;
  exports.shareItemWithGroup = shareItemWithGroup;
  exports.unprotectGroup = unprotectGroup;
  exports.unprotectItem = unprotectItem;
  exports.unshareItemWithGroup = unshareItemWithGroup;
  exports.updateGroup = updateGroup;
  exports.updateItem = updateItem;
  exports.updateItemInfo = updateItemInfo;
  exports.updateItemResource = updateItemResource;
  exports.updateUser = updateUser;
  exports.updateUserMemberships = updateUserMemberships;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=portal.umd.js.map
