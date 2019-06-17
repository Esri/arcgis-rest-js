/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  addGroupUsers,
  IAddGroupUsersOptions
} from "../../src/groups/add-users";
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

describe("add-users", () => {
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
      { notAdded: ["username1"] },
      { notAdded: ["username30"] }
    ];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/addUsers"
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

    addGroupUsers(params)
      .then(result => {
        expect(requests.length).toEqual(0);
        expect(responses.length).toEqual(0);
        expect(result.notAdded).toEqual(["username1", "username30"]);
        expect(result.errors).toBeUndefined();
        done();
      })
      .catch(error => fail(error));
  });

  it("should send multiple requests for a long admin array", done => {
    const requests = [createUsernames(0, 25), createUsernames(25, 35)];

    const responses = [
      { notAdded: ["username1"] },
      { notAdded: ["username30"] }
    ];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/addUsers"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("admins", requests.shift().join(","))
      );

      return responses.shift();
    });

    const params = {
      id: "group-id",
      admins: createUsernames(0, 35),
      authentication: MOCK_AUTH
    };

    addGroupUsers(params)
      .then(result => {
        expect(requests.length).toEqual(0);
        expect(responses.length).toEqual(0);
        expect(result.notAdded).toEqual(["username1", "username30"]);
        expect(result.errors).toBeUndefined();
        done();
      })
      .catch(error => fail(error));
  });

  it("should send separate requests for users and admins", done => {
    const requests = [
      encodeParam("users", ["username1", "username2"]),
      encodeParam("admins", ["username3"])
    ];

    fetchMock.post("*", (url, options) => {
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/addUsers"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(requests.shift());

      return { notAdded: [] };
    });

    const params = {
      id: "group-id",
      users: ["username1", "username2"],
      admins: ["username3"],
      authentication: MOCK_AUTH
    };

    addGroupUsers(params)
      .then(result => {
        expect(requests.length).toEqual(0);
        expect(result.notAdded).toEqual([]);
        expect(result.errors).toBeUndefined();
        done();
      })
      .catch(error => fail(error));
  });

  it("should return request failure", done => {
    const responses = [
      { notAdded: ["username2"] },
      {
        error: {
          code: 400,
          messageCode: "ORG_3100",
          message: "error message for add-user request"
        }
      },
      { notAdded: ["username30"] },
      {
        error: {
          code: 400,
          messageCode: "ORG_3200",
          message: "error message for add-admin request"
        }
      }
    ];

    fetchMock.post("*", () => responses.shift());

    const params = {
      id: "group-id",
      users: createUsernames(0, 30),
      admins: createUsernames(30, 60),
      authentication: MOCK_AUTH
    };

    addGroupUsers(params)
      .then(result => {
        expect(responses.length).toEqual(0);

        const expectedNotAdded = ["username2"]
          .concat(createUsernames(25, 31))
          .concat(createUsernames(55, 60));
        expect(result.notAdded).toEqual(expectedNotAdded);

        expect(result.errors.length).toEqual(2);

        const errorA = result.errors[0];
        expect(errorA.url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/addUsers"
        );
        expect(errorA.code).toEqual("ORG_3100");
        expect(errorA.originalMessage).toEqual(
          "error message for add-user request"
        );

        const errorAOptions: any = errorA.options;
        expect(errorAOptions.users).toEqual(createUsernames(25, 30));
        expect(errorAOptions.admins).toBeUndefined();

        const errorB = result.errors[1];
        expect(errorB.url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/group-id/addUsers"
        );
        expect(errorB.code).toEqual("ORG_3200");
        expect(errorB.originalMessage).toEqual(
          "error message for add-admin request"
        );

        const errorBOptions: any = errorB.options;
        expect(errorBOptions.users).toBeUndefined();
        expect(errorBOptions.admins).toEqual(createUsernames(55, 60));

        done();
      })
      .catch(error => fail(error));
  });

  it("should not send any request for zero-length username array", done => {
    const params: IAddGroupUsersOptions = {
      id: "group-id",
      users: [],
      admins: [],
      authentication: MOCK_AUTH
    };

    addGroupUsers(params)
      .then(result => {
        expect(fetchMock.called()).toEqual(false);
        expect(result.notAdded).toEqual([]);
        expect(result.errors).toBeUndefined();

        done();
      })
      .catch(error => fail(error));
  });
});
