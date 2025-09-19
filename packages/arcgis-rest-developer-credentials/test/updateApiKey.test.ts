import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IApiKeyResponse } from "../src/shared/types/apiKeyType.js";
import { updateApiKey } from "../src/updateApiKey.js";

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

// first successful test mock response
const mockGetAppResponseNoParams: IRegisteredAppResponse = {
  itemId: "4832e6bc5fa540129822212c12168710",
  client_id: "ShnJhKhzr2cVCujl",
  client_secret: "92d87924b87342dbae9d129469141387",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687939657000,
  modified: 1687939657000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: ["premium:user:geocode:temporary"],
  isBeta: false,
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: false,
  customAppLoginShowTriage: false
};
const updateItemResponseNoParams: any = {
  id: "da7720eff87c4f5b9504f526ad6f0c6e",
  success: true
};
const mockUpdateKeyResponseNoParams: IRegisteredAppResponse = {
  itemId: "4832e6bc5fa540129822212c12168710",
  client_id: "ShnJhKhzr2cVCujl",
  client_secret: "92d87924b87342dbae9d129469141387",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687939657000,
  modified: 1687939746000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: ["premium:user:geocode:temporary"],
  isBeta: false,
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: false,
  customAppLoginShowTriage: false
};
const mockGetItemResponseNoParams: IItem = {
  id: "4832e6bc5fa540129822212c12168710",
  owner: "3807206777",
  created: 1687939656000,
  isOrgItem: true,
  modified: 1687939656000,
  guid: null,
  name: null,
  title: "test 4",
  type: "API Key",
  typeKeywords: ["API Key", "Registered App"],
  description: "test 4",
  tags: [],
  snippet: null,
  thumbnail: null,
  documentation: null,
  extent: [],
  categories: [],
  spatialReference: null,
  accessInformation: null,
  licenseInfo: null,
  culture: "en-us",
  properties: null,
  advancedSettings: null,
  url: null,
  proxyFilter: null,
  access: "private",
  size: 0,
  subInfo: 0,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  ownerFolder: null,
  protected: false,
  commentsEnabled: true,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 0,
  itemControl: "admin",
  scoreCompleteness: 18,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};
const keyResponseExpectedNoParams: IApiKeyResponse = {
  accessToken2:
    "AAPTKUgfudpnh_cXrZ7wRiqGE-Ab-2vuhTJqKU7sefbQ8XCwJt3MWt_2OZPQOofpdhl5Tvyu-bB5s39D-Gz-2eBLROI2cT1ydl-HQsMOkrcJBcJMOgHAuoC9hzz3wUQWx5Xl8Wg7wU8PK96Q5caDwUWak86-4UWVV2H9cUXB7ObXXSUHGWUO2Dx7Do12KsvEZelcGfKLemkqxn6XY6G_0cYBjgi030xY_r9ATfK3D0fhkgKn0NEGIEcN0WnJ-8oa1O0xAT2_U48KuejH",
  client_id: "ShnJhKhzr2cVCujl",
  item: mockGetItemResponseNoParams,
  itemId: "4832e6bc5fa540129822212c12168710",
  registered: new Date(1687939657000),
  modified: new Date(1687939746000),
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: [
    "premium:user:networkanalysis:servicearea",
    "premium:user:networkanalysis:routing"
  ],
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: true
};
const mockUpdatedGetAppResponseNoParams: IRegisteredAppResponse = {
  itemId: "4832e6bc5fa540129822212c12168710",
  client_id: "ShnJhKhzr2cVCujl",
  client_secret: "92d87924b87342dbae9d129469141387",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687939657000,
  modified: 1687939746000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: [
    "premium:user:networkanalysis:servicearea",
    "premium:user:networkanalysis:routing"
  ],
  isBeta: false,
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: true,
  customAppLoginShowTriage: false
};
const generateAccessToken2ParamsResponse = {
  access_token:
    "AAPTKUgfudpnh_cXrZ7wRiqGE-Ab-2vuhTJqKU7sefbQ8XCwJt3MWt_2OZPQOofpdhl5Tvyu-bB5s39D-Gz-2eBLROI2cT1ydl-HQsMOkrcJBcJMOgHAuoC9hzz3wUQWx5Xl8Wg7wU8PK96Q5caDwUWak86-4UWVV2H9cUXB7ObXXSUHGWUO2Dx7Do12KsvEZelcGfKLemkqxn6XY6G_0cYBjgi030xY_r9ATfK3D0fhkgKn0NEGIEcN0WnJ-8oa1O0xAT2_U48KuejH",
  expires_in: 1800
};

describe("updateApiKey()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;

  beforeAll(function () {
    authOnline = new ArcGISIdentityManager({
      username: "3807206777",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
  });

  beforeEach(() => {
    fetchMock.restore();
  });

  it("should update an API key with expiration dates", async function () {
    let callCount = 0;
    fetchMock.mock(
      {
        url: "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/registeredAppInfo", // url should match
        method: "POST", // http method should match
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
        name: "getAppRoute"
      },
      function () {
        if (callCount === 0) {
          callCount++;
          return {
            body: mockGetAppResponseNoParams,
            status: 200,
            headers: { "Content-Type": "application/json" }
          };
        }
        return {
          body: mockUpdatedGetAppResponseNoParams,
          status: 200,
          headers: { "Content-Type": "application/json" }
        };
      }
    );

    // step 1 update item with expiration dates
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/update",
      updateItemResponseNoParams,
      200,
      "updateItemRoute",
      1
    );

    // step 2 update registered app
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/ShnJhKhzr2cVCujl/update",
      mockUpdateKeyResponseNoParams,
      200,
      "updateKeyRoute",
      1
    );

    // step 3 get item info
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/4832e6bc5fa540129822212c12168710",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    // step 5 generate access token 2
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/token",
      generateAccessToken2ParamsResponse,
      200,
      "generateToken1Route",
      1
    );

    const updateApiKeyResponse = await updateApiKey({
      itemId: "4832e6bc5fa540129822212c12168710",
      authentication: authOnline,
      privileges: [
        "premium:user:networkanalysis:servicearea",
        "premium:user:networkanalysis:routing"
      ],
      generateToken2: true,
      apiToken2ExpirationDate: TOMORROW
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("updateKeyRoute")).toBe(true);
    const actualOptionUpdateKeyRoute = fetchMock.lastOptions("updateKeyRoute");
    expect(actualOptionUpdateKeyRoute.body).toContain("f=json");
    expect(actualOptionUpdateKeyRoute.body).toContain("token=fake-token");
    expect(actualOptionUpdateKeyRoute.body).toContain(
      encodeParam(
        "httpReferrers",
        JSON.stringify([
          "https://www.esri.com/en-us/home",
          "https://esri.okta.com/app/UserHome"
        ])
      )
    );
    expect(actualOptionUpdateKeyRoute.body).toContain(
      encodeParam(
        "privileges",
        JSON.stringify([
          "premium:user:networkanalysis:servicearea",
          "premium:user:networkanalysis:routing"
        ])
      )
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateApiKeyResponse).toEqual(keyResponseExpectedNoParams);
  });

  it("should update an API key without expiration dates", async function () {
    let callCount = 0;
    fetchMock.mock(
      {
        url: "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/registeredAppInfo", // url should match
        method: "POST", // http method should match
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
        name: "getAppRoute"
      },
      function () {
        if (callCount === 0) {
          callCount++;
          return {
            body: mockGetAppResponseNoParams,
            status: 200,
            headers: { "Content-Type": "application/json" }
          };
        }
        return {
          body: mockUpdatedGetAppResponseNoParams,
          status: 200,
          headers: { "Content-Type": "application/json" }
        };
      }
    );

    // step 2 update registered app
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/ShnJhKhzr2cVCujl/update",
      mockUpdateKeyResponseNoParams,
      200,
      "updateKeyRoute",
      1
    );

    // step 3 get item info
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/4832e6bc5fa540129822212c12168710",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    // step 5 generate access token 2
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/token",
      generateAccessToken2ParamsResponse,
      200,
      "generateToken1Route",
      1
    );

    const updateApiKeyResponse = await updateApiKey({
      itemId: "4832e6bc5fa540129822212c12168710",
      authentication: authOnline,
      privileges: [
        "premium:user:networkanalysis:servicearea",
        "premium:user:networkanalysis:routing"
      ],
      generateToken2: true
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("updateKeyRoute")).toBe(true);
    const actualOptionUpdateKeyRoute = fetchMock.lastOptions("updateKeyRoute");
    expect(actualOptionUpdateKeyRoute.body).toContain("f=json");
    expect(actualOptionUpdateKeyRoute.body).toContain("token=fake-token");
    expect(actualOptionUpdateKeyRoute.body).toContain(
      encodeParam(
        "httpReferrers",
        JSON.stringify([
          "https://www.esri.com/en-us/home",
          "https://esri.okta.com/app/UserHome"
        ])
      )
    );
    expect(actualOptionUpdateKeyRoute.body).toContain(
      encodeParam(
        "privileges",
        JSON.stringify([
          "premium:user:networkanalysis:servicearea",
          "premium:user:networkanalysis:routing"
        ])
      )
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateApiKeyResponse).toEqual(keyResponseExpectedNoParams);
  });

  it("should update an API key without privileges or referers", async function () {
    let callCount = 0;
    fetchMock.mock(
      {
        url: "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/registeredAppInfo", // url should match
        method: "POST", // http method should match
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
        name: "getAppRoute"
      },
      function () {
        if (callCount === 0) {
          callCount++;
          return {
            body: mockGetAppResponseNoParams,
            status: 200,
            headers: { "Content-Type": "application/json" }
          };
        }
        return {
          body: mockUpdatedGetAppResponseNoParams,
          status: 200,
          headers: { "Content-Type": "application/json" }
        };
      }
    );

    // step 1 update item with expiration dates
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/update",
      updateItemResponseNoParams,
      200,
      "updateItemRoute",
      1
    );

    // step 2 update registered app
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/ShnJhKhzr2cVCujl/update",
      mockUpdateKeyResponseNoParams,
      200,
      "updateKeyRoute",
      1
    );

    // step 3 get item info
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/4832e6bc5fa540129822212c12168710",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    // step 5 generate access token 2
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/token",
      generateAccessToken2ParamsResponse,
      200,
      "generateToken1Route",
      1
    );

    const updateApiKeyResponse = await updateApiKey({
      itemId: "4832e6bc5fa540129822212c12168710",
      authentication: authOnline,
      generateToken2: true,
      apiToken2ExpirationDate: TOMORROW
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("updateKeyRoute")).toBe(false);

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateApiKeyResponse).toEqual(keyResponseExpectedNoParams);
  });
});
