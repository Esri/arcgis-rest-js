/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { commitItem } from "../../src/items/commit";
import { ItemSuccessResponse } from "../mocks/items/item";
import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

describe("search", () => {
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

    it("should commit the item upload", done => {
      fetchMock.once("*", ItemSuccessResponse);

      commitItem({
        id: "3ef",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/3ef/commit"
          );
          expect(options.method).toBe("POST");

          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");

          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should commit the item upload for the other owner", done => {
      fetchMock.once("*", ItemSuccessResponse);

      commitItem({
        id: "3ef",
        owner: "fanny",
        ...MOCK_USER_REQOPTS
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/fanny/items/3ef/commit"
          );
          expect(options.method).toBe("POST");

          expect(options.body).toContain("f=json");
          expect(options.body).toContain("token=fake-token");

          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});