/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect } from "vitest";
import { determineUsername } from "../../src/util/determine-username.js";

describe("determineUsername", () => {
  test("should return undefined if no username is available", async () => {
    const requestOptions = {};
    const username = await determineUsername(requestOptions);
    expect(username).toEqual(undefined);
  });

  test("should use the username in the requestOptions if passed", async () => {
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
    const username = await determineUsername(requestOptions);
    expect(username).toEqual(encodeURIComponent("c@sey"));
  });

  test("should fallback to the username in the requestOptions authentication", async () => {
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
    const username = await determineUsername(requestOptions);
    expect(username).toEqual(encodeURIComponent("bob"));
  });

  test("should fallback to getUsername() in the requestOptions authentication", async () => {
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
    const username = await determineUsername(requestOptions);
    expect(username).toEqual(encodeURIComponent("jsmith"));
  });
});
