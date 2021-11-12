/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { isServiceNameAvailable } from "./is-service-name-available.js";

/**
 * Given a starting name, return a service name that is unique within
 * the current users organization
 *
 * @export
 * @param {string} name
 * @param {ArcGISIdentityManager} session
 * @param {number} step
 * @return {*}  {Promise<string>}
 */
export function getUniqueServiceName(
  name: string,
  type: string,
  session: ArcGISIdentityManager,
  step: number
): Promise<string> {
  let nameToCheck = name;
  if (step) {
    nameToCheck = `${name}_${step}`;
  }
  return isServiceNameAvailable(nameToCheck, type, session).then((response) => {
    if (response.available) {
      return nameToCheck;
    } else {
      step = step + 1;
      return getUniqueServiceName(name, type, session, step);
    }
  });
}
