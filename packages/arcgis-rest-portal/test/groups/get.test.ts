/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
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
    test("should return a group", async () => {
      fetchMock.once("*", GroupResponse);
      await getGroup("3ef");
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/community/groups/3ef?f=json"
      );
      expect(options.method).toBe("GET");
    });
  });

  describe("getGroupCategorySchema", () => {
    test("should return group's category schema", async () => {
      fetchMock.once("*", GroupCategorySchemaResponse);
      await getGroupCategorySchema("3ef");
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/community/groups/3ef/categorySchema?f=json"
      );
      expect(options.method).toBe("GET");
    });
  });

  describe("getGroupContent", () => {
    test("should return group content", async () => {
      fetchMock.once("*", GroupContentResponse);
      await getGroupContent("3ef");
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=1&num=100"
      );
      expect(options.method).toBe("GET");
    });

    test("should return group content, paged", async () => {
      fetchMock.once("*", GroupContentResponse);
      await getGroupContent("3ef", { paging: { start: 4, num: 7 } });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/content/groups/3ef?f=json&start=4&num=7"
      );
      expect(options.method).toBe("GET");
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

    test("should return group users", async () => {
      fetchMock.once("*", GroupUsersResponse);
      await getGroupUsers("5bc", MOCK_REQOPTS);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/users?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });

    describe("search group users", function () {
      test("should search group users", async () => {
        fetchMock.once("*", SearchGroupUsersResponse);
        await searchGroupUsers("5bc", {
          name: "jupe",
          sortField: "fullname",
          sortOrder: "asc",
          num: 2,
          start: 2,
          joined: [null, 123456],
          memberType: "member",
          ...MOCK_REQOPTS
        });
        expect(fetchMock.called()).toEqual(true);
        const [url, options] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://myorg.maps.arcgis.com/sharing/rest/community/groups/5bc/userlist?f=json&name=jupe&num=2&start=2&sortField=fullname&sortOrder=asc&joined=%2C123456&memberType=member&token=fake-token"
        );
        expect(options.method).toBe("GET");
      });

      test("shouldn't require searchOptions", async () => {
        fetchMock.once("*", SearchGroupUsersResponse);
        await searchGroupUsers("5bc");
        expect(fetchMock.called()).toEqual(true);
        const [__, options] = fetchMock.lastCall("*");
        expect(options.method).toBe("GET");
      });
    });
  });
});
