/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { shareItemWithGroup, unshareItemWithGroup } from "../src/index";
import { MOCK_USER_SESSION } from "./mocks/sharing";

import {
  AnonUserResponse,
  GroupNonMemberUserResponse,
  GroupMemberUserResponse,
  GroupAdminUserResponse,
  OrgAdminUserResponse
} from "../../arcgis-rest-users/test/mocks/responses";

import { SearchResponse } from "../../arcgis-rest-items/test/mocks/search";

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

describe("shareItemWithGroup()", () => {
  // make sure session doesnt cache metadata
  beforeEach(function() {
    MOCK_USER_SESSION._user = null;
  });

  afterEach(fetchMock.restore);

  it("should share an item with a group by owner", done => {
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
      SharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/n3v/share"
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

  it("should fail to share an item with a group if the request is made by a non-org admin and non-group member", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupNonMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    }).catch(e => {
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

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share",
      SharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/n3v/share"
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
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
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
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
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
        fail(e);
      });
  });

  it("should throw if the person trying to share doesnt own the item, is not an admin or member of said group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      GroupMemberUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b",
      owner: "casey"
    }).catch(e => {
      expect(e.message).toContain(
        "This item can not be shared by jsmith as they are neither the owner, a groupAdmin of t6b, nor an org_admin."
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

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    }).catch(e => {
      expect(e.message).toBe("Item n3v could not be shared to group t6b.");
      done();
    });
  });
});

describe("unshareItemWithGroup()", () => {
  // make sure session doesnt cache metadata
  beforeEach(function() {
    MOCK_USER_SESSION._user = null;
  });

  afterEach(fetchMock.restore);

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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b/unshare"
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
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/a5b/unshare",
      UnsharingResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/a5b/unshare"
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

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b",
      owner: "otherguy"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
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

  it("should throw if the person trying to unshare doesnt own the item, is not an admin or member of said group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith?f=json&token=fake-token",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
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
