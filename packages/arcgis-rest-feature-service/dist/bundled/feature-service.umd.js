/* @preserve
* @esri/arcgis-rest-feature-service - v4.0.4 - Apache-2.0
* Copyright (c) 2017-2022 Esri, Inc.
* Tue Dec 27 2022 09:24:48 GMT-0800 (Pacific Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request'), require('@esri/arcgis-rest-portal')) :
  typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-request', '@esri/arcgis-rest-portal'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest, global.arcgisRest));
})(this, (function (exports, arcgisRestRequest, arcgisRestPortal) { 'use strict';

  /* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Add features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-features.htm) for more information.
   *
   * ```js
   * import { addFeatures } from '@esri/arcgis-rest-feature-service';
   * //
   * addFeatures({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   features: [{
   *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
   *     attributes: { status: "alive" }
   *   }]
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the addFeatures response.
   */
  function addFeatures(requestOptions) {
      const url = `${arcgisRestRequest.cleanUrl(requestOptions.url)}/addFeatures`;
      // edit operations are POST only
      const options = arcgisRestRequest.appendCustomParams(requestOptions, ["features", "gdbVersion", "returnEditMoment", "rollbackOnFailure"], { params: Object.assign({}, requestOptions.params) });
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Attach a file to a feature by id. See [Add Attachment](https://developers.arcgis.com/rest/services-reference/add-attachment.htm) for more information.
   *
   * ```js
   * import { addAttachment } from '@esri/arcgis-rest-feature-service';
   * //
   * addAttachment({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   featureId: 8484,
   *   attachment: myFileInput.files[0]
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the `addAttachment()` response.
   */
  function addAttachment(requestOptions) {
      const options = Object.assign({ params: {} }, requestOptions);
      // `attachment` --> params: {}
      options.params.attachment = requestOptions.attachment;
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.url)}/${options.featureId}/addAttachment`, options);
  }

  /* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Add layer(s) and/or table(s) to a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/add-to-definition-feature-service-.htm) for more information.
   *
   *  ```js
   * import { addToServiceDefinition } from '@esri/arcgis-rest-service-admin';
   * //
   * addToServiceDefinition(serviceurl, {
   *   authentication: ArcGISIdentityManager,
   *   layers: [],
   *   tables: []
   * });
   * ```
   *
   * @param url - URL of feature service
   * @param requestOptions - Options for the request
   * @returns A Promise that resolves with service layer and/or table details once the definition
   * has been updated
   */
  function addToServiceDefinition(url, requestOptions) {
      const adminUrl = `${arcgisRestRequest.cleanUrl(url).replace(`/rest/services`, `/rest/admin/services`)}/addToDefinition`;
      requestOptions.params = Object.assign({ addToDefinition: {} }, requestOptions.params);
      if (requestOptions.layers && requestOptions.layers.length > 0) {
          requestOptions.params.addToDefinition.layers = requestOptions.layers;
      }
      if (requestOptions.tables && requestOptions.tables.length > 0) {
          requestOptions.params.addToDefinition.tables = requestOptions.tables;
      }
      return arcgisRestRequest.request(adminUrl, requestOptions);
  }

  /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Apply edits request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/apply-edits-feature-service-layer-.htm) for more information.
   *
   * ```js
   * import { applyEdits } from '@esri/arcgis-rest-feature-service';
   * //
   * applyEdits({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   adds: [{
   *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
   *     attributes: { status: "alive" }
   *   }],
   *   updates: [{
   *     attributes: { OBJECTID: 1004, status: "alive" }
   *   }],
   *   deletes: [862, 1548]
   * })
   *   .then(response)
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the applyEdits response.
   */
  function applyEdits(requestOptions) {
      const url = `${arcgisRestRequest.cleanUrl(requestOptions.url)}/applyEdits`;
      // edit operations are POST only
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "adds",
          "updates",
          "deletes",
          "useGlobalIds",
          "attachments",
          "gdbVersion",
          "returnEditMoment",
          "rollbackOnFailure",
          "trueCurveClient"
      ], { params: Object.assign({}, requestOptions.params) });
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Create a new [hosted feature service](https://developers.arcgis.com/rest/users-groups-and-items/create-service.htm). After the service has been created, call [`addToServiceDefinition()`](../addToServiceDefinition/) if you'd like to update it's schema.
   *
   * ```js
   * import {
   *   createFeatureService,
   *   addToServiceDefinition
   * } from '@esri/arcgis-rest-service-admin';
   * //
   * createFeatureService({
   *   authentication: ArcGISIdentityManager,
   *   item: {
   *     "name": "NewEmptyService",
   *     "capabilities": "Create,Delete,Query,Update,Editing"
   *   }
   * });
   * ```
   *
   * @param requestOptions - Options for the request. NOTE: `rawResponse` is not supported by this operation.
   * @returns A Promise that resolves with service details once the service has been created
   */
  function createFeatureService(requestOptions) {
      return arcgisRestPortal.determineOwner(requestOptions).then((owner) => {
          const options = Object.assign(Object.assign({}, requestOptions), { rawResponse: false });
          const baseUrl = `${arcgisRestPortal.getPortalUrl(requestOptions)}/content/users/${owner}`;
          const folder = !options.folderId || options.folderId === "/"
              ? ""
              : "/" + options.folderId;
          const url = `${baseUrl}${folder}/createService`;
          // Create the service
          options.params = Object.assign({ createParameters: options.item, outputType: "featureService" }, options.params);
          return arcgisRestRequest.request(url, options);
      });
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Layer (Feature Service) request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/layer-feature-service-.htm) for more information.
   *
   * ```js
   * import { getLayer } from '@esri/arcgis-rest-feature-service';
   * //
   * getLayer({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
   * })
   *   .then(response) // { name: "311", id: 0, ... }
   * ```
   *
   * @param options - Options for the request.
   * @returns A Promise that will resolve with the addFeatures response.
   */
  function getLayer(options) {
      return arcgisRestRequest.request(arcgisRestRequest.cleanUrl(options.url), options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
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
  function decodeValues(requestOptions) {
      let prms;
      if (requestOptions.fields) {
          prms = Promise.resolve(requestOptions.fields);
      }
      else {
          prms = getLayer({ url: requestOptions.url }).then((metadata) => {
              return metadata.fields;
          });
      }
      return prms.then((fields) => {
          // extract coded value domains
          const domains = extractCodedValueDomains(fields);
          if (Object.keys(domains).length < 1) {
              // no values to decode
              return requestOptions.queryResponse;
          }
          // don't mutate original features
          const decodedFeatures = requestOptions.queryResponse.features.map((feature) => {
              const decodedAttributes = {};
              for (const key in feature.attributes) {
                  /* istanbul ignore next */
                  if (!Object.prototype.hasOwnProperty.call(feature.attributes, key))
                      continue;
                  const value = feature.attributes[key];
                  const domain = domains[key];
                  decodedAttributes[key] =
                      value !== null && domain ? decodeValue(value, domain) : value;
              }
              // merge decoded attributes into the feature
              return Object.assign(Object.assign({}, feature), { attributes: decodedAttributes });
          });
          // merge decoded features into the response
          return Object.assign(Object.assign({}, requestOptions.queryResponse), { features: decodedFeatures });
      });
  }
  function extractCodedValueDomains(fields) {
      return fields.reduce((domains, field) => {
          const domain = field.domain;
          if (domain && domain.type === "codedValue") {
              domains[field.name] = domain;
          }
          return domains;
      }, {});
  }
  // TODO: add type for domain?
  function decodeValue(value, domain) {
      const codedValue = domain.codedValues.find((d) => {
          return value === d.code;
      });
      return codedValue ? codedValue.name : value;
  }

  /* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Delete features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/delete-features.htm) for more information.
   *
   * ```js
   * import { deleteFeatures } from '@esri/arcgis-rest-feature-service';
   * //
   * deleteFeatures({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   objectIds: [1,2,3]
   * });
   * ```
   *
   * @param deleteFeaturesRequestOptions - Options for the request.
   * @returns A Promise that will resolve with the deleteFeatures response.
   */
  function deleteFeatures(requestOptions) {
      const url = `${arcgisRestRequest.cleanUrl(requestOptions.url)}/deleteFeatures`;
      // edit operations POST only
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "where",
          "objectIds",
          "gdbVersion",
          "returnEditMoment",
          "rollbackOnFailure"
      ], { params: Object.assign({}, requestOptions.params) });
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Delete existing attachment files of a feature by id. See [Delete Attachments](https://developers.arcgis.com/rest/services-reference/delete-attachments.htm) for more information.
   *
   * ```js
   * import { deleteAttachments } from '@esri/arcgis-rest-feature-service';
   * //
   * deleteAttachments({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   featureId: 8484,
   *   attachmentIds: [306]
   * });
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the `deleteAttachments()` response.
   */
  function deleteAttachments(requestOptions) {
      const options = Object.assign({ params: {} }, requestOptions);
      // `attachmentIds` --> params: {}
      options.params.attachmentIds = requestOptions.attachmentIds;
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.url)}/${options.featureId}/deleteAttachments`, options);
  }

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  function __rest(s, e) {
      var t = {};
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === "function")
          for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
              if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                  t[p[i]] = s[p[i]];
          }
      return t;
  }

  /* Copyright (c) 2017-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  const serviceRegex = new RegExp(/.+(?:map|feature|image)server/i);
  /**
   * Return the service url. If not matched, returns what was passed in
   */
  function parseServiceUrl(url) {
      const match = url.match(serviceRegex);
      if (match) {
          return match[0];
      }
      else {
          return stripQueryString(url);
      }
  }
  function stripQueryString(url) {
      const stripped = url.split("?")[0];
      return arcgisRestRequest.cleanUrl(stripped);
  }

  /**
   *  * Fetches all the layers and tables associated with a given layer service.
   * Wrapper for https://developers.arcgis.com/rest/services-reference/all-layers-and-tables.htm
   *
   * ```js
   * import { getAllLayersAndTables } from '@esri/arcgis-rest-feature-service';
   * getAllLayersAndTables({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0"
   * })
   *   .then(response) // { layers: [...], tables: [...] }
   * ```
   *
   * @param options - Request options, including the url for the layer service
   * @returns A Promise that will resolve with the layers and tables for the given service
   */
  // TODO: should we expand this to support other valid params of the endpoint?
  function getAllLayersAndTables(options) {
      const { url } = options, requestOptions = __rest(options, ["url"]);
      const layersUrl = `${parseServiceUrl(url)}/layers`;
      return arcgisRestRequest.request(layersUrl, requestOptions);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Request `attachmentInfos` of a feature by id. See [Attachment Infos](https://developers.arcgis.com/rest/services-reference/attachment-infos-feature-service-.htm) for more information.
   *
   * ```js
   * import { getAttachments } from '@esri/arcgis-rest-feature-service';
   * //
   * getAttachments({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   featureId: 8484
   * });
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the `getAttachments()` response.
   */
  function getAttachments(requestOptions) {
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      // pass through
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.url)}/${options.featureId}/attachments`, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Feature Service request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/feature-service.htm) for more information.
   *
   * ```js
   * import { getService } from '@esri/arcgis-rest-feature-service';
   * //
   * getService({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer"
   * })
   *   .then(response) // { name: "311", id: 0, ... }
   * ```
   *
   * @param options - Options for the request.
   * @returns A Promise that will resolve with the getService response.
   */
  function getService(options) {
      return arcgisRestRequest.request(arcgisRestRequest.cleanUrl(options.url), options);
  }

  /* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Given a Feature Service url, fetch the service admin information.
   *
   * The response from this call includes all the detailed information
   * for each layer/table in the service as well as some admin properties
   *
   * @export
   * @param {string} serviceUrl
   * @param {ArcGISIdentityManager} session
   * @return {*}  {Promise<IServiceInfo>}
   */
  function getServiceAdminInfo(serviceUrl, session) {
      const serviceAdminUrl = serviceUrl.replace("/rest/services", "/rest/admin/services");
      return arcgisRestRequest.request(serviceAdminUrl, {
          authentication: session,
          params: {
              f: "json"
          }
      });
  }

  /* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Return the sources response for a view service item
   *
   * @param {string} viewServiceUrl
   * @param {ArcGISIdentityManager} session
   * @return {*}  {Promise<Record<string, unknown>>}
   */
  function getViewSources(viewServiceUrl, session) {
      return arcgisRestRequest.request(`${viewServiceUrl}/sources`, { authentication: session });
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Get a feature by id.
   *
   * ```js
   * import { getFeature } from '@esri/arcgis-rest-feature-service';
   *
   * const url = "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0";
   *
   * getFeature({
   *   url,
   *   id: 42
   * }).then(feature => {
   *  console.log(feature.attributes.FID); // 42
   * });
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the feature or the [response](https://developer.mozilla.org/en-US/docs/Web/API/Response) itself if `rawResponse: true` was passed in.
   */
  function getFeature(requestOptions) {
      const url = `${arcgisRestRequest.cleanUrl(requestOptions.url)}/${requestOptions.id}`;
      // default to a GET request
      const options = Object.assign({ httpMethod: "GET" }, requestOptions);
      return arcgisRestRequest.request(url, options).then((response) => {
          if (options.rawResponse) {
              return response;
          }
          return response.feature;
      });
  }
  /**
   * Query a feature service. See [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm) for more information.
   *
   * ```js
   * import { queryFeatures } from '@esri/arcgis-rest-feature-service';
   *
   * queryFeatures({
   *   url: "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Census/MapServer/3",
   *   where: "STATE_NAME = 'Alaska'"
   * })
   *   .then(result)
   * ```
   *
   * @param requestOptions - Options for the request
   * @returns A Promise that will resolve with the query response.
   */
  function queryFeatures(requestOptions) {
      const queryOptions = arcgisRestRequest.appendCustomParams(requestOptions, [
          "where",
          "objectIds",
          "relationParam",
          "time",
          "distance",
          "units",
          "outFields",
          "geometry",
          "geometryType",
          "spatialRel",
          "returnGeometry",
          "maxAllowableOffset",
          "geometryPrecision",
          "inSR",
          "outSR",
          "gdbVersion",
          "returnDistinctValues",
          "returnIdsOnly",
          "returnCountOnly",
          "returnExtentOnly",
          "orderByFields",
          "groupByFieldsForStatistics",
          "outStatistics",
          "returnZ",
          "returnM",
          "multipatchOption",
          "resultOffset",
          "resultRecordCount",
          "quantizationParameters",
          "returnCentroid",
          "resultType",
          "historicMoment",
          "returnTrueCurves",
          "sqlFormat",
          "returnExceededLimitFeatures",
          "f"
      ], {
          httpMethod: "GET",
          params: Object.assign({ 
              // set default query parameters
              where: "1=1", outFields: "*" }, requestOptions.params)
      });
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(requestOptions.url)}/query`, queryOptions);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Query the related records for a feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/query-related-records-feature-service-.htm) for more information.
   *
   * ```js
   * import { queryRelated } from '@esri/arcgis-rest-feature-service'
   *
   * queryRelated({
   *  url: "http://services.myserver/OrgID/ArcGIS/rest/services/Petroleum/KSPetro/FeatureServer/0",
   *  relationshipId: 1,
   *  params: { returnCountOnly: true }
   * })
   *  .then(response) // response.relatedRecords
   * ```
   *
   * @param requestOptions
   * @returns A Promise that will resolve with the query response
   */
  function queryRelated(requestOptions) {
      const options = arcgisRestRequest.appendCustomParams(requestOptions, ["objectIds", "relationshipId", "definitionExpression", "outFields"], {
          httpMethod: "GET",
          params: Object.assign({ 
              // set default query parameters
              definitionExpression: "1=1", outFields: "*", relationshipId: 0 }, requestOptions.params)
      });
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(requestOptions.url)}/queryRelatedRecords`, options);
  }

  /* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update features request. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/update-features.htm) for more information.
   *
   * ```js
   * import { updateFeatures } from '@esri/arcgis-rest-feature-service';
   * //
   * updateFeatures({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   features: [{
   *     geometry: { x: -120, y: 45, spatialReference: { wkid: 4326 } },
   *     attributes: { status: "alive" }
   *   }]
   * });
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the updateFeatures response.
   */
  function updateFeatures(requestOptions) {
      const url = `${arcgisRestRequest.cleanUrl(requestOptions.url)}/updateFeatures`;
      // edit operations are POST only
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "features",
          "gdbVersion",
          "returnEditMoment",
          "rollbackOnFailure",
          "trueCurveClient"
      ], { params: Object.assign({}, requestOptions.params) });
      return arcgisRestRequest.request(url, options);
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update a related attachment to a feature by id. See [Update Attachment](https://developers.arcgis.com/rest/services-reference/update-attachment.htm) for more information.
   *
   * ```js
   * import { updateAttachment } from '@esri/arcgis-rest-feature-service';
   * //
   * updateAttachment({
   *   url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
   *   featureId: 8484,
   *   attachment: myFileInput.files[0],
   *   attachmentId: 306
   * });
   * ```
   *
   * @param requestOptions - Options for the request.
   * @returns A Promise that will resolve with the `updateAttachment()` response.
   */
  function updateAttachment(requestOptions) {
      const options = Object.assign({ params: {} }, requestOptions);
      // `attachment` and `attachmentId` --> params: {}
      options.params.attachment = requestOptions.attachment;
      options.params.attachmentId = requestOptions.attachmentId;
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.url)}/${options.featureId}/updateAttachment`, options);
  }

  /* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Update a definition property in a hosted feature service. See the [REST Documentation](https://developers.arcgis.com/rest/services-reference/online/update-definition-feature-service-.htm) for more information.
   *
   * ```js
   * import { updateServiceDefinition } from '@esri/arcgis-rest-service-admin';
   * //
   * updateServiceDefinition(serviceurl, {
   *   authentication: ArcGISIdentityManager,
   *   updateDefinition: serviceDefinition
   * });
   * ```
   *
   * @param url - URL of feature service
   * @param requestOptions - Options for the request
   * @returns A Promise that resolves with success or error
   */
  function updateServiceDefinition(url, requestOptions) {
      const adminUrl = `${arcgisRestRequest.cleanUrl(url).replace(`/rest/services`, `/rest/admin/services`)}/updateDefinition`;
      requestOptions.params = Object.assign({ updateDefinition: {} }, requestOptions.params);
      if (requestOptions.updateDefinition) {
          requestOptions.params.updateDefinition = requestOptions.updateDefinition;
      }
      return arcgisRestRequest.request(adminUrl, requestOptions);
  }

  exports.addAttachment = addAttachment;
  exports.addFeatures = addFeatures;
  exports.addToServiceDefinition = addToServiceDefinition;
  exports.applyEdits = applyEdits;
  exports.createFeatureService = createFeatureService;
  exports.decodeValues = decodeValues;
  exports.deleteAttachments = deleteAttachments;
  exports.deleteFeatures = deleteFeatures;
  exports.getAllLayersAndTables = getAllLayersAndTables;
  exports.getAttachments = getAttachments;
  exports.getFeature = getFeature;
  exports.getLayer = getLayer;
  exports.getService = getService;
  exports.getServiceAdminInfo = getServiceAdminInfo;
  exports.getViewSources = getViewSources;
  exports.parseServiceUrl = parseServiceUrl;
  exports.queryFeatures = queryFeatures;
  exports.queryRelated = queryRelated;
  exports.updateAttachment = updateAttachment;
  exports.updateFeatures = updateFeatures;
  exports.updateServiceDefinition = updateServiceDefinition;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=feature-service.umd.js.map
