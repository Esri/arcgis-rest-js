export function processParams(params) {
    Object.keys(params).forEach(function (key) {
        var param = params[key];
        var type = Object.prototype.toString.call(param);
        var value;
        // properly encodes objects, arrays and dates for arcgis.com and other services.
        // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
        switch (type) {
            case '[object Array]':
                value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
                break;
            case '[object Object]':
                value = JSON.stringify(param);
                break;
            case '[object Date]':
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
//# sourceMappingURL=process-params.js.map