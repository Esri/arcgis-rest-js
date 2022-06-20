/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../../scripts/test-helpers.js";

export const MOCK_USER_SESSION = new ArcGISIdentityManager({
  clientId: "clientId",
  redirectUri: "https://example-app.com/redirect-uri",
  token: "fake-token",
  tokenExpires: TOMORROW,
  refreshToken: "refreshToken",
  refreshTokenExpires: TOMORROW,
  username: "jsmith",
  password: "123456",
  portal: "https://myorg.maps.arcgis.com/sharing/rest"
});
