import * as FormData from './browser/form-data';
import { processParams } from './process-params';
export function encodeFormData(paramsObj) {
    var formData = new FormData();
    var newParams = processParams(paramsObj);
    Object.keys(newParams).forEach(function (key) {
        formData.append(key, newParams[key]);
    });
    return formData;
}
export { FormData };
//# sourceMappingURL=encode-form-data.js.map