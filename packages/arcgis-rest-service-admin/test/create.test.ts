/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { createFeatureService } from "../src/create";

import { FeatureServiceResponse } from "./mocks/service";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("create feature service", () => {
  afterEach(() => fetchMock.restore());

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

    const serviceDescription = {
      name: "EmptyServiceName",
      serviceDescription: "",
      hasStaticData: false,
      maxRecordCount: 1000,
      supportedQueryFormats: "JSON",
      capabilities: "Create,Delete,Query,Update,Editing",
      description: "",
      copyrightText: "",
      spatialReference: {
        wkid: 102100
      },
      initialExtent: {
        xmin: -20037507.0671618,
        ymin: -30240971.9583862,
        xmax: 20037507.0671618,
        ymax: 18398924.324645,
        spatialReference: {
          wkid: 102100,
          latestWkid: 3857
        }
      },
      allowGeometryUpdates: true,
      units: "esriMeters",
      xssPreventionInfo: {
        xssPreventionEnabled: true,
        xssPreventionRule: "InputOnly",
        xssInputRule: "rejectInvalid"
      }
    };

    it("should create a feature service defaulting to the root folder", done => {
      fetchMock.mock("end:createService", FeatureServiceResponse, {});

      createFeatureService({
        item: serviceDescription,
        ...MOCK_USER_REQOPTS
      })
        .then(
          response => {
            expect(fetchMock.called("end:createService")).toEqual(true);

            // Check create service call
            const [urlCreate, optionsCreate]: fetchMock.MockCall = fetchMock.lastCall("end:createService");
            expect(urlCreate).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createService"
            );
            expect(optionsCreate.method).toBe("POST");
            expect(optionsCreate.body).toContain("f=json");
            expect(optionsCreate.body).toContain(
              encodeParam(
                "createParameters",
                JSON.stringify(serviceDescription)
              )
            );
            expect(optionsCreate.body).toContain("outputType=featureService");
            expect(optionsCreate.body).toContain(
              encodeParam("token", "fake-token")
            );

            // Check response
            expect(response).toEqual(FeatureServiceResponse);

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

    it("should create a feature service specified for the root folder 1", done => {
      fetchMock.mock("end:createService", FeatureServiceResponse, {});
      const folderId = "";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(
          response => {
            expect(fetchMock.called("end:createService")).toEqual(true);

            // Check create service call
            const [urlCreate, optionsCreate]: fetchMock.MockCall = fetchMock.lastCall("end:createService");
            expect(urlCreate).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createService"
            );
            expect(optionsCreate.method).toBe("POST");
            expect(optionsCreate.body).toContain("f=json");
            expect(optionsCreate.body).toContain(
              encodeParam(
                "createParameters",
                JSON.stringify(serviceDescription)
              )
            );
            expect(optionsCreate.body).toContain("outputType=featureService");
            expect(optionsCreate.body).toContain(
              encodeParam("token", "fake-token")
            );

            // Check response
            expect(response).toEqual(FeatureServiceResponse);

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

    it("should create a feature service specified for the root folder 2", done => {
      fetchMock.mock("end:createService", FeatureServiceResponse, {});
      const folderId = "/";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(
          response => {
            expect(fetchMock.called("end:createService")).toEqual(true);

            // Check create service call
            const [urlCreate, optionsCreate]: fetchMock.MockCall = fetchMock.lastCall("end:createService");
            expect(urlCreate).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createService"
            );
            expect(optionsCreate.method).toBe("POST");
            expect(optionsCreate.body).toContain("f=json");
            expect(optionsCreate.body).toContain(
              encodeParam(
                "createParameters",
                JSON.stringify(serviceDescription)
              )
            );
            expect(optionsCreate.body).toContain("outputType=featureService");
            expect(optionsCreate.body).toContain(
              encodeParam("token", "fake-token")
            );

            // Check response
            expect(response).toEqual(FeatureServiceResponse);

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

    it("should create a feature service in a particular folder", done => {
      fetchMock
        .mock("end:createService", FeatureServiceResponse, {});
      const folderId = "83216cba44bf4357bf06687ec88a847b";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(
          response => {
            expect(fetchMock.called("end:createService")).toEqual(true);

            // Check create service call
            const [urlCreate, optionsCreate]: fetchMock.MockCall = fetchMock.lastCall("end:createService");
            expect(urlCreate).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/83216cba44bf4357bf06687ec88a847b/createService"
            );
            expect(optionsCreate.method).toBe("POST");
            expect(optionsCreate.body).toContain("f=json");
            expect(optionsCreate.body).toContain(
              encodeParam(
                "createParameters",
                JSON.stringify(serviceDescription)
              )
            );
            expect(optionsCreate.body).toContain("outputType=featureService");
            expect(optionsCreate.body).toContain(
              encodeParam("token", "fake-token")
            );

            // Check response
            expect(response).toEqual(FeatureServiceResponse);

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

    it("should fail to create a feature service destined for a particular folder with success=false", done => {
      fetchMock.mock("end:createService", { success: false });

      const folderId = "83216cba44bf4357bf06687ec88a847b";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(e => {
          expect(fetchMock.called("end:createService")).toEqual(true);

          // Check create service call
          const [urlCreate, optionsCreate]: fetchMock.MockCall = fetchMock.lastCall("end:createService");
          expect(urlCreate).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/83216cba44bf4357bf06687ec88a847b/createService"
          );
          expect(optionsCreate.method).toBe("POST");
          expect(optionsCreate.body).toContain("f=json");
          expect(optionsCreate.body).toContain(
            encodeParam("createParameters", JSON.stringify(serviceDescription))
          );
          expect(optionsCreate.body).toContain("outputType=featureService");
          expect(optionsCreate.body).toContain(
            encodeParam("token", "fake-token")
          );
          expect(e.success).toBeFalsy();
          done();
        })
      .catch(() => fail());
    });
  });
});
