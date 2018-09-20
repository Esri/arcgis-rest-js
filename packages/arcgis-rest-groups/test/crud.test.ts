/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { createGroup } from "../src/create";
import { updateGroup } from "../src/update";
import { removeGroup } from "../src/remove";

import { GroupEditResponse } from "./mocks/responses";

import { encodeParam } from "@esri/arcgis-rest-request";
import * as fetchMock from "fetch-mock";

describe("groups", () => {
  afterEach(fetchMock.restore);

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
  });
});
