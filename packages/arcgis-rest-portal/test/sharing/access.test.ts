/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { setItemAccess } from "../../src/sharing/access.js";
import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";
import { AnonUserResponse, OrgAdminUserResponse } from "../mocks/users/user.js";

const SharingResponse = {
  notSharedWith: [] as any,
  itemId: "abc123"
};

describe("setItemAccess()", () => {
  beforeEach(async () => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: "jsmith"
    });
    // make sure session doesnt cache metadata
    await MOCK_USER_SESSION.refreshCredentials();
  });

  afterEach(() => {
    fetchMock.restore();
  });
  test("should share an item with everyone", async () => {
    fetchMock.once("*", SharingResponse, { overwriteRoutes: true });
    const response = await setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "public"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("everyone=true");
    expect(options.body).toContain("account=true");
  });

  test("should share an item with an organization", async () => {
    fetchMock.once("*", SharingResponse);
    const response = await setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "org"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("everyone=false");
    expect(options.body).toContain("org=true");
  });

  test("should stop sharing an item entirely", async () => {
    fetchMock.once("*", SharingResponse);
    const response = await setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "private"
    });
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("everyone=false");
    expect(options.body).toContain("org=false");
    expect(options.body).toContain("groups=");
  });

  test("should share another persons item if an org admin makes the request", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/self?f=json&token=fake-token",
      OrgAdminUserResponse
    );
    fetchMock.once(
      "begin:https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share",
      SharingResponse
    );
    const response = await setItemAccess({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      access: "private",
      owner: "casey"
    });
    const [url, options] = fetchMock.lastCall();
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(SharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("everyone=false");
    expect(options.body).toContain("org=false");
    expect(options.body).toContain("groups=");
  });

  test("should throw if the person trying to share doesnt own the item and is not an admin", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/self?f=json&token=fake-token",
      AnonUserResponse
    );
    await expect(
      setItemAccess({
        authentication: MOCK_USER_SESSION,
        id: "abc123",
        access: "private",
        owner: "casey"
      })
    ).rejects.toThrow(
      "This item can not be shared by jsmith. They are neither the item owner nor an organization admin."
    );
  });
});
