import 'es6-promise/auto';
import 'isomorphic-fetch';
import { defaults } from 'lodash-es';
import { encodeFormData, FormData } from './utils/encode-form-data';
import { encodeQueryString, URLSearchParams } from './utils/encode-query-string';
import { checkForErrors } from './utils/check-for-errors';

export { FormData };
export { URLSearchParams };

// Simple enum for our HTTP Methods. Users can also use the strings "GET" and "POST"
export enum HTTPMethods {
  GET = 'GET',
  POST = 'POST'
}

export enum ResponseType {
  JSON = 'json',
  HTML = 'text',
  Text = 'text',
  Image = 'blob',
  ZIP = 'blob'
}

export interface RequestOptions {
  params: any;
  authentication: string | null | undefined;
  method: HTTPMethods;
  response: ResponseType;
}

const defaultOptions = {
  params: {},
  authentication: null,
  method: HTTPMethods.POST,
  response: ResponseType.JSON
}

export function request (url: string, options: Partial<RequestOptions> = {}): Promise<any> {
  const requestOptions :RequestOptions = defaults(options, defaultOptions);

  const fetchOptions: RequestInit = {
    method: options.method
  };

  switch (options.response) {
    case ResponseType.JSON:
      options.params.f = "json";
      break;
    case ResponseType.Image:
      options.params.f = "image";
      break;
    case ResponseType.HTML:
      options.params.f = "html";
      break;
    case ResponseType.Text:
      break;
    case ResponseType.ZIP:
      options.params.f = 'zip'
      break;
    default:
      options.params.f = "json";
  }

  if (options.method === HTTPMethods.GET) {
    url = url + '?' + encodeQueryString(options.params).toString();
  }

  if (options.method === HTTPMethods.POST) {
    fetchOptions.body = encodeFormData(options.params);
  }

  return fetch(url, fetchOptions)
    .then((response) => {
      switch (options.response) {
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
    }).
    then((data => {
      if(options.response === ResponseType.JSON) {
        checkForErrors(data);
        return data;
      } else {
        return data;
      }
    }));
}
