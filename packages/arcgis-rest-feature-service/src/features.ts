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
 * Get an feature by id
 *
 * @param serviceUrl - service url
 * @param id - feature id
 * @param requestOptions - Options for the request
 * @returns A Promise that will resolve with the feature.
 */
export function getFeature(
  serviceUrl: string,
  id: number,
  requestOptions?: IRequestOptions
): Promise<IFeature> {
  const url = `${serviceUrl}/${id}`;

  // default to a GET request
  const options: IRequestOptions = {
    ...{ httpMethod: "GET" },
    ...requestOptions
  };
  return request(url, options).then(response => response.feature);
}
