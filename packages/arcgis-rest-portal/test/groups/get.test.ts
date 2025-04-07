/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";

import {
  getGroup,
  getGroupCategorySchema,
  getGroupContent,
  getGroupUsers,
  searchGroupUsers
} from "../../src/groups/get.js";

import {
  GroupResponse,
  GroupCategorySchemaResponse,
  GroupContentResponse,
  GroupUsersResponse,
  SearchGroupUsersResponse
} from "../mocks/groups/responses.js";

describe("groups", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("getGroup", () => {
    it("should return a group", (done) => {
      fetchMock.once("*", GroupResponse);
      getGroup("3ef")
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/groups/3ef?f=json"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("getGroupCategorySchema", () => {
    it("should return group's category schema", (done) => {
      fetchMock.once("*", GroupCategorySchemaResponse);
      getGroupCategorySchema("3ef")
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/community/groups/3ef/categorySchema?f=json"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("getGroupContent", () => {
    it("should return group content", (done) => {
      fetchMock.once("*", GroupContentResponse);
      getGroupContent("3ef")
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=1&num=100"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should return group content, paged", (done) => {
      fetchMock.once("*", GroupContentResponse);
      getGroupContent("3ef", { paging: { start: 4, num: 7 } })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=4&num=7"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("authenticted methods", () => {
    const MOCK_AUTH = {
      token: "token",
      getToken() {
        return Promise.resolve("fake-token");
      },
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    };
    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    it("should return group users", (done) => {
      fetchMock.once("*", GroupUsersResponse);

      getGroupUsers("5bc", MOCK_REQOPTS)
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/users?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    describe("search group users", function () {
      it("should search group users", (done) => {
        fetchMock.once("*", SearchGroupUsersResponse);

        searchGroupUsers("5bc", {
          name: "jupe",
          sortField: "fullname",
          sortOrder: "asc",
          num: 2,
          start: 2,
          joined: [null, 123456],
          memberType: "member",
          ...MOCK_REQOPTS
        })
          .then((response) => {
            expect(fetchMock.called()).toEqual(true);
            const [url, options] = fetchMock.lastCall("*");
            expect(url).toEqual(
              "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/userlist?f=json&name=jupe&num=2&start=2&sortField=fullname&sortOrder=asc&joined=%2C123456&memberType=member&token=fake-token"
            );
            expect(options.method).toBe("GET");
            done();
          })
          .catch((e) => {
            fail(e);
          });
      });

      it("shouldn't require searchOptions", (done) => {
        fetchMock.once("*", SearchGroupUsersResponse);

        searchGroupUsers("5bc")
          .then((_) => {
            expect(fetchMock.called()).toEqual(true);
            const [__, options] = fetchMock.lastCall("*");
            expect(options.method).toBe("GET");
            done();
          })
          .catch((e) => {
            fail(e);
          });
      });
    });
  });
});
