import { revokeToken, appendCustomParams } from "../src/index.js";
import fetchMock from "fetch-mock";

describe("revokeToken", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  it("should revoke a token with a client id", () => {
    fetchMock.once("*", { success: true });
    return revokeToken({
      clientId: "clientId",
      token: "token"
    }).then((response) => {
      const [url, options] = fetchMock.lastCall("*");

      expect(response).toEqual({ success: true });
      expect(url).toBe(
        "https://www.arcgis.com/sharing/rest/oauth2/revokeToken/"
      );
      expect(options.body).toContain("auth_token=token");
      expect(options.body).toContain("client_id=clientId");
    });
  });

  it("should revoke a token with a client id and custom portal", () => {
    fetchMock.once("*", { success: true });

    return revokeToken({
      clientId: "clientId",
      token: "token",
      portal: "https://myportal.com/sharing/rest/"
    }).then((response) => {
      const [url, options] = fetchMock.lastCall("*");

      expect(response).toEqual({ success: true });
      expect(url).toBe("https://myportal.com/sharing/rest/oauth2/revokeToken/");
      expect(options.body).toContain("auth_token=token");
      expect(options.body).toContain("client_id=clientId");
    });
  });

  it("should throw a ArcGISRequestError when success is false", () => {
    fetchMock.once("*", { success: false });

    return revokeToken({
      clientId: "clientId",
      token: "token",
      portal: "https://myportal.com/sharing/rest/"
    }).catch((e) => {
      expect(e.name).toBe("ArcGISRequestError");
      expect(e.message).toBe("500: Unable to revoke token");
    });
  });
});
