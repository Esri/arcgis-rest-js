/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { joinGroup, leaveGroup } from "../../src/groups/join";

import { GroupEditResponse } from "../mocks/groups/responses";

import { encodeParam } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(() => fetchMock.restore());

  describe("authenticted methods", () => {
    const MOCK_REQOPTS = {
      authentication: new UserSession({
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
      })
    };

    it("should help a user join a group", done => {
      fetchMock.once("*", GroupEditResponse);

      joinGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/join"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should help a user leave a group", done => {
      fetchMock.once("*", GroupEditResponse);

      leaveGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/leave"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
