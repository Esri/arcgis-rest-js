/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ICreateServiceResult } from "../../src/create";
import { IAddToServiceDefinitionResult } from "../../src/addTo";

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

export const AddToFeatureServiceSuccessResponseFredAndGinger: IAddToServiceDefinitionResult = {
  layers: [
    {
      name: "Fred",
      id: "1899"
    },
    {
      name: "Ginger",
      id: "1911"
    }
  ],
  success: true
};
export const AddToFeatureServiceSuccessResponseFayardAndHarold: IAddToServiceDefinitionResult = {
  tables: [
    {
      name: "Fayard",
      id: "1914"
    },
    {
      name: "Harold",
      id: "1921"
    }
  ],
  success: true
};
export const AddToFeatureServiceSuccessResponseCydAndGene: IAddToServiceDefinitionResult = {
  layers: [
    {
      name: "Cyd",
      id: "1922"
    }
  ],
  tables: [
    {
      name: "Gene",
      id: "1912"
    }
  ],
  success: true
};

export const AddToFeatureServiceError: any = {
  error: {
    code: 400,
    message: "Unable to add feature service definition.",
    details: ["Object reference not set to an instance of an object."]
  }
};
