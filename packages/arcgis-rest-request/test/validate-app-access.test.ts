/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { validateAppAccess } from "../src/validate-app-access.js";

const VERIFYAPPACCESS_URL =
  "https://www.arcgis.com/sharing/rest/oauth2/validateAppAccess";

describe("validateAppAccess: ", () => {
  it("makes a request to /oauth2/validateAppAccess passing params", () => {
    fetchMock.postOnce(VERIFYAPPACCESS_URL, {
      valid: true,
      viewOnlyUserTypeApp: false
    });
    return validateAppAccess("FAKE-TOKEN", "abc123")
      .then((response) => {
        const [url, options]: [string, RequestInit] =
          fetchMock.lastCall(VERIFYAPPACCESS_URL);
        expect(url).toEqual(VERIFYAPPACCESS_URL);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("token=FAKE-TOKEN");
        expect(options.body).toContain("client_id=abc123");
        expect(response.valid).toEqual(true);
        expect(response.viewOnlyUserTypeApp).toBe(false);
      })
      .catch((e) => fail(e));
  });
  it("takes a portalUrl", () => {
    const PORTAL_BASE_URL = "https://my-portal.com/instance/sharing/rest";
    const PORTAL_VERIFY_URL = `${PORTAL_BASE_URL}/oauth2/validateAppAccess`;
    fetchMock.postOnce(PORTAL_VERIFY_URL, {
      valid: true,
      viewOnlyUserTypeApp: false
    });
    return validateAppAccess("FAKE-TOKEN", "abc123", PORTAL_BASE_URL)
      .then((response) => {
        const [url, options]: [string, RequestInit] =
          fetchMock.lastCall(PORTAL_VERIFY_URL);
        expect(url).toEqual(PORTAL_VERIFY_URL);
      })
      .catch((e) => fail(e));
  });
});
