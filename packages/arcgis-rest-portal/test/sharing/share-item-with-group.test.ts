/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { shareItemWithGroup, ensureMembership } from "../../src/sharing/share-item-with-group";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";
import { ArcGISAuthError } from "@esri/arcgis-rest-request";

import {
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse,
  AnonUserResponse
} from "../mocks/users/user";

import { SearchResponse } from "../mocks/items/search";
import { ISharingResponse } from "../../src/sharing/helpers";

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
  describe("share item as owner::", () => {
    it("should share an item with a group by owner", done => {
      // this is used when isOrgAdmin is called...
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupMemberUserResponse
      );
      // this is called when we try to determine if the item is already in the group
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupOwnerResponse
      );

      // the actual sharing request
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share",
        SharingResponse
      );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b"
      })
        .then(response => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share"
          );
          expect(url).toBe(
            "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share"
          );
          expect(options.method).toBe("POST");
          expect(response).toEqual(SharingResponse);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("groups=t6b");
          done();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          fail(e);
        });
    });

    it("should share an item with a group by org administrator", done => {
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
        "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
        SharingResponse
      );
      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      })
        .then(response => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(url).toBe(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(options.method).toBe("POST");
          expect(response).toEqual(SharingResponse);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("groups=t6b");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should share an item with a group by group owner/admin", done => {
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

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "otherguy"
      })
        .then(response => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(url).toBe(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(options.method).toBe("POST");
          expect(response).toEqual(SharingResponse);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("groups=t6b");
          done();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          fail(e);
        });
    });

    it("should mock the response if an item was previously shared with a group", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupAdminUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "a5b",
        groupId: "t6b"
      })
        .then(response => {
          // no web request to share at all
          expect(response).toEqual(CachedSharingResponse);
          done();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          fail(e);
        });
    });

    it("should allow group owner/admin/member to share item they do not own", done => {
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

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey"
      })
        .then(response => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const [url, options]: [string, RequestInit] = fetchMock.lastCall(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(url).toBe(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(options.method).toBe("POST");
          expect(response).toEqual(SharingResponse);
          expect(options.body).toContain("f=json");
          expect(options.body).toContain("groups=t6b");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should throw if non-owner tries to share to shared editing group", done => {
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

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      }).catch(e => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(e.message).toContain(
          "This item can not be shared to shared editing group t6b by jsmith as they not the item owner or org admin."
        );
        done();
      });
    });

    it("should throw if the response from the server is fishy", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupMemberUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share",
        FailedSharingResponse
      );

      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupMemberResponse
      );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b"
      }).catch(e => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(e.message).toBe("Item n3v could not be shared to group t6b.");
        done();
      });
    });
  });

  describe("share item as org admin on behalf of other user ::", () => {
    it("should add user to group then share item", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          // verify we added casey to t6b
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");

          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should add user to group the returned user lacks groups array", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          // verify we added casey to t6b
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");

          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should upgrade user to admin then share item", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          // verify we added casey to t6b
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");

          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should share item if user is already admin in group", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          // verify we shared the item
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");

          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should throw if we can not upgrade user membership", done => {
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

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          expect(e.message).toBe(
            "Error promoting user casey to admin in edit group t6b. Consequently item n3v was not shared to the group."
          );
          done();
        });
    });
    it("should throw if we cannot add the user as a group admin", done => {
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
          { errors: [new ArcGISAuthError('my error', 717)] }
        );

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          expect(e.message).toBe(
            "Error adding jsmith as member to edit group t6b. Consequently item n3v was not shared to the group."
          );
          done();
        });
    });
    it("should throw when a non org admin, non group member attempts to share a view group", done => {
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

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: false
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          expect(e.message).toBe(
            "This item can not be shared by jsmith as they are not a member of the specified group t6b."
          );
          done();
        });
    });
    it("should throw if owner is in other org", done => {
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

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );

          expect(e.message).toBe(
            "User casey is not a member of the same org as jsmith. Consequently they can not be added added to group t6b nor can item n3v be shared to the group."
          );
          done();
        });
    });
    it("should throw if owner has > 511 groups", done => {
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

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );

          expect(e.message).toBe(
            "User casey already has 512 groups, and can not be added to group t6b. Consequently item n3v can not be shared to the group."
          );
          done();
        });
    });

    it("should throw when updateUserMemberships fails", done => {
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

      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(() => {
          expect("").toBe("Should Throw, but it returned");
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          expect(e.message).toBe(
            "Error promoting user casey to admin in edit group t6b. Consequently item n3v was not shared to the group."
          );
          done();
        });
    });

    it("should add the admin user as a member, share the item, then remove the admin from the group", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "nv3" }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/removeUsers",
          { notRemoved: [] }
        );
  
      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");
  
          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should add the admin user as a member, share the item, then suppress any removeUser errors", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "nv3" }
        )
        .post(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/removeUsers",
          { throws: true }
        );
  
      return shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");
  
          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should upgrade user to group admin, add admin as member, then share item, then remove admin user", done => {
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
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share",
          { notSharedWith: [], itemId: "n3v" }
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "casey",
        confirmItemControl: true
      })
        .then(result => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          // verify we added casey to t6b
          const addUsersOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: RequestInit = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/content/items/n3v/share"
          );
          expect(shareOptions.body).toContain("groups=t6b");
          expect(shareOptions.body).toContain("confirmItemControl=true");

          done();
        })
        .catch(e => {
          fail();
        });
    });
  });
  describe("ensureMembership", function () {
    it("should revert the user promotion and suppress resolved error", done => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "jsmith", success: true }] }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "jsmith", success: false }] }
        );
      const { revert } = ensureMembership(
        GroupAdminUserResponse,
        GroupMemberUserResponse,
        true,
        'some error message',
        {
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        }
      );
      revert({ notSharedWith: [] } as ISharingResponse)
        .then(() => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          done();
        })
        .catch(e => {
          fail();
        });
    });
    it("should revert the user promotion and suppress rejected error", done => {
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { results: [{ username: "jsmith", success: true }] }
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers",
          { throws: true }
        );
      const { revert } = ensureMembership(
        GroupAdminUserResponse,
        GroupMemberUserResponse,
        true,
        'some error message',
        {
          authentication: MOCK_USER_SESSION,
          id: "n3v",
          groupId: "t6b",
          owner: "casey",
          confirmItemControl: true
        }
      );
      revert({ notSharedWith: [] } as ISharingResponse)
        .then(() => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          done();
        })
        .catch(e => {
          fail();
        });
    });
  });
});
