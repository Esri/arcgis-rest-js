 /**
   * Processes arrays to JSON strings for Geoprocessing services. See “GPMultiValue” in {@link https://developers.arcgis.com/rest/services-reference/enterprise/gp-data-types.htm}
   */
  export function processJobParams(params: any) {
  const processedParams = Object.keys(params).reduce((newParams: any, key) => {
    const value = params[key]
    const type = value.constructor.name;
    newParams[key] = type === "Array" ? JSON.stringify(value) : value;
    return newParams;
  }, {});

  return processedParams
}