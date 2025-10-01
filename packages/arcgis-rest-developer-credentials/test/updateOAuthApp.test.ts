import { describe, test, expect, beforeAll, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IOAuthApp } from "../src/shared/types/oAuthType.js";
import { updateOAuthApp } from "../src/updateOAuthApp.js";

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
const mockGetAppFirstTestCase: IRegisteredAppResponse = {
  itemId: "263de277750c46fca342ef0449d325db",
  client_id: "ZzarVfne3AMRoYIm",
  client_secret: "d963d399fb784d7fa92551a23399c136",
  appType: "multiple",
  redirect_uris: ["www.esri.com"],
  registered: 1689740611000,
  modified: 1689740611000,
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
const mockUpdateOAuthResponseFirstTestCase: IRegisteredAppResponse = {
  itemId: "263de277750c46fca342ef0449d325db",
  client_id: "ZzarVfne3AMRoYIm",
  client_secret: "d963d399fb784d7fa92551a23399c136",
  appType: "multiple",
  redirect_uris: ["www.esri.com"],
  registered: 1689740611000,
  modified: 1689740628000,
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
const mockGetItemResponseFirstTestCase: IItem = {
  id: "263de277750c46fca342ef0449d325db",
  owner: "3807206777",
  created: 1689740610000,
  isOrgItem: true,
  modified: 1689740610000,
  guid: null,
  name: null,
  title: "title 4",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
  tags: [],
  snippet: "desc 4",
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
  scoreCompleteness: 20,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};
const oAuthResponseExpectedFirstTestCase: IOAuthApp = {
  item: mockGetItemResponseFirstTestCase,
  itemId: "263de277750c46fca342ef0449d325db",
  client_id: "ZzarVfne3AMRoYIm",
  client_secret: "d963d399fb784d7fa92551a23399c136",
  redirect_uris: ["www.esri.com"],
  registered: new Date(1689740611000),
  modified: new Date(1689740628000)
};

// second successful test mock response
const mockGetAppSecondTestCase: IRegisteredAppResponse = {
  itemId: "df9c4128c84d45fa8a7da95837590fc5",
  client_id: "lQw8ENRR3CcMmozd",
  client_secret: "d53cb3ec012f47ba88c4e965e8363d96",
  appType: "multiple",
  redirect_uris: [],
  registered: 1689741013000,
  modified: 1689741013000,
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
const mockUpdateOAuthResponseSecondTestCase: IRegisteredAppResponse = {
  itemId: "df9c4128c84d45fa8a7da95837590fc5",
  client_id: "lQw8ENRR3CcMmozd",
  client_secret: "d53cb3ec012f47ba88c4e965e8363d96",
  appType: "multiple",
  redirect_uris: ["www.devtopia.com", "www.arcgis.com"],
  registered: 1689741013000,
  modified: 1689741068000,
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
const mockGetItemResponseSecondTestCase: IItem = {
  id: "df9c4128c84d45fa8a7da95837590fc5",
  owner: "3807206777",
  created: 1689741012000,
  isOrgItem: true,
  modified: 1689741012000,
  guid: null,
  name: null,
  title: "title 5",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
  tags: [],
  snippet: "desc 5",
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
  scoreCompleteness: 20,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};
const oAuthResponseExpectedSecondTestCase: IOAuthApp = {
  item: mockGetItemResponseSecondTestCase,
  itemId: "df9c4128c84d45fa8a7da95837590fc5",
  client_id: "lQw8ENRR3CcMmozd",
  client_secret: "d53cb3ec012f47ba88c4e965e8363d96",
  redirect_uris: ["www.devtopia.com", "www.arcgis.com"],
  registered: new Date(1689741013000),
  modified: new Date(1689741068000)
};

/* test plan
1. update OAuth app (no redirectUris)
2. update OAuth app (with redirectUris)
3. throw err if itemId is found but appType is wrong
 */
describe("updateOAuthApp()", () => {
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

  test("should update OAuth app (no redirectUris)", async () => {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/263de277750c46fca342ef0449d325db/registeredAppInfo",
      mockGetAppFirstTestCase,
      200,
      "getAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/ZzarVfne3AMRoYIm/update",
      mockUpdateOAuthResponseFirstTestCase,
      200,
      "updateOAuthRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/263de277750c46fca342ef0449d325db",
      mockGetItemResponseFirstTestCase,
      200,
      "getItemRoute",
      1
    );

    const updateOAuthAppResponse = await updateOAuthApp({
      itemId: "263de277750c46fca342ef0449d325db",
      authentication: authOnline
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("updateOAuthRoute")).toBe(true);
    const actualUpdateOAuthRoute = fetchMock.lastOptions("updateOAuthRoute");
    expect(actualUpdateOAuthRoute.body).toContain("f=json");
    expect(actualUpdateOAuthRoute.body).toContain("token=fake-token");
    expect(actualUpdateOAuthRoute.body).toContain("appType=multiple");

    expect(actualUpdateOAuthRoute.body).toContain(
      encodeParam("redirect_uris", JSON.stringify(["www.esri.com"]))
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateOAuthAppResponse).toEqual(oAuthResponseExpectedFirstTestCase);
  });

  test("should update OAuth app (with redirectUris)", async () => {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/df9c4128c84d45fa8a7da95837590fc5/registeredAppInfo",
      mockGetAppSecondTestCase,
      200,
      "getAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/lQw8ENRR3CcMmozd/update",
      mockUpdateOAuthResponseSecondTestCase,
      200,
      "updateOAuthRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/df9c4128c84d45fa8a7da95837590fc5",
      mockGetItemResponseSecondTestCase,
      200,
      "getItemRoute",
      1
    );

    const updateOAuthAppResponse = await updateOAuthApp({
      itemId: "df9c4128c84d45fa8a7da95837590fc5",
      authentication: authOnline,
      redirect_uris: ["www.devtopia.com", "www.arcgis.com"]
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("updateOAuthRoute")).toBe(true);
    const actualUpdateOAuthRoute = fetchMock.lastOptions("updateOAuthRoute");
    expect(actualUpdateOAuthRoute.body).toContain("f=json");
    expect(actualUpdateOAuthRoute.body).toContain("token=fake-token");
    expect(actualUpdateOAuthRoute.body).toContain("appType=multiple");

    expect(actualUpdateOAuthRoute.body).toContain(
      encodeParam(
        "redirect_uris",
        JSON.stringify(["www.devtopia.com", "www.arcgis.com"])
      )
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateOAuthAppResponse).toEqual(oAuthResponseExpectedSecondTestCase);
  });

  test("should throw err if itemId is found but appType is wrong", async () => {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      {
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        client_id: "EiwLuFlkNwE2Ifye",
        client_secret: "dc7526de9ece482dba4704618fd3de81",
        appType: "apikey", // type is not apiKey and apiKey is excluded from response
        redirect_uris: [],
        registered: 1687824330000,
        modified: 1687824330000,
        apnsProdCert: null,
        apnsSandboxCert: null,
        gcmApiKey: null,
        httpReferrers: [],
        privileges: [],
        isBeta: false
      } as IRegisteredAppResponse,
      200,
      "getAppRoute",
      1
    );
    await expect(
      updateOAuthApp({
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        authentication: authOnline
      })
    ).rejects.toThrow("Item is not an OAuth 2.0 app.");
    expect(fetchMock.called("getAppRoute")).toBe(true);
  });
});
