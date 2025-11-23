/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";
import { ApplicationCredentialsManager } from "../src/index.js";
import { YESTERDAY, TOMORROW } from "../../../scripts/test-helpers.js";
import { ArcGISTokenRequestError } from "../src/utils/ArcGISTokenRequestError.js";

describe("ApplicationCredentialsManager", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe(".fromCredentials", () => {
    test("should construct a new ApplicationCredentialsManager", async () => {
      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
        access_token: "token",
        expires_in: 1800
      });

      const session = ApplicationCredentialsManager.fromCredentials({
        clientId: "id",
        clientSecret: "secret"
      });

      const token = await session.getToken(
        "https://www.arcgis.com/sharing/rest/portals/self"
      );
      expect(token).toBe("token");
    });
  });

  describe(".getToken()", () => {
    test("should return the cached token if it is not expired", async () => {
      const session = new ApplicationCredentialsManager({
        clientId: "id",
        clientSecret: "secret",
        token: "token",
        expires: TOMORROW
      });

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("token");
      expect(token2).toBe("token");
    });

    test("should fetch a new token if the cached one is expired", async () => {
      const session = new ApplicationCredentialsManager({
        clientId: "id",
        clientSecret: "secret",
        token: "token",
        expires: YESTERDAY
      });

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
        access_token: "new",
        expires_in: 1800
      });

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ]);
      expect(token1).toBe("new");
      expect(token2).toBe("new");
    });

    test("should not make multiple refresh requests while a refresh is pending", async () => {
      const session = new ApplicationCredentialsManager({
        clientId: "id",
        clientSecret: "secret",
        token: "token",
        expires: YESTERDAY
      });

      fetchMock.mock(
        "https://www.arcgis.com/sharing/rest/oauth2/token/",
        {
          access_token: "new",
          expires_in: 1800
        },
        { method: "POST", repeat: 1 }
      );

      const [token1, token2] = await Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self")
      ]);
      expect(token1).toBe("new");
      expect(token2).toBe("new");
      expect(
        fetchMock.calls("https://www.arcgis.com/sharing/rest/oauth2/token/")
          .length
      ).toBe(1);
    });
  });

  test("should provide a method to refresh a session", async () => {
    const session = new ApplicationCredentialsManager({
      clientId: "id",
      clientSecret: "secret",
      token: "token",
      expires: YESTERDAY
    });

    fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
      access_token: "new",
      expires_in: 1800
    });

    const refreshedSession = await session.refreshCredentials();
    expect(refreshedSession).toBe(session);
  });

  test("should throw a ArcGISTokenRequestError if refreshing the token fails", async () => {
    const session = new ApplicationCredentialsManager({
      clientId: "id",
      clientSecret: "secret",
      token: "token",
      expires: YESTERDAY
    });

    fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
      error: {
        code: 400,
        error: "invalid_request",
        error_description: "Invalid client_secret",
        message: "Invalid client_secret",
        details: []
      }
    });

    await expect(session.refreshCredentials()).rejects.toMatchObject({
      name: "ArcGISTokenRequestError",
      code: "TOKEN_REFRESH_FAILED",
      message: "TOKEN_REFRESH_FAILED: 400: Invalid client_secret"
    });
  });

  describe(".serialize() and .deserialize()", () => {
    test("should serialize to a string", () => {
      const session = new ApplicationCredentialsManager({
        clientId: "id",
        clientSecret: "secret",
        token: "token",
        expires: YESTERDAY
      });

      const serialized = session.serialize();

      expect(serialized).toBe(
        JSON.stringify({
          type: "ApplicationCredentialsManager",
          clientId: "id",
          clientSecret: "secret",
          token: "token",
          expires: YESTERDAY,
          portal: "https://www.arcgis.com/sharing/rest",
          duration: 7200
        })
      );
    });

    test("should deserialize to an object", () => {
      const session = new ApplicationCredentialsManager({
        token: "token",
        clientId: "id",
        clientSecret: "secret",
        expires: YESTERDAY,
        portal: "https://www.arcgis.com/sharing/rest"
      });

      const serialized = session.serialize();
      const deserialized =
        ApplicationCredentialsManager.deserialize(serialized);
      expect(deserialized.token).toEqual("token");
      expect(deserialized.clientId).toEqual("id");
      expect(deserialized.clientSecret).toEqual("secret");
      expect(deserialized.expires).toEqual(YESTERDAY);
      expect(deserialized.portal).toEqual(
        "https://www.arcgis.com/sharing/rest"
      );
      expect(
        deserialized instanceof ApplicationCredentialsManager
      ).toBeTruthy();
    });
  });
});
