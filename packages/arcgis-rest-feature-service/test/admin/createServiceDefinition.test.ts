/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { createFeatureService } from "../../src/admin/createServiceDefinition";

import { FeatureServiceResponse } from "../mocks/service";
import { MoveToFolderResponse } from "../mocks/move";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { encodeParam } from "@esri/arcgis-rest-request";

describe("create feature service", () => {
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
            expect(fetchMock.called("end:move")).toEqual(false);

            // Check create service call
            const [urlCreate, optionsCreate]: [
              string,
              RequestInit
            ] = fetchMock.lastCall("end:createService");
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
            expect(fetchMock.called("end:move")).toEqual(false);

            // Check create service call
            const [urlCreate, optionsCreate]: [
              string,
              RequestInit
            ] = fetchMock.lastCall("end:createService");
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
            expect(fetchMock.called("end:move")).toEqual(false);

            // Check create service call
            const [urlCreate, optionsCreate]: [
              string,
              RequestInit
            ] = fetchMock.lastCall("end:createService");
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
        .mock("end:createService", FeatureServiceResponse, {})
        .mock("end:move", MoveToFolderResponse, {});
      const folderId = "83216cba44bf4357bf06687ec88a847b";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(
          response => {
            expect(fetchMock.called("end:createService")).toEqual(true);
            expect(fetchMock.called("end:move")).toEqual(true);

            // Check create service call
            const [urlCreate, optionsCreate]: [
              string,
              RequestInit
            ] = fetchMock.lastCall("end:createService");
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

            // Because the service is created in the root folder, the API follows it with a move call
            const [urlMove, optionsMove]: [
              string,
              RequestInit
            ] = fetchMock.lastCall("end:move");
            expect(urlMove).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/" +
                response.serviceItemId +
                "/move"
            );
            expect(optionsMove.method).toBe("POST");
            expect(optionsMove.body).toContain("folder=" + folderId);
            expect(optionsMove.body).toContain("f=json");
            expect(optionsMove.body).toContain(
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
        .then(() => fail())
        .catch(e => {
          expect(fetchMock.called("end:createService")).toEqual(true);
          expect(fetchMock.called("end:move")).toEqual(false);

          // Check create service call
          const [urlCreate, optionsCreate]: [
            string,
            RequestInit
          ] = fetchMock.lastCall("end:createService");
          expect(urlCreate).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createService"
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
          expect(e.message).toEqual(
            `A problem was encountered when trying to create the service.`
          );
          done();
        });
    });

    it("should fail to create a feature service destined for a particular folder with success=false (for the move)", done => {
      fetchMock.mock("end:createService", FeatureServiceResponse, {});
      fetchMock.mock("end:move", { success: false });
      const folderId = "83216cba44bf4357bf06687ec88a847b";

      createFeatureService({
        item: serviceDescription,
        folderId,
        ...MOCK_USER_REQOPTS
      })
        .then(() => fail())
        .catch(e => {
          expect(fetchMock.called("end:createService")).toEqual(true);
          expect(fetchMock.called("end:move")).toEqual(true);

          // Check create service call
          const [urlCreate, optionsCreate]: [
            string,
            RequestInit
          ] = fetchMock.lastCall("end:createService");
          expect(urlCreate).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/createService"
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

          // Because the service is created in the root folder, the API follows it with a move call
          const [urlMove, optionsMove]: [
            string,
            RequestInit
          ] = fetchMock.lastCall("end:move");
          expect(urlMove).toEqual(
            `https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/${
              FeatureServiceResponse.serviceItemId
            }/move`
          );
          expect(optionsMove.method).toBe("POST");
          expect(optionsMove.body).toContain("folder=" + folderId);
          expect(optionsMove.body).toContain("f=json");
          expect(optionsMove.body).toContain(
            encodeParam("token", "fake-token")
          );

          expect(e.message).toEqual(
            `A problem was encountered when trying to move the service to a different folder.`
          );
          done();
        });
    });
  });
});
