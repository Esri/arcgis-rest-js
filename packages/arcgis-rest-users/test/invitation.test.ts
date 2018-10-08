/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  getUserInvitations,
  getUserInvitation,
  acceptInvitation,
  declineInvitation
} from "../src/index";

import {
  UserInvitationsResponse,
  UserInvitationResponse
} from "./mocks/invitation";

import { encodeParam } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as fetchMock from "fetch-mock";

const TOMORROW = (function() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  return now;
})();

describe("invitations", () => {
  afterEach(fetchMock.restore);

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

  describe("getUserInvitations", () => {
    session.refreshSession();

    it("should make an authenticated request for user invitations", done => {
      fetchMock.once("*", UserInvitationsResponse);

      getUserInvitations({ authentication: session })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response.userInvitations.length).toEqual(1);
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe("getUserInvitation", () => {
    fetchMock.postOnce(
      "https://myorg.maps.arcgis.com/sharing/rest/generateToken",
      {
        token: "fake-token",
        expires: TOMORROW.getTime(),
        username: "c@sey"
      }
    );

    session.refreshSession();

    it("should make an authenticated request for a user invitation", done => {
      fetchMock.once("*", UserInvitationResponse);

      getUserInvitation({ invitationId: "3ef", authentication: session })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef?f=json&token=fake-token"
          );
          expect(options.method).toBe("GET");
          expect(response.id).toEqual("G45ad52e7560e470598815499003c13f6");
          expect(response.id).toEqual("G45ad52e7560e470598815499003c13f6");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe("acceptInvitation", () => {
    fetchMock.postOnce(
      "https://myorg.maps.arcgis.com/sharing/rest/generateToken",
      {
        token: "fake-token",
        expires: TOMORROW.getTime(),
        username: "c@sey"
      }
    );

    session.refreshSession();

    it("should accept an invitation", done => {
      fetchMock.once("*", { success: true });

      acceptInvitation({ invitationId: "3ef", authentication: session })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef/accept"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(response.success).toEqual(true);
          // expect(response.notificationId).toBe("3ef");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });

  describe("declineInvitation", () => {
    fetchMock.postOnce(
      "https://myorg.maps.arcgis.com/sharing/rest/generateToken",
      {
        token: "fake-token",
        expires: TOMORROW.getTime(),
        username: "c@sey"
      }
    );

    session.refreshSession();

    it("should decline an invitation", done => {
      fetchMock.once("*", { success: true });

      declineInvitation({ invitationId: "3ef", authentication: session })
        .then(response => {
          expect(fetchMock.called()).toEqual(true);
          const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
          expect(url).toEqual(
            "https://myorg.maps.arcgis.com/sharing/rest/community/users/c%40sey/invitations/3ef/decline"
          );
          expect(options.method).toBe("POST");
          expect(options.body).toContain(encodeParam("f", "json"));
          expect(options.body).toContain(encodeParam("token", "fake-token"));
          expect(response.success).toEqual(true);
          // expect(response.notificationId).toBe("3ef");
          done();
        })
        .catch(e => {
          fail(e);
        });
    });
  });
});
