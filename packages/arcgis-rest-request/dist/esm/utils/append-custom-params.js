/* Copyright (c) 2017-2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
/**
 * Helper for methods with lots of first order request options to pass through as request parameters.
 */
export function appendCustomParams(customOptions, keys, baseOptions) {
    const requestOptionsKeys = [
        "params",
        "httpMethod",
        "rawResponse",
        "authentication",
        "portal",
        "fetch",
        "maxUrlLength",
        "headers"
    ];
    const options = Object.assign(Object.assign({ params: {} }, baseOptions), customOptions);
    // merge all keys in customOptions into options.params
    options.params = keys.reduce((value, key) => {
        if (customOptions[key] ||
            typeof customOptions[key] === "boolean" ||
            (typeof customOptions[key] === "number" &&
                customOptions[key] === 0)) {
            value[key] = customOptions[key];
        }
        return value;
    }, options.params);
    // now remove all properties in options that don't exist in IRequestOptions
    return requestOptionsKeys.reduce((value, key) => {
        if (options[key]) {
            value[key] = options[key];
        }
        return value;
    }, {});
}
//# sourceMappingURL=append-custom-params.js.map