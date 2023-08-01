import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { ICreateItemResponse, IItem } from "@esri/arcgis-rest-portal";

import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IApiKeyResponse } from "../src/shared/types/apiKeyType.js";
import { createApiKey } from "../src/createApiKey.js";
import { Privileges } from "../src/shared/enum/privileges.js";

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
  privileges: [Privileges.NetworkAnalysis, Privileges.Places],
  isBeta: false,
  apiKey:
    "AAPKaf04c75ae5a94b9b942bd715275a1dd361OFPxBJl2ytI7Seqy1RMSSbtC7osyRZNGx9LNz5r6dCdiofOBplYIk1P-ih8sRU"
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
  itemId: "da7720eff87c4f5b9504f526ad6f0c6e",
  registered: new Date(1687880984000),
  modified: new Date(1687880984000),
  httpReferrers: [],
  privileges: [Privileges.NetworkAnalysis, Privileges.Places],
  apiKey:
    "AAPKaf04c75ae5a94b9b942bd715275a1dd361OFPxBJl2ytI7Seqy1RMSSbtC7osyRZNGx9LNz5r6dCdiofOBplYIk1P-ih8sRU"
};

// second successful test mock response
const mockCreateItemResponseWithParams: ICreateItemResponse = {
  success: true,
  id: "704a511c34db431292d9f013ef941985",
  folder: ""
};
const mockRegisterAppResponseWithParams: IRegisteredAppResponse = {
  itemId: "704a511c34db431292d9f013ef941985",
  client_id: "i9XLZhVGmG27Uedy",
  client_secret: "fd803ae8f1b3482d8bf3bf8e290b3d80",
  appType: "apikey",
  redirect_uris: [],
  registered: 1687925730000,
  modified: 1687925730000,
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: [],
  isBeta: false,
  apiKey:
    "AAPKc2bec15a09714b1b8c5aa5e6bff172b871hTeT16SKB6Gf-sQvbWDHNZfz52Dm9xOZWCW-YlcVDkgp1J0nbS3eEor6AUSS8P"
};
const mockGetItemResponseWithParams: IItem = {
  id: "704a511c34db431292d9f013ef941985",
  owner: "3807206777",
  created: 1687925730000,
  isOrgItem: true,
  modified: 1687925730000,
  guid: null,
  name: null,
  title: "test 4",
  type: "API Key",
  typeKeywords: ["API Key", "Registered App"],
  description: "test 4",
  tags: ["tag 1", "tag 2"],
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
  scoreCompleteness: 26,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};
const keyResponseExpectedWithParams: IApiKeyResponse = {
  item: mockGetItemResponseWithParams,
  itemId: "704a511c34db431292d9f013ef941985",
  registered: new Date(1687925730000),
  modified: new Date(1687925730000),
  httpReferrers: [
    "https://www.esri.com/en-us/home",
    "https://esri.okta.com/app/UserHome"
  ],
  privileges: [],
  apiKey:
    "AAPKc2bec15a09714b1b8c5aa5e6bff172b871hTeT16SKB6Gf-sQvbWDHNZfz52Dm9xOZWCW-YlcVDkgp1J0nbS3eEor6AUSS8P"
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
  let authEnterprise: ArcGISIdentityManager;
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
    authInvalidToken = new ArcGISIdentityManager({
      username: "745062756",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "invalid-token",
      tokenExpires: TOMORROW
    });
  });
  afterEach(fetchMock.restore);

  it("should create key without IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/users/745062756/addItem",
      mockCreateItemResponseNoParams,
      200,
      "addItemRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/oauth2/registerApp",
      mockRegisterAppResponseNoParams,
      200,
      "registerAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/items/da7720eff87c4f5b9504f526ad6f0c6e",
      mockGetItemResponseNoParams,
      200,
      "getItemRoute",
      1
    );

    const creatApiKeyResponse = await createApiKey({
      privileges: [Privileges.NetworkAnalysis, Privileges.Places],
      title: "test 4",
      description: "test 4",
      authentication: authEnterprise
    });

    // verify first fetch
    expect(fetchMock.called("addItemRoute")).toBe(true);
    const actualOptionAddItemRoute = fetchMock.lastOptions("addItemRoute");
    expect(actualOptionAddItemRoute.body).toContain("f=json");
    expect(actualOptionAddItemRoute.body).toContain("token=fake-token");
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("title", "test 4")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("type", "API Key")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("description", "test 4")
    );

    // verify second fetch
    expect(fetchMock.called("registerAppRoute")).toBe(true);
    const actualOptionRegisterAppRoute =
      fetchMock.lastOptions("registerAppRoute");
    expect(actualOptionRegisterAppRoute.body).toContain("f=json");
    expect(actualOptionRegisterAppRoute.body).toContain("token=fake-token");
    expect(actualOptionRegisterAppRoute.body).toContain(
      "itemId=da7720eff87c4f5b9504f526ad6f0c6e"
    );
    expect(actualOptionRegisterAppRoute.body).toContain("appType=apikey");
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("redirect_uris", JSON.stringify([]))
    );
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("httpReferrers", JSON.stringify([]))
    );

    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam(
        "privileges",
        JSON.stringify(["premium:user:networkanalysis", "premium:user:places"])
      )
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(creatApiKeyResponse).toEqual(keyResponseExpectedNoParams);
  });
  it("should create key with IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/745062756/addItem",
      mockCreateItemResponseWithParams,
      200,
      "addItemRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/registerApp",
      mockRegisterAppResponseWithParams,
      200,
      "registerAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/704a511c34db431292d9f013ef941985",
      mockGetItemResponseWithParams,
      200,
      "getItemRoute",
      1
    );

    const creatApiKeyResponse = await createApiKey({
      privileges: [],
      title: "test 4",
      description: "test 4",
      httpReferrers: [
        "https://www.esri.com/en-us/home",
        "https://esri.okta.com/app/UserHome"
      ],
      tags: ["tag 1", "tag 2"],
      authentication: authOnline,
      httpMethod: "GET"
    });

    // verify first fetch
    expect(fetchMock.called("addItemRoute")).toBe(true);
    const actualOptionAddItemRoute = fetchMock.lastOptions("addItemRoute");
    expect(actualOptionAddItemRoute.body).toContain("f=json");
    expect(actualOptionAddItemRoute.body).toContain("token=fake-token");
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("title", "test 4")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("type", "API Key")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("description", "test 4")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("tags", ["tag 1", "tag 2"])
    );

    // verify second fetch
    expect(fetchMock.called("registerAppRoute")).toBe(true);
    const actualOptionRegisterAppRoute =
      fetchMock.lastOptions("registerAppRoute");
    expect(actualOptionRegisterAppRoute.body).toContain("f=json");
    expect(actualOptionRegisterAppRoute.body).toContain("token=fake-token");
    expect(actualOptionRegisterAppRoute.body).toContain(
      "itemId=704a511c34db431292d9f013ef941985"
    );
    expect(actualOptionRegisterAppRoute.body).toContain("appType=apikey");
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("redirect_uris", JSON.stringify([]))
    );
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam(
        "httpReferrers",
        JSON.stringify([
          "https://www.esri.com/en-us/home",
          "https://esri.okta.com/app/UserHome"
        ])
      )
    );

    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("privileges", JSON.stringify([]))
    );

    // verify third fetch
    expect(fetchMock.called("getItemRoute")).toBe(true);
    const actualOptionGetItemRoute = fetchMock.lastOptions("getItemRoute");
    expect(actualOptionGetItemRoute.body).toContain("f=json");
    expect(actualOptionGetItemRoute.body).toContain("token=fake-token");

    // verify func return
    expect(creatApiKeyResponse).toEqual(keyResponseExpectedWithParams);
  });
  it("should throw err if privilege is invalid", async function () {
    fetchMock.mock("*", 400);
    try {
      await createApiKey({
        privileges: ["invalid privileges"] as any,
        title: "test 4",
        description: "test 4",
        httpReferrers: [
          "https://www.esri.com/en-us/home",
          "https://esri.okta.com/app/UserHome"
        ],
        tags: ["tag 1", "tag 2"],
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
          url: "https://www.arcgis.com/sharing/rest/content/users/745062756/addItem", // url should match
          method: "POST", // http method should match
          headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
          name: "addItemRoute",
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
      await createApiKey({
        privileges: [],
        title: "test 4",
        description: "test 4",
        httpReferrers: [
          "https://www.esri.com/en-us/home",
          "https://esri.okta.com/app/UserHome"
        ],
        tags: ["tag 1", "tag 2"],
        authentication: authInvalidToken
      });
      fail("Should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("addItemRoute")).toBe(true);
      expect(fetchMock.called("generateToken")).toBe(true);
      expect(e.message).toBe(
        "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
      );
    }
  });
});
