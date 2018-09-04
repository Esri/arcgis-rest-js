/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  searchGroups,
  getGroup,
  getGroupContent,
  getGroupUsers,
  createGroup,
  updateGroup,
  removeGroup,
  protectGroup,
  unprotectGroup
} from "../src/index";

import {
  GroupSearchResponse,
  GroupEditResponse,
  GroupResponse,
  GroupContentResponse,
  GroupUsersResponse
} from "./mocks/responses";
import { encodeParam } from "@esri/arcgis-rest-request";
import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(fetchMock.restore);

  describe("searchGroups", () => {
    it("should make a simple, unauthenticated group search request", done => {
      fetchMock.once("*", GroupSearchResponse);

      searchGroups({ q: "water" })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/groups?f=json&q=water"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should take num, start, sortField, sortOrder and construct the request", done => {
      fetchMock.once("*", GroupSearchResponse);
      searchGroups({
        q: "water",
        start: 4,
        num: 7,
        sortField: "owner",
        sortOrder: "desc"
      })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/groups?f=json&q=water&start=4&num=7&sortField=owner&sortOrder=desc"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
  describe("getGroup", () => {
    it("should return a group", done => {
      fetchMock.once("*", GroupResponse);
      getGroup("3ef")
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/groups/3ef?f=json"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
  describe("getGroupContent", () => {
    it("should return group content", done => {
      fetchMock.once("*", GroupContentResponse);
      getGroupContent("3ef")
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=1&num=100"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should return group content, paged", done => {
      fetchMock.once("*", GroupContentResponse);
      getGroupContent("3ef", { paging: { start: 4, num: 7 } })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=4&num=7"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe("authenticted methods", () => {
    const MOCK_AUTH = {
      getToken() {
        return Promise.resolve("fake-token");
      },
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    };
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should make a simple, authenticated group search request", done => {
      fetchMock.once("*", GroupSearchResponse);

      searchGroups({ q: "water" }, MOCK_REQOPTS)
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups?f=json&q=water&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should create a group", done => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        title: "fake group",
        owner: "fakeUser",
        tags: ["foo", "bar"],
        description: "my fake group"
      };
      createGroup({ group: fakeGroup, ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/createGroup"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(encodeParam("owner", "fakeUser"));
          // ensure the array props are serialized into strings
          expect(options.body).toContain(encodeParam("tags", "foo, bar"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should update a group", done => {
      fetchMock.once("*", GroupEditResponse);
      const fakeGroup = {
        id: "5bc",
        title: "fake group",
        owner: "fakeUser",
        tags: ["foo", "bar"],
        description: "my fake group"
      };
      updateGroup({ group: fakeGroup, ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/update"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(options.body).toContain(encodeParam("owner", "fakeUser"));
          // ensure the array props are serialized into strings
          expect(options.body).toContain(encodeParam("tags", "foo, bar"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should remove a group", done => {
      fetchMock.once("*", GroupEditResponse);

      removeGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should protect a group", done => {
      fetchMock.once("*", GroupEditResponse);

      protectGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/protect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should unprotect a group", done => {
      fetchMock.once("*", GroupEditResponse);

      unprotectGroup({ id: "5bc", ...MOCK_REQOPTS })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/unprotect"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    it("should return group users", done => {
      fetchMock.once("*", GroupUsersResponse);

      getGroupUsers("5bc", MOCK_REQOPTS)
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/users?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
    // it('should make authenticated call to get the group content', done => {})
  });
});
