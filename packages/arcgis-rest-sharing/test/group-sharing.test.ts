import * as fetchMock from "fetch-mock";

import { shareItemWithGroup, unshareItemWithGroup } from "../src/index";

import { MOCK_USER_SESSION } from "./mocks/sharing";

import {
  AnonUserResponse,
  UserResponse
} from "../../arcgis-rest-users/test/mocks/responses";

import { SearchResponse } from "../../arcgis-rest-items/test/mocks/search";

const SharingResponse = {
  notSharedWith: [] as any,
  itemId: "abc123"
};

const FailedSharingResponse = {
  notSharedWith: ["xyz678"],
  itemId: "abc123"
};

const UnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "a5b15fe368684a66b8c85a6cadaef9e5"
};

const CachedSharingResponse = {
  notSharedWith: [] as any,
  itemId: "a5b15fe368684a66b8c85a6cadaef9e5",
  shortcut: true
};

const CachedUnsharingResponse = {
  notUnsharedFrom: [] as any,
  itemId: "abc123",
  shortcut: true
};

const AdminGroupUsersResponse = {
  owner: "jsmith",
  admins: ["jsmith"],
  users: ["joe"]
};

const UserGroupUsersResponse = {
  owner: "joe",
  admins: ["joe"],
  users: ["jsmith"]
};

const NonMemberGroupUsersResponse = {
  owner: "joe",
  admins: ["joe"],
  users: ["rayray"]
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
  afterEach(fetchMock.restore);

  it("should share an item with a group by owner", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      UserGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share",
      SharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678..."
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should fail to share an item with a group if the request is made by a non-org admin and non-group member", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      NonMemberGroupUsersResponse
    );

    // fetchMock.once("https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share", SharingResponse);

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678..."
    }).catch(e => {
      expect(e.message).toBe(
        "This item can not be shared by jsmith as they are not a member of the specified group xyz678...."
      );
      done();
    });
  });

  it("should share an item with a group by org administrator", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      NoResultsSearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      UserGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share",
      SharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678...",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should share an item with a group by group owner/admin", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      AdminGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/abc123/share",
      SharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678...",
      owner: "otherguy"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/abc123/share"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(SharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should mock a share if an item was previously shared with a group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      AdminGroupUsersResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b15fe368684a66b8c85a6cadaef9e5",
      groupId: "xyz678..."
    })
      .then(response => {
        // no web request at all
        expect(response).toEqual(CachedSharingResponse);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw if the person trying to share doesnt own the item, is not an admin or member of said group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      UserGroupUsersResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678...",
      owner: "casey"
    }).catch(e => {
      expect(e.message).toContain(
        "This item can not be share by jsmith as they are neither the owner, a groupAdmin of xyz678..., nor an org_admin."
      );
      done();
    });
  });

  it("should throw if the response from the server is fishy", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      AdminGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/abc123/share",
      FailedSharingResponse
    );

    shareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678..."
    }).catch(e => {
      expect(e.message).toBe(
        "Item abc123 could not be shareed to group xyz678...."
      );
      done();
    });
  });
});

describe("unshareItemWithGroup()", () => {
  afterEach(fetchMock.restore);

  it("should unshare an item with a group by owner", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      AdminGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare",
      UnsharingResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b15fe368684a66b8c85a6cadaef9e5",
      groupId: "xyz678..."
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/jsmith/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678...");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should unshare an item with a group by org administrator", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      UserGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare",
      UnsharingResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b15fe368684a66b8c85a6cadaef9e5",
      groupId: "xyz678...",
      owner: "casey"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/users/casey/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678...");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should unshare an item with a group by group member", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      AdminGroupUsersResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare",
      UnsharingResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b15fe368684a66b8c85a6cadaef9e5",
      groupId: "xyz678...",
      owner: "otherguy"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          "https://myorg.maps.arcgis.com/sharing/rest/content/items/a5b15fe368684a66b8c85a6cadaef9e5/unshare"
        );
        expect(options.method).toBe("POST");
        expect(response).toEqual(UnsharingResponse);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("groups=xyz678...");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should shortcircuit share if an item was previously unshared with a group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      UserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      UserGroupUsersResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "abc123",
      groupId: "xyz678..."
    })
      .then(response => {
        // no web request at all
        expect(response).toEqual(CachedUnsharingResponse);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should throw if the person trying to unshare doesnt own the item, is not an admin or member of said group", done => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/users/jsmith",
      AnonUserResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/community/groups/xyz678.../users?f=json",
      NonMemberGroupUsersResponse
    );

    unshareItemWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b15fe368684a66b8c85a6cadaef9e5",
      groupId: "xyz678...",
      owner: "jones"
    }).catch(e => {
      expect(e.message).toContain(
        "This item can not be unshared by jsmith as they are not a member of the specified group xyz678...."
      );
      done();
    });
  });
});
