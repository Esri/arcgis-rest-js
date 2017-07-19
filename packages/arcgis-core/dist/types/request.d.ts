/**
 * Actual module comment.
 * @module arcgis-client-core
 */
import 'es6-promise/auto';
import 'isomorphic-fetch';
import { FormData } from './utils/encode-form-data';
import { URLSearchParams } from './utils/encode-query-string';
export { FormData };
export { URLSearchParams };
export declare enum HTTPMethods {
    GET = "GET",
    POST = "POST",
}
export declare enum ResponseType {
    JSON = "json",
    HTML = "text",
    Text = "text",
    Image = "blob",
    ZIP = "blob",
}
export interface RequestOptions {
    params: any;
    authentication: string | null | undefined;
    method: HTTPMethods;
    response: ResponseType;
}
export declare function request(url: string, options?: Partial<RequestOptions>): Promise<any>;
