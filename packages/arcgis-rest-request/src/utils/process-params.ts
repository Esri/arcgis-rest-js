/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
* Apache-2.0 */

/**
 * Checks parameters to see if we should use FormData to send the request
 * @param params The object whose keys will be encoded.
 * @return A boolean indicating if FormData will be required.
 */
export function requiresFormData(params: any) {
  return Object.keys(params).some(key => {
    const value = params[key];

    if (!value) {
      return false;
    }

    const type = value.constructor.name;

    switch (type) {
      case "Array":
        return false;
      case "Object":
        return false;
      case "Date":
        return false;
      case "Function":
        return false;
      case "Boolean":
        return false;
      case "String":
        return false;
      case "Number":
        return false;
      default:
        return true;
    }
  });
}

/**
 * Converts parameters to the proper representation to send to the ArcGIS REST API.
 * @param params The object whose keys will be encoded.
 * @return A new object with properly encoded values.
 */
export function processParams(params: any): any {
  const newParams: any = {};

  Object.keys(params).forEach(key => {
    const param = params[key];
    if (
      !param &&
      param !== 0 &&
      typeof param !== "boolean" &&
      typeof param !== "string"
    ) {
      return;
    }
    const type = param.constructor.name;

    let value: any;

    // properly encodes objects, arrays and dates for arcgis.com and other services.
    // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
    // also see https://github.com/Esri/arcgis-rest-js/issues/18:
    // null, undefined, function are excluded. If you want to send an empty key you need to send an empty string "".
    switch (type) {
      case "Array":
        // classify array as empty or use the first element to determine whether it contains objects to be stringified or non-objects to be comma-separated
        value =
          param.length === 0 ||
          (param[0] &&
            param[0].constructor &&
            param[0].constructor.name === "Object")
            ? JSON.stringify(param)
            : param.join(",");
        break;
      case "Object":
        value = JSON.stringify(param);
        break;
      case "Date":
        value = param.valueOf();
        break;
      case "Function":
        value = null;
        break;
      case "Boolean":
        value = param + "";
        break;
      default:
        value = param;
        break;
    }
    if (value || value === 0 || typeof value === "string") {
      newParams[key] = value;
    }
  });

  return newParams;
}
