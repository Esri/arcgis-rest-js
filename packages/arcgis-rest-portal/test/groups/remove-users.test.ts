/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  removeGroupUsers,
  IRemoveGroupUsersOptions
} from "../../src/groups/remove-users";
import { UserSession } from "@esri/arcgis-rest-auth";
import { encodeParam } from "@esri/arcgis-rest-request";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import * as fetchMock from "fetch-mock";

function createUsernames(start: number, end: number): string[] {
  const usernames = [];

  for (let i = start; i < end; i++) {
    usernames.push(`username${i}`);
  }

  return usernames;
}

describe("remove-users", () => {
  const MOCK_AUTH = new UserSession({
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

  afterEach(fetchMock.restore);

  it("should send multiple requests for a long user array", done => {
    const requests = [createUsernames(0, 25), createUsernames(25, 35)];

    const responses = [
      { notRemoved: ["username1"] },
      { notRemoved: ["username30"] }
    ];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/removeUsers"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("users", requests.shift().join(","))
      );

      return responses.shift();
    });

    const params = {
      id: "group-id",
      users: createUsernames(0, 35),
      authentication: MOCK_AUTH
    };

    removeGroupUsers(params)
      .then(result => {
        expect(requests.length).toEqual(0);
        expect(responses.length).toEqual(0);
        expect(result.notRemoved).toEqual(["username1", "username30"]);
        expect(result.errors).toBeUndefined();
        done();
      })
      .catch(error => fail(error));
  });

  it("should return request failure", done => {
    const responses = [
      { notRemoved: ["username2"] },
      {
        error: {
          code: 400,
          messageCode: "ORG_3100",
          message: "error message for remove-user request"
        }
      }
    ];

    fetchMock.post("*", () => responses.shift());

    const params = {
      id: "group-id",
      users: createUsernames(0, 30),
      authentication: MOCK_AUTH
    };

    removeGroupUsers(params)
      .then(result => {
        expect(responses.length).toEqual(0);

        const expectedNotAdded = ["username2"];
        expect(result.notRemoved).toEqual(expectedNotAdded);

        expect(result.errors.length).toEqual(1);
        const errorA = result.errors[0];
        expect(errorA.url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/removeUsers"
        );
        expect(errorA.code).toEqual("ORG_3100");
        expect(errorA.originalMessage).toEqual(
          "error message for remove-user request"
        );

        const errorAOptions: any = errorA.options;
        expect(errorAOptions.users).toEqual(createUsernames(25, 30));

        done();
      })
      .catch(error => fail(error));
  });

  it("should not send any request for zero-length username array", done => {
    const params: IRemoveGroupUsersOptions = {
      id: "group-id",
      users: [],
      authentication: MOCK_AUTH
    };

    removeGroupUsers(params)
      .then(result => {
        expect(fetchMock.called()).toEqual(false);
        expect(result.notRemoved).toEqual([]);
        expect(result.errors).toBeUndefined();

        done();
      })
      .catch(error => fail(error));
  });
});
