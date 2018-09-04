/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { ApplicationSession } from "../src/index";
import * as fetchMock from "fetch-mock";
import { YESTERDAY, TOMORROW } from "./utils";

describe("ApplicationSession", () => {
  afterEach(fetchMock.restore);

  describe(".getToken()", () => {
    it("should return the cached token if it is not expired", done => {
      const session = new ApplicationSession({
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
        .catch(e => {
          fail(e);
        });
    });

    it("should fetch a new token if the cached one is expired", done => {
      const session = new ApplicationSession({
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
        .catch(e => {
          fail(e);
        });
    });

    it("should not make multiple refresh requests while a refresh is pending", done => {
      const session = new ApplicationSession({
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
        { method: "POST", times: 1 }
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
        .catch(e => {
          fail(e);
        });
    });
  });

  it("should provide a method to refresh a session", done => {
    const session = new ApplicationSession({
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
      .then(s => {
        expect(s).toBe(session);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
