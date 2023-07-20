import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { deleteOAuthApp } from "../src/deleteOAuthApp.js";
import { IDeleteOAuthAppResponse } from "../src/shared/types/oAuthType.js";
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
  itemId: "9667be1f36ed4318b2def449e6b4ff59",
  client_id: "6InEyTunHbkyb0jE",
  client_secret: "8173c21484e448d2819d46a98f760ad4",
  appType: "multiple",
  redirect_uris: [],
  registered: 1689757234000,
  modified: 1689757234000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: [],
  isBeta: false
};

const mockGetItemResponse: IItem = {
  id: "9667be1f36ed4318b2def449e6b4ff59",
  owner: "3807206777",
  created: 1689757234000,
  isOrgItem: true,
  modified: 1689757234000,
  guid: null,
  name: null,
  title: "t3",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
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
  scoreCompleteness: 0,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};

const mockDeleteResponse: IDeleteOAuthAppResponse = {
  success: true,
  itemId: "9667be1f36ed4318b2def449e6b4ff59"
};

/* test plans:
1. delete OAuth app
2. throw err if itemId is found but appType is wrong
*/
describe("deleteOAuthApp()", () => {
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

  it("should delete OAuth app", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/9667be1f36ed4318b2def449e6b4ff59/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/9667be1f36ed4318b2def449e6b4ff59",
      mockGetItemResponse,
      200,
      "getItemRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/9667be1f36ed4318b2def449e6b4ff59/delete",
      mockDeleteResponse,
      200,
      "removeItemRoute",
      1
    );

    const deleteResponse = await deleteOAuthApp({
      itemId: "9667be1f36ed4318b2def449e6b4ff59",
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

    // verify third fetch
    expect(fetchMock.called("removeItemRoute")).toBe(true);
    const actualRemoveItemRoute = fetchMock.lastOptions("removeItemRoute");
    expect(actualRemoveItemRoute.body).toContain("f=json");
    expect(actualRemoveItemRoute.body).toContain("token=fake-token");

    // verify actual return with expected return
    expect(deleteResponse).toEqual(mockDeleteResponse);
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
      await deleteOAuthApp({
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
