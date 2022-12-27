"use strict";
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeValues = void 0;
const getLayer_js_1 = require("./getLayer.js");
/**
 * ```js
 * import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-service';
 * //
 * const url = `https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0`
 * queryFeatures({ url })
 *   .then(queryResponse => {
 *     decodeValues({
 *       url,
 *       queryResponse
 *     })
 *       .then(decodedResponse)
 *   })
 * ```
 * Replaces the raw coded domain values in a query response with descriptions (for legibility).
 *
 * @param requestOptions - Options for the request.
 * @returns A Promise that will resolve with the addFeatures response.
 */
function decodeValues(requestOptions) {
    let prms;
    if (requestOptions.fields) {
        prms = Promise.resolve(requestOptions.fields);
    }
    else {
        prms = (0, getLayer_js_1.getLayer)({ url: requestOptions.url }).then((metadata) => {
            return metadata.fields;
        });
    }
    return prms.then((fields) => {
        // extract coded value domains
        const domains = extractCodedValueDomains(fields);
        if (Object.keys(domains).length < 1) {
            // no values to decode
            return requestOptions.queryResponse;
        }
        // don't mutate original features
        const decodedFeatures = requestOptions.queryResponse.features.map((feature) => {
            const decodedAttributes = {};
            for (const key in feature.attributes) {
                /* istanbul ignore next */
                if (!Object.prototype.hasOwnProperty.call(feature.attributes, key))
                    continue;
                const value = feature.attributes[key];
                const domain = domains[key];
                decodedAttributes[key] =
                    value !== null && domain ? decodeValue(value, domain) : value;
            }
            // merge decoded attributes into the feature
            return Object.assign(Object.assign({}, feature), { attributes: decodedAttributes });
        });
        // merge decoded features into the response
        return Object.assign(Object.assign({}, requestOptions.queryResponse), { features: decodedFeatures });
    });
}
exports.decodeValues = decodeValues;
function extractCodedValueDomains(fields) {
    return fields.reduce((domains, field) => {
        const domain = field.domain;
        if (domain && domain.type === "codedValue") {
            domains[field.name] = domain;
        }
        return domains;
    }, {});
}
// TODO: add type for domain?
function decodeValue(value, domain) {
    const codedValue = domain.codedValues.find((d) => {
        return value === d.code;
    });
    return codedValue ? codedValue.name : value;
}
//# sourceMappingURL=decodeValues.js.map