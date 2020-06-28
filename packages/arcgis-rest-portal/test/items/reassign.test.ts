/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { reassignItem } from "../../src/items/reassign";

import { UserSession } from "@esri/arcgis-rest-auth";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import {
  GroupMemberUserResponse,
  OrgAdminUserResponse
} from "../mocks/users/user";

describe("reassignItem", () => {
  afterEach(fetchMock.restore);

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

  it("shoulds throw if not authd as org_admin", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
      GroupMemberUserResponse
    );
    reassignItem({
      id: "3ef",
      currentOwner: "alex",
      targetUsername: "blake",
      authentication: MOCK_USER_SESSION
    }).catch(e => {
      expect(e.message).toBe(
        "Item 3ef can not be reassigned because current user is not an organization administrator."
      );
      done();
    });
  });

  it("should send the folder if passed", done => {
    fetchMock
      .once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
        OrgAdminUserResponse
      )
      .once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign",
        { success: true, itemId: "3ef" }
      );
    reassignItem({
      id: "3ef",
      currentOwner: "alex",
      targetUsername: "blake",
      targetFolderName: "folder1",
      authentication: MOCK_USER_SESSION
    })
      .then(resp => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(resp.success).toBe(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign"
        );
        expect(url).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("targetUsername=blake");
        expect(options.body).toContain("targetFolderName=folder1");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should not send the folder if not passed", done => {
    fetchMock
      .once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
        OrgAdminUserResponse
      )
      .once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign",
        { success: true, itemId: "3ef" }
      );
    reassignItem({
      id: "3ef",
      currentOwner: "alex",
      targetUsername: "blake",
      authentication: MOCK_USER_SESSION
    })
      .then(resp => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(resp.success).toBe(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign"
        );
        expect(url).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/alex/items/3ef/reassign"
        );
        expect(options.method).toBe("POST");
        expect(options.body).toContain("targetUsername=blake");
        expect(options.body).not.toContain("targetFolderName");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
