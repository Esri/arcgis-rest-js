/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { searchGroups } from "../src/search";

import { GroupSearchResponse } from "./mocks/responses";

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
  });
});
