/* @preserve
* @esri/arcgis-rest-routing - v4.0.3 - Apache-2.0
* Copyright (c) 2017-2022 Esri, Inc.
* Tue Dec 27 2022 09:24:40 GMT-0800 (Pacific Standard Time)
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@esri/arcgis-rest-request')) :
  typeof define === 'function' && define.amd ? define(['exports', '@esri/arcgis-rest-request'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arcgisRest = global.arcgisRest || {}, global.arcgisRest));
})(this, (function (exports, arcgisRestRequest) { 'use strict';

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  // https always
  const ARCGIS_ONLINE_ROUTING_URL = "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
  const ARCGIS_ONLINE_CLOSEST_FACILITY_URL = "https://route.arcgis.com/arcgis/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World";
  const ARCGIS_ONLINE_SERVICE_AREA_URL = "https://route.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World";
  const ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL = "https://route.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World";
  function isLocationArray$1(coords) {
      return (coords.length === 2 ||
          coords.length === 3);
  }
  function isLocation$1(coords) {
      return (coords.latitude !== undefined ||
          coords.lat !== undefined);
  }
  function normalizeLocationsList(locations) {
      return locations.map((coords) => {
          if (isLocationArray$1(coords)) {
              return coords.join();
          }
          else if (isLocation$1(coords)) {
              if (coords.lat) {
                  return coords.long + "," + coords.lat;
              }
              else {
                  return coords.longitude + "," + coords.latitude;
              }
          }
          else {
              return coords.x + "," + coords.y;
          }
      });
  }
  function decompressGeometry(str) {
      let xDiffPrev = 0;
      let yDiffPrev = 0;
      const points = [];
      let x;
      let y;
      // Split the string into an array on the + and - characters
      const strings = str.match(/((\+|-)[^+-]+)/g);
      // The first value is the coefficient in base 32
      const coefficient = parseInt(strings[0], 32);
      for (let j = 1; j < strings.length; j += 2) {
          // j is the offset for the x value
          // Convert the value from base 32 and add the previous x value
          x = parseInt(strings[j], 32) + xDiffPrev;
          xDiffPrev = x;
          // j+1 is the offset for the y value
          // Convert the value from base 32 and add the previous y value
          y = parseInt(strings[j + 1], 32) + yDiffPrev;
          yDiffPrev = y;
          points.push([x / coefficient, y / coefficient]);
      }
      return {
          paths: [points]
      };
  }
  /**
   * User Defined Type Guard that verifies this is a featureSet
   */
  function isFeatureSet(arg) {
      return Object.prototype.hasOwnProperty.call(arg, "features");
  }
  /**
   * User Defined Type Guard that verifies this is a JSON with `url` property
   */
  function isJsonWithURL(arg) {
      return "url" in arg;
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

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
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
   * Used to find the best way to get from one location to another or to visit several locations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm) for more information.
   *
   * ```js
   * import { solveRoute } from '@esri/arcgis-rest-routing';
   *
   * solveRoute({
   *   stops: [
   *     [-117.195677, 34.056383],
   *     [-117.918976, 33.812092],
   *    ],
   *    authentication
   * })
   *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
   * ```
   *
   * @param requestOptions Options to pass through to the routing service.
   * @returns A Promise that will resolve with routes and directions for the request.
   * @restlink https://developers.arcgis.com/rest/network/api-reference/route-synchronous-service.htm
   */
  function solveRoute(requestOptions) {
      const options = Object.assign({ endpoint: requestOptions.endpoint || ARCGIS_ONLINE_ROUTING_URL, params: {} }, requestOptions);
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication &&
          options.endpoint === ARCGIS_ONLINE_ROUTING_URL) {
          return Promise.reject("Routing using the ArcGIS service requires authentication");
      }
      if (isFeatureSet(requestOptions.stops)) {
          options.params.stops = requestOptions.stops;
      }
      else {
          const stops = requestOptions.stops.map((coords) => {
              if (isLocationArray(coords)) {
                  return coords.join();
              }
              else if (isLocation(coords)) {
                  if (coords.lat) {
                      return (coords.long + "," + coords.lat + (coords.z ? "," + coords.z : ""));
                  }
                  else {
                      return (coords.longitude +
                          "," +
                          coords.latitude +
                          (coords.z ? "," + coords.z : ""));
                  }
              }
              else {
                  return coords.x + "," + coords.y + (coords.z ? "," + coords.z : "");
              }
          });
          options.params.stops = stops.join(";");
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(options.endpoint)}/solve`, options).then(cleanResponse$3);
  }
  function cleanResponse$3(res) {
      if (res.directions && res.directions.length > 0) {
          res.directions = res.directions.map((direction) => {
              direction.features = direction.features.map((feature) => {
                  feature.geometry = decompressGeometry(feature.compressedGeometry);
                  return feature;
              });
              return direction;
          });
      }
      // add "geoJson" property to "routes"
      if (res.routes.spatialReference.wkid === 4326) {
          const features = res.routes.features.map((feature) => {
              return {
                  type: "Feature",
                  geometry: arcgisToGeoJSON(feature.geometry),
                  properties: Object.assign({}, feature.attributes)
              };
          });
          res.routes.geoJson = {
              type: "FeatureCollection",
              features
          };
      }
      return res;
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function getTravelDirection$1(key) {
      if (key === "incidentsToFacilities") {
          return "esriNATravelDirectionFromFacility";
      }
      else {
          return "esriNATravelDirectionToFacility";
      }
  }
  /**
   * Used to find a route to the nearest of several possible destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm) for more information.
   *
   * ```js
   * import { closestFacility } from '@esri/arcgis-rest-routing';
   *
   * closestFacility({
   *   incidents: [
   *     [-90.404302, 38.600621],
   *     [-90.364293, 38.620427],
   *    ],
   *   facilities: [
   *     [-90.444716, 38.635501],
   *     [-90.311919, 38.633523],
   *     [-90.451147, 38.581107]
   *    ],
   *    authentication
   * })
   *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
   * ```
   *
   * @param requestOptions Options to pass through to the routing service.
   * @returns A Promise that will resolve with routes and directions for the request.
   * @restlink https://developers.arcgis.com/rest/network/api-reference/closest-facility-synchronous-service.htm
   * @inline IClosestFacilityOptions
   */
  function closestFacility(requestOptions) {
      const endpoint = requestOptions.endpoint || ARCGIS_ONLINE_CLOSEST_FACILITY_URL;
      requestOptions.params = Object.assign({ returnFacilities: true, returnDirections: true, returnIncidents: true, returnBarriers: true, returnPolylineBarriers: true, returnPolygonBarriers: true, preserveObjectID: true }, requestOptions.params);
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "returnCFRoutes",
          // "travelDirection",
          "barriers",
          "polylineBarriers",
          "polygonBarriers",
          "returnDirections",
          "directionsOutputType",
          "directionsLengthUnits",
          "outputLines",
          "returnFacilities",
          "returnIncidents",
          "returnBarriers",
          "returnPolylineBarriers",
          "returnPolygonBarriers",
          "preserveObjectID"
      ]);
      // Set travelDirection
      if (requestOptions.travelDirection) {
          options.params.travelDirection = getTravelDirection$1(requestOptions.travelDirection);
      }
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication &&
          endpoint === ARCGIS_ONLINE_CLOSEST_FACILITY_URL) {
          return Promise.reject("Finding the closest facility using the ArcGIS service requires authentication");
      }
      if (isFeatureSet(requestOptions.incidents) ||
          isJsonWithURL(requestOptions.incidents)) {
          options.params.incidents = requestOptions.incidents;
      }
      else {
          options.params.incidents = normalizeLocationsList(requestOptions.incidents).join(";");
      }
      if (isFeatureSet(requestOptions.facilities) ||
          isJsonWithURL(requestOptions.facilities)) {
          options.params.facilities = requestOptions.facilities;
      }
      else {
          options.params.facilities = normalizeLocationsList(requestOptions.facilities).join(";");
      }
      // optional input param that may need point geometry normalizing
      if (requestOptions.barriers) {
          if (isFeatureSet(requestOptions.barriers)) {
              options.params.barriers = requestOptions.barriers;
          }
          else {
              // optional point geometry barriers must be normalized, too
              // but not if provided as IFeatureSet type
              // note that optional polylineBarriers and polygonBarriers do not need to be normalized
              options.params.barriers = normalizeLocationsList(requestOptions.barriers).join(";");
          }
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}/solveClosestFacility`, options).then(cleanResponse$2);
  }
  function cleanResponse$2(res) {
      // add "geoJson" property to "routes"
      if (res.routes.spatialReference.wkid === 4326) {
          res.routes.geoJson = arcgisToGeoJSON(res.routes);
      }
      return res;
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  function getTravelDirection(key) {
      if (key === "incidentsToFacilities") {
          return "esriNATravelDirectionFromFacility";
      }
      else {
          return "esriNATravelDirectionToFacility";
      }
  }
  /**
   * Used to find the area that can be reached from the input location within a given travel time or travel distance. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm) for more information.
   *
   * ```js
   * import { serviceArea } from '@esri/arcgis-rest-routing';
   *
   * serviceArea({
   *   facilities: [
   *     [-90.444716, 38.635501],
   *     [-90.311919, 38.633523],
   *     [-90.451147, 38.581107]
   *    ],
   *    authentication
   * })
   *   .then(response) // => {routes: {features: [{attributes: { ... }, geometry:{ ... }}]}
   * ```
   *
   * @param requestOptions Options to pass through to the routing service.
   * @returns A Promise that will resolve with service area polygons for the request.
   * @restlink https://developers.arcgis.com/rest/network/api-reference/service-area-synchronous-service.htm
   */
  function serviceArea(requestOptions) {
      const endpoint = requestOptions.endpoint || ARCGIS_ONLINE_SERVICE_AREA_URL;
      requestOptions.params = Object.assign({ returnFacilities: true, returnBarriers: true, returnPolylineBarriers: true, returnPolygonBarriers: true, preserveObjectID: true }, requestOptions.params);
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "barriers",
          "polylineBarriers",
          "polygonBarriers",
          "outputLines",
          "returnFacilities",
          "returnBarriers",
          "returnPolylineBarriers",
          "returnPolygonBarriers",
          "preserveObjectID"
      ]);
      // Set travelDirection
      if (requestOptions.travelDirection) {
          options.params.travelDirection = getTravelDirection(requestOptions.travelDirection);
      }
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication &&
          endpoint === ARCGIS_ONLINE_SERVICE_AREA_URL) {
          return Promise.reject("Finding service areas using the ArcGIS service requires authentication");
      }
      if (isFeatureSet(requestOptions.facilities)) {
          options.params.facilities = requestOptions.facilities;
      }
      else {
          options.params.facilities = normalizeLocationsList(requestOptions.facilities).join(";");
      }
      // optional input param that may need point geometry normalizing
      if (requestOptions.barriers) {
          if (isFeatureSet(requestOptions.barriers)) {
              options.params.barriers = requestOptions.barriers;
          }
          else {
              // optional point geometry barriers must be normalized, too
              // but not if provided as IFeatureSet type
              // note that optional polylineBarriers and polygonBarriers do not need to be normalized
              options.params.barriers = normalizeLocationsList(requestOptions.barriers).join(";");
          }
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}/solveServiceArea`, options).then(cleanResponse$1);
  }
  function cleanResponse$1(res) {
      // remove "fieldAliases" because it does not do anything.
      delete res.saPolygons.fieldAliases;
      // add "geoJson" property to "saPolygons"
      if (res.saPolygons.spatialReference.wkid === 4326) {
          res.saPolygons.geoJson = arcgisToGeoJSON(res.saPolygons);
      }
      return res;
  }

  /* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
   * Apache-2.0 */
  /**
   * Used to create an origin-destination (OD) cost matrix from multiple origins to multiple destinations. See the [REST Documentation](https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm) for more information.
   *
   * ```js
   * import { originDestinationMatrix } from '@esri/arcgis-rest-routing';
   *
   * originDestinationMatrix({
   *   origins: [
   *     [-90.404302, 38.600621],
   *     [-90.364293, 38.620427],
   *   ],
   *   destinations: [
   *     [-90.444716, 38.635501],
   *     [-90.311919, 38.633523],
   *     [-90.451147, 38.581107]
   *   ],
   *   authentication
   * })
   *   .then(response) // => { ... }
   * ```
   *
   * @param requestOptions Options to pass through to the routing service.
   * @returns A Promise that will resolve with travel time and/or distance for each origin-destination pair. It returns either odLines or odCostMatrix for this information depending on the outputType you specify.
   * @restlink https://developers.arcgis.com/rest/network/api-reference/origin-destination-cost-matrix-synchronous-service.htm
   */
  function originDestinationMatrix(requestOptions) {
      const endpoint = requestOptions.endpoint || ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL;
      requestOptions.params = Object.assign({ outputType: "esriNAODOutputSparseMatrix", returnOrigins: true, returnDestinations: true, returnBarriers: true, returnPolylineBarriers: true, returnPolygonBarriers: true }, requestOptions.params);
      const options = arcgisRestRequest.appendCustomParams(requestOptions, [
          "outputType",
          "barriers",
          "polylineBarriers",
          "polygonBarriers",
          "returnOrigins",
          "returnDestinations",
          "returnBarriers",
          "returnPolylineBarriers",
          "returnPolygonBarriers"
      ]);
      // the SAAS service does not support anonymous requests
      if (!requestOptions.authentication &&
          endpoint === ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL) {
          return Promise.reject("Calculating the origin-destination cost matrix using the ArcGIS service requires authentication");
      }
      // use a formatting helper for input params of this type: Array<IPoint | ILocation | [number, number]>
      if (isFeatureSet(requestOptions.origins)) {
          options.params.origins = requestOptions.origins;
      }
      else {
          options.params.origins = normalizeLocationsList(requestOptions.origins).join(";");
      }
      if (isFeatureSet(requestOptions.destinations)) {
          options.params.destinations = requestOptions.destinations;
      }
      else {
          options.params.destinations = normalizeLocationsList(requestOptions.destinations).join(";");
      }
      // optional input param that may need point geometry normalizing
      if (requestOptions.barriers) {
          if (isFeatureSet(requestOptions.barriers)) {
              options.params.barriers = requestOptions.barriers;
          }
          else {
              // optional point geometry barriers must be normalized, too
              // but not if provided as IFeatureSet type
              // note that optional polylineBarriers and polygonBarriers do not need to be normalized
              options.params.barriers = normalizeLocationsList(requestOptions.barriers).join(";");
          }
      }
      return arcgisRestRequest.request(`${arcgisRestRequest.cleanUrl(endpoint)}/solveODCostMatrix`, options).then(function (res) {
          return cleanResponse(res, options);
      });
  }
  function cleanResponse(res, options) {
      // add "geoJson" property to each response property that is an arcgis featureSet
      // res.odLines only exists and only includes geometry in this condition (out of 3 possible options.params.outputType conditions)
      if (options.params.outputType === "esriNAODOutputStraightLines" &&
          res.odLines &&
          res.odLines.spatialReference.wkid === 4326) {
          res.odLines.geoJson = arcgisToGeoJSON(res.odLines);
      }
      if (res.origins && res.origins.spatialReference.wkid === 4326) {
          res.origins.geoJson = arcgisToGeoJSON(res.origins);
      }
      if (res.destinations && res.destinations.spatialReference.wkid === 4326) {
          res.destinations.geoJson = arcgisToGeoJSON(res.destinations);
      }
      if (res.barriers && res.barriers.spatialReference.wkid === 4326) {
          res.barriers.geoJson = arcgisToGeoJSON(res.barriers);
      }
      if (res.polygonBarriers &&
          res.polygonBarriers.spatialReference.wkid === 4326) {
          res.polygonBarriers.geoJson = arcgisToGeoJSON(res.polygonBarriers);
      }
      if (res.polylineBarriers &&
          res.polylineBarriers.spatialReference.wkid === 4326) {
          res.polylineBarriers.geoJson = arcgisToGeoJSON(res.polylineBarriers);
      }
      return res;
  }

  exports.ARCGIS_ONLINE_CLOSEST_FACILITY_URL = ARCGIS_ONLINE_CLOSEST_FACILITY_URL;
  exports.ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL = ARCGIS_ONLINE_ORIGIN_DESTINATION_MATRIX_URL;
  exports.ARCGIS_ONLINE_ROUTING_URL = ARCGIS_ONLINE_ROUTING_URL;
  exports.ARCGIS_ONLINE_SERVICE_AREA_URL = ARCGIS_ONLINE_SERVICE_AREA_URL;
  exports.closestFacility = closestFacility;
  exports.decompressGeometry = decompressGeometry;
  exports.isFeatureSet = isFeatureSet;
  exports.isJsonWithURL = isJsonWithURL;
  exports.normalizeLocationsList = normalizeLocationsList;
  exports.originDestinationMatrix = originDestinationMatrix;
  exports.serviceArea = serviceArea;
  exports.solveRoute = solveRoute;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=routing.umd.js.map
