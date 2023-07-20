import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IOAuthApp } from "../src/shared/types/oAuthType.js";
import { getOAuthAppInfo } from "../src/getOAuthAppInfo.js";
import { TOMORROW } from "../../../scripts/test-helpers.js";

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
  itemId: "1273346593154afca9a5f80ec9f25595",
  client_id: "rane9DhJYhCisit7",
  client_secret: "2c68492002e54bdb894ab9afc29e8454",
  appType: "multiple",
  redirect_uris: ["www.esri.com", "www.devtopia.com"],
  registered: 1689748134000,
  modified: 1689748134000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: [],
  isBeta: false
};

const mockGetItemResponse: IItem = {
  id: "1273346593154afca9a5f80ec9f25595",
  owner: "3807206777",
  created: 1689748133000,
  isOrgItem: true,
  modified: 1689748133000,
  guid: null,
  name: null,
  title: "title 6",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
  tags: [],
  snippet: "desc 6",
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

const getOAuthAppResponseExpected: IOAuthApp = {
  itemId: "1273346593154afca9a5f80ec9f25595",
  client_id: "rane9DhJYhCisit7",
  client_secret: "2c68492002e54bdb894ab9afc29e8454",
  redirect_uris: ["www.esri.com", "www.devtopia.com"],
  registered: new Date(1689748134000),
  modified: new Date(1689748134000),
  item: mockGetItemResponse
};

/* test plans:
1. get OAuth app
2. throw err if itemId is found but appType is wrong
*/
describe("getOAuthAppInfo()", () => {
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
  afterEach(fetchMock.restore);

  it("should get OAuth app", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/1273346593154afca9a5f80ec9f25595/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/1273346593154afca9a5f80ec9f25595",
      mockGetItemResponse,
      200,
      "getItemRoute",
      1
    );

    const oAuthAppResponse = await getOAuthAppInfo({
      itemId: "1273346593154afca9a5f80ec9f25595",
      authentication: authOnline
    });

    // verify first fetch
    expect(fetchMock.called("getAppRoute")).toBe(true);
    const actualOptionGetAppRoute = fetchMock.lastOptions("getAppRoute");
    expect(actualOptionGetAppRoute.body).toContain("f=json");
    expect(actualOptionGetAppRoute.body).toContain("token=fake-token");

    // verify second fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify actual return with expected return
    expect(oAuthAppResponse).toEqual(getOAuthAppResponseExpected);
  });

  it("should throw err if itemId is found but appType is wrong", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      {
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
        privileges: [],
        isBeta: false
      } as IRegisteredAppResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/cddcacee5848488bb981e6c6ff91ab79",
      mockGetItemResponse,
      200,
      "getItemRoute",
      1
    );

    try {
      await getOAuthAppInfo({
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        authentication: authOnline
      });
      fail("should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(fetchMock.called("getItemRoute")).toBe(true);
      expect(e.message).toBe("Item is not an OAuth 2.0 app.");
    }
  });
});
