/* @preserve
* @esri/arcgis-rest-demographics - v4.0.2 - Apache-2.0
* Copyright (c) 2017-2022 Esri, Inc.
* Tue Dec 27 2022 09:24:40 GMT-0800 (Pacific Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request')) :
  typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-request'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest));
})(this, (function (exports, arcgisRestRequest) { 'use strict';

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  const ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver";
  const ARCGIS_ONLINE_GEOENRICHMENT_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/Geoenrichment`;
  const ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL = `${ARCGIS_ONLINE_GEOENRICHMENTSERVER_URL}/StandardGeographyQuery`;

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Return a list of information for all countries. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/countries.htm) for more information.
   *
   * ```js
   * import { getAvailableCountries } from '@esri/arcgis-rest-demographics';
   *
   * getAvailableCountries()
   *   .then((response) => {
   *     response; // => { countries: [ ... ]  }
   *   });
   * ```
   *
   * @param requestOptions Options to pass through to the geoenrichment service.
   * @returns A Promise that will resolve with available geography levels for the request.
   */
  function getAvailableCountries(requestOptions) {
      let options = {};
      let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/countries`;
      if (!requestOptions) {
          options.params = {};
      }
      else {
          if (requestOptions.endpoint) {
              endpoint = `${requestOptions.endpoint}/countries`;
          }
          options = arcgisRestRequest.appendCustomParams(requestOptions, [], { params: Object.assign({}, requestOptions.params) });
          if (requestOptions.countryCode) {
              endpoint = `${endpoint}/${requestOptions.countryCode}`;
          }
      }
      return arcgisRestRequest.request(arcgisRestRequest.cleanUrl(endpoint), options).then((response) => {
          return response;
      });
  }

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Used to determine the data collections available for usage with the Geoenrichment service. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/data-collections.htm) for more information.
   *
   * ```js
   * import { getAvailableDataCollections } from '@esri/arcgis-rest-demographics';
   *
   * getAvailableDataCollections()
   *   .then((response) => {
   *     response; // => { DataCollections: [ ... ]  }
   *   });
   *
   * getAvailableDataCollections({
   *   countryCode: "se",
   *   dataCollection: "EducationalAttainment"
   * })
   *   .then((response) => {
   *     response.; // => { DataCollections: [ ... ] }
   *   });
   * ```
   *
   * @param requestOptions Options to pass through to the geoenrichment service.
   * @returns A Promise that will resolve with data collections for the request.
   */
  function getAvailableDataCollections(requestOptions) {
      let options = {};
      let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/dataCollections`;
      if (!requestOptions) {
          options.params = {};
      }
      else {
          if (requestOptions.endpoint) {
              endpoint = `${requestOptions.endpoint}/dataCollections`;
          }
          options = arcgisRestRequest.appendCustomParams(requestOptions, ["addDerivativeVariables", "suppressNullValues"], { params: Object.assign({}, requestOptions.params) });
          if (options.params.addDerivativeVariables) {
              options.params.addDerivativeVariables = JSON.stringify(options.params.addDerivativeVariables);
          }
          if (requestOptions.countryCode) {
              endpoint = `${endpoint}/${requestOptions.countryCode}`;
              if (requestOptions.dataCollection) {
                  endpoint = `${endpoint}/${requestOptions.dataCollection}`;
              }
          }
      }
      // add spatialReference property to individual matches
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}`, options).then((response) => {
          return response;
      });
  }

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Returns a list of available geography data layers, which can then be used in [getGeography()](). See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-levels.htm) for more information.
   *
   * ```js
   * import { getAvailableGeographyLevels } from '@esri/arcgis-rest-demographics';
   * //
   * getAvailableGeographyLevels()
   *   .then((response) => {
   *     response; // => { geographyLevels: [ ... ]  }
   *   });
   * ```
   *
   * @param requestOptions Options to pass through to the geoenrichment service.
   * @returns A Promise that will resolve with available geography levels for the request.
   */
  function getAvailableGeographyLevels(requestOptions) {
      let options = {};
      let endpoint = `${ARCGIS_ONLINE_GEOENRICHMENT_URL}/StandardGeographyLevels`;
      if (!requestOptions) {
          options.params = {};
      }
      else {
          if (requestOptions.endpoint) {
              endpoint = `${requestOptions.endpoint}/StandardGeographyLevels`;
          }
          options = arcgisRestRequest.appendCustomParams(requestOptions, [], {
              params: Object.assign({}, requestOptions.params)
          });
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}`, options).then((response) => {
          return response;
      });
  }

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Used to get standard geography IDs and features for the supported geographic levels. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/standard-geography-query.htm) and the [best practices post](https://www.esri.com/arcgis-blog/products/arcgis-online/uncategorized/best-practices-how-to-query-standard-geographies-branches) for more information.
   *
   * ```js
   * import { getGeography } from '@esri/arcgis-rest-demographics';
   * //
   * getGeography({
   *   sourceCountry: "CA",
   *   geographyIDs: ["35"]
   * })
   *   .then((response) => {
   *     response.; // => { results: [ ... ] }
   *   });
   * ```
   *
   * @param requestOptions Options to pass through to the service. All properties are optional, but either `geographyIds` or `geographyQuery` must be sent at a minimum.
   * @returns A Promise that will resolve with return data defined and optionally geometry for the feature.
   */
  function getGeography(requestOptions) {
      const endpoint = `${requestOptions.endpoint || ARCGIS_ONLINE_STANDARD_GEOGRAPHY_QUERY_URL}/execute`;
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "sourceCountry",
          "optionalCountryDataset",
          "geographyLayers",
          "geographyIDs",
          "geographyQuery",
          "returnSubGeographyLayer",
          "subGeographyLayer",
          "subGeographyQuery",
          "outSR",
          "returnGeometry",
          "returnCentroids",
          "generalizationLevel",
          "useFuzzySearch",
          "featureLimit",
          "featureOffset",
          "langCode"
      ], { params: Object.assign({}, requestOptions.params) });
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication) {
          return Promise.reject("Geoenrichment using the ArcGIS service requires authentication");
      }
      // These parameters are passed as JSON-style strings:
      ["geographyLayers", "geographyIDs"].forEach((parameter) => {
          if (options.params[parameter]) {
              options.params[parameter] = JSON.stringify(options.params[parameter]);
          }
      });
      // add spatialReference property to individual matches
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}`, options).then((response) => {
          return response;
      });
  }

  /* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Used to get facts about a location or area. See the [REST Documentation](https://developers.arcgis.com/rest/geoenrichment/api-reference/enrich.htm) for more information.
   *
   * ```js
   * import { queryDemographicData } from '@esri/arcgis-rest-demographics';
   * //
   * queryDemographicData({
   *  studyAreas: [{"geometry":{"x":-117.1956,"y":34.0572}}],
   *  authentication
   * })
   *   .then((response) => {
   *     response; // => { results: [ ... ] }
   *   });
   * ```
   *
   * @param requestOptions Options to pass through to the service.
   * @returns A Promise that will resolve with results for the request.
   */
  function queryDemographicData(requestOptions) {
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "studyAreas",
          "dataCollections",
          "analysisVariables",
          "addDerivativeVariables",
          "returnGeometry",
          "inSR",
          "outSR"
      ], { params: Object.assign({}, requestOptions.params) });
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication) {
          return Promise.reject("Geoenrichment using the ArcGIS service requires authentication");
      }
      // These parameters are passed as JSON-style strings:
      ["dataCollections", "analysisVariables"].forEach((parameter) => {
          if (options.params[parameter]) {
              options.params[parameter] = JSON.stringify(options.params[parameter]);
          }
      });
      // add spatialReference property to individual matches
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(`${requestOptions.endpoint || ARCGIS_ONLINE_GEOENRICHMENT_URL}/enrich`)}`, options).then((response) => {
          return response;
      });
  }

  exports.getAvailableCountries = getAvailableCountries;
  exports.getAvailableDataCollections = getAvailableDataCollections;
  exports.getAvailableGeographyLevels = getAvailableGeographyLevels;
  exports.getGeography = getGeography;
  exports.queryDemographicData = queryDemographicData;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=demographics.umd.js.map
