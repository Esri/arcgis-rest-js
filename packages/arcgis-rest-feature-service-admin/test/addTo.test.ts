/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { addToServiceDefinition } from "../src/addTo";

import {
  AddToFeatureServiceSuccessResponseFredAndGinger,
  AddToFeatureServiceSuccessResponseFayardAndHarold,
  AddToFeatureServiceSuccessResponseCydAndGene,
  AddToFeatureServiceError
} from "./mocks/service";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam, ErrorTypes } from "@esri/arcgis-rest-request";
import { ILayer, ITable } from "@esri/arcgis-rest-common-types";

describe("add to feature service", () => {
  afterEach(fetchMock.restore);

  describe("Authenticated methods", () => {
    // setup a UserSession to use in all these tests
    const MOCK_USER_SESSION = new UserSession({
      clientId: "clientId",
      redirectUri: "https://example-app.com/redirect-uri",
      token: "fake-token",
      tokenExpires: TOMORROW,
      refreshToken: "refreshToken",
      refreshTokenExpires: TOMORROW,
      refreshTokenTTL: 1440,
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
      id: "1914"
    };

    const tableDescriptionHarold: ITable = {
      name: "Harold",
      id: "1921"
    };

    const tableDescriptionGene: ITable = {
      name: "Gene",
      id: "1912"
    };

    const tableDescriptionFail: ITable = {
      name: "",
      id: ""
    };

    it("should add a pair of layers", done => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseFredAndGinger);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionFred, layerDescriptionGinger],
          ...MOCK_USER_REQOPTS
        }
      )
        .then(
          response => {
            // Check service call
            expect(fetchMock.called()).toEqual(true);
            const [url, options]: [string, RequestInit] = fetchMock.lastCall(
              "*"
            );

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
            expect(response).toEqual(
              AddToFeatureServiceSuccessResponseFredAndGinger
            );

            done();
          },
          () => {
            fail(); // call is supposed to succeed
          }
        )
        .catch(e => {
          fail(e);
        });
    });

    it("should add a pair of tables", done => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseFayardAndHarold);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          tables: [tableDescriptionFayard, tableDescriptionHarold],
          ...MOCK_USER_REQOPTS
        }
      )
        .then(
          response => {
            // Check service call
            expect(fetchMock.called()).toEqual(true);
            const [url, options]: [string, RequestInit] = fetchMock.lastCall(
              "*"
            );

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

            done();
          },
          () => {
            fail(); // call is supposed to succeed
          }
        )
        .catch(e => {
          fail(e);
        });
    });

    it("should add a layer and a table", done => {
      fetchMock.once("*", AddToFeatureServiceSuccessResponseCydAndGene);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionCyd],
          tables: [tableDescriptionGene],
          ...MOCK_USER_REQOPTS
        }
      )
        .then(response => {
          // Check service call
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");

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
          expect(response).toEqual(
            AddToFeatureServiceSuccessResponseCydAndGene
          );
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should fail to add a bad layer", done => {
      fetchMock.once("*", AddToFeatureServiceError);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionFail],
          ...MOCK_USER_REQOPTS
        }
      ).catch(error => {
        expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
        expect(error.message).toBe(
          "400: Unable to add feature service definition."
        );
        expect(error instanceof Error).toBeTruthy();
        expect(error.url).toBe(
          "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
        );
        // params added internally aren't surfaced in the error
        expect(error.options.params.addToDefinition).toEqual({
          layers: [layerDescriptionFail]
        });
        expect(error.options.httpMethod).toEqual("POST");
        done();
      });
    });

    it("should fail to add a bad table", done => {
      fetchMock.once("*", AddToFeatureServiceError);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          tables: [tableDescriptionFail],
          ...MOCK_USER_REQOPTS
        }
      ).catch(error => {
        expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
        expect(error.message).toBe(
          "400: Unable to add feature service definition."
        );
        expect(error instanceof Error).toBeTruthy();
        expect(error.url).toBe(
          "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
        );
        // params added internally aren't surfaced in the error
        expect(error.options.params.addToDefinition).toEqual({
          tables: [tableDescriptionFail]
        });
        expect(error.options.httpMethod).toEqual("POST");
        done();
      });
    });

    it("should fail to add a bad layer and a bad table", done => {
      fetchMock.once("*", AddToFeatureServiceError);

      addToServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          layers: [layerDescriptionFail],
          tables: [tableDescriptionFail],
          ...MOCK_USER_REQOPTS
        }
      ).catch(error => {
        expect(error.name).toBe(ErrorTypes.ArcGISRequestError);
        expect(error.message).toBe(
          "400: Unable to add feature service definition."
        );
        expect(error instanceof Error).toBeTruthy();
        expect(error.url).toBe(
          "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/addToDefinition"
        );
        // params added internally aren't surfaced in the error
        expect(error.options.params.addToDefinition).toEqual({
          tables: [tableDescriptionFail],
          layers: [layerDescriptionFail]
        });
        expect(error.options.httpMethod).toEqual("POST");
        done();
      });
    });
  }); // auth requests
});
