/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import {
  inviteGroupUsers,
  IInviteGroupUsersOptions
} from "../../src/groups/invite-users.js";

import { encodeParam, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

function createUsernames(start: number, end: number): string[] {
  const usernames = [];

  for (let i = start; i < end; i++) {
    usernames.push(`username${i}`);
  }

  return usernames;
}

describe("invite-users", () => {
  const MOCK_AUTH = new ArcGISIdentityManager({
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

  afterEach(() => {
    fetchMock.restore();
  });
  test("should send multiple requests for a long user array", async () => {
    const requests = [createUsernames(0, 25), createUsernames(25, 35)];
    const responses = [{ success: true }, { success: false }];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/invite"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(encodeParam("role", "group_member"));
      expect(options.body).toContain(encodeParam("expiration", 1440));
      expect(options.body).toContain(
        encodeParam("users", requests.shift().join(","))
      );
      return responses.shift();
    });

    const params: IInviteGroupUsersOptions = {
      id: "group-id",
      users: createUsernames(0, 35),
      role: "group_member",
      expiration: 1440,
      authentication: MOCK_AUTH
    };

    const result = await inviteGroupUsers(params);
    expect(requests.length).toEqual(0);
    expect(responses.length).toEqual(0);
    expect(result.success).toEqual(false);
    expect(result.errors).toBeUndefined();
  });

  test("should return request failure", async () => {
    const responses = [
      { success: true },
      {
        error: {
          code: 400,
          messageCode: "ORG_3100",
          message: "error message for add-user request"
        }
      }
    ];

    fetchMock.post("*", (url, options) => {
      return responses.shift();
    });

    const params: IInviteGroupUsersOptions = {
      id: "group-id",
      users: createUsernames(0, 30),
      role: "group_member",
      expiration: 1440,
      authentication: MOCK_AUTH
    };

    const result = await inviteGroupUsers(params);
    expect(responses.length).toEqual(0);
    expect(result.success).toEqual(false);
    expect(result.errors.length).toEqual(1);
    const errorA = result.errors[0];
    expect(errorA.url).toEqual(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/invite"
    );
    expect(errorA.code).toEqual("ORG_3100");
    expect(errorA.originalMessage).toEqual(
      "error message for add-user request"
    );
    const errorAOptions: any = errorA.options;
    expect(errorAOptions.params.users).toEqual(createUsernames(25, 30));
  });

  test("should not send any request for zero-length username array", async () => {
    const params: IInviteGroupUsersOptions = {
      id: "group-id",
      role: "group_member",
      expiration: 1440,
      users: [],
      authentication: MOCK_AUTH
    };
    fetchMock.post("*", () => 200);
    const result = await inviteGroupUsers(params);
    expect(fetchMock.called()).toEqual(false);
    expect(result.success).toEqual(true);
    expect(result.errors).toBeUndefined();
  });
});
