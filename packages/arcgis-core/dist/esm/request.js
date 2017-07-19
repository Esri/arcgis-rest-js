/**
 * Actual module comment.
 * @module arcgis-client-core
 */
import 'es6-promise/auto';
import 'isomorphic-fetch';
import { defaults } from 'lodash-es';
import { encodeFormData, FormData } from './utils/encode-form-data';
import { encodeQueryString, URLSearchParams } from './utils/encode-query-string';
import { checkForErrors } from './utils/check-for-errors';
export { FormData };
export { URLSearchParams };
// Simple enum for our HTTP Methods. Users cana lso just use the strings "GET" and "POST"
export var HTTPMethods;
(function (HTTPMethods) {
    HTTPMethods["GET"] = "GET";
    HTTPMethods["POST"] = "POST";
})(HTTPMethods || (HTTPMethods = {}));
export var ResponseType;
(function (ResponseType) {
    ResponseType["JSON"] = "json";
    ResponseType["HTML"] = "text";
    ResponseType["Text"] = "text";
    ResponseType["Image"] = "blob";
    ResponseType["ZIP"] = "blob";
})(ResponseType || (ResponseType = {}));
var defaultOptions = {
    params: {},
    authentication: null,
    method: HTTPMethods.POST,
    response: ResponseType.JSON
};
export function request(url, options) {
    if (options === void 0) { options = {}; }
    var requestOptions = defaults(options, defaultOptions);
    var fetchOptions = {
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
            options.params.f = 'zip';
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
        .then(function (response) {
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
        then((function (data) {
        if (options.response === ResponseType.JSON) {
            checkForErrors(data);
            return data;
        }
        else {
            return data;
        }
    }));
}
//# sourceMappingURL=request.js.map