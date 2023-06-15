import { IRequestOptions } from "@esri/arcgis-rest-request";
import { Privileges } from "./enum/PRIVILEGE.js";

// Check privileges validity as user's input at runtime is non-deterministic
export const isPrivilegesValid = (
  privileges: Array<keyof typeof Privileges>
): boolean => privileges.every((element) => element in Privileges);

// TODO: This func may be modified in future to support more types e.g. object
// encode special params value (e.g. array type...) in advance in order to make encodeQueryString() works correctly. This is case by case usage
export const paramsEncodingToJsonStr = (requestOptions: IRequestOptions) => {
  Object.entries(requestOptions.params).forEach((entry) => {
    const [key, value] = entry;
    if (value.constructor.name === "Array") {
      requestOptions.params[key] = JSON.stringify(value);
    }
  });
};
