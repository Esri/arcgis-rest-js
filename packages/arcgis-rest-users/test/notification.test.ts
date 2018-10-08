/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { getUserNotifications, removeNotification } from "../src/index";

import {
  UserNotificationsResponse,
  IDeleteSuccessResponse
} from "./mocks/notification";

import { encodeParam } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as fetchMock from "fetch-mock";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("users", () => {
  afterEach(fetchMock.restore);

  describe("getUserNotifications", () => {
    const session = new UserSession({
      username: "c@sey",
      password: "123456",
      portal: "https://myorg.maps.arcgis.com/sharing/rest"
    });

    fetchMock.postOnce(
      "https://myorg.maps.arcgis.com/sharing/rest/generateToken",
      {
        token: "fake-token",
        expires: TOMORROW.getTime(),
        username: "c@sey"
      }
    );

    session.refreshSession();

    it("should make an authenticated request for user notifications", done => {
      fetchMock.once("*", UserNotificationsResponse);

      getUserNotifications({ authentication: session })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/notifications?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response.notifications.length).toEqual(2);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });

    it("should remove a notification", done => {
      fetchMock.once("*", IDeleteSuccessResponse);

      removeNotification({ id: "3ef", ...{ authentication: session } })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/notifications/3ef/delete"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(response.success).toEqual(true);
          expect(response.notificationId).toBe("3ef");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
