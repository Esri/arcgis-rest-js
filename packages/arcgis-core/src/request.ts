import "es6-promise/auto";
import "isomorphic-fetch";
import { defaults } from "lodash-es";
import { checkForErrors } from "./utils/check-for-errors";
import { encodeFormData, FormData } from "./utils/encode-form-data";
import {
  encodeQueryString,
  URLSearchParams
} from "./utils/encode-query-string";

export { FormData };
export { URLSearchParams };

/**
 * Enum for valid HTTP Methods. The Strings "GET" and "POST" can also be used in place of this `HTTPMethods`.
 */
export enum HTTPMethods {
  GET = "GET",
  POST = "POST"
}

export enum ResponseType {
  JSON = "json",
  HTML = "text",
  Text = "text",
  Image = "blob",
  ZIP = "blob"
}

export interface IRequestOptions {
  params: any;
  authentication: string | null | undefined;
  method: HTTPMethods;
  response: ResponseType;
}

const defaultOptions: IRequestOptions = {
  authentication: null,
  params: {},
  method: HTTPMethods.POST,
  response: ResponseType.JSON
};

export function request(
  url: string,
  options: Partial<IRequestOptions> = {}
): Promise<any> {
  const requestOptions: IRequestOptions = defaults(options, defaultOptions);

  const fetchOptions: RequestInit = {
    method: requestOptions.method
  };

  switch (requestOptions.response) {
    case ResponseType.JSON:
      requestOptions.params.f = "json";
      break;
    case ResponseType.Image:
      requestOptions.params.f = "image";
      break;
    case ResponseType.HTML:
      requestOptions.params.f = "html";
      break;
    case ResponseType.Text:
      break;
    case ResponseType.ZIP:
      requestOptions.params.f = "zip";
      break;
    default:
      requestOptions.params.f = "json";
  }

  if (requestOptions.method === HTTPMethods.GET) {
    url = url + "?" + encodeQueryString(requestOptions.params).toString();
  }

  if (requestOptions.method === HTTPMethods.POST) {
    fetchOptions.body = encodeFormData(requestOptions.params);
  }

  return fetch(url, fetchOptions)
    .then(response => {
      switch (requestOptions.response) {
        case ResponseType.JSON:
          return response.json();
        case ResponseType.Image:
          return response.blob();
        case ResponseType.HTML:
          return response.text();
        case ResponseType.Text:
          return response.text();
        case ResponseType.ZIP:
          return response.blob();
        default:
          return response.text();
      }
    })
    .then(data => {
      if (requestOptions.response === ResponseType.JSON) {
        checkForErrors(data);
        return data;
      } else {
        return data;
      }
    });
}
