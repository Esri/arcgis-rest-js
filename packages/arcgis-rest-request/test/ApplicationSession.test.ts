/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import fetchMock from "fetch-mock";
import { ApplicationCredentialsManager } from "../src/index.js";
import { YESTERDAY, TOMORROW } from "../../../scripts/test-helpers.js";

describe("ApplicationCredentialsManager", () => {
  afterEach(fetchMock.restore);

  describe(".fromCredentials", () => {
    it("should construct a new ApplicationCredentialsManager", (done) => {
      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
        access_token: "token",
        expires_in: 1800
      });

      const session = ApplicationCredentialsManager.fromCredentials({
        clientId: "id",
        clientSecret: "secret"
      });

      session
        .getToken("https://www.arcgis.com/sharing/rest/portals/self")
        .then((token) => {
          expect(token).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  describe(".getToken()", () => {
    it("should return the cached token if it is not expired", (done) => {
      const session = new ApplicationCredentialsManager({
        clientId: "id",
        clientSecret: "secret",
        token: "token",
        expires: TOMORROW
      });

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("token");
          expect(token2).toBe("token");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should fetch a new token if the cached one is expired", (done) => {
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

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken(
          "https://services1.arcgis.com/MOCK_ORG/arcgis/rest/services/Private_Service/FeatureServer"
        )
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("new");
          expect(token2).toBe("new");
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });

    it("should not make multiple refresh requests while a refresh is pending", (done) => {
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

      Promise.all([
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self"),
        session.getToken("https://www.arcgis.com/sharing/rest/portals/self")
      ])
        .then(([token1, token2]) => {
          expect(token1).toBe("new");
          expect(token2).toBe("new");
          expect(
            fetchMock.calls("https://www.arcgis.com/sharing/rest/oauth2/token/")
              .length
          ).toBe(1);
          done();
        })
        .catch((e) => {
          fail(e);
        });
    });
  });

  it("should provide a method to refresh a session", (done) => {
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

    session
      .refreshSession()
      .then((s) => {
        expect(s).toBe(session);
        done();
      })
      .catch((e) => {
        fail(e);
      });
  });
});
