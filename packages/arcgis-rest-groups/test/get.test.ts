/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getGroup, getGroupContent, getGroupUsers } from "../src/get";

import {
  GroupResponse,
  GroupContentResponse,
  GroupUsersResponse
} from "./mocks/responses";

import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(fetchMock.restore);

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
  });
});
