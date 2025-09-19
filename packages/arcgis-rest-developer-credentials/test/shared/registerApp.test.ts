import fetchMock from "fetch-mock";
import {
  IRegisterAppOptions,
  IRegisteredAppResponse
} from "../../src/shared/types/appType.js";
import { registerApp } from "../../src/shared/registerApp.js";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { Privileges } from "../../src/shared/enum/privileges.js";
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
1. create app without IRequestOptions (APIKey type app, empty redirected_uri, Enterprise portal) => empty or non-empty array can be added to params normally; root url should be enterprise
2. create key with IRequestOptions (non APIKey type app, empty privilege, Online portal) => apikey should be omitted in response; empty privilege is acceptable; root url should be online
3. throw error if arePrivilegesValid() false
4. auto generateToken if registerApp replied with invalid token error
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
  beforeEach(() => {
    fetchMock.restore();
  });

  // normal workflow
  it("should create app without IRequestOptions", async function () {
    // setup FM response
    setFetchMockPOSTFormUrlencoded(
      "https://machine.domain.com/webadaptor/sharing/rest/oauth2/registerApp",
      mockNormalResponse,
      200,
      "registerAppRoute",
      1
    );

    const requestOptions: IRegisterAppOptions = {
      itemId: "fake-itemID",
      appType: "apikey",
      redirect_uris: [],
      httpReferrers: ["https://www.esri.com/en-us/home"],
      privileges: ["premium:user:geocode:temporary"],
      authentication: authEnterprise
    };

    const appResponse = await registerApp(requestOptions);

    expect(fetchMock.called("registerAppRoute")).toBe(true); // registered route should be called

    // fetch({actual}) vs fetch({expect})
    const actualOption = fetchMock.lastOptions("registerAppRoute");
    expect(actualOption?.body).toContain("f=json"); // body should contain necessary key-value pairs
    expect(actualOption?.body).toContain("token=fake-token");
    expect(actualOption?.body).toContain("itemId=fake-itemID");
    expect(actualOption?.body).toContain("appType=apikey");
    expect(actualOption?.body).toContain(
      encodeParam("redirect_uris", JSON.stringify(requestOptions.redirect_uris))
    );
    expect(actualOption?.body).toContain(
      encodeParam("httpReferrers", JSON.stringify(requestOptions.httpReferrers))
    );
    expect(actualOption?.body).toContain(
      encodeParam("privileges", JSON.stringify(requestOptions.privileges))
    );

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

  it("should create key with IRequestOptions", async function () {
    // setup FM response
    const { apiKey, ...mockResponseWithoutApiKey } = mockNormalResponse;

    setFetchMockPOSTFormUrlencoded(
      "https://www.arcgis.com/sharing/rest/oauth2/registerApp",
      {
        ...mockResponseWithoutApiKey,
        appType: "multiple",
        privileges: []
      },
      200,
      "registerAppRoute",
      1
    );

    const requestOptions: IRegisterAppOptions = {
      itemId: "fake-itemID",
      appType: "multiple",
      redirect_uris: [],
      httpReferrers: ["https://www.esri.com/en-us/home"],
      privileges: [],
      authentication: authOnline,
      httpMethod: "GET"
    };

    const appResponse = await registerApp(requestOptions);

    expect(fetchMock.called("registerAppRoute")).toBe(true); // registered route should be called

    // fetch({actual}) vs fetch({expect})
    const actualOption = fetchMock.lastOptions("registerAppRoute");
    expect(actualOption?.body).toContain("f=json"); // body should contain necessary key-value pairs
    expect(actualOption?.body).toContain("token=fake-token");
    expect(actualOption?.body).toContain("itemId=fake-itemID");
    expect(actualOption?.body).toContain("appType=multiple");
    expect(actualOption?.body).toContain(
      encodeParam("redirect_uris", JSON.stringify(requestOptions.redirect_uris))
    );
    expect(actualOption?.body).toContain(
      encodeParam("httpReferrers", JSON.stringify(requestOptions.httpReferrers))
    );
    expect(actualOption?.body).toContain(
      encodeParam("privileges", JSON.stringify(requestOptions.privileges))
    );

    // actual return vs expected return
    const {
      apnsProdCert,
      apnsSandboxCert,
      gcmApiKey,
      isBeta,
      customAppLoginShowTriage,
      ...expectedResponse
    } = {
      ...mockResponseWithoutApiKey,
      appType: "multiple",
      privileges: []
    } as IRegisteredAppResponse;

    expect(appResponse).toEqual({
      // object deep equality check
      ...expectedResponse,
      registered: new Date(1380561095000),
      modified: new Date(1380561095000)
    });
  });

  it("should auto generateToken if registerApp replied with invalid token error", async function () {
    // setup FM response
    fetchMock
      .mock(
        {
          url: "https://www.arcgis.com/sharing/rest/oauth2/registerApp", // url should match
          method: "POST", // http method should match
          headers: { "Content-Type": "application/x-www-form-urlencoded" }, // content type should match
          name: "registerAppRoute",
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
      await registerApp({
        itemId: "fake-itemID",
        appType: "apikey",
        redirect_uris: [],
        httpReferrers: ["https://www.esri.com/en-us/home"],
        privileges: ["premium:user:geocode:temporary"],
        authentication: authInvalidToken
      });
      fail("Should have rejected.");
    } catch (e: any) {
      // generateToken() is called
      expect(fetchMock.called("registerAppRoute")).toBe(true);
      expect(fetchMock.called("generateToken")).toBe(true);
      expect(e.message).toBe(
        "TOKEN_REFRESH_FAILED: 400: Unable to generate token."
      );
    }
  });
});
