import { describe, test, expect, beforeAll, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { ICreateItemResponse, IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IApiKeyResponse } from "../src/shared/types/apiKeyType.js";
import { createApiKey } from "../src/createApiKey.js";

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
const mockCreateItemResponseNoParams: ICreateItemResponse = {
  success: true,
  folder: "",
  id: "da7720eff87c4f5b9504f526ad6f0c6e"
};
const mockRegisterAppResponseNoParams: IRegisteredAppResponse = {
  itemId: "da7720eff87c4f5b9504f526ad6f0c6e",
  client_id: "h9D4gAwxMqsjr9dm",
  client_secret: "9304ce3ace33400aa606b57b19b574ae",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687880984000,
  modified: 1687880984000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: ["premium:user:geocode:temporary"],
  isBeta: false,
  isPersonalAPIToken: false,
  customAppLoginShowTriage: false,
  apiToken1Active: false,
  apiToken2Active: false
};
const updateItemResponseNoParams: any = {
  id: "da7720eff87c4f5b9504f526ad6f0c6e",
  success: true
};
const mockGetItemResponseNoParams: IItem = {
  id: "da7720eff87c4f5b9504f526ad6f0c6e",
  owner: "3807206777",
  created: 1687880984000,
  isOrgItem: true,
  modified: 1687880984000,
  guid: null,
  name: null,
  title: "test 4",
  type: "Application",
  typeKeywords: [],
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
  accessToken1:
    "AAPTKUgfudpnh_cXrZ7wRiqGE-Ab-2vuhTJqKU7sefbQ8XCwJt3MWt_2OZPQOofpdhl5Tvyu-bB5s39D-Gz-2eBLROI2cT1ydl-HQsMOkrcJBcJMOgHAuoC9hzz3wUQWx5Xl8Wg7wU8PK96Q5caDwUWak86-4UWVV2H9cUXB7ObXXSUHGWUO2Dx7Do12KsvEZelcGfKLemkqxn6XY6G_0cYBjgi030xY_r9ATfK3D0fhkgKn0NEGIEcN0WnJ-8oa1O0xAT1_U48KuejH",
  client_id: "h9D4gAwxMqsjr9dm",
  item: mockGetItemResponseNoParams,
  itemId: "da7720eff87c4f5b9504f526ad6f0c6e",
  registered: new Date(1687880984000),
  modified: new Date(1687880984000),
  httpReferrers: [],
  privileges: ["premium:user:geocode:temporary"],
  isPersonalAPIToken: false,
  apiToken1Active: true,
  apiToken2Active: false
};
const mockGetRegisteredAppResponseNoParams: IRegisteredAppResponse = {
  itemId: "da7720eff87c4f5b9504f526ad6f0c6e",
  client_id: "h9D4gAwxMqsjr9dm",
  client_secret: "9304ce3ace33400aa606b57b19b574ae",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687880984000,
  modified: 1687880984000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: ["premium:user:geocode:temporary"],
  isBeta: false,
  isPersonalAPIToken: false,
  customAppLoginShowTriage: false,
  apiToken1Active: true,
  apiToken2Active: false
};
const generateAccessToken1ParamsResponse = {
  access_token:
    "AAPTKUgfudpnh_cXrZ7wRiqGE-Ab-2vuhTJqKU7sefbQ8XCwJt3MWt_2OZPQOofpdhl5Tvyu-bB5s39D-Gz-2eBLROI2cT1ydl-HQsMOkrcJBcJMOgHAuoC9hzz3wUQWx5Xl8Wg7wU8PK96Q5caDwUWak86-4UWVV2H9cUXB7ObXXSUHGWUO2Dx7Do12KsvEZelcGfKLemkqxn6XY6G_0cYBjgi030xY_r9ATfK3D0fhkgKn0NEGIEcN0WnJ-8oa1O0xAT1_U48KuejH",
  expires_in: 1800
};
const generateAccessToken2ParamsResponse = {
  access_token:
    "AAPTKUgfudpnh_cXrZ7wRiqGE-Ab-2vuhTJqKU7sefbQ8XCwJt3MWt_2OZPQOofpdhl5Tvyu-bB5s39D-Gz-2eBLROI2cT1ydl-HQsMOkrcJBcJMOgHAuoC9hzz3wUQWx5Xl8Wg7wU8PK96Q5caDwUWak86-4UWVV2H9cUXB7ObXXSUHGWUO2Dx7Do12KsvEZelcGfKLemkqxn6XY6G_0cYBjgi030xY_r9ATfK3D0fhkgKn0NEGIEcN0WnJ-8oa1O0xAT2_U48KuejH",
  expires_in: 1800
};

/* test plans:
  1. create key without IRequestOptions (Enterprise portal, missing httpReferrers, non-empty privilege)
  2. create key with IRequestOptions (Online portal, with httpReferrers, with IItemAdd-tags, empty privilege)
  3. throw err if privilege is invalid
  4. auto generateToken if auth token is invalid
   */
describe("createApiKey()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;

  beforeAll(() => {
    authOnline = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
  });

  afterEach(() => fetchMock.restore());

  test("should create an API key and generate the access token", async () => {
    // step 1 create item
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/addItem",
      mockCreateItemResponseNoParams,
      200,
      "createItemRoute",
      1
    );

    // step 2 register app
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/registerApp",
      mockRegisterAppResponseNoParams,
      200,
      "registerAppRoute",
      1
    );

    // step 3 update item with expiration dates
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/da7720eff87c4f5b9504f526ad6f0c6e/update",
      updateItemResponseNoParams,
      200,
      "updateItemRoute",
      1
    );

    // step 4 get item
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/da7720eff87c4f5b9504f526ad6f0c6e",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    // step 5 generate access token 1
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/token",
      generateAccessToken1ParamsResponse,
      200,
      "generateToken1Route",
      1
    );

    // step 6 get registered app info to get updated active key status
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/da7720eff87c4f5b9504f526ad6f0c6e/registeredAppInfo",
      mockGetRegisteredAppResponseNoParams,
      200,
      "getRegisteredAppInfoRoute",
      2
    );

    // run function
    const creatApiKeyResponse = await createApiKey({
      privileges: ["premium:user:geocode:temporary"],
      title: "test 4",
      description: "test 4",
      authentication: authOnline,
      apiToken1ExpirationDate: TOMORROW,
      generateToken1: true
    });

    // verify create item
    expect(fetchMock.called("createItemRoute")).toBe(true);
    const actualOptionAddItemRoute = fetchMock.lastOptions("createItemRoute");
    expect(actualOptionAddItemRoute.body).toContain("f=json");
    expect(actualOptionAddItemRoute.body).toContain("token=fake-token");
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("title", "test 4")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("type", "Application")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("description", "test 4")
    );

    // verify register app
    expect(fetchMock.called("registerAppRoute")).toBe(true);
    const actualOptionRegisterAppRoute =
      fetchMock.lastOptions("registerAppRoute");
    expect(actualOptionRegisterAppRoute.body).toContain("f=json");
    expect(actualOptionRegisterAppRoute.body).toContain("token=fake-token");
    expect(actualOptionRegisterAppRoute.body).toContain(
      "itemId=da7720eff87c4f5b9504f526ad6f0c6e"
    );
    expect(actualOptionRegisterAppRoute.body).toContain("appType=multiple");
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("httpReferrers", JSON.stringify([]))
    );

    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam(
        "privileges",
        JSON.stringify(["premium:user:geocode:temporary"])
      )
    );

    // verify updating item with expiration dates
    expect(fetchMock.called("updateItemRoute")).toBe(true);
    const actualOptionUpdateItemRoute =
      fetchMock.lastOptions("updateItemRoute");
    console.log(actualOptionUpdateItemRoute.body);

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(creatApiKeyResponse).toEqual(keyResponseExpectedNoParams);
  });
});
