/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getUser } from "../../src/index.js";
import { determineUsername } from "../../src/util/determine-username.js";

describe("determineUsername", () => {
  it("should return undefined if no username is available", () => {
    const requestOptions = {};
    return determineUsername(requestOptions).then((username) => {
      expect(username).toEqual(undefined);
    });
  });

  it("should use the username in the requestOptions if passed", () => {
    const requestOptions = {
      username: "c@sey",
      authentication: {
        portal: "https://bar.com/arcgis/sharing/rest",
        username: "bob",
        getUsername: function () {
          return Promise.resolve("jsmith");
        },
        getToken() {
          return Promise.resolve("fake");
        }
      }
    };
    return determineUsername(requestOptions).then((username) => {
      expect(username).toEqual(encodeURIComponent("c@sey"));
    });
  });

  it("should fallback to the username in the requestOptions authentication", () => {
    const requestOptions = {
      authentication: {
        portal: "https://bar.com/arcgis/sharing/rest",
        username: "bob",
        getUsername: function () {
          return Promise.resolve("jsmith");
        },
        getToken() {
          return Promise.resolve("fake");
        }
      }
    };
    return determineUsername(requestOptions).then((username) => {
      expect(username).toEqual(encodeURIComponent("bob"));
    });
  });

  it("should fallback to getUsername() in the requestOptions authentication", () => {
    const requestOptions = {
      authentication: {
        portal: "https://bar.com/arcgis/sharing/rest",
        getUsername: function () {
          return Promise.resolve("jsmith");
        },
        getToken() {
          return Promise.resolve("fake");
        }
      }
    };
    return determineUsername(requestOptions).then((username) => {
      expect(username).toEqual(encodeURIComponent("jsmith"));
    });
  });
});
