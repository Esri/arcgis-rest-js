import * as URLSearchParams from './browser/url-search-params';
import { processParams } from './process-params';
export function encodeQueryString(paramsObj) {
    var params = new URLSearchParams();
    var newParams = processParams(paramsObj);
    Object.keys(newParams).forEach(function (key) {
        params.set(key, newParams[key]);
    });
    return params;
}
export { URLSearchParams };
//# sourceMappingURL=encode-query-string.js.map