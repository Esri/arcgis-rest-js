/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchGroups, searchGroupContent } from "../../src/groups/search";
import {
  GroupSearchResponse,
  EmptyGroupSearchResponse
} from "../mocks/groups/responses";
import { SearchQueryBuilder } from "../../src/util/SearchQueryBuilder";
import { genericSearch } from "../../src/util/generic-search";

import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(fetchMock.restore);

  describe("searchGroups", () => {
    it("should make a simple, unauthenticated group search request", done => {
      fetchMock.once("*", GroupSearchResponse);

      searchGroups("water")
        .then(() => {
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
            "https://www.arcgis.com/sharing/rest/community/groups?f=json&q=water&num=7&start=4&sortField=owner&sortOrder=desc"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should search for group contents", done => {
      fetchMock.once("*", GroupSearchResponse);

      searchGroupContent({
        groupId: "grp1234567890",
        q: "water"
      })
        .then(() => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://www.arcgis.com/sharing/rest/content/groups/grp1234567890/search?f=json&q=water"
          );
          expect(options.method).toBe("GET");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should catch search for group contents without group id", done => {
      genericSearch(
        {
          q: "water"
        },
        "groupContent"
      ).then(
        () => fail(),
        err => {
          expect(err).toEqual(EmptyGroupSearchResponse);
          done();
        }
      );
    });
  });

  it("should make a simple, single search request with a builder", done => {
    fetchMock.once("*", GroupSearchResponse);
    const expectedParam = "Trees AND owner:USFS";
    const q = new SearchQueryBuilder()
      .match("Trees")
      .and()
      .match("USFS")
      .in("owner");
    searchGroups(q)
      .then(() => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          `https://www.arcgis.com/sharing/rest/community/groups?f=json&q=${encodeURIComponent(
            expectedParam
          )}`
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
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

      searchGroups({ q: "water", authentication: MOCK_AUTH })
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
  });
});
