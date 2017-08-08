import { UserSession } from "../src/index";
import { ErrorTypes } from "@esri/rest-request";
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

    it("should throw an ArcGISAuthError when the owning system doesn't match", done => {
      const session = new UserSession({
        clientId: "id",
        token: "token",
        refreshToken: "refresh",
        tokenExpires: YESTERDAY
      });

      fetchMock.post("http://gisservices.city.gov/public/rest/info", {
        currentVersion: 10.51,
        fullVersion: "10.5.1.120",
        owningSystemUrl: "http://gis.city.gov",
        authInfo: {
          isTokenBasedSecurity: true,
          tokenServicesUrl: "https://gis.city.gov/sharing/generateToken"
        }
      });

      fetchMock.post("https://gis.city.gov/sharing/generateToken", {
        error: {
          code: 400,
          message: "Unable to generate token",
          details: ["Unable to generate token for this server"]
        }
      });

      session
        .getToken(
          "http://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query"
        )
        .catch(e => {
          expect(e.name).toEqual(ErrorTypes.ArcGISAuthError);
          expect(e.code).toEqual("NOT_FEDERATED");
          expect(e.message).toEqual(
            "NOT_FEDERATED: http://gisservices.city.gov/public/rest/services/trees/FeatureServer/0/query is not federated with https://www.arcgis.com/sharing/rest."
          );
          done();
        });
    });
  });
});
