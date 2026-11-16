/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { isItemSharedWithGroup } from "../../src/sharing/is-item-shared-with-group.js";
import { SearchResponse } from "../mocks/items/search.js";
import { MOCK_USER_SESSION } from "../mocks/sharing/sharing.js";

const NoResultsSearchResponse = {
  query: "",
  total: 0,
  start: 0,
  num: 0,
  nextStart: 0,
  results: [] as any
};

describe("isItemSharedWithGroup ::", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should search for the item within the group", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    await isItemSharedWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b"
    });

    expect(fetchMock.done()).toBe(true);
    const [url, options] = fetchMock.lastCall(
      "https://myorg.maps.arcgis.com/sharing/rest/search"
    );
    expect(url).toBe("https://myorg.maps.arcgis.com/sharing/rest/search");
    expect(options.method).toBe("POST");
    expect(options.body).toContain(
      `q=${encodeURIComponent("id: a5b AND group: t6b")}`
    );
  });

  test("should return true if the item is shared with the group", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    const result = await isItemSharedWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "a5b",
      groupId: "t6b"
    });

    expect(fetchMock.done()).toBe(true);
    expect(result).toBe(true);
  });

  test("should return false if none of the results match the item", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      SearchResponse
    );

    const result = await isItemSharedWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    });

    expect(fetchMock.done()).toBe(true);
    expect(result).toBe(false);
  });

  test("should return false if the search has no results", async () => {
    fetchMock.once(
      "https://myorg.maps.arcgis.com/sharing/rest/search",
      NoResultsSearchResponse
    );

    const result = await isItemSharedWithGroup({
      authentication: MOCK_USER_SESSION,
      id: "n3v",
      groupId: "t6b"
    });

    expect(fetchMock.done()).toBe(true);
    expect(result).toBe(false);
  });
});
