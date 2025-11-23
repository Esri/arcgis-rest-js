import {
  sendNoCorsRequest,
  getRegisteredNoCorsDomains,
  registerNoCorsDomains,
  isNoCorsDomain,
  isNoCorsRequestRequired
} from "../../src/utils/sendNoCorsRequest.js";
import { describe, test, expect, beforeEach, vi } from "vitest";
import fetchMock from "fetch-mock";
import { requestConfig } from "../../src/requestConfig.js";

describe("sendNoCorsRequest utils:", () => {
  beforeEach(() => {
    // Reset requestConfig before each test
    requestConfig.pendingNoCorsRequests = {};
    requestConfig.noCorsDomains = [];
    requestConfig.crossOriginNoCorsDomains = {};
    fetchMock.restore();
  });

  describe("sendNoCorsRequest:", () => {
    test("should send a no-cors request and cache the call", async () => {
      const url = "https://example.com/resource";
      fetchMock.once(url, { status: 200 });

      await sendNoCorsRequest(url);

      const [lastUrl, lastOptions] = fetchMock.lastCall()!;
      expect(lastUrl).toBe("https://example.com/resource");
      expect(lastOptions).toEqual({
        mode: "no-cors",
        credentials: "include",
        cache: "no-store"
      });
      expect(requestConfig.noCorsDomains).toContain("https://example.com");
    });

    test("strips path and leaves on f=json", async () => {
      const url = "https://example.com/resource/more?fat=cat&f=json";
      fetchMock.once("https://example.com/resource/more?f=json", {
        status: 200
      });

      await sendNoCorsRequest(url);
      const [lastUrl, lastOptions] = fetchMock.lastCall()!;
      expect(lastUrl).toBe("https://example.com/resource/more?f=json");
      expect(lastOptions).toEqual({
        mode: "no-cors",
        credentials: "include",
        cache: "no-store"
      });

      expect(requestConfig.noCorsDomains).toContain("https://example.com");
    });

    test("does not duplicate entry in noCorsDomains", async () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      const url = "https://example.com/resource/more?fat=cat&f=json";
      fetchMock.once("https://example.com/resource/more?f=json", {
        status: 200
      });

      await sendNoCorsRequest(url);

      expect(requestConfig.noCorsDomains).toEqual(["https://example.com"]);
    });

    test("should not send duplicate no-cors requests for the same origin", async () => {
      const url = "https://example2.com/resource";
      fetchMock.once(url, { status: 200 });

      await Promise.all([sendNoCorsRequest(url), sendNoCorsRequest(url)]);

      const calls = fetchMock.calls(url);
      expect(calls.length).toBe(1);
      expect(requestConfig.pendingNoCorsRequests).toEqual({});
      expect(requestConfig.noCorsDomains).toContain("https://example2.com");
      expect(
        requestConfig.crossOriginNoCorsDomains["https://example2.com"]
      ).toBeDefined();
    });

    if (typeof window !== "undefined") {
      // This test can't work in node because we spy on window.fetch
      test("should reject if the no-cors request fails", async () => {
        const url = "https://example.com/resource";

        vi.spyOn(window, "fetch").mockRejectedValue(new Error("Network error"));

        await expect(sendNoCorsRequest(url)).rejects.toThrowError(
          "no-cors request to https://example.com failed"
        );
      });
    }
  });

  describe("getRegisteredNoCorsDomains:", () => {
    test("should return the list of registered no-cors domains", () => {
      requestConfig.noCorsDomains = [
        "https://example.com",
        "https://another.com"
      ];
      const domains = getRegisteredNoCorsDomains();

      expect(domains).toEqual(["https://example.com", "https://another.com"]);
    });
  });

  describe("registerNoCorsDomains:", () => {
    test("should register domains", () => {
      const domains = ["https://example.com", "another.com"];
      registerNoCorsDomains(domains);

      expect(requestConfig.noCorsDomains).toContain("https://example.com");
      expect(requestConfig.noCorsDomains).toContain("http://another.com");
      expect(requestConfig.noCorsDomains).toContain("https://another.com");
    });

    test("should not allow duplicates", () => {
      const domains = ["https://example.com"];
      registerNoCorsDomains(domains);
      registerNoCorsDomains(domains);
      expect(requestConfig.noCorsDomains.length).toBe(1);
      expect(requestConfig.noCorsDomains).toContain("https://example.com");
    });
  });

  describe("isNoCorsDomain:", () => {
    test("should return true if the domain is in the no-cors domains list", () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      const result = isNoCorsDomain("https://example.com/resource");

      expect(result).toBeTruthy();
    });

    test("should return false if the domain is not in the no-cors domains list", () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      const result = isNoCorsDomain("https://another.com/resource");

      expect(result).toBeFalsy();
    });

    test("should return false if no-cors domains list is empty", () => {
      requestConfig.noCorsDomains = [];
      const result = isNoCorsDomain("https://another.com/resource");

      expect(result).toBeFalsy();
    });
  });

  describe("isNoCorsRequestRequired:", () => {
    test("returns false if no no-cors domains are set", () => {
      const result = isNoCorsRequestRequired("https://example.com/resource");
      expect(result).toBeFalsy();
    });
    test("should return true if a no-cors request is required", () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      requestConfig.crossOriginNoCorsDomains = {
        "https://example.com": Date.now() - 2 * 60 * 60000
      }; // 2 hours ago

      const result = isNoCorsRequestRequired("https://example.com/resource");

      expect(result).toBeTruthy();
    });

    test("should return true if a no-cors request has not been sent", () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      requestConfig.crossOriginNoCorsDomains = {};

      const result = isNoCorsRequestRequired("https://example.com/resource");

      expect(result).toBeTruthy();
    });

    test("should return false if a no-cors request is not required", () => {
      requestConfig.noCorsDomains = ["https://example.com"];
      requestConfig.crossOriginNoCorsDomains = {
        "https://example.com": Date.now()
      };

      const result = isNoCorsRequestRequired("https://example.com/resource");

      expect(result).toBeFalsy();
    });
  });
});
