/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { updateServiceDefinition } from "../src/updateServiceDefinition.js";
import { UpdateServiceDefinitionSuccess } from "./mocks/service.js";

describe("update service definition", () => {
  afterEach(fetchMock.restore);

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

    const updateDefinition = {
      capabilities: "Create,Update"
    };

    it("should update feature service defintion", (done) => {
      fetchMock.once("*", UpdateServiceDefinitionSuccess);

      updateServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          updateDefinition,
          ...MOCK_USER_REQOPTS
        }
      )
        .then((response) => {
          // Check service call
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");

          expect(url).toEqual(
            "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/updateDefinition"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(
            encodeParam("updateDefinition", JSON.stringify(updateDefinition))
          );

          // Check response
          expect(response).toEqual(UpdateServiceDefinitionSuccess);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
    it("should update feature service defintion (params.updateDefinition)", (done) => {
      fetchMock.once("*", UpdateServiceDefinitionSuccess);

      updateServiceDefinition(
        "https://services1.arcgis.com/ORG/arcgis/rest/services/FEATURE_SERVICE/FeatureServer",
        {
          params: { updateDefinition },
          ...MOCK_USER_REQOPTS
        }
      )
        .then((response) => {
          // Check service call
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");

          expect(url).toEqual(
            "https://services1.arcgis.com/ORG/arcgis/rest/admin/services/FEATURE_SERVICE/FeatureServer/updateDefinition"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain("f=json");
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(
            encodeParam("updateDefinition", JSON.stringify(updateDefinition))
          );

          // Check response
          expect(response).toEqual(UpdateServiceDefinitionSuccess);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  }); // auth requests
});
