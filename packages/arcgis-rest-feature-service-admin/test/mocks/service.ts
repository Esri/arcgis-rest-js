/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ICreateServiceResult } from "../../src/create";

export const FeatureServiceSuccessResponse: ICreateServiceResult = {
  encodedServiceURL:
    "https://services.arcgis.com/b6gLrKHqgkQb393u/arcgis/rest/services/EmptyServiceName/FeatureServer",
  isView: false,
  itemId: "1b1a3c914ef94c49ae55ce223cac5754",
  name: "EmptyServiceName",
  serviceItemId: "1b1a3c914ef94c49ae55ce223cac5754",
  serviceurl:
    "https://services.arcgis.com/b6gLrKHqgkQb393u/arcgis/rest/services/EmptyServiceName/FeatureServer",
  size: -1,
  success: true,
  type: "Feature Service"
};
export const FeatureServiceFailResponse: any = {
  success: false
};
