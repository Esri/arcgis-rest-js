import { ApplicationSession } from "../src/index";
import * as fetchMock from "fetch-mock";
import { YESTERDAY, TOMORROW } from "./utils";

describe("ApplicationSession", () => {
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
      ]).then(([token1, token2]) => {
        expect(token1).toBe("token");
        expect(token2).toBe("token");
        done();
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
      ]).then(([token1, token2]) => {
        expect(token1).toBe("new");
        expect(token2).toBe("new");
        done();
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

    session.refreshSession().then(s => {
      expect(s).toBe(session);
      done();
    });
  });
});
