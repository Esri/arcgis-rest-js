/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import {
  shareItemWithGroup,
  unshareItemWithGroup
} from "../../src/sharing/group-sharing";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

import {
  AnonUserResponse,
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse
} from "../mocks/users/user";

import { SearchResponse } from "../mocks/items/search";

const SharingResponse = {
  notSharedWith: [] as any,
  itemId: "n3v"
};

const FailedSharingResponse = {
  notSharedWith: ["t6b"],
  itemId: "n3v"
};

const UnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "a5b"
};

const CachedSharingResponse = {
  notSharedWith: [] as any,
  itemId: "a5b",
  shortcut: true
};

const CachedUnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "n3v",
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

  afterEach(() => fetchMock.restore());
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
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
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
    it("should throw is owner is not member of the group", done => {
      // this is used when isOrgAdmin is called...
      fetchMock
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
          OrgAdminUserResponse
        )
        .once(
          "https://myorg.maps.arcgis.com/sharing/rest/search",
          SearchResponse
        )
        .get(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
          GroupNonMemberResponse
        );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b"
      }).catch(e => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(e.message).toBe(
          "This item can not be shared by jsmith as they are not a member of the specified group t6b."
        );
        done();
      });
    });

    it("should fail to share an item with a group if the request is made by a non-org admin and non-group member", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupNonMemberUserResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/search",
        SearchResponse
      );

      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupNonMemberUserResponse
      );

      shareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b"
      }).catch(e => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        expect(e.message).toBe(
          "This item can not be shared by jsmith as they are not a member of the specified group t6b."
        );
        done();
      });
    });

    it("should share an item with a group by org administrator", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        OrgAdminUserResponse
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
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
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

    it("should fail unshare an item with a group by org administrator thats not a group member ", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        OrgAdminUserResponse
      );

      fetchMock.once("https://myorg.maps.arcgis.com/sharing/rest/search", {
        total: 1,
        results: [
          {
            id: "n3v"
          }
        ]
      });

      // called when we determine if the user is a member of the group
      fetchMock.get(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b?f=json&token=fake-token",
        GroupNonMemberResponse
      );
      unshareItemWithGroup({
        authentication: MOCK_USER_SESSION,
        id: "n3v",
        groupId: "t6b",
        owner: "vader"
      })
        .then(_ => {
          fail();
        })
        .catch(e => {
          expect(fetchMock.done()).toBeTruthy(
            "All fetchMocks should have been called"
          );
          expect(e.message).toBe(
            "This item can not be unshared from group t6b by jsmith as they not the item owner, group admin or group owner."
          );
          done();
        });
    });

    it("should share an item with a group by group owner/admin", done => {
      fetchMock.once(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
        GroupAdminUserResponse
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
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
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
          const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
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
          "This item can not be shared to shared editing group t6b by jsmith as they not the item owner."
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
          const addUsersOptions: fetchMock.MockOptions = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: fetchMock.MockOptions = fetchMock.lastOptions(
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
          const addUsersOptions: fetchMock.MockOptions = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/addUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: fetchMock.MockOptions = fetchMock.lastOptions(
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
          const addUsersOptions: fetchMock.MockOptions = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          // verify we shared the item
          const shareOptions: fetchMock.MockOptions = fetchMock.lastOptions(
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
          const shareOptions: fetchMock.MockOptions = fetchMock.lastOptions(
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
          const addUsersOptions: fetchMock.MockOptions = fetchMock.lastOptions(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/t6b/updateUsers"
          );
          expect(addUsersOptions.body).toContain("admins=casey");
          expect(e.message).toBe(
            "Error adding user casey to group t6b. Consequently item n3v was not shared to the group."
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
  });
});

describe("unshareItemWithGroup() ::", () => {
  // make sure session doesnt cache metadata
  beforeEach(done => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: " jsmith"
    });

    // make sure session doesnt cache metadata
    MOCK_USER_SESSION.refreshSession()
      .then(() => done())
      .catch();
  });

  afterEach(() => fetchMock.restore());

  it("should unshare an item with a group by owner", done => {
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b"
    })
      .then(response => {
        const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare"
        );
        expect(url).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
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

  it("should unshare an item with a group by org administrator", done => {
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
        );
        expect(url).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=t6b");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should unshare an item with a group by group admin", done => {
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "otherguy"
    })
      .then(response => {
        const [url, options]: fetchMock.MockCall = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
        );
        expect(url).toBe(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=t6b");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should shortcircuit share if an item was previously unshared with a group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    })
      .then(response => {
        // no web request to unshare at all
        expect(response).toEqual(CachedUnsharingResponse);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  // this one
  it("should throw if the person trying to unshare doesnt own the item, is not an admin or member of said group", done => {
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "jones"
    }).catch(e => {
      expect(e.message).toContain(
        "This item can not be unshared by jsmith as they are not a member of the specified group t6b."
      );
      done();
    });
  });
});
