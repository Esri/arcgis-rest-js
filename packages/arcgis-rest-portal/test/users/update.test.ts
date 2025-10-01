/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { updateUser, IUpdateUserResponse } from "../../src/users/update.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("updateUser", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  const session = new ArcGISIdentityManager({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  test("should make an authenticated request to update the same user profile.", async () => {
    fetchMock.once("*", {
      success: true,
      username: "c@sey"
    } as IUpdateUserResponse);

    await updateUser({
      authentication: session,
      user: { description: "destroyer of worlds" }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/update"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=fake-token");
    expect(options.body).toContain(
      encodeParam("description", "destroyer of worlds")
    );
  });

  test("should make an authenticated request to update the same user profile and mixin custom params.", async () => {
    fetchMock.once("*", {
      success: true,
      username: "c@sey"
    } as IUpdateUserResponse);

    await updateUser({
      authentication: session,
      user: { description: "destroyer of worlds" },
      params: { foo: "bar" }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
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
  });

  test("should make an org administrator authenticated request to update a different user.", async () => {
    fetchMock.once("*", {
      success: true,
      username: "jsmith"
    } as IUpdateUserResponse);

    await updateUser({
      authentication: session,
      user: { username: "jsmith", description: "something different" }
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith/update"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=fake-token");
    expect(options.body).toContain(
      encodeParam("description", "something different")
    );
  });

  test("should throw an error when the authenticated user doesnt have permission to update the user profile in question.", async () => {
    fetchMock.once("*", {
      error: {
        code: 403,
        messageCode: "GWM_0003",
        message:
          "You do not have permissions to access this resource or perform this operation.",
        details: []
      }
    });

    await expect(
      updateUser({
        authentication: session,
        user: { username: "fake", description: "real" }
      })
    ).rejects.toMatchObject({
      name: "ArcGISRequestError",
      code: "GWM_0003",
      originalMessage:
        "You do not have permissions to access this resource or perform this operation."
    });
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/fake/update"
    );
    expect(options.method).toBe("POST");
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=fake-token");
    expect(options.body).toContain(encodeParam("description", "real"));
  });
});
