/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import { searchGroups, searchGroupContent } from "../../src/groups/search.js";
import { GroupSearchResponse } from "../mocks/groups/responses.js";
import { SearchQueryBuilder } from "../../src/util/SearchQueryBuilder.js";
import { genericSearch } from "../../src/util/generic-search.js";

describe("groups", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("searchGroups", () => {
    test("should make a simple, unauthenticated group search request", async () => {
      fetchMock.once("*", GroupSearchResponse);
      await searchGroups("water");
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/community/groups?f=json&q=water"
      );
      expect(options.method).toBe("GET");
    });

    test("should take num, start, sortField, sortOrder and construct the request", async () => {
      fetchMock.once("*", GroupSearchResponse);
      await searchGroups({
        q: "water",
        start: 4,
        num: 7,
        sortField: "owner",
        sortOrder: "desc"
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/community/groups?f=json&q=water&num=7&start=4&sortField=owner&sortOrder=desc"
      );
      expect(options.method).toBe("GET");
    });

    test("should search for group contents", async () => {
      fetchMock.once("*", GroupSearchResponse);
      await searchGroupContent({
        groupId: "grp1234567890",
        q: "water"
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://www.arcgis.com/sharing/rest/content/groups/grp1234567890/search?f=json&q=water"
      );
      expect(options.method).toBe("GET");
    });

    test("should catch search for group contents without group id", async () => {
      await expect(
        genericSearch({ q: "water" }, "groupContent")
      ).rejects.toEqual(
        new Error("you must pass a `groupId` option to `searchGroupContent`")
      );
    });
  });

  test("should make a simple, single search request with a builder", async () => {
    fetchMock.once("*", GroupSearchResponse);
    const expectedParam = "Trees AND owner:USFS";
    const q = new SearchQueryBuilder()
      .match("Trees")
      .and()
      .match("USFS")
      .in("owner");
    await searchGroups(q);
    expect(fetchMock.called()).toEqual(true);
    const [url, options] = fetchMock.lastCall("*");
    expect(url).toEqual(
      `https://www.arcgis.com/sharing/rest/community/groups?f=json&q=${encodeURIComponent(
        expectedParam
      )}`
    );
    expect(options.method).toBe("GET");
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

    test("should make a simple, authenticated group search request", async () => {
      fetchMock.once("*", GroupSearchResponse);
      await searchGroups({ q: "water", authentication: MOCK_AUTH });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups?f=json&q=water&token=fake-token"
      );
      expect(options.method).toBe("GET");
    });
  });
});
