/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { updateUser, IUpdateUserResponse } from "../../src/users/update";
import { encodeParam } from "@esri/arcgis-rest-request/src";
import { UserSession } from "@esri/arcgis-rest-auth/src";
import * as fetchMock from "fetch-mock";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("updateUser", () => {
  afterEach(fetchMock.restore);

  const session = new UserSession({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  it("should make an authenticated request to update the same user profile.", done => {
    fetchMock.once("*", {
      success: true,
      username: "c@sey"
    } as IUpdateUserResponse);

    updateUser({
      authentication: session,
      user: { description: "destroyer of worlds" }
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/update"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=fake-token");
        expect(options.body).toContain(
          encodeParam("description", "destroyer of worlds")
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make an authenticated request to update the same user profile and mixin custom params.", done => {
    fetchMock.once("*", {
      success: true,
      username: "c@sey"
    } as IUpdateUserResponse);

    updateUser({
      authentication: session,
      user: { description: "destroyer of worlds" },
      params: { foo: "bar" }
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/update"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=fake-token");
        expect(options.body).toContain("foo=bar");
        expect(options.body).toContain(
          encodeParam("description", "destroyer of worlds")
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should make an org administrator authenticated request to update a different user.", done => {
    fetchMock.once("*", {
      success: true,
      username: "jsmith"
    } as IUpdateUserResponse);

    updateUser({
      authentication: session,
      user: { username: "jsmith", description: "something different" }
    })
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith/update"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=fake-token");
        expect(options.body).toContain(
          encodeParam("description", "something different")
        );
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw an error when the authenticated user doesnt have permission to update the user profile in question.", done => {
    fetchMock.once("*", {
      error: {
        code: 403,
        messageCode: "GWM_0003",
        message:
          "You do not have permissions to access this resource or perform this operation.",
        details: []
      }
    });

    updateUser({
      authentication: session,
      user: { username: "fake", description: "real" }
    })
      .then(() => {
        fail();
      })
      .catch(e => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/fake/update"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=fake-token");
        expect(options.body).toContain(encodeParam("description", "real"));
        expect(e.name).toBe("ArcGISAuthError");
        expect(e.code).toBe("GWM_0003");
        expect(e.originalMessage).toBe(
          "You do not have permissions to access this resource or perform this operation."
        );
        done();
      });
  });
});
