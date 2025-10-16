/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { validateAppAccess } from "../src/index.js";
import { describe, test, expect } from "vitest";

const VERIFYAPPACCESS_URL =
  "https://www.arcgis.com/sharing/rest/oauth2/validateAppAccess";

describe("validateAppAccess: ", () => {
  test("makes a request to /oauth2/validateAppAccess passing params", async () => {
    fetchMock.postOnce(VERIFYAPPACCESS_URL, {
      valid: true,
      viewOnlyUserTypeApp: false
    });
    const response = await validateAppAccess("FAKE-TOKEN", "abc123");
    const [url, options] = fetchMock.lastCall(VERIFYAPPACCESS_URL);
    expect(url).toEqual(VERIFYAPPACCESS_URL);
    expect(options.body).toContain("f=json");
    expect(options.body).toContain("token=FAKE-TOKEN");
    expect(options.body).toContain("client_id=abc123");
    expect(response.valid).toEqual(true);
    expect(response.viewOnlyUserTypeApp).toBe(false);
  });

  test("takes a portalUrl", async () => {
    const PORTAL_BASE_URL = "https://my-portal.com/instance/sharing/rest";
    const PORTAL_VERIFY_URL = `${PORTAL_BASE_URL}/oauth2/validateAppAccess`;
    fetchMock.postOnce(PORTAL_VERIFY_URL, {
      valid: true,
      viewOnlyUserTypeApp: false
    });
    const response = await validateAppAccess(
      "FAKE-TOKEN",
      "abc123",
      PORTAL_BASE_URL
    );
    const [url, options] = fetchMock.lastCall(PORTAL_VERIFY_URL);
    expect(url).toEqual(PORTAL_VERIFY_URL);
  });
});
