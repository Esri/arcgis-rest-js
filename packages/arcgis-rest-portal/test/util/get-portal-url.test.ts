/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect } from "vitest";
import { getPortalUrl } from "../../src/util/get-portal-url.js";

describe("getPortalUrl", () => {
  test("should default to arcgis.com", () => {
    const url = getPortalUrl();
    expect(url).toEqual("https://www.arcgis.com/sharing/rest");
  });

  test("should use the portal from authorization if passed", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      }
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://foo.com/arcgis/sharing/rest");
  });

  test("should use the portal in the requestOptions if passed", () => {
    const requestOptions = {
      authentication: {
        portal: "https://foo.com/arcgis/sharing/rest",
        getToken() {
          return Promise.resolve("fake");
        }
      },
      portal: "https://bar.com/arcgis/sharing/rest"
    };
    const url = getPortalUrl(requestOptions);
    expect(url).toEqual("https://bar.com/arcgis/sharing/rest");
  });
});
