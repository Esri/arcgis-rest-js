import fetchMock from "fetch-mock";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { getApiKey, IRegisteredAppResponse, IApiKeyResponse } from "../src";
import { TOMORROW } from "../../../scripts/test-helpers";

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
  privileges: ["premium:user:networkanalysis"],
  isBeta: false,
  apiKey:
    "AAPKb3c949a2a9b04f5baf4acbd4b96fd2d0aagzgFeAHCXEGzVXtClRiQE2aHgEYyDOUoQmygarcwG5R5PfY04lezi9GZt98L-F"
};

const mockGetItemResponse: IItem = {
  id: "cddcacee5848488bb981e6c6ff91ab79",
  owner: "3807206777",
  created: 1687824329000,
  isOrgItem: true,
  modified: 1687824329000,
  guid: null,
  name: null,
  title: "test 3",
  type: "API Key",
  typeKeywords: ["API Key", "Registered App"],
  description: "tes 3",
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

const getApiKeyResponseExpected: IApiKeyResponse = {
  itemId: "cddcacee5848488bb981e6c6ff91ab79",
  registered: new Date(1687824330000),
  modified: new Date(1687824330000),
  httpReferrers: [],
  privileges: ["premium:user:networkanalysis"],
  apiKey:
    "AAPKb3c949a2a9b04f5baf4acbd4b96fd2d0aagzgFeAHCXEGzVXtClRiQE2aHgEYyDOUoQmygarcwG5R5PfY04lezi9GZt98L-F",
  item: mockGetItemResponse
};

/* test plans:
1. get key without IRequestOptions (Enterprise portal) => root url should be enterprise at getRegisteredAppInfo() and getItem() endpoints
2. get key with IRequestOptions (Online portal) => root url should be online at getRegisteredAppInfo() and getItem() endpoints
3. throw err if itemId is not found by getRegisteredAppInfo()
4. throw err if itemId is found by getRegisteredAppInfo() but appType is not ApiKey
5. throw err if auth token is missing
6. auto generateToken if auth token is invalid
 */
describe("getApiKey()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;
  let authEnterprise: ArcGISIdentityManager;
  let authEmptyToken: ArcGISIdentityManager;
  let authInvalidToken: ArcGISIdentityManager;

  beforeAll(function () {
    authOnline = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authEnterprise = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://machine.domain.com/webadaptor/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authEmptyToken = new ArcGISIdentityManager({});
    authInvalidToken = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "invalid-token",
      tokenExpires: TOMORROW
    });
  });
  afterEach(fetchMock.restore);

  it("should get get key without IRequestOptions (Enterprise portal)", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/users/745062756/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      mockGetAppInfoResponse,
      200,
      "getAppRoute",
      1
    );

    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/items/cddcacee5848488bb981e6c6ff91ab79",
      mockGetItemResponse,
      200,
      "getItemRoute",
      1
    );

    const apiKeyResponse = await getApiKey({
      itemId: "cddcacee5848488bb981e6c6ff91ab79",
      authentication: authEnterprise
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
    expect(apiKeyResponse).toEqual(getApiKeyResponseExpected);
  });
  it("should get key with IRequestOptions (Online portal)", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      mockGetAppInfoResponse,
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

    const apiKeyResponse = await getApiKey({
      itemId: "cddcacee5848488bb981e6c6ff91ab79",
      authentication: authOnline,
      params: { f: "json" },
      httpMethod: "GET"
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
    expect(apiKeyResponse).toEqual(getApiKeyResponseExpected);
  });
  it("should throw err if itemId is not found by getRegisteredAppInfo()", async function () {
    // setup FM response

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/unknown-itemId/registeredAppInfo",
      {
        error: {
          code: 400,
          messageCode: "CONT_0001",
          message: "Item does not exist or is inaccessible.",
          details: []
        }
      },
      200,
      "getAppRoute",
      1
    );

    try {
      await getApiKey({
        itemId: "unknown-itemId",
        authentication: authOnline
      });
      fail("should have rejected");
    } catch (e: any) {
      // any additional fetch() will be unhandled calls that throw an error
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(e.message).toBe(
        "CONT_0001: Item does not exist or is inaccessible."
      );
    }
  });
  it("should throw err if itemId is found by getRegisteredAppInfo() but appType is not ApiKey", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
      {
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        client_id: "EiwLuFlkNwE2Ifye",
        client_secret: "dc7526de9ece482dba4704618fd3de81",
        appType: "multiple", // type is not apiKey and apiKey is excluded from response
        redirect_uris: [],
        registered: 1687824330000,
        modified: 1687824330000,
        apnsProdCert: null,
        apnsSandboxCert: null,
        gcmApiKey: null,
        httpReferrers: [],
        privileges: ["premium:user:networkanalysis"],
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
      await getApiKey({
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        authentication: authOnline
      });
      fail("should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(fetchMock.called("getItemRoute")).toBe(true);
      expect(e.message).toBe("App type is not api key.");
    }
  });
  it("should throw err if auth token is missing", async function () {
    // setup FM response
    fetchMock.mock(
      {
        url: "begin:https://www.arcgis.com/sharing/rest/community/self", // url should match
        method: "GET", // http method should match
        headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
        name: "communitySelfRoute",
        repeat: 1
      },
      {
        body: {
          error: {
            code: 400,
            messageCode: "COM_0019",
            message: "Not logged in.",
            details: []
          }
        },
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

    try {
      await getApiKey({
        itemId: "fake-itemID",
        authentication: authEmptyToken
      });
      fail("Should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("communitySelfRoute")).toBe(true);
      expect(e.message).toBe("COM_0019: Not logged in.");
    }
  });
  it("should auto generateToken if auth token is invalid", async function () {
    // setup FM response
    fetchMock
      .mock(
        {
          url: "https://www.arcgis.com/sharing/rest/content/users/745062756/items/fake-itemId/registeredAppInfo", // url should match
          method: "POST", // http method should match
          headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
          name: "getAppRoute",
          repeat: 1
        },
        {
          body: {
            error: {
              code: 498,
              message: "Invalid token.",
              details: []
            }
          },
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      )
      .mock(
        {
          url: "https://www.arcgis.com/sharing/rest/generateToken", // url should match
          name: "generateToken",
          repeat: 1
        },
        {
          body: {
            error: {
              code: 400,
              message: "Unable to generate token.",
              details: ["Invalid username or password."]
            }
          },
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );

    try {
      await getApiKey({
        itemId: "fake-itemId",
        authentication: authInvalidToken
      });
      fail("Should have rejected.");
    } catch (e: any) {
      // generateToken() is called
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(fetchMock.called("generateToken")).toBe(true);
      expect(e.message).toBe(
        "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
      );
    }
  });
});
