import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";
import { unregisterApp } from "../../src/shared/unregisterApp.js";
import { describe, beforeAll, afterEach, test, expect } from "vitest";
import {
  IUnregisterAppResponse,
  IRegisteredAppResponse
} from "../../src/shared/types/appType.js";

function setFetchMockPOSTFormUrlencoded(
  url: string,
  responseBody: any,
  status: number,
  routeName: string,
  repeat: number
): void {
  fetchMock.mock(
    {
      url: url, // url should match
      method: "POST", // http method should match
      headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
      name: routeName,
      repeat: repeat
    },
    {
      body: responseBody,
      status: status,
      headers: { "Content-Type": "application/json" }
    }
  );
}

const mockGetAppInfoResponse: IRegisteredAppResponse = {
  itemId: "b3d7ab46200b455aa83ac85969101b7e",
  client_id: "VteqTcbthTazVFmR",
  client_secret: "a387fd7f9a4a4a6da0a90ea9cb9298f7",
  appType: "apikey",
  redirect_uris: [],
  registered: 1689846407000,
  modified: 1689846407000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: [],
  isBeta: false,
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: false,
  customAppLoginShowTriage: false
};

const mockUnregisterResponse: IUnregisterAppResponse = {
  success: true,
  itemId: "b3d7ab46200b455aa83ac85969101b7e"
};

const unregisterAppResponseExpected: IUnregisterAppResponse =
  mockUnregisterResponse;

/* test plans:
1. unregister an app
*/
describe("unregisterApp()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;

  beforeAll(() => {
    authOnline = new ArcGISIdentityManager({
      username: "3807206777",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
  });

  afterEach(() => fetchMock.restore());

  test("should unregister an app", async () => {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/b3d7ab46200b455aa83ac85969101b7e/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/VteqTcbthTazVFmR/unregister",
      mockUnregisterResponse,
      200,
      "unregisterAppRoute",
      1
    );

    const unregisterResponse = await unregisterApp({
      itemId: "b3d7ab46200b455aa83ac85969101b7e",
      authentication: authOnline
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("unregisterAppRoute")).toBe(true);
    const actualUnregisterAppRoute =
      fetchMock.lastOptions("unregisterAppRoute");
    expect(actualUnregisterAppRoute.body).toContain("f=json");
    expect(actualUnregisterAppRoute.body).toContain("token=fake-token");

    // verify actual return with expected return
    expect(unregisterResponse).toEqual(unregisterAppResponseExpected);
  });
});
