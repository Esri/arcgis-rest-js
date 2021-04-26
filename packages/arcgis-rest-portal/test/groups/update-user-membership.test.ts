/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";

import { MOCK_USER_SESSION } from "../mocks/sharing/sharing";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { updateUserMemberships } from "../../src/groups/update-user-membership";

describe("udpate-user-membership", () => {
  beforeEach(done => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: "jsmith"
    });

    // make sure session doesnt cache metadata
    MOCK_USER_SESSION.refreshSession()
      .then(() => done())
      .catch();
  });

  afterEach(fetchMock.restore);

  it("converts member to admin", done => {
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers",
      { results: [{ username: "casey", success: true }] }
    );
    return updateUserMemberships({
      authentication: MOCK_USER_SESSION,
      id: "3ef",
      users: ["larry", "curly", "moe"],
      newMemberType: "admin"
    }).then(() => {
      const opts: RequestInit = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers"
      );
      expect(opts.body).toContain("admins=larry%2Ccurly%2Cmoe");
      done();
    });
  });
  it("converts admin to member", done => {
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers",
      { results: [{ username: "casey", success: true }] }
    );
    return updateUserMemberships({
      authentication: MOCK_USER_SESSION,
      id: "3ef",
      users: ["larry", "curly", "moe"],
      newMemberType: "member"
    }).then(() => {
      const opts: RequestInit = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers"
      );
      expect(opts.body).toContain("users=larry%2Ccurly%2Cmoe");
      done();
    });
  });
});
