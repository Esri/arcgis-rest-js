/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { beforeEach, describe, expect, test, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { SearchResponse } from "../mocks/items/search.js";
import { ISharingResponse } from "../../src/sharing/helpers.js";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";
import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { ArcGISAuthError } from "@esri/arcgis-rest-request";
import {
  shareItemWithGroup,
  ensureMembership
} from "../../src/sharing/share-item-with-group.js";
import {
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse,
  AnonUserResponse
} from "../mocks/users/user.js";

const SharingResponse = {
  notSharedWith: [] as any,
  itemId: "n3v"
};

const FailedSharingResponse = {
  notSharedWith: ["t6b"],
  itemId: "n3v"
};

const CachedSharingResponse = {
  notSharedWith: [] as any,
  itemId: "a5b",
  shortcut: true
};

const NoResultsSearchResponse = {
  query: "",
  total: 0,
  start: 0,
  num: 0,
  nextStart: 0,
  results: [] as any
};

export const GroupOwnerResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "owner"
  }
};

export const GroupMemberResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "member"
  }
};

export const GroupNonMemberResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "none"
  }
};

export const GroupAdminResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "admin"
  }
};

export const GroupNoAccessResponse = {
  error: {
    code: 400,
    messageCode: "COM_0003",
    message: "Group does not exist or is inaccessible.",
    details: [] as any[]
  }
};

describe("shareItemWithGroup() ::", () => {
  // make sure session doesnt cache metadata
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

  describe("share item as owner::", () => {
    test("should share an item with a group by owner", async () => {
      // this is called when we try to determine if the item is already in the group
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      // the actual sharing request
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share",
        SharingResponse
      );

      const response = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b"
      });
      expect(fetchMock.done()).toBe(true);
      const [url, options] = fetchMock.lastCall(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share"
      );
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share"
      );
      expect(options.method).toBe("POST");
      expect(response).toEqual(SharingResponse);
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("groups=t6b");
    });

    test("should share an item with a group by org administrator", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        OrgAdminUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
        {
          username: "casey",
          orgId: "qWAReEOCnD7eTxOe",
          groups: [] as any[]
        }
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        NoResultsSearchResponse
      );

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupOwnerResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
        SharingResponse
      );
      const response = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      });
      expect(fetchMock.done()).toBe(true);
      const [url, options] = fetchMock.lastCall(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(options.method).toBe("POST");
      expect(response).toEqual(SharingResponse);
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("groups=t6b");
    });

    test("should share an item with a group by group owner/admin", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupAdminUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/otherguy?f=json&token=fake-token",
        {
          username: "otherguy",
          orgId: "qWAReEOCnD7eTxOe",
          groups: [] as any[]
        }
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupOwnerResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
        SharingResponse
      );

      const response = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "otherguy"
      });
      expect(fetchMock.done()).toBe(true);
      const [url, options] = fetchMock.lastCall(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
      );
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
      );
      expect(options.method).toBe("POST");
      expect(response).toEqual(SharingResponse);
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("groups=t6b");
    });

    test("should mock the response if an item was previously shared with a group", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupAdminUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      const response = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "a5b",
        groupId: "t6b"
      });
      // no web request to share at all
      expect(response).toEqual(CachedSharingResponse);
    });

    test("should allow group owner/admin/member to share item they do not own", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupMemberUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
        {
          username: "casey",
          orgId: "qWAReEOCnD7eTxOe",
          groups: [] as any[]
        }
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupMemberResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
        SharingResponse
      );

      const response = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      });
      expect(fetchMock.done()).toBe(true);
      const [url, options] = fetchMock.lastCall(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
      );
      expect(url).toBe(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
      );
      expect(options.method).toBe("POST");
      expect(response).toEqual(SharingResponse);
      expect(options.body).toContain("f=json");
      expect(options.body).toContain("groups=t6b");
    });

    test("should throw if non-owner tries to share to shared editing group", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupMemberUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
        {
          username: "casey",
          orgId: "qWAReEOCnD7eTxOe",
          groups: [] as any[]
        }
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupMemberResponse
      );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "This item can not be shared to shared editing group t6b by jsmith as they not the item owner or org admin."
      );
      expect(fetchMock.done()).toBe(true);
    });

    test("should throw if the response from the server is fishy", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share",
        FailedSharingResponse
      );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b"
        })
      ).rejects.toThrow("Item n3v could not be shared to group t6b.");
      expect(fetchMock.done()).toBe(true);
    });
  });

  describe("share item as org admin on behalf of other user ::", () => {
    test("should add user to group then share item", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers",
          { notAdded: [] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      // verify we added casey to t6b
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should add user to group the returned user lacks groups array", async () => {
      // tbh, not 100% sure this can even happen, but... 100% coverage
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe"
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers",
          { notAdded: [] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      // verify we added casey to t6b
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should upgrade user to admin then share item", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "member"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "casey", success: true }] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      // verify we added casey to t6b
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should share item if user is already admin in group", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "admin"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should throw if we can not upgrade user membership", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "member"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "casey", success: false }] }
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "Error promoting user casey to admin in edit group t6b. Consequently item n3v was not shared to the group."
      );

      expect(fetchMock.done()).toBe(true);
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
    });

    test("should throw if we cannot add the user as a group admin", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            groups: []
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "admin"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers",
          { errors: [new ArcGISAuthError("my error", 717)] }
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "Error adding jsmith as member to edit group t6b. Consequently item n3v was not shared to the group."
      );

      expect(fetchMock.done()).toBe(true);
    });

    test("should throw when a non org admin, non group member attempts to share a view group", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          { ...AnonUserResponse, orgId: "qWAReEOCnD7eTxOe" }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "member"
                }
              }
            ] as any[]
          }
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: false
        })
      ).rejects.toThrow(
        "This item can not be shared by jsmith as they are not a member of the specified group t6b."
      );

      expect(fetchMock.done()).toBe(true);
    });

    test("should throw if owner is in other org", async () => {
      fetchMock
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "some-other-org",
            groups: [] as any[]
          }
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "User casey is not a member of the same org as jsmith. Consequently they can not be added added to group t6b nor can item n3v be shared to the group."
      );
      expect(fetchMock.done()).toBe(true);
    });

    test("should throw if owner has > 511 groups", async () => {
      const caseyUser = {
        username: "casey",
        orgId: "qWAReEOCnD7eTxOe",
        groups: new Array(512)
      };
      caseyUser.groups.fill({ id: "not-real-group" });
      fetchMock
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          caseyUser
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "User casey already has 512 groups, and can not be added to group t6b. Consequently item n3v can not be shared to the group."
      );
      expect(fetchMock.done()).toBe(true);
    });

    test("should throw when updateUserMemberships fails", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "member"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { throws: true }
        );

      await expect(
        shareItemWithGroup({
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        })
      ).rejects.toThrow(
        "Error promoting user casey to admin in edit group t6b. Consequently item n3v was not shared to the group."
      );
      expect(fetchMock.done()).toBe(true);
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
    });

    test("should add the admin user as a member, share the item, then remove the admin from the group", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            groups: []
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "admin"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers",
          { notAdded: [] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "nv3" }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/removeUsers",
          { notRemoved: [] }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should add the admin user as a member, share the item, then suppress any removeUser errors", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            groups: []
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "admin"
                }
              }
            ] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers",
          { notAdded: [] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "nv3" }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/removeUsers",
          { throws: true }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });

    test("should upgrade user to group admin, add admin as member, then share item, then remove admin user", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            groups: [
              {
                ...OrgAdminUserResponse.groups[0],
                userMembership: {
                  ...OrgAdminUserResponse.groups[0].userMembership,
                  memberType: "member"
                }
              }
            ]
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [
              {
                id: "t6b",
                userMembership: {
                  memberType: "member"
                }
              }
            ] as any[]
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "casey", success: true }] }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      });
      expect(fetchMock.done()).toBe(true);
      // verify we added casey to t6b
      const addUsersOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
      );
      expect(addUsersOptions.body).toContain("admins=casey");
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
      expect(shareOptions.body).toContain("confirmItemControl=true");
    });
  });
  describe("ensureMembership", () => {
    test("should revert the user promotion and suppress resolved error", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
        { results: [{ username: "jsmith", success: true }] },
        { overwriteRoutes: true }
      );
      const { revert, promise } = ensureMembership(
        GroupAdminUserResponse,
        GroupMemberUserResponse,
        true,
        "some error message",
        {
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        }
      );

      await promise;
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
        { results: [{ username: "jsmith", success: false }] },
        { overwriteRoutes: true }
      );
      await revert({ notSharedWith: [] } as any);
      expect(fetchMock.done()).toBe(true);
    });

    test("should revert the user promotion and suppress error", async () => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
        { results: [{ username: "jsmith", success: true }] },
        { overwriteRoutes: true }
      );

      const { revert, promise } = ensureMembership(
        GroupAdminUserResponse,
        GroupMemberUserResponse,
        true,
        "some error message",
        {
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        }
      );

      await promise;
      await revert({ notSharedWith: [] } as ISharingResponse);
      expect(fetchMock.done()).toBe(true);
    });
  });
  describe("share item to admin user's favorites group ::", () => {
    test("should share item", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            favGroupId: "t6b"
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "qWAReEOCnD7eTxOe",
            groups: [] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      });
      expect(fetchMock.done()).toBe(true);
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
    });
  });
  describe("share item from another org to admin user's favorites group ::", () => {
    test("should share item", async () => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          {
            ...OrgAdminUserResponse,
            favGroupId: "t6b"
          }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          NoResultsSearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupOwnerResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/casey?f=json&token=fake-token",
          {
            username: "casey",
            orgId: "SOMEOTHERORG",
            groups: [] as any[]
          }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      const result = await shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      });
      expect(fetchMock.done()).toBe(true);
      // verify we shared the item
      const shareOptions = fetchMock.lastOptions(
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
      );
      expect(shareOptions.body).toContain("groups=t6b");
    });
  });
});
