/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { unshareItemWithGroup } from "../../src/sharing/unshare-item-with-group.js";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";
import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { SearchResponse } from "../mocks/items/search.js";
import {
  AnonUserResponse,
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse
} from "../mocks/users/user.js";

const UnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "a5b"
};

const CachedUnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "n3v",
  shortcut: true
};

export const GroupOwnerResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "owner"
  }
};

export const GroupAdminResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "admin"
  }
};

describe("unshareItemWithGroup() ::", () => {
  // make sure session doesnt cache metadata
  beforeEach(async () => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: " jsmith"
    });
    await MOCK_USER_SESSION.refreshCredentials();
  });

  afterEach(() => {
    fetchMock.restore();
  });
  test("should unshare an item with a group by owner", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare",
      UnsharingResponse
    );

    fetchMock.get(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
      GroupOwnerResponse
    );

    const response = await unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b"
    });
    const [url, options] = fetchMock.lastCall(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare"
    );
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(UnsharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("groups=t6b");
  });

  test("should unshare an item with a group by org administrator", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      OrgAdminUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare",
      UnsharingResponse
    );

    fetchMock.get(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
      GroupOwnerResponse
    );

    const response = await unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "casey"
    });
    const [url, options] = fetchMock.lastCall(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
    );
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(UnsharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("groups=t6b");
  });

  test("should unshare an item with a group by group admin", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupAdminUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare",
      UnsharingResponse
    );

    fetchMock.get(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
      GroupAdminResponse
    );

    const response = await unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "otherguy"
    });
    const [url, options] = fetchMock.lastCall(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
    );
    expect(url).toBe(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
    );
    expect(options.method).toBe("POST");
    expect(response).toEqual(UnsharingResponse);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("groups=t6b");
  });

  test("should shortcircuit share if an item was previously unshared with a group", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    const response = await unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    });
    // no web request to unshare at all
    expect(response).toEqual(CachedUnsharingResponse);
  });

  test("should throw if the person trying to unshare doesnt own the item, is not an admin or member of said group", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
      GroupNonMemberUserResponse
    );

    await expect(
      unshareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "a5b",
        groupId: "t6b",
        owner: "jones"
      })
    ).rejects.toThrow(
      "This item can not be unshared from group t6b by jsmith as they not the item owner, an org admin, group admin or group owner."
    );
  });

  test("should throw when notUnsharedFrom is not empty", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      OrgAdminUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
      GroupNonMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare",
      { ...UnsharingResponse, notUnsharedFrom: ["t6b"] }
    );

    await expect(
      unshareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "a5b",
        groupId: "t6b",
        owner: "jones"
      })
    ).rejects.toThrow("Item a5b could not be unshared to group t6b");
  });
});
