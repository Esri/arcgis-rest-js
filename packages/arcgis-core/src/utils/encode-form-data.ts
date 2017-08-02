import * as FormData from "form-data";
import { processParams } from "./process-params";

export function encodeFormData(paramsObj: any): FormData {
  const formData = new FormData();
  const newParams = processParams(paramsObj);
  Object.keys(newParams).forEach((key: any) => {
    formData.append(key, newParams[key]);
  });
  return formData;
}

export { FormData };
