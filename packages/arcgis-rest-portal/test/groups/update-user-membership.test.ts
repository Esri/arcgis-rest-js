/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, beforeEach, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";
import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { updateUserMemberships } from "../../src/groups/update-user-membership.js";

describe("udpate-user-membership", () => {
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

  test("converts member to admin", async () => {
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers",
      { results: [{ username: "casey", success: true }] }
    );

    await updateUserMemberships({
      authentication: MOCK_USER_SESSION,
      id: "3ef",
      users: ["larry", "curly", "moe"],
      newMemberType: "admin"
    } as any);
    const opts = fetchMock.lastOptions(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers"
    );
    expect(opts.body).toContain("admins=larry%2Ccurly%2Cmoe");
  });

  test("converts admin to member", async () => {
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers",
      { results: [{ username: "casey", success: true }] }
    );

    await updateUserMemberships({
      authentication: MOCK_USER_SESSION,
      id: "3ef",
      users: ["larry", "curly", "moe"],
      newMemberType: "member"
    });
    const opts = fetchMock.lastOptions(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/updateUsers"
    );
    expect(opts.body).toContain("users=larry%2Ccurly%2Cmoe");
  });
});
