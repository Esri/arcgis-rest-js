/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect, afterEach } from "vitest";
import fetchMock from "fetch-mock";
import { ArcGISIdentityManager, encodeParam } from "@esri/arcgis-rest-request";
import {
  getUserInvitations,
  getUserInvitation,
  acceptInvitation,
  declineInvitation
} from "../../src/users/invitation.js";
import {
  UserInvitationsResponse,
  UserInvitationResponse
} from "../mocks/users/invitation.js";

const TOMORROW = (function () {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("invitations", () => {
  afterEach(() => {
    fetchMock.restore();
  });
  const session = new ArcGISIdentityManager({
    username: "c@sey",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW,
    portal: "https://myorg.maps.arcgis.com/sharing/rest"
  });

  describe("getUserInvitations", () => {
    test("should make an authenticated request for user invitations", async () => {
      fetchMock.once("*", UserInvitationsResponse);

      const response = await getUserInvitations({ authentication: session });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
      expect(response.userInvitations.length).toEqual(1);
    });
  });

  describe("getUserInvitation", () => {
    test("should make an authenticated request for a user invitation", async () => {
      fetchMock.once("*", UserInvitationResponse);

      const response = await getUserInvitation({
        invitationId: "3ef",
        authentication: session
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef?f=json&token=fake-token"
      );
      expect(options.method).toBe("GET");
      expect(response.id).toEqual("G45ad52e7560e470598815499003c13f6");
    });
  });

  describe("acceptInvitation", () => {
    test("should accept an invitation", async () => {
      fetchMock.once("*", { success: true });

      const response = await acceptInvitation({
        invitationId: "3ef",
        authentication: session
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef/accept"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(response.success).toEqual(true);
      // expect(response.notificationId).toBe("3ef");
    });
  });

  describe("declineInvitation", () => {
    test("should decline an invitation", async () => {
      fetchMock.once("*", { success: true });

      const response = await declineInvitation({
        invitationId: "3ef",
        authentication: session
      });
      expect(fetchMock.called()).toEqual(true);
      const [url, options] = fetchMock.lastCall("*");
      expect(url).toEqual(
        "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef/decline"
      );
      expect(options.method).toBe("POST");
      expect(options.body).toContain(encodeParam("f", "json"));
      expect(options.body).toContain(encodeParam("token", "fake-token"));
      expect(response.success).toEqual(true);
      // expect(response.notificationId).toBe("3ef");
    });
  });
});
