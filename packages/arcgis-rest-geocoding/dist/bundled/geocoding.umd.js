/* @preserve
* @esri/arcgis-rest-geocoding - v4.0.2 - Apache-2.0
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
  // https always
  const ARCGIS_ONLINE_GEOCODING_URL = "https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
  const ARCGIS_ONLINE_BULK_GEOCODING_URL = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/";
  /**
   * Used to fetch metadata from a geocoding service.
   *
   * ```js
   * import { getGeocoderServiceInfo } from '@esri/arcgis-rest-geocoding';
   *
   * getGeocoderServiceInfo()
   *   .then((response) => {
   *     response.serviceDescription; // => 'World Geocoder'
   *   });
   * ```
   *
   * @param requestOptions - Request options can contain a custom geocoding service to fetch metadata from.
   * @returns A Promise that will resolve with the data from the response.
   */
  function getGeocodeService(requestOptions) {
      const url = (requestOptions && requestOptions.endpoint) || ARCGIS_ONLINE_GEOCODING_URL;
      const options = Object.assign({ httpMethod: "GET", maxUrlLength: 2000 }, requestOptions);
      return arcgisRestRequest.request(url, options);
  }

  /* @preserve
  * @terraformer/arcgis - v2.0.7 - MIT
  * Copyright (c) 2012-2021 Environmental Systems Research Institute, Inc.
  * Thu Jul 22 2021 13:58:30 GMT-0700 (Pacific Daylight Time)
  */
  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var edgeIntersectsEdge = function edgeIntersectsEdge(a1, a2, b1, b2) {
    var uaT = (b2[0] - b1[0]) * (a1[1] - b1[1]) - (b2[1] - b1[1]) * (a1[0] - b1[0]);
    var ubT = (a2[0] - a1[0]) * (a1[1] - b1[1]) - (a2[1] - a1[1]) * (a1[0] - b1[0]);
    var uB = (b2[1] - b1[1]) * (a2[0] - a1[0]) - (b2[0] - b1[0]) * (a2[1] - a1[1]);

    if (uB !== 0) {
      var ua = uaT / uB;
      var ub = ubT / uB;

      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        return true;
      }
    }

    return false;
  };
  var coordinatesContainPoint = function coordinatesContainPoint(coordinates, point) {
    var contains = false;

    for (var i = -1, l = coordinates.length, j = l - 1; ++i < l; j = i) {
      if ((coordinates[i][1] <= point[1] && point[1] < coordinates[j][1] || coordinates[j][1] <= point[1] && point[1] < coordinates[i][1]) && point[0] < (coordinates[j][0] - coordinates[i][0]) * (point[1] - coordinates[i][1]) / (coordinates[j][1] - coordinates[i][1]) + coordinates[i][0]) {
        contains = !contains;
      }
    }

    return contains;
  };
  var pointsEqual = function pointsEqual(a, b) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  };
  var arrayIntersectsArray = function arrayIntersectsArray(a, b) {
    for (var i = 0; i < a.length - 1; i++) {
      for (var j = 0; j < b.length - 1; j++) {
        if (edgeIntersectsEdge(a[i], a[i + 1], b[j], b[j + 1])) {
          return true;
        }
      }
    }

    return false;
  };

  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var closeRing = function closeRing(coordinates) {
    if (!pointsEqual(coordinates[0], coordinates[coordinates.length - 1])) {
      coordinates.push(coordinates[0]);
    }

    return coordinates;
  }; // determine if polygon ring coordinates are clockwise. clockwise signifies outer ring, counter-clockwise an inner ring
  // or hole. this logic was found at http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-
  // points-are-in-clockwise-order

  var ringIsClockwise = function ringIsClockwise(ringToTest) {
    var total = 0;
    var i = 0;
    var rLength = ringToTest.length;
    var pt1 = ringToTest[i];
    var pt2;

    for (i; i < rLength - 1; i++) {
      pt2 = ringToTest[i + 1];
      total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
      pt1 = pt2;
    }

    return total >= 0;
  }; // This function ensures that rings are oriented in the right directions
  // from http://jsperf.com/cloning-an-object/2

  var shallowClone = function shallowClone(obj) {
    var target = {};

    for (var i in obj) {
      // both arcgis attributes and geojson props are just hardcoded keys
      if (obj.hasOwnProperty(i)) {
        // eslint-disable-line no-prototype-builtins
        target[i] = obj[i];
      }
    }

    return target;
  };

  /* Copyright (c) 2012-2019 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */

  var coordinatesContainCoordinates = function coordinatesContainCoordinates(outer, inner) {
    var intersects = arrayIntersectsArray(outer, inner);
    var contains = coordinatesContainPoint(outer, inner[0]);

    if (!intersects && contains) {
      return true;
    }

    return false;
  }; // do any polygons in this array contain any other polygons in this array?
  // used for checking for holes in arcgis rings


  var convertRingsToGeoJSON = function convertRingsToGeoJSON(rings) {
    var outerRings = [];
    var holes = [];
    var x; // iterator

    var outerRing; // current outer ring being evaluated

    var hole; // current hole being evaluated
    // for each ring

    for (var r = 0; r < rings.length; r++) {
      var ring = closeRing(rings[r].slice(0));

      if (ring.length < 4) {
        continue;
      } // is this ring an outer ring? is it clockwise?


      if (ringIsClockwise(ring)) {
        var polygon = [ring.slice().reverse()]; // wind outer rings counterclockwise for RFC 7946 compliance

        outerRings.push(polygon); // push to outer rings
      } else {
        holes.push(ring.slice().reverse()); // wind inner rings clockwise for RFC 7946 compliance
      }
    }

    var uncontainedHoles = []; // while there are holes left...

    while (holes.length) {
      // pop a hole off out stack
      hole = holes.pop(); // loop over all outer rings and see if they contain our hole.

      var contained = false;

      for (x = outerRings.length - 1; x >= 0; x--) {
        outerRing = outerRings[x][0];

        if (coordinatesContainCoordinates(outerRing, hole)) {
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);
          contained = true;
          break;
        }
      } // ring is not contained in any outer ring
      // sometimes this happens https://github.com/Esri/esri-leaflet/issues/320


      if (!contained) {
        uncontainedHoles.push(hole);
      }
    } // if we couldn't match any holes using contains we can try intersects...


    while (uncontainedHoles.length) {
      // pop a hole off out stack
      hole = uncontainedHoles.pop(); // loop over all outer rings and see if any intersect our hole.

      var intersects = false;

      for (x = outerRings.length - 1; x >= 0; x--) {
        outerRing = outerRings[x][0];

        if (arrayIntersectsArray(outerRing, hole)) {
          // the hole is contained push it into our polygon
          outerRings[x].push(hole);
          intersects = true;
          break;
        }
      }

      if (!intersects) {
        outerRings.push([hole.reverse()]);
      }
    }

    if (outerRings.length === 1) {
      return {
        type: 'Polygon',
        coordinates: outerRings[0]
      };
    } else {
      return {
        type: 'MultiPolygon',
        coordinates: outerRings
      };
    }
  };

  var getId = function getId(attributes, idAttribute) {
    var keys = idAttribute ? [idAttribute, 'OBJECTID', 'FID'] : ['OBJECTID', 'FID'];

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key in attributes && (typeof attributes[key] === 'string' || typeof attributes[key] === 'number')) {
        return attributes[key];
      }
    }

    throw Error('No valid id attribute found');
  };

  var arcgisToGeoJSON = function arcgisToGeoJSON(arcgis, idAttribute) {
    var geojson = {};

    if (arcgis.features) {
      geojson.type = 'FeatureCollection';
      geojson.features = [];

      for (var i = 0; i < arcgis.features.length; i++) {
        geojson.features.push(arcgisToGeoJSON(arcgis.features[i], idAttribute));
      }
    }

    if (typeof arcgis.x === 'number' && typeof arcgis.y === 'number') {
      geojson.type = 'Point';
      geojson.coordinates = [arcgis.x, arcgis.y];

      if (typeof arcgis.z === 'number') {
        geojson.coordinates.push(arcgis.z);
      }
    }

    if (arcgis.points) {
      geojson.type = 'MultiPoint';
      geojson.coordinates = arcgis.points.slice(0);
    }

    if (arcgis.paths) {
      if (arcgis.paths.length === 1) {
        geojson.type = 'LineString';
        geojson.coordinates = arcgis.paths[0].slice(0);
      } else {
        geojson.type = 'MultiLineString';
        geojson.coordinates = arcgis.paths.slice(0);
      }
    }

    if (arcgis.rings) {
      geojson = convertRingsToGeoJSON(arcgis.rings.slice(0));
    }

    if (typeof arcgis.xmin === 'number' && typeof arcgis.ymin === 'number' && typeof arcgis.xmax === 'number' && typeof arcgis.ymax === 'number') {
      geojson.type = 'Polygon';
      geojson.coordinates = [[[arcgis.xmax, arcgis.ymax], [arcgis.xmin, arcgis.ymax], [arcgis.xmin, arcgis.ymin], [arcgis.xmax, arcgis.ymin], [arcgis.xmax, arcgis.ymax]]];
    }

    if (arcgis.geometry || arcgis.attributes) {
      geojson.type = 'Feature';
      geojson.geometry = arcgis.geometry ? arcgisToGeoJSON(arcgis.geometry) : null;
      geojson.properties = arcgis.attributes ? shallowClone(arcgis.attributes) : null;

      if (arcgis.attributes) {
        try {
          geojson.id = getId(arcgis.attributes, idAttribute);
        } catch (err) {// don't set an id
        }
      }
    } // if no valid geometry was encountered


    if (JSON.stringify(geojson.geometry) === JSON.stringify({})) {
      geojson.geometry = null;
    }

    if (arcgis.spatialReference && arcgis.spatialReference.wkid && arcgis.spatialReference.wkid !== 4326) {
      console.warn('Object converted in non-standard crs - ' + JSON.stringify(arcgis.spatialReference));
    }

    return geojson;
  };

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
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
  function geocode(address) {
      let options = {};
      let endpoint;
      if (typeof address === "string") {
          options.params = { singleLine: address };
          endpoint = ARCGIS_ONLINE_GEOCODING_URL;
      }
      else {
          endpoint = address.endpoint || ARCGIS_ONLINE_GEOCODING_URL;
          options = arcgisRestRequest.appendCustomParams(address, [
              "singleLine",
              "address",
              "address2",
              "address3",
              "neighborhood",
              "city",
              "subregion",
              "region",
              "postal",
              "postalExt",
              "countryCode",
              "outFields",
              "magicKey"
          ], { params: Object.assign({}, address.params) });
      }
      // add spatialReference property to individual matches
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}/findAddressCandidates`, options).then((response) => {
          if (typeof address !== "string" && address.rawResponse) {
              return response;
          }
          const sr = response.spatialReference;
          response.candidates.forEach(function (candidate) {
              candidate.location.spatialReference = sr;
              if (candidate.extent) {
                  candidate.extent.spatialReference = sr;
              }
          });
          // geoJson
          if (sr.wkid === 4326) {
              const features = response.candidates.map((candidate) => {
                  return {
                      type: "Feature",
                      geometry: arcgisToGeoJSON(candidate.location),
                      properties: Object.assign({
                          address: candidate.address,
                          score: candidate.score
                      }, candidate.attributes)
                  };
              });
              response.geoJson = {
                  type: "FeatureCollection",
                  features
              };
          }
          return response;
      });
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
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
  function suggest(partialText, requestOptions) {
      const options = Object.assign({ endpoint: ARCGIS_ONLINE_GEOCODING_URL, params: {} }, requestOptions);
      options.params.text = partialText;
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.endpoint)}/suggest`, options);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function isLocationArray(coords) {
      return (coords.length === 2 ||
          coords.length === 3);
  }
  function isLocation(coords) {
      return (coords.latitude !== undefined ||
          coords.lat !== undefined);
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
  function reverseGeocode(coords, requestOptions) {
      const options = Object.assign({ endpoint: ARCGIS_ONLINE_GEOCODING_URL, params: {} }, requestOptions);
      if (isLocationArray(coords)) {
          options.params.location = coords.join();
      }
      else if (isLocation(coords)) {
          if (coords.lat) {
              options.params.location = coords.long + "," + coords.lat;
          }
          if (coords.latitude) {
              options.params.location = coords.longitude + "," + coords.latitude;
          }
      }
      else {
          // if input is a point, we can pass it straight through, with or without a spatial reference
          options.params.location = coords;
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.endpoint)}/reverseGeocode`, options);
  }

  /* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Used to geocode a [batch](https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm) of addresses.
   *
   * ```js
   * import { bulkGeocode } from '@esri/arcgis-rest-geocoding';
   * import { ApplicationCredentialsManager } from '@esri/arcgis-rest-request';
   *
   * const addresses = [
   *   { "OBJECTID": 1, "SingleLine": "380 New York Street 92373" },
   *   { "OBJECTID": 2, "SingleLine": "1 World Way Los Angeles 90045" }
   * ];
   *
   * bulkGeocode({ addresses, authentication: session })
   *   .then((response) => {
   *     response.locations[0].location; // => { x: -117, y: 34, spatialReference: { wkid: 4326 } }
   *   });
   * ```
   *
   * @param requestOptions - Request options to pass to the geocoder, including an array of addresses and authentication session.
   * @returns A Promise that will resolve with the data from the response. The spatial reference will be added to address locations unless `rawResponse: true` was passed.
   */
  function bulkGeocode(requestOptions // must POST, which is the default
  ) {
      const options = Object.assign({ endpoint: ARCGIS_ONLINE_BULK_GEOCODING_URL, params: {} }, requestOptions);
      options.params.addresses = {
          records: requestOptions.addresses.map((address) => {
              return { attributes: address };
          })
      };
      // the SAS service does not support anonymous requests
      if (!requestOptions.authentication &&
          options.endpoint === ARCGIS_ONLINE_BULK_GEOCODING_URL) {
          return Promise.reject("bulk geocoding using the ArcGIS service requires authentication");
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.endpoint)}/geocodeAddresses`, options).then((response) => {
          if (options.rawResponse) {
              return response;
          }
          const sr = response.spatialReference;
          response.locations.forEach(function (address) {
              if (address.location) {
                  address.location.spatialReference = sr;
              }
          });
          return response;
      });
  }

  exports.ARCGIS_ONLINE_BULK_GEOCODING_URL = ARCGIS_ONLINE_BULK_GEOCODING_URL;
  exports.ARCGIS_ONLINE_GEOCODING_URL = ARCGIS_ONLINE_GEOCODING_URL;
  exports.bulkGeocode = bulkGeocode;
  exports.geocode = geocode;
  exports.getGeocodeService = getGeocodeService;
  exports.reverseGeocode = reverseGeocode;
  exports.suggest = suggest;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=geocoding.umd.js.map
