/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IField, ILayerDefinition, IFeature } from "@esri/arcgis-rest-types";
import { IQueryFeaturesResponse } from "./query";
import { getLayer } from "./getLayer";

/**
 * Request options to fetch a feature by id.
 */
export interface IDecodeValuesRequestOptions extends IRequestOptions {
  /**
   * Layer service url.
   */
  url?: string;
  /**
   * Unique identifier of the feature.
   */
  queryResponse: IQueryFeaturesResponse;
  /**
   * * If a fieldset is provided, no internal metadata check will be issued to gather info about coded value domains.
   *
   * getFeatureService(url)
   *   .then(metadata => {
   *     queryFeatures({ url })
   *       .then(response => {
   *         decodeValues({
   *           url,
   *           queryResponse,
   *           fields: metadata.fields
   *         })
   *           .then(decodedResponse)
   *       })
   *   })
   */
  fields?: IField[];
}

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
export function decodeValues(
  requestOptions: IDecodeValuesRequestOptions
): Promise<IQueryFeaturesResponse> {
  return new Promise(resolve => {
    if (!requestOptions.fields) {
      return getLayer(requestOptions.url, requestOptions).then(
        (metadata: ILayerDefinition) => {
          resolve((requestOptions.fields = metadata.fields));
        }
      );
    } else {
      resolve(requestOptions.fields);
    }
  }).then(fields => {
    // extract coded value domains
    const domains = extractCodedValueDomains(fields as IField[]);
    if (Object.keys(domains).length < 1) {
      // no values to decode
      return requestOptions.queryResponse;
    }

    // don't mutate original features
    const decodedFeatures = requestOptions.queryResponse.features.map(
      (feature: IFeature) => {
        const decodedAttributes: { [index: string]: any } = {};
        for (const key in feature.attributes) {
          /* istanbul ignore next */
          if (!feature.attributes.hasOwnProperty(key)) continue;
          const value = feature.attributes[key];
          const domain = domains[key];
          decodedAttributes[key] =
            value !== null && domain ? decodeValue(value, domain) : value;
        }
        // merge decoded attributes into the feature
        return { ...feature, ...{ attributes: decodedAttributes } };
      }
    );
    // merge decoded features into the response
    return {
      ...requestOptions.queryResponse,
      ...{ features: decodedFeatures }
    };
  });
}

function extractCodedValueDomains(fields: IField[]) {
  return fields.reduce(
    (domains, field) => {
      const domain = field.domain;
      if (domain && domain.type === "codedValue") {
        domains[field.name] = domain;
      }
      return domains;
    },
    {} as { [index: string]: any }
  );
}

// TODO: add type for domain?
function decodeValue(value: any, domain: any) {
  const codedValue = domain.codedValues.find((d: any) => {
    return value === d.code;
  });
  return codedValue ? codedValue.name : value;
}
