import { UserSession } from "../src/index";
import * as fetchMock from "fetch-mock";
import { YESTERDAY, TOMORROW } from "./utils";

describe("UserSession", () => {
  describe(".getToken()", () => {
    it("should return unexpired tokens for trusted arcgis.com domains", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        tokenExpires: TOMORROW
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

    it("should fetch new tokens when tokens for for trusted arcgis.com domains are expired", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.post("https://www.arcgis.com/sharing/rest/oauth2/token/", {
        access_token: "new",
        expires_in: 1800,
        username: " casey"
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
});
