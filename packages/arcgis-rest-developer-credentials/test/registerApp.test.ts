import fetchMock from "fetch-mock";
import { registerApp } from "../src/index.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../scripts/test-helpers.js";

const MockResponse: any = {
  itemId: "e52db2cdc16640a0b1c69727abdf48c8",
  client_id: "GGjeDjEY6kKEiDmX",
  client_secret: "e2b8958384c74d3a9f09e988d782b473",
  appType: "apikey",
  redirect_uris: [],
  registered: 1380561095000,
  modified: 1380561095000,
  apiKey: "FAKE_API_KEY"
};

describe("registerApp()", () => {
  // reset fetch mock to clear mocks and get a clean test environment
  afterEach(() => {
    fetchMock.restore();
  });

  it("should register an app given auth and an item id", () => {
    const mockUrl = "https://www.arcgis.com/sharing/rest/oauth2/registerApp";
    fetchMock.post(mockUrl, MockResponse);

    const fakeAuth = new ArcGISIdentityManager({
      token: "FAKE_TOKEN",
      tokenExpires: TOMORROW
    });

    return registerApp({
      itemId: "e52db2cdc16640a0b1c69727abdf48c8",
      appType: "apikey",
      redirect_uris: [],
      privileges: [],
      httpReferrers: [],
      authentication: fakeAuth
    }).then((response) => {
      // ask fetch mock for the last URL it saw a request for and write a test against it.
      // use to confirm that the URL matches what you expect or that you specificed query params properly
      expect(fetchMock.lastUrl()).toEqual(mockUrl);

      // ask fetch mock the last set of fetch options it saw and write a test for it last "options"
      // used to confirm that you sent a parameter properly to the API
      expect(fetchMock.lastOptions()?.body).toContain("appType=apikey");

      // confirm that the response contains the expected values
      expect(response.apiKey).toEqual("FAKE_API_KEY");
    });
  });

  it("should throw an error when invalid privileges are provided", () => {
    const mockUrl = "https://www.arcgis.com/sharing/rest/oauth2/registerApp";
    fetchMock.post(mockUrl, MockResponse);

    const fakeAuth = new ArcGISIdentityManager({
      token: "FAKE_TOKEN",
      tokenExpires: TOMORROW
    });

    return registerApp({
      itemId: "e52db2cdc16640a0b1c69727abdf48c8",
      appType: "apikey",
      redirect_uris: [],
      privileges: ["Invalid Privilege"] as any,
      httpReferrers: [],
      authentication: fakeAuth
    }).catch((e) => {
      expect(e.message).toEqual("Contain invalid privileges");
    });
  });
});
