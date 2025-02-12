import fetchMock from "fetch-mock";
import { getRegisteredAppInfo } from "../../src/shared/getRegisteredAppInfo.js";
import {
  IGetAppInfoOptions,
  IRegisteredAppResponse
} from "../../src/shared/types/appType.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

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

const mockNormalResponse: IRegisteredAppResponse = {
  itemId: "fake-itemID",
  client_id: "fake-client_id",
  client_secret: "fake-client_secret",
  appType: "apikey",
  redirect_uris: [],
  registered: 1380561095000,
  modified: 1380561095000,
  apiKey: "fake-apikey",
  apnsProdCert: null,
  apnsSandboxCert: null,
  gcmApiKey: null,
  isBeta: false,
  httpReferrers: ["https://www.esri.com/en-us/home"],
  privileges: ["premium:user:geocode:temporary"],
  isPersonalAPIToken: false,
  apiToken1Active: false,
  apiToken2Active: false,
  customAppLoginShowTriage: false
};

/* test plans:
1. get app without IRequestOptions (APIKey type app, Enterprise portal) => root url should be enterprise
2. get app with IRequestOptions (non APIKey type app, Online portal) => apikey should be omitted in response; root url should be online
3. throw error if itemId is not found
4. auto generateToken if getAppInfo replied with invalid token error
5. throw error if response status code >= 400
 */

describe("registerApp()", () => {
  // setup IdentityManager
  let authOnline: ArcGISIdentityManager;
  let authEnterprise: ArcGISIdentityManager;
  let authInvalidToken: ArcGISIdentityManager;

  beforeAll(function () {
    authOnline = new ArcGISIdentityManager({
      username: "fake-username",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authEnterprise = new ArcGISIdentityManager({
      username: "fake-username",
      password: "fake-password",
      portal: "https://machine.domain.com/webadaptor/sharing/rest",
      token: "fake-token",
      tokenExpires: TOMORROW
    });
    authInvalidToken = new ArcGISIdentityManager({
      username: "fake-username",
      password: "fake-password",
      portal: "https://www.arcgis.com/sharing/rest",
      token: "invalid-token",
      tokenExpires: TOMORROW
    });
  });
  afterEach(() => fetchMock.restore());

  // normal workflow
  it("should get app without IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/content/users/fake-username/items/fake-itemID/registeredAppInfo",
      mockNormalResponse,
      200,
      "getAppRoute",
      1
    );

    const requestOptions: IGetAppInfoOptions = {
      itemId: "fake-itemID",
      authentication: authEnterprise
    };

    const appResponse = await getRegisteredAppInfo(requestOptions);

    expect(fetchMock.called("getAppRoute")).toBe(true); // getApp route should be called

    // fetch({actual}) vs fetch({expect})
    const actualOption = fetchMock.lastOptions("getAppRoute");
    expect(actualOption.body).toContain("f=json"); // body should contain necessary key-value pairs
    expect(actualOption.body).toContain("token=fake-token");

    // actual return vs expected return
    const {
      apnsProdCert,
      apnsSandboxCert,
      gcmApiKey,
      isBeta,
      customAppLoginShowTriage,
      ...expectedResponse
    } = mockNormalResponse;

    expect(appResponse).toEqual({
      // object deep equality check
      ...expectedResponse,
      registered: new Date(1380561095000),
      modified: new Date(1380561095000)
    });
  });

  it("should get app with IRequestOptions", async function () {
    // setup FM response
    const { apiKey, ...mockResponseWithoutApiKey } = mockNormalResponse;
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/fake-username/items/fake-itemID/registeredAppInfo",
      {
        ...mockResponseWithoutApiKey,
        appType: "multiple"
      },
      200,
      "getAppRoute",
      1
    );

    const requestOptions: IGetAppInfoOptions = {
      itemId: "fake-itemID",
      authentication: authOnline,
      httpMethod: "GET"
    };

    const appResponse = await getRegisteredAppInfo(requestOptions);

    expect(fetchMock.called("getAppRoute")).toBe(true); // registered route should be called

    // fetch({actual}) vs fetch({expect})
    const actualOption = fetchMock.lastOptions("getAppRoute");
    expect(actualOption.body).toContain("f=json"); // body should contain necessary key-value pairs
    expect(actualOption.body).toContain("token=fake-token");

    // actual getRegisteredAppInfo() return vs expected return
    const {
      apnsProdCert,
      apnsSandboxCert,
      gcmApiKey,
      isBeta,
      customAppLoginShowTriage,
      ...expectedResponse
    } = {
      ...mockResponseWithoutApiKey,
      appType: "multiple"
    } as IRegisteredAppResponse;

    expect(appResponse).toEqual({
      // object deep equality check
      ...expectedResponse,
      registered: new Date(1380561095000),
      modified: new Date(1380561095000)
    });
  });

  // error
  it("should throw error if itemId is not found", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/content/users/fake-username/items/unknown-itemID/registeredAppInfo",
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
      await getRegisteredAppInfo({
        itemId: "unknown-itemID",
        authentication: authOnline
      });
      fail("Should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppRoute")).toBe(true);
      expect(e.message).toBe(
        "CONT_0001: Item does not exist or is inaccessible."
      );
    }
  });

  it("should auto generateToken if getAppInfo replied with invalid token error", async function () {
    // setup FM response
    fetchMock
      .mock(
        {
          url: "https://www.arcgis.com/sharing/rest/content/users/fake-username/items/fake-itemId/registeredAppInfo", // url should match
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
      await getRegisteredAppInfo({
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

  // server status code: 400/500
  it("should throw error if server status code >= 400", async function () {
    // setup FM response
    fetchMock.mock(
      {
        url: "https://www.arcgis.com/sharing/rest/content/users/fake-username/items/unknown-itemID/registeredAppInfo",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        name: "getAppInfoRoute",
        repeat: 1
      },
      {
        status: 500, // internal server err for instance
        headers: { "Content-Type": "application/json" }
      }
    );

    try {
      await getRegisteredAppInfo({
        itemId: "unknown-itemID",
        authentication: authOnline
      });
      fail("Should have rejected.");
    } catch (e: any) {
      expect(fetchMock.called("getAppInfoRoute")).toBe(true);
      expect(e.message).toBe("HTTP 500: Internal Server Error");
    }
  });
});
