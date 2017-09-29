/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

/**
 * Converts parameters to the proper representation to send to the ArcGIS REST API.
 * @param params The object whose keys will be encoded.
 * @return A new object with properly encoded values.
 */
export function processParams(params: any): any {
  const newParams: any = {};

  Object.keys(params).forEach(key => {
    const param = params[key];
    const type = Object.prototype.toString.call(param);
    let value: any;

    // properly encodes objects, arrays and dates for arcgis.com and other services.
    // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
    // also see https://github.com/Esri/arcgis-rest-js/issues/18
    switch (type) {
      case "[object Array]":
        value =
          Object.prototype.toString.call(param[0]) === "[object Object]"
            ? JSON.stringify(param)
            : param.join(",");
        break;
      case "[object Object]":
        value = JSON.stringify(param);
        break;
      case "[object Date]":
        value = param.valueOf();
        break;
      case "[object Function]":
        value = null;
        break;
      case "[object Boolean]":
        value = param + "";
        break;
      default:
        value = param;
        break;
    }
    if (value) {
      newParams[key] = value;
    }
  });

  return newParams;
}
