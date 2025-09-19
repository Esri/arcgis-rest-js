import fetchMock from "fetch-mock";
import { TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { ICreateItemResponse, IItem } from "@esri/arcgis-rest-portal";
import { IRegisteredAppResponse } from "../src/shared/types/appType.js";
import { IOAuthApp } from "../src/shared/types/oAuthType.js";
import { createOAuthApp } from "../src/createOAuthApp.js";

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
const mockCreateItemResponseFirstTestCase: ICreateItemResponse = {
  folder: "",
  id: "dcab477145cd4063918f444fd95e50d3",
  success: true
};

const mockRegisterAppResponseFirstTestCase: IRegisteredAppResponse = {
  itemId: "dcab477145cd4063918f444fd95e50d3",
  client_id: "l7yQA6V7PH4TzP3j",
  client_secret: "73721f023d0141558a94048315d664b1",
  appType: "multiple",
  redirect_uris: [],
  registered: 1689696500000,
  modified: 1689696500000,
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
  id: "dcab477145cd4063918f444fd95e50d3",
  owner: "3807206777",
  created: 1689696499000,
  isOrgItem: true,
  modified: 1689696499000,
  guid: null,
  name: null,
  title: "title 2",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
  tags: [],
  snippet: "desc 2",
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

const oAuthAppResponseExpectedFirstTestCase: IOAuthApp = {
  item: mockGetItemResponseFirstTestCase,
  itemId: "dcab477145cd4063918f444fd95e50d3",
  client_id: "l7yQA6V7PH4TzP3j",
  client_secret: "73721f023d0141558a94048315d664b1",
  redirect_uris: [],
  registered: new Date(1689696500000),
  modified: new Date(1689696500000)
};

// second successful test mock response
const mockCreateItemResponseSecondTestCase: ICreateItemResponse = {
  success: true,
  id: "c779ff3e6164464985ae0cf65573ba9e",
  folder: ""
};

const mockRegisterAppResponseSecondTestCase: IRegisteredAppResponse = {
  itemId: "c779ff3e6164464985ae0cf65573ba9e",
  client_id: "Emf9n95ZFGquEedM",
  client_secret: "7fbef91d711f48e1a8e5f54f2bfd7bea",
  appType: "multiple",
  redirect_uris: ["www.esri.com", "https://developers.arcgis.com/"],
  registered: 1689697494000,
  modified: 1689697494000,
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
  id: "c779ff3e6164464985ae0cf65573ba9e",
  owner: "3807206777",
  created: 1689697493000,
  isOrgItem: true,
  modified: 1689697493000,
  guid: null,
  name: null,
  title: "title 3",
  type: "Application",
  typeKeywords: ["Application", "Registered App"],
  description: null,
  tags: ["tag_1", "tag_2"],
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
  scoreCompleteness: 25,
  groupDesignations: null,
  tokenExpirationDate: -1,
  lastViewed: -1
};

const oAuthAppResponseExpectedSecondTestCase: IOAuthApp = {
  item: mockGetItemResponseSecondTestCase,
  itemId: "c779ff3e6164464985ae0cf65573ba9e",
  client_id: "Emf9n95ZFGquEedM",
  client_secret: "7fbef91d711f48e1a8e5f54f2bfd7bea",
  redirect_uris: ["www.esri.com", "https://developers.arcgis.com/"],
  registered: new Date(1689697494000),
  modified: new Date(1689697494000)
};

/* test plans:
  1. create OAuth app (redirect_uri not provided)
  2. create OAuth app (redirect_uri provided, with IItemAdd-tags)
*/
describe("createOAuthApp()", () => {
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

  it("should create OAuth app (redirect_uri not provided)", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/addItem",
      mockCreateItemResponseFirstTestCase,
      200,
      "addItemRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/registerApp",
      mockRegisterAppResponseFirstTestCase,
      200,
      "registerAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/dcab477145cd4063918f444fd95e50d3",
      mockGetItemResponseFirstTestCase,
      200,
      "getItemRoute",
      1
    );

    const creatOAuthAppResponse = await createOAuthApp({
      title: "title 2",
      snippet: "desc 2",
      authentication: authOnline
    });

    // verify first fetch
    expect(fetchMock.called("addItemRoute")).toBe(true);
    const actualOptionAddItemRoute = fetchMock.lastOptions("addItemRoute");
    expect(actualOptionAddItemRoute.body).toContain("f=json");
    expect(actualOptionAddItemRoute.body).toContain("token=fake-token");
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("title", "title 2")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("type", "Application")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("snippet", "desc 2")
    );

    // verify second fetch
    expect(fetchMock.called("registerAppRoute")).toBe(true);
    const actualOptionRegisterAppRoute =
      fetchMock.lastOptions("registerAppRoute");
    expect(actualOptionRegisterAppRoute.body).toContain("f=json");
    expect(actualOptionRegisterAppRoute.body).toContain("token=fake-token");
    expect(actualOptionRegisterAppRoute.body).toContain(
      "itemId=dcab477145cd4063918f444fd95e50d3"
    );
    expect(actualOptionRegisterAppRoute.body).toContain("appType=multiple");
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("redirect_uris", JSON.stringify([]))
    );
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("httpReferrers", JSON.stringify([]))
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
    expect(creatOAuthAppResponse).toEqual(
      oAuthAppResponseExpectedFirstTestCase
    );
  });

  it("should create OAuth app (redirect_uri provided, with IItemAdd-tags)", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/3807206777/addItem",
      mockCreateItemResponseSecondTestCase,
      200,
      "addItemRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/registerApp",
      mockRegisterAppResponseSecondTestCase,
      200,
      "registerAppRoute",
      1
    );
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/items/c779ff3e6164464985ae0cf65573ba9e",
      mockGetItemResponseSecondTestCase,
      200,
      "getItemRoute",
      1
    );

    const creatOAuthAppResponse = await createOAuthApp({
      title: "title 3",
      authentication: authOnline,
      redirect_uris: ["www.esri.com", "https://developers.arcgis.com/"],
      tags: ["tag_1", "tag_2"]
    });

    // verify first fetch
    expect(fetchMock.called("addItemRoute")).toBe(true);
    const actualOptionAddItemRoute = fetchMock.lastOptions("addItemRoute");
    expect(actualOptionAddItemRoute.body).toContain("f=json");
    expect(actualOptionAddItemRoute.body).toContain("token=fake-token");
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("title", "title 3")
    );
    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("type", "Application")
    );

    expect(actualOptionAddItemRoute.body).toContain(
      encodeParam("tags", ["tag_1", "tag_2"])
    );

    // verify second fetch
    expect(fetchMock.called("registerAppRoute")).toBe(true);
    const actualOptionRegisterAppRoute =
      fetchMock.lastOptions("registerAppRoute");
    expect(actualOptionRegisterAppRoute.body).toContain("f=json");
    expect(actualOptionRegisterAppRoute.body).toContain("token=fake-token");
    expect(actualOptionRegisterAppRoute.body).toContain(
      "itemId=c779ff3e6164464985ae0cf65573ba9e"
    );
    expect(actualOptionRegisterAppRoute.body).toContain("appType=multiple");
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam(
        "redirect_uris",
        JSON.stringify(["www.esri.com", "https://developers.arcgis.com/"])
      )
    );
    expect(actualOptionRegisterAppRoute.body).toContain(
      encodeParam("httpReferrers", JSON.stringify([]))
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
    expect(creatOAuthAppResponse).toEqual(
      oAuthAppResponseExpectedSecondTestCase
    );
  });
});
