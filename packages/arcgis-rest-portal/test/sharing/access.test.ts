/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { setItemAccess } from "../../src/sharing/access";
import * as fetchMock from "fetch-mock";

import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing";

import { AnonUserResponse, OrgAdminUserResponse } from "../mocks/users/user";

const SharingResponse = {
  notSharedWith: [] as any,
  itemId: "abc123"
};

describe("setItemAccess()", () => {
  beforeEach(done => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: " jsmith"
    });

    // make sure session doesnt cache metadata
    MOCK_USER_SESSION.refreshSession()
      .then(() => done())
      .catch();
  });

  afterEach(fetchMock.restore);

  it("should share an item with everyone", done => {
    fetchMock.once("*", SharingResponse);

    setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "public"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("everyone=true");
        expect(options.body).toContain("account=true");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should share an item with an organization", done => {
    fetchMock.once("*", SharingResponse);

    setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "org"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("everyone=false");
        expect(options.body).toContain("org=true");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should stop sharing an item entirely", done => {
    fetchMock.once("*", SharingResponse);

    setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "private"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("everyone=false");
        expect(options.body).toContain("org=false");
        expect(options.body).toContain("groups=");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should share another persons item if an org admin makes the request", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/self?f=json&token=fake-token",
      OrgAdminUserResponse
    );

    fetchMock.once(
      "begin:https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share",
      SharingResponse
    );

    setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "private",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall();
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("everyone=false");
        expect(options.body).toContain("org=false");
        expect(options.body).toContain("groups=");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw if the person trying to share doesnt own the item and is not an admin", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/self?f=json&token=fake-token",
      AnonUserResponse
    );

    setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "private",
      owner: "casey"
    }).catch(e => {
      expect(e.message).toEqual(
        "This item can not be shared by jsmith. They are neither the item owner nor an organization admin."
      );
      done();
    });
  });
});
