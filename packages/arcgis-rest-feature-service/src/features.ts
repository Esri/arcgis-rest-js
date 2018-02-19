/* Copyright (c) 2017 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Feature - TODO: move this to common types?
 */
export interface IFeature {
  attributes: { [key: string]: any };
  geometry: any;
}

/**
 * parameters required to get a feature by id
 *
 * @param url - layer service url
 * @param id - feature id
 */
export interface IFeatureRequestOptions extends IRequestOptions {
  url: string;
  id: number;
}

/**
 * Get an feature by id
 *
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the feature.
 */
export function getFeature(
  requestOptions: IFeatureRequestOptions
): Promise<IFeature> {
  const url = `${requestOptions.url}/${requestOptions.id}`;

  // default to a GET request
  const options: IFeatureRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options).then((response: any) => response.feature);
}
