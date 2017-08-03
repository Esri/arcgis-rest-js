export function processParams(params: any): any {
  Object.keys(params).forEach(key => {
    const param = params[key];
    const type = Object.prototype.toString.call(param);
    let value: any;
    // properly encodes objects, arrays and dates for arcgis.com and other services.
    // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
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
      default:
        value = param;
        break;
    }

    params[key] = value;
  });
  return params;
}
