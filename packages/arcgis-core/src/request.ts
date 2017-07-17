import 'es6-promise/auto';
import 'isomorphic-fetch';
import * as FormData from 'form-data';
import * as URLSearchParams from 'url-search-params';

export type Partial<T> = {
    [P in keyof T]?: T[P];
};

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

export function encodeQueryString (paramsObj: any): URLSearchParams {
  const params = new URLSearchParams();
  let newParams = processParams(paramsObj);
  Object.keys(newParams).forEach((key: any) => {
    params.set(key, newParams[key]);
  });
  return params;
}

export function encodeFormData (paramsObj: any): FormData {
  let formData = new FormData();
  let newParams = processParams(paramsObj);
  Object.keys(newParams).forEach((key: any) => {
    formData.append(key, newParams[key]);
  });
  return formData;
}

export function processParams (params: any): any {
  Object.keys(params).forEach((key) => {
    let param = params[key];
    let type = Object.prototype.toString.call(param);
    let value: any;
    // properly encodes objects, arrays and dates for arcgis.com and other services.
    // ported from https://github.com/Esri/esri-leaflet/blob/master/src/Request.js#L22-L30
    switch (type) {
      case '[object Array]':
        value = (Object.prototype.toString.call(param[0]) === '[object Object]') ? JSON.stringify(param) : param.join(',');
        break;
      case '[object Object]':
        value = JSON.stringify(param);
        break;
      case '[object Date]':
        value = param.valueOf();
        break;
      default:
        value = param;
        break;
    }

    params[key] = value;
  });
  return params;
}

// TypeScript 2.1 no longer allows you to extend built in types. See https://github.com/Microsoft/TypeScript/issues/12790#issuecomment-265981442
// and https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
//
// This code is from MDN https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types.
export class ArcGISRequestError {
  name: string;
  message: string;
  apiErrorMessage: string;

  constructor (message = 'UNKNOWN_ERROR', apiErrorMessage = '') {
    this.name = 'ArcGISEndpointError';
    this.message = message;
    this.apiErrorMessage = apiErrorMessage;
  }
};
ArcGISRequestError.prototype = Object.create(Error.prototype);
ArcGISRequestError.prototype.constructor = ArcGISRequestError;

export function checkForErrors (data: any): any {
  // this is an error message from billing.arcgis.com backend
  if (data.code >= 400) {
    let { message, code } = data;
    let apiErrorMessage = `${code}${code ? ': ' : ''}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from the arcgis.com portal
  if (data.error) {
    let message = data.error.message;
    let errorCode = (data.error.messageCode || data.error.code) || '';
    let apiErrorMessage = `${errorCode}${errorCode ? ': ' : ''}${message}`;
    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  // error from a status check
  if (data.status === 'failed') {
    let message: string;
    let code: any = '';

    try {
      message = JSON.parse(data.statusMessage).message;
      code = JSON.parse(data.statusMessage).code;
    } catch (e) {
      message = data.statusMessage;
    }

    let apiErrorMessage = `${code}${code ? ': ' : ''}${message}`;

    throw new ArcGISRequestError(message, apiErrorMessage);
  }

  return data;
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

export { FormData };

export function request (url: string, options: Partial<RequestOptions> = {}): Promise<any> {
  const requestOptions :RequestOptions = Object.assign(options, defaultOptions);

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
