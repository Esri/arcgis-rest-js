/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import {
  searchUsers,
  searchCommunityUsers
} from "../../src/users/search-users.js";
import { UserSearchResponse } from "../mocks/users/user-search.js";

describe("users", () => {
  const MOCK_AUTH = {
    getToken() {
      return Promise.resolve("fake-token");
    },
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  };

  afterEach(() => {
    fetchMock.restore();
  });
  describe("searchUsers", () => {
    it("should make a simple, authenticated user search request", (done) => {
      fetchMock.once("*", UserSearchResponse);

      searchUsers({
        q: "role:org_user OR role:org_publisher",
        num: 100,
        authentication: MOCK_AUTH
      })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/portals/self/users/search?f=json&q=role%3Aorg_user%20OR%20role%3Aorg_publisher&num=100&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response).toEqual(UserSearchResponse);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe("searchCommunityUsers", () => {
    it("should make a simple, authenticated user search request", (done) => {
      fetchMock.once("*", UserSearchResponse);

      searchCommunityUsers({
        q: "role:org_user OR role:org_publisher",
        num: 100,
        authentication: MOCK_AUTH
      })
        .then((response) => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users?f=json&q=role%3Aorg_user%20OR%20role%3Aorg_publisher&num=100&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response).toEqual(UserSearchResponse);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });
});
