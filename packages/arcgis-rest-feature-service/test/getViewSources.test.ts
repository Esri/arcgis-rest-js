/* Copyright (c) 2018-2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { getViewSources } from "../src/getViewSources.js";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../scripts/test-helpers.js";

describe("get-view-sources: ", () => {
  const MOCK_USER_SESSION = new ArcGISIdentityManager({
    clientId: "clientId",
    redirectUri: "https://example-app.com/redirect-uri",
    token: "fake-token",
    tokenExpires: TOMORROW,
    refreshToken: "refreshToken",
    refreshTokenExpires: TOMORROW,
    username: "casey",
    password: "123456",
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });
  afterEach(() => {
    fetchMock.restore();
  });
  test("makes request to the admin url", async () => {
    fetchMock.once("*", { currentVersion: 1234 }, { method: "POST" });

    const response = await getViewSources(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer",
      MOCK_USER_SESSION
    );

    expect(response.currentVersion).toBe(1234);

    const [url] = fetchMock.lastCall("*");

    expect(fetchMock.called()).toBe(true);

    expect(url).toContain(
      "https://servicesqa.arcgis.com/orgid/arcgis/rest/services/mysevice/FeatureServer/sources"
    );
  });
});
