import { describe, test, expect, beforeAll, afterEach } from "vitest";
import { invalidateApiKey } from "../src/invalidateApiKey.js";
import fetchMock from "fetch-mock";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

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
  itemId: "cddcacee5848488bb981e6c6ff91ab79",
  client_id: "EiwLuFlkNwE2Ifye",
  client_secret: "dc7526de9ece482dba4704618fd3de81",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687824330000,
  modified: 1687824330000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: ["premium:user:geocode:temporary"],
  isBeta: false,
  isPersonalAPIToken: false,
  apiToken1Active: true,
  apiToken2Active: false,
  customAppLoginShowTriage: false
};

const mockInvaildateApiKeyResponse = {
  success: true
};

describe("invalidateApiKey", () => {
  // setup IdentityManager
  let MOCK_USER_SESSION: ArcGISIdentityManager;

  beforeAll(() => {
    MOCK_USER_SESSION = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
  });

  afterEach(() => fetchMock.restore());

  test("should invalidate an API key", async () => {
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/revokeToken",
      mockInvaildateApiKeyResponse,
      200,
      "invalidateKeyRoute",
      1
    );

    const response = await invalidateApiKey({
      itemId: "cddcacee5848488bb981e6c6ff91ab79",
      apiKey: 1,
      authentication: MOCK_USER_SESSION
    });

    // verify first fetch
    expect(fetchMock.called("invalidateKeyRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("invalidateKeyRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).not.toContain("token=fake-token");
    expect(actualOptionGetAppRoute.body).toContain(
      "client_id=EiwLuFlkNwE2Ifye"
    );
    expect(actualOptionGetAppRoute.body).toContain(
      "client_secret=dc7526de9ece482dba4704618fd3de81"
    );

    expect(response).toEqual({
      success: true
    });
  });
});
