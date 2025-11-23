import { revokeToken } from "../src/index.js";
import fetchMock from "fetch-mock";
import { describe, test, afterEach, expect } from "vitest";

describe("revokeToken", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  test("should revoke a token with a client id", async () => {
    fetchMock.once("*", { success: true });
    const response = await revokeToken({
      clientId: "clientId",
      token: "token"
    });
    const [url, options] = fetchMock.lastCall("*");

    expect(response).toEqual({ success: true });
    expect(url).toBe("https://www.arcgis.com/sharing/rest/oauth2/revokeToken/");
    expect(options.body).toContain("auth_token=token");
    expect(options.body).toContain("client_id=clientId");
  });

  test("should revoke a token with a client id and custom portal", async () => {
    fetchMock.once("*", { success: true });

    const response = await revokeToken({
      clientId: "clientId",
      token: "token",
      portal: "https://myportal.com/sharing/rest/"
    });
    const [url, options] = fetchMock.lastCall("*");

    expect(response).toEqual({ success: true });
    expect(url).toBe("https://myportal.com/sharing/rest/oauth2/revokeToken/");
    expect(options.body).toContain("auth_token=token");
    expect(options.body).toContain("client_id=clientId");
  });

  test("should throw a ArcGISRequestError when success is false", async () => {
    fetchMock.once("*", { success: false });

    await expect(
      revokeToken({
        clientId: "clientId",
        token: "token",
        portal: "https://myportal.com/sharing/rest/"
      })
    ).rejects.toMatchObject({
      name: "ArcGISRequestError",
      message: "500: Unable to revoke token"
    });
  });
});
