"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processJobParams = void 0;
/**
  * Processes arrays to JSON strings for Geoprocessing services. See “GPMultiValue” in https://developers.arcgis.com/rest/services-reference/enterprise/gp-data-types.htm
  */
function processJobParams(params) {
    const processedParams = Object.keys(params).reduce((newParams, key) => {
        const value = params[key];
        const type = value.constructor.name;
        newParams[key] = type === "Array" ? JSON.stringify(value) : value;
        return newParams;
    }, {});
    return processedParams;
}
exports.processJobParams = processJobParams;
//# sourceMappingURL=process-job-params.js.map