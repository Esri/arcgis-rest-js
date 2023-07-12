import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse, IApiKeyResponse, updateApiKey } from "../src";

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
  privileges: [
    "premium:user:networkanalysis:servicearea",
    "premium:user:networkanalysis:routing"
  ],
  isBeta: false,
  apiKey:
    "AAPK27f2b7b36acd49778e872bb59fdc6137WeIxBAmg3WKOEIoeUPhuVDRyyBXxKCIaOHn7Dl2zhkMvy0mBndPvk0BSWRsxhnHb"
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
  privileges: [
    "premium:user:networkanalysis:servicearea",
    "premium:user:networkanalysis:routing"
  ],
  isBeta: false
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
  apiKey:
    "AAPK27f2b7b36acd49778e872bb59fdc6137WeIxBAmg3WKOEIoeUPhuVDRyyBXxKCIaOHn7Dl2zhkMvy0mBndPvk0BSWRsxhnHb"
};

// second successful test mock response
const mockGetAppResponseWithParams: IRegisteredAppResponse = {
  itemId: "83b35d04cd914e81b52e0c3e532eddec",
  client_id: "aT1o4DVzP5tnnfHa",
  client_secret: "dc76300a548849b8a985bb40db45ebc5",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687945378000,
  modified: 1687945378000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [],
  privileges: ["premium:user:networkanalysis:routing"],
  isBeta: false,
  apiKey:
    "AAPKb5da4a3b877d4a409ac1ee25d45703956AMdCnhP3UR6Q8XR5wRoFx6TvHwauLnx4K-pt-5fguVsG1hzNxsUossx1dIVXyRw"
};
const mockUpdateKeyResponseWithParams: IRegisteredAppResponse = {
  itemId: "83b35d04cd914e81b52e0c3e532eddec",
  client_id: "aT1o4DVzP5tnnfHa",
  client_secret: "dc76300a548849b8a985bb40db45ebc5",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687945378000,
  modified: 1687945474000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: ["https://github.com/Esri/arcgis-rest-js"],
  privileges: [],
  isBeta: false
};
const mockGetItemResponseWithParams: IItem = {
  id: "83b35d04cd914e81b52e0c3e532eddec",
  owner: "3807206777",
  created: 1687945378000,
  isOrgItem: true,
  modified: 1687945378000,
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
const keyResponseExpectedWithParams: IApiKeyResponse = {
  item: mockGetItemResponseWithParams,
  itemId: "83b35d04cd914e81b52e0c3e532eddec",
  registered: new Date(1687945378000),
  modified: new Date(1687945474000),
  httpReferrers: ["https://github.com/Esri/arcgis-rest-js"],
  privileges: [],
  apiKey:
    "AAPKb5da4a3b877d4a409ac1ee25d45703956AMdCnhP3UR6Q8XR5wRoFx6TvHwauLnx4K-pt-5fguVsG1hzNxsUossx1dIVXyRw"
};

/* test plan
1. update key without IRequestOptions (Enterprise portal, no httpReferrers, no privileges)
2. update key with IRequestOptions (Online portal, with httpReferrers, with privileges)
3. throw err if itemId is not found
4. throw err of itemId is found but appType not apiKey
5. throw err if privilege is invalid
6. auto generateToken if auth token is invalid

note:
 originally, I need test 4 cases:
 I. no httpReferrers, no privileges
 II. with httpReferrers, no privileges
 III. no httpReferrers, with privileges
 IV. with httpReferrers, with privileges

Because httpReferrers and privileges are processed independently, test case 1 & 2 can fully cover omitted/non-omitted cases
for both httpReferrers and privileges
 */
describe("updateApiKey()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;
  let authEnterprise: ArcGISIdentityManager;
  let authInvalidToken: ArcGISIdentityManager;

  beforeAll(function () {
    authOnline = new ArcGISIdentityManager({
      username: "3807206777",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authEnterprise = new ArcGISIdentityManager({
      username: "3807206777",
      password: "fake-password",
      portal: "https://machine.domain.com/webadaptor/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authInvalidToken = new ArcGISIdentityManager({
      username: "3807206777",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "invalid-token",
      tokenExpires: TOMORROW
    });
  });
  afterEach(fetchMock.restore);

  it("should update key without IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/users/3807206777/items/4832e6bc5fa540129822212c12168710/registeredAppInfo",
      mockGetAppResponseNoParams,
      200,
      "getAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/oauth2/apps/ShnJhKhzr2cVCujl/update",
      mockUpdateKeyResponseNoParams,
      200,
      "updateKeyRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/items/4832e6bc5fa540129822212c12168710",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    const updateApiKeyResponse = await updateApiKey({
      itemId: "4832e6bc5fa540129822212c12168710",
      authentication: authEnterprise
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
  it("should update key with IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/83b35d04cd914e81b52e0c3e532eddec/registeredAppInfo",
      mockGetAppResponseWithParams,
      200,
      "getAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/apps/aT1o4DVzP5tnnfHa/update",
      mockUpdateKeyResponseWithParams,
      200,
      "updateKeyRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/83b35d04cd914e81b52e0c3e532eddec",
      mockGetItemResponseWithParams,
      200,
      "getItemRoute",
      1
    );

    const updateApiKeyResponse = await updateApiKey({
      itemId: "83b35d04cd914e81b52e0c3e532eddec",
      privileges: [],
      httpReferrers: ["https://github.com/Esri/arcgis-rest-js"],
      authentication: authOnline,
      httpMethod: "GET"
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
        JSON.stringify(["https://github.com/Esri/arcgis-rest-js"])
      )
    );
    expect(actualOptionUpdateKeyRoute.body).toContain(
      encodeParam("privileges", JSON.stringify([]))
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(updateApiKeyResponse).toEqual(keyResponseExpectedWithParams);
  });
  it("should throw err if itemId is not found", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/unknown-itemId/registeredAppInfo",
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
      await updateApiKey({
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
  it("should throw err of itemId is found but appType not apiKey", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/cddcacee5848488bb981e6c6ff91ab79/registeredAppInfo",
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
    try {
      await updateApiKey({
        itemId: "cddcacee5848488bb981e6c6ff91ab79",
        authentication: authOnline
      });
      fail("should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(e.message).toBe("Item is not an API key.");
    }
  });
  it("should throw err if privilege is invalid", async function () {
    fetchMock.mock("*", 400);
    try {
      await updateApiKey({
        itemId: "someId",
        privileges: ["invalid privileges"] as any,
        authentication: authOnline
      });
      fail("should have rejected.");
    } catch (e: any) {
      expect(e.message).toBe(
        "The `privileges` option contains invalid privileges."
      );
      expect(fetchMock.called()).toBe(false); // no fetch should be called
    }
  });

  it("should auto generateToken if auth token is invalid", async function () {
    // setup FM response
    fetchMock
      .mock(
        {
          url: "https://www.arcgis.com/sharing/rest/content/users/3807206777/items/someId/registeredAppInfo", // url should match
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
      await updateApiKey({
        itemId: "someId",
        privileges: [],
        authentication: authInvalidToken
      });
      fail("Should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(fetchMock.called("generateToken")).toBe(true);
      expect(e.message).toBe(
        "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
      );
    }
  });
});
