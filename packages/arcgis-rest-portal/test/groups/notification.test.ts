import { describe, test, afterEach, expect } from "vitest";
import fetchMock from "fetch-mock";

import { encodeParam, ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { TOMORROW } from "../../../../scripts/test-helpers.js";

import { createGroupNotification } from "../../src/groups/notification.js";

import { GroupNotificationResponse } from "../mocks/groups/responses.js";

describe("groups", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  describe("createGroupNotification", () => {
    const MOCK_AUTH = new ArcGISIdentityManager({
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

    const MOCK_REQOPTS = {
      authentication: MOCK_AUTH
    };

    test("should create an email notification", async () => {
      fetchMock.once("*", GroupNotificationResponse);

      const opts = {
        id: "3ef",
        subject: "this is the subject",
        message: "this is the message",
        ...MOCK_REQOPTS
      };

      const response = await createGroupNotification(opts);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/createNotification"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("subject", "this is the subject")
      );
      expect(options.body).toContain(
        encodeParam("message", "this is the message")
      );
      expect(options.body).toContain(
        encodeParam("notificationChannelType", "email")
      );
      expect(options.body).toContain(encodeParam("notifyAll", true));
      expect(response.success).toEqual(true);
    });

    test("should create an email notification for specific users", async () => {
      fetchMock.once("*", GroupNotificationResponse);

      const opts = {
        id: "3ef",
        subject: "this is the subject",
        message: "this is the message",
        users: ["casey", "atthebat"],
        ...MOCK_REQOPTS
      };

      const response = await createGroupNotification(opts);
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/groups/3ef/createNotification"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(options.body).toContain(
        encodeParam("subject", "this is the subject")
      );
      expect(options.body).toContain(
        encodeParam("message", "this is the message")
      );
      expect(options.body).toContain(
        encodeParam("notificationChannelType", "email")
      );
      expect(options.body).toContain(encodeParam("notifyAll", false));
      expect(options.body).toContain(encodeParam("users", "casey,atthebat"));
      expect(response.success).toEqual(true);
    });
  });
});
