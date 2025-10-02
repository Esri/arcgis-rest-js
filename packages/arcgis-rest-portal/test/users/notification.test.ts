/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import {
  getUserNotifications,
  removeNotification
} from "../../src/users/notification.js";

import {
  UserNotificationsResponse,
  IDeleteSuccessResponse
} from "../mocks/users/notification.js";

import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import { describe, test, expect, vi, afterEach } from "vitest";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("getUserNotifications", () => {
    const session = new ArcGISIdentityManager({
      username: "c@sey",
      password: "123456",
      token: "fake-token",
      tokenExpires: TOMORROW,
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    test("should make an authenticated request for user notifications", async () => {
      fetchMock.once("*", UserNotificationsResponse);

      const response = await getUserNotifications({ authentication: session });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/notifications?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
      expect(response.notifications.length).toEqual(2);
    });

    test("should remove a notification", async () => {
      fetchMock.once("*", IDeleteSuccessResponse);

      const response = await removeNotification({
        id: "3ef",
        ...{ authentication: session }
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/notifications/3ef/delete"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(response.success).toEqual(true);
      expect(response.notificationId).toBe("3ef");
    });
  });
});
