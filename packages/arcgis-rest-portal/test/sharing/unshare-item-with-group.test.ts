/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { unshareItemWithGroup } from "../../src/sharing/unshare-item-with-group";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing";
import { TOMORROW } from "@esri/arcgis-rest-auth/test/utils";

import {
  AnonUserResponse,
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse,
} from "../mocks/users/user";

import { SearchResponse } from "../mocks/items/search";

const UnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "a5b",
};

const CachedUnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "n3v",
  shortcut: true,
};

export const GroupOwnerResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "owner",
  },
};

export const GroupAdminResponse = {
  id: "tb6",
  title: "fake group",
  userMembership: {
    memberType: "admin",
  },
};

describe("unshareItemWithGroup() ::", () => {
  // make sure session doesnt cache metadata
  beforeEach((done) => {
    fetchMock.post("https://myorg.maps.arcgis.com/sharing/rest/generateToken", {
      token: "fake-token",
      expires: TOMORROW.getTime(),
      username: " jsmith",
    });

    // make sure session doesnt cache metadata
    MOCK_USER_SESSION.refreshSession()
      .then(() => done())
      .catch();
  });

  afterEach(fetchMock.restore);

  it("should unshare an item with a group by owner", (done) => {
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
      groupId: "t6b",
    })
      .then((response) => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
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
      .catch((e) => {
        expect(fetchMock.done()).toBeTruthy(
          "All fetchMocks should have been called"
        );
        fail(e);
      });
  });

  it("should unshare an item with a group by org administrator", (done) => {
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
      owner: "casey",
    })
      .then((response) => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
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
      .catch((e) => {
        fail(e);
      });
  });

  it("should unshare an item with a group by group admin", (done) => {
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
      owner: "otherguy",
    })
      .then((response) => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
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
      .catch((e) => {
        fail(e);
      });
  });

  it("should shortcircuit share if an item was previously unshared with a group", (done) => {
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
      groupId: "t6b",
    })
      .then((response) => {
        // no web request to unshare at all
        expect(response).toEqual(CachedUnsharingResponse);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });

  it("should throw if the person trying to unshare doesnt own the item, is not an admin or member of said group", (done) => {
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
      owner: "jones",
    }).catch((e) => {
      expect(e.message).toContain(
        "This item can not be unshared from group t6b by jsmith as they not the item owner, an org admin, group admin or group owner."
      );
      done();
    });
  });

  it("should throw when notUnsharedFrom is not empty", (done) => {
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "jones",
    }).catch((e) => {
      expect(e.message).toContain(
        "Item a5b could not be unshared to group t6b"
      );
      done();
    });
  });
});
