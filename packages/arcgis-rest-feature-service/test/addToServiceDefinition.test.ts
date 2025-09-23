/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { describe, afterEach, test, expect } from "vitest";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ILayer, ITable } from "../src/helpers.js";
import {
  encodeParam,
  ErrorTypes,
  ArcGISIdentityManager
} from "@esri/arcgis-rest-request";
import { addToServiceDefinition } from "../src/addToServiceDefinition.js";
import { layerDefinitionSid } from "./mocks/layerDefinition.js";
import {
  AddToFeatureServiceSuccessResponseFredAndGinger,
  AddToFeatureServiceSuccessResponseFayardAndHarold,
  AddToFeatureServiceSuccessResponseCydAndGene,
  AddToFeatureServiceError
} from "./mocks/service.js";

describe("add to feature service", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("Authenticated methods", () => {
    // setup a ArcGISIdentityManager to use in all these tests
    const MOCK_USER_SESSION = new ArcGISIdentityManager({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      username: "casey",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    const MOCK_USER_REQOPTS = {
      authentication: MOCK_USER_SESSION
    };

    const layerDescriptionFred: ILayer = {
      name: "Fred",
      id: "1899",
      layerType: "Feature Layer"
    };

    const layerDescriptionGinger: ILayer = {
      name: "Ginger",
      id: "1911",
      layerType: "Feature Layer"
    };

    const layerDescriptionCyd: ILayer = {
      name: "Cyd",
      id: "1922",
      layerType: "Feature Layer"
    };

    const layerDescriptionFail: ILayer = {
      name: "",
      id: "",
      layerType: "Feature Layer"
    };

    const tableDescriptionFayard: ITable = {
      name: "Fayard",
      id: 1914
    };

    const tableDescriptionHarold: ITable = {
      name: "Harold",
      id: 1921
    };

    const tableDescriptionGene: ITable = {
      name: "Gene",
      id: 1912
    };

    const tableDescriptionFail: ITable = {
      name: "",
      id: 0
    };

    test("should add a pair of layers", async () => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseFredAndGinger);

      const response = await addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionFred, layerDescriptionGinger],
          ...MOCK_USER_REQOPTS
        }
      );
      // Check service call
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam(
          "addToDefinition",
          JSON.stringify({
            layers: [layerDescriptionFred, layerDescriptionGinger]
          })
        )
      );
      // Check response
      expect(response).toEqual(AddToFeatureServiceSuccessResponseFredAndGinger);
    });

    test("should add a pair of tables", async () => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseFayardAndHarold);

      const response = await addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          tables: [tableDescriptionFayard, tableDescriptionHarold],
          ...MOCK_USER_REQOPTS
        }
      );
      // Check service call
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam(
          "addToDefinition",
          JSON.stringify({
            tables: [tableDescriptionFayard, tableDescriptionHarold]
          })
        )
      );
      // Check response
      expect(response).toEqual(
        AddToFeatureServiceSuccessResponseFayardAndHarold
      );
    });

    test("should add a layer and a table", async () => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseCydAndGene);

      const response = await addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionCyd],
          tables: [tableDescriptionGene],
          ...MOCK_USER_REQOPTS
        }
      );
      // Check service call
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");

      expect(url).toEqual(
        "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam(
          "addToDefinition",
          JSON.stringify({
            layers: [layerDescriptionCyd],
            tables: [tableDescriptionGene]
          })
        )
      );
      // Check response
      expect(response).toEqual(AddToFeatureServiceSuccessResponseCydAndGene);
    });

    test("should add a layer definition", async () => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseCydAndGene);

      const response = await addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDefinitionSid],
          ...MOCK_USER_REQOPTS
        }
      );
      // Check service call
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");

      expect(url).toEqual(
        "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain("f=json");
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam(
          "addToDefinition",
          JSON.stringify({
            layers: [layerDefinitionSid]
          })
        )
      );
      // Check response
      expect(response).toEqual(AddToFeatureServiceSuccessResponseCydAndGene);
    });

    test("should throw an error with expected information when attempting to add invalid layer", async () => {
      fetchMock.once("*", AddToFeatureServiceError);

      await expect(
        addToServiceDefinition(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
          {
            layers: [layerDescriptionFail],
            ...MOCK_USER_REQOPTS
          }
        )
      ).rejects.toMatchObject({
        name: ErrorTypes.ArcGISRequestError,
        message: "400: Unable to add feature service definition.",
        url: "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition",
        options: expect.objectContaining({
          params: expect.objectContaining({
            addToDefinition: { layers: [layerDescriptionFail] }
          }),
          httpMethod: "POST"
        })
      });
    });

    test("should throw an error with expected information when attempting to add invalid table", async () => {
      fetchMock.once("*", AddToFeatureServiceError);

      await expect(
        addToServiceDefinition(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
          {
            tables: [tableDescriptionFail],
            ...MOCK_USER_REQOPTS
          }
        )
      ).rejects.toMatchObject({
        name: ErrorTypes.ArcGISRequestError,
        message: "400: Unable to add feature service definition.",
        url: "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition",
        options: expect.objectContaining({
          params: expect.objectContaining({
            addToDefinition: { tables: [tableDescriptionFail] }
          }),
          httpMethod: "POST"
        })
      });
    });

    test("should fail to add a bad layer and a bad table", async () => {
      fetchMock.once("*", AddToFeatureServiceError);

      await expect(
        addToServiceDefinition(
          "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
          {
            layers: [layerDescriptionFail],
            tables: [tableDescriptionFail],
            ...MOCK_USER_REQOPTS
          }
        )
      ).rejects.toMatchObject({
        name: ErrorTypes.ArcGISRequestError,
        message: "400: Unable to add feature service definition.",
        url: "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition",
        options: expect.objectContaining({
          params: expect.objectContaining({
            addToDefinition: {
              tables: [tableDescriptionFail],
              layers: [layerDescriptionFail]
            }
          }),
          httpMethod: "POST"
        })
      });
    });
  }); // auth requests
});
