import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { deleteApiKey } from "../src/deleteApiKey.js";
import { IDeleteApiKeyResponse } from "../src/shared/types/apiKeyType.js";
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
  itemId: "b33ff3e08f0d4b389707e3c6b4baff62",
  client_id: "AeTZQlDDrXYE7eaN",
  client_secret: "5805b9225ad94a099e3251a0271dc6bb",
  appType: "apikey",
  redirect_uris: [],
  registered: 1689755375000,
  modified: 1689755375000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: [],
  isBeta: false,
  apiKey:
    "AAPKc6eb9e276b82485d84c43155a08a213eF96BpZgrbUlXC-CusSs5WRHdIM6y-Ksl2DTikR5wZdbFmd0Q90cT5iIEqZLx6hGI"
};

const mockGetItemResponse: IItem = {
  id: "b33ff3e08f0d4b389707e3c6b4baff62",
  owner: "3807206777",
  created: 1689755375000,
  isOrgItem: true,
  modified: 1689755375000,
  guid: null,
  name: null,
  title: "t6",
  type: "API Key",
  typeKeywords: ["API Key", "Registered App"],
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

const mockDeleteResponse: IDeleteApiKeyResponse = {
  success: true,
  itemId: "b33ff3e08f0d4b389707e3c6b4baff62"
};

/* test plans:
1. delete API key
2. throw err if itemId is found but appType is wrong
*/
describe("deleteApiKey()", () => {
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

  it("should delete API key", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/b33ff3e08f0d4b389707e3c6b4baff62/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/b33ff3e08f0d4b389707e3c6b4baff62",
      mockGetItemResponse,
      200,
      "getItemRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/b33ff3e08f0d4b389707e3c6b4baff62/delete",
      mockDeleteResponse,
      200,
      "removeItemRoute",
      1
    );

    const deleteResponse = await deleteApiKey({
      itemId: "b33ff3e08f0d4b389707e3c6b4baff62",
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
        appType: "native",
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
      await deleteApiKey({
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        authentication: authOnline
      });
      fail("should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(fetchMock.called("getItemRoute")).toBe(true);
      expect(e.message).toBe("Item is not an API key.");
    }
  });
});
