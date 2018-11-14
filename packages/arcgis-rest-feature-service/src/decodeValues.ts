/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  IField,
  ILayerDefinition,
  IFeature
} from "@esri/arcgis-rest-common-types";
import { IQueryFeaturesResponse } from "./query";
import { getLayer } from "./getLayer";

/**
 * Request options to fetch a feature by id.
 */
export interface IDecodeValuesRequestOptions extends IRequestOptions {
  /**
   * Layer service url.
   */
  url: string;
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
 * Replaces the raw coded domain values in a query response with descriptions (for legibility).
 *
 * ```js
 * import { queryFeatures, decodeValues } from '@esri/arcgis-rest-feature-service';
 *
 * const url = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0";
 *
 * queryFeatures({ url })
 *   .then(queryResponse => {
 *     decodeValues({
 *       url,
 *       queryResponse
 *     })
 *       .then(decodedResponse)
 *   })
 * ```
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
    // turn the fields array into a POJO to avoid multiple calls to Array.find()
    const fieldsObject: any = {};
    const fieldsArray = fields as IField[];
    fieldsArray.forEach((field: IField) => {
      fieldsObject[field.name] = field;
    });

    // dont mutate original response
    const clonedResponse = JSON.parse(
      JSON.stringify(requestOptions.queryResponse)
    );

    clonedResponse.features.forEach((feature: IFeature) => {
      for (const key in feature.attributes) {
        /* istanbul ignore next */
        if (!feature.attributes.hasOwnProperty(key)) continue;
        feature.attributes[key] = convertAttribute(
          feature.attributes,
          fieldsObject[key]
        );
      }
    });
    return clonedResponse;
  });
}

/**
 * ripped off from https://github.com/GeoXForm/esri-to-geojson/blob/55d32955d8ef0acb26de70025539e7c7a37d838e/src/index.js#L193-L220
 *
 * Decodes an attributes CVD and standardizes any date fields
 *
 * @params {object} attribute - a single esri feature attribute
 * @params {object} field - the field metadata describing that attribute
 * @returns {object} outAttribute - the converted attribute
 * @private
 */

function convertAttribute(attribute: any, field: IField) {
  const inValue = attribute[field.name];
  let value;

  if (inValue === null) return inValue;

  if (field.domain && field.domain.type === "codedValue") {
    value = cvd(inValue, field);
  } else {
    value = inValue;
  }
  return value;
}

/**
 * also ripped off from https://github.com/GeoXForm/esri-to-geojson/blob/55d32955d8ef0acb26de70025539e7c7a37d838e/src/index.js#L222-L235
 *
 * Looks up a value from a coded domain
 *
 * @params {integer} value - The original field value
 * @params {object} field - metadata describing the attribute field
 * @returns {string/integerfloat} - The decoded field value
 * @private
 */

function cvd(value: any, field: IField) {
  const domain = field.domain.codedValues.find((d: any) => {
    return value === d.code;
  });
  return domain ? domain.name : value;
}
