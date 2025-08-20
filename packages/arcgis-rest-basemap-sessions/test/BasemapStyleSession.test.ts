import { expect, test, describe, afterEach, vi } from "vitest";
import {
  BasemapStyleSession,
  DEFAULT_DURATION,
  DEFAULT_SAFETY_MARGIN,
  DEFAULT_START_BASEMAP_STYLE_SESSION_URL,
  IStartSessionParams
} from "../src/index.js";
import { MOCK_START_TIME, MOCK_END_TIME, TWELVE_HOURS } from "./test-utils.js";
import fetchMock from "fetch-mock";
import { Emitter } from "mitt";

function createMockSession() {
  return new BasemapStyleSession({
    token: "fake-token",
    startSessionUrl: DEFAULT_START_BASEMAP_STYLE_SESSION_URL,
    styleFamily: "arcgis",
    startTime: MOCK_START_TIME,
    endTime: MOCK_END_TIME,
    expires: new Date(MOCK_END_TIME.getTime() - DEFAULT_SAFETY_MARGIN * 1000),
    authentication: "token"
  });
}

async function startMockSession(
  sessionParams: Partial<IStartSessionParams> = {},
  fetchOptions = {}
) {
  fetchMock.getOnce("*", {
    ...{
      sessionToken: "fake-token",
      startTime: MOCK_START_TIME.getTime(),
      endTime: sessionParams.duration
        ? MOCK_START_TIME.getTime() + sessionParams.duration * 1000
        : MOCK_END_TIME.getTime(),
      styleFamily: "arcgis"
    },
    ...fetchOptions
  });

  const session = await BasemapStyleSession.start({
    ...{
      styleFamily: "arcgis",
      authentication: "token"
    },
    ...sessionParams
  });

  return session;
}

afterEach(() => {
  fetchMock.restore();
});

describe("BasemapStyleSession", () => {
  test("should create a BasemapStyleSession object from valid parameters", () => {
    const session = createMockSession();

    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
  });

  test("should destroy a BasemapStyleSession instance, stopping all timers and event listeners", () => {
    const session = createMockSession();
    session.enableAutoRefresh();

    expect(session.checkingExpirationTime).toBe(true);
    expect(session.autoRefresh).toBe(true);
    expect((session as any).emitter.all.get("expired").length).toBe(1);

    session.destroy();
    expect(session.checkingExpirationTime).toBe(false);
    expect(session.autoRefresh).toBe(false);
    expect((session as any).emitter.all.get("expired").length).toBe(0);
  });

  test("should create a BasemapStyleSession object from valid parameters", () => {
    // @ts-expect-error, // this is to test the constructor directly with default parameters
    const session = new BasemapStyleSession({
      token: "fake-token",
      startSessionUrl: DEFAULT_START_BASEMAP_STYLE_SESSION_URL,
      startTime: MOCK_START_TIME,
      endTime: MOCK_END_TIME,
      expires: new Date(MOCK_END_TIME.getTime() - DEFAULT_SAFETY_MARGIN * 1000),
      authentication: "token"
    });

    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
  });

  test("should throw an error if duration is under 30", async () => {
    try {
      await BasemapStyleSession.start({
        duration: 29,
        authentication: "token"
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("Session duration must be at least 30 seconds.")
      );
    }
  });

  test("should throw an error if duration is over 12 hours", async () => {
    try {
      await BasemapStyleSession.start({
        duration: 43201,
        authentication: "token"
      });
    } catch (error) {
      expect(error).toEqual(
        new Error("Session duration cannot exceed 12 hours (43200 seconds).")
      );
    }
  });

  test("should have helpers for time remaining until expiration in seconds an milliseconds", () => {
    const session = createMockSession();

    vi.useFakeTimers();
    vi.setSystemTime(MOCK_START_TIME);

    expect(session.secondsUntilExpiration).toBe(DEFAULT_DURATION);
    expect(session.millisecondsUntilExpiration).toBe(DEFAULT_DURATION * 1000);

    vi.useRealTimers();
  });

  test("should create have helpers for time remaining until expiration in seconds an milliseconds should return 0 for an expired session", () => {
    const session = createMockSession();

    vi.useFakeTimers();
    vi.setSystemTime(MOCK_END_TIME);

    expect(session.secondsUntilExpiration).toBe(0);
    expect(session.millisecondsUntilExpiration).toBe(0);

    vi.useRealTimers();
  });

  test("should start a new BasemapStyleSession with the default duration", async () => {
    const session = await startMockSession();

    // Validate the session object
    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
    expect(session.startTime, "startTime").toEqual(MOCK_START_TIME);
    expect(session.endTime, "endTime").toEqual(MOCK_END_TIME);
    expect(session.expires.getTime(), "expires").toEqual(
      MOCK_END_TIME.getTime() - session.safetyMargin * 1000
    );
    expect(session.startSessionUrl).toBe(
      DEFAULT_START_BASEMAP_STYLE_SESSION_URL
    );
    expect(session.safetyMargin).toBe(DEFAULT_SAFETY_MARGIN);
    expect(session.expirationCheckInterval).toBe(10000); // 10 seconds
    expect(session.styleFamily).toBe("arcgis");
    expect(session.authentication).toBe("token");
    expect(session.canRefresh).toBe(true);
    expect(await session.getToken()).toBe("fake-token");
    expect(session.autoRefresh).toBe(false);

    // Validate the fetch call
    expect(fetchMock.calls().length).toBe(1);

    const lastCall = fetchMock.lastCall();
    const url = lastCall?.[0];

    expect(url.startsWith(DEFAULT_START_BASEMAP_STYLE_SESSION_URL)).toBe(true);
    expect(url).toContain("styleFamily=arcgis");
    expect(url).toContain("token=token");
    expect(url).toContain("durationSeconds=43200");
    expect(url).toContain("f=json");
  });

  test("should start a new BasemapStyleSession with a custom duration", async () => {
    const session = await startMockSession({
      duration: 60,
      authentication: "token"
    });

    // Validate the session object
    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
    expect(session.startTime).toEqual(MOCK_START_TIME);
    expect(session.safetyMargin).toBe(1);

    expect(session.endTime.getTime(), "endTime").toEqual(
      MOCK_START_TIME.getTime() + 60 * 1000
    );
    expect(session.expires.getTime(), "expires").toEqual(
      MOCK_START_TIME.getTime() + 60 * 1000 - session.safetyMargin * 1000
    );
    expect(session.startSessionUrl).toBe(
      DEFAULT_START_BASEMAP_STYLE_SESSION_URL
    );
    expect(session.expirationCheckInterval).toBe(600);
    expect(session.styleFamily).toBe("arcgis");
    expect(session.authentication).toBe("token");
    expect(session.canRefresh).toBe(true);
    expect(await session.getToken()).toBe("fake-token");
    expect(session.autoRefresh).toBe(false);

    // Validate the fetch call
    expect(fetchMock.calls().length).toBe(1);

    const lastCall = fetchMock.lastCall();
    const url = lastCall?.[0];

    expect(url.startsWith(DEFAULT_START_BASEMAP_STYLE_SESSION_URL)).toBe(true);
    expect(url).toContain("styleFamily=arcgis");
    expect(url).toContain("token=token");
    expect(url).toContain("durationSeconds=60");
    expect(url).toContain("f=json");
  });

  test("should start a new BasemapStyleSession with a custom safetyMargin", async () => {
    const session = await startMockSession({
      authentication: "token",
      safetyMargin: 600
    });

    // Validate the session object
    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
    expect(session.startTime).toEqual(MOCK_START_TIME);
    expect(session.safetyMargin).toBe(600);

    expect(session.endTime.getTime(), "endTime").toEqual(
      MOCK_END_TIME.getTime()
    );
    expect(session.expires.getTime(), "expires").toEqual(
      MOCK_END_TIME.getTime() - session.safetyMargin * 1000
    );
    expect(session.startSessionUrl).toBe(
      DEFAULT_START_BASEMAP_STYLE_SESSION_URL
    );
    expect(session.expirationCheckInterval).toBe(10000);
    expect(session.styleFamily).toBe("arcgis");
    expect(session.authentication).toBe("token");
    expect(session.canRefresh).toBe(true);
    expect(await session.getToken()).toBe("fake-token");
    expect(session.autoRefresh).toBe(false);

    // Validate the fetch call
    expect(fetchMock.calls().length).toBe(1);

    const lastCall = fetchMock.lastCall();
    const url = lastCall?.[0];

    expect(url.startsWith(DEFAULT_START_BASEMAP_STYLE_SESSION_URL)).toBe(true);
    expect(url).toContain("styleFamily=arcgis");
    expect(url).toContain("token=token");
    expect(url).toContain("durationSeconds=43200");
    expect(url).toContain("f=json");
  });

  test("should start a new BasemapStyleSession with a default style family", async () => {
    fetchMock.getOnce("*", {
      sessionToken: "fake-token",
      startTime: MOCK_START_TIME.getTime(),
      endTime: MOCK_END_TIME.getTime(),
      styleFamily: "arcgis"
    });

    const session = await BasemapStyleSession.start({
      authentication: "token"
    });

    // Validate the session object
    expect(session).toBeDefined();
    expect(session.token).toBe("fake-token");
    expect(session.startTime).toEqual(MOCK_START_TIME);
    expect(session.endTime).toEqual(MOCK_END_TIME);
    expect(session.expires).toEqual(
      new Date(MOCK_END_TIME.getTime() - session.safetyMargin * 1000)
    );
    expect(session.startSessionUrl).toBe(
      DEFAULT_START_BASEMAP_STYLE_SESSION_URL
    );
    expect(session.styleFamily).toBe("arcgis");
    expect(session.authentication).toBe("token");
    expect(session.canRefresh).toBe(true);
    expect(await session.getToken()).toBe("fake-token");
    expect(session.autoRefresh).toBe(false);

    // Validate the fetch call
    expect(fetchMock.calls().length).toBe(1);

    const lastCall = fetchMock.lastCall();
    const url = lastCall?.[0];

    expect(url.startsWith(DEFAULT_START_BASEMAP_STYLE_SESSION_URL)).toBe(true);
    expect(url).toContain("styleFamily=arcgis");
    expect(url).toContain("token=token");
    expect(url).toContain("durationSeconds=43200");
    expect(url).toContain("f=json");
  });

  describe("autoRefresh", () => {
    test("should not auto-refresh the session by default", async () => {
      const session = await startMockSession();

      expect(session.autoRefresh).toBe(false);
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.canRefresh).toBe(true);
    });

    test("should auto-refresh at start time if enabled", async () => {
      const session = await startMockSession({ autoRefresh: true });

      expect(session.autoRefresh).toBe(true);
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.canRefresh).toBe(true);
    });

    test("should start and stop auto-refresh", async () => {
      const session = await startMockSession();

      expect(session.autoRefresh).toBe(false);
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.canRefresh).toBe(true);

      session.enableAutoRefresh();
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(true);

      session.disableAutoRefresh();
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(false);
    });

    test("should start expiration checking when starting auto refresh", async () => {
      const session = createMockSession();

      expect(session.autoRefresh).toBe(false);
      expect(session.checkingExpirationTime).toBe(false);

      session.enableAutoRefresh();
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(true);

      session.disableAutoRefresh();
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(false);
    });

    test("should not restart or error when stopping auto refresh multiple times", async () => {
      const session = createMockSession();

      expect(session.autoRefresh).toBe(false);
      expect(session.checkingExpirationTime).toBe(false);

      session.enableAutoRefresh();
      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(true);

      session.disableAutoRefresh();
      session.disableAutoRefresh();

      expect(session.checkingExpirationTime).toBe(true);
      expect(session.autoRefresh).toBe(false);
    });

    test("should auto-refresh when a session expires", async () => {
      const session = await startMockSession({ autoRefresh: true });

      session.disableCheckingExpirationTime(); // stop checking on a timer while we manually expire the session

      // Create a promise that resolves when the session is refreshed
      const refreshPromise = new Promise<any>((resolve) => {
        session.on("refreshed", (e) => {
          resolve(e);
        });
      });

      // Create a promise that resolves when the session expires
      const expiredPromise = new Promise<any>((resolve) => {
        session.on("expired", (e) => {
          resolve(e);
        });
      });

      // Setup a new request to refresh the session with a fresh token
      const newStartTime = new Date(MOCK_START_TIME.getTime() + TWELVE_HOURS);
      const newEndTime = new Date(MOCK_END_TIME.getTime() + TWELVE_HOURS);

      fetchMock.getOnce(
        "*",
        {
          sessionToken: "fake-token-2",
          startTime: newStartTime.getTime(),
          endTime: newEndTime.getTime(),
          styleFamily: "arcgis"
        },
        {
          overwriteRoutes: true
        }
      );

      // simulating the session expiration
      session["setEndTime"](new Date(Date.now() - 1000));
      session["setExpires"](new Date(Date.now() - session.safetyMargin * 1000));
      session.isSessionExpired();

      // wait for the refresh and expiration events
      const refreshed = await refreshPromise;

      // compare to what we sent from the server
      expect(refreshed.current.token).toBe("fake-token-2");
      expect(refreshed.current.startTime).toEqual(newStartTime);
      expect(refreshed.current.endTime).toEqual(newEndTime);
      expect(refreshed.current.expires).toEqual(
        new Date(newEndTime.getTime() - session.safetyMargin * 1000)
      );

      // compare to the current session
      expect(refreshed.current.token).toBe(session.token);
      expect(refreshed.current.startTime).toEqual(session.startTime);
      expect(refreshed.current.endTime).toEqual(session.endTime);
      expect(refreshed.current.expires).toEqual(session.expires);

      // compare the expired session to the previous session
      const expired = await expiredPromise;
      expect(expired.token).toBe("fake-token");
      expect(expired).toEqual(refreshed.previous);
    });

    test("should emit an error when auto-refresh fails", async () => {
      const session = await startMockSession({ autoRefresh: true });

      session.disableCheckingExpirationTime(); // stop checking on a timer while we manually expire the session

      // Create a promise that resolves when the session is refreshed
      const errorPromise = new Promise<any>((resolve) => {
        session.once("error", (e) => {
          resolve(e);
        });
      });

      fetchMock.getOnce(
        "*",
        {
          error: {
            code: 498,
            message: "Token Invalid.",
            details: [
              "The required authentication information is invalid. The token is either invalid or has expired."
            ],
            restInfoUrl: "https://basemapstyles-api.arcgis.com/arcgis/rest/info"
          }
        },
        {
          overwriteRoutes: true
        }
      );

      // simulating the session expiration
      session["setEndTime"](new Date(Date.now() - 1000));
      session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));
      session.isSessionExpired();

      // wait for the refresh and expiration events
      const error = await errorPromise;

      // compare to what we sent from the server
      expect(error.code).toBe(498);
      expect(error.message).toBe("498: Token Invalid.");
    });
  });

  test("should refresh the session if it is expired when calling get token", async () => {
    const session = await startMockSession();

    session.disableCheckingExpirationTime(); // stop checking on a timer while we manually expire the session

    // Setup a new request to refresh the session with a fresh token
    const newStartTime = new Date(MOCK_START_TIME.getTime() + TWELVE_HOURS);
    const newEndTime = new Date(MOCK_END_TIME.getTime() + TWELVE_HOURS);

    fetchMock.getOnce(
      "*",
      {
        sessionToken: "fake-token-2",
        startTime: newStartTime.getTime(),
        endTime: newEndTime.getTime(),
        styleFamily: "arcgis"
      },
      {
        overwriteRoutes: true
      }
    );

    // simulating the session expiration
    session["setEndTime"](new Date(Date.now() - 1000));
    session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));

    // wait for the refresh and expiration events
    const token = await session.getToken();
    expect(token).toEqual("fake-token-2");
  });

  test("should return the same promise if refreshCredentials is called multiple times", async () => {
    const session = await startMockSession();

    session.disableCheckingExpirationTime(); // stop checking on a timer while we manually expire the session

    // Setup a new request to refresh the session with a fresh token
    const newStartTime = new Date(MOCK_START_TIME.getTime() + TWELVE_HOURS);
    const newEndTime = new Date(MOCK_END_TIME.getTime() + TWELVE_HOURS);

    fetchMock.getOnce(
      "*",
      {
        sessionToken: "fake-token-2",
        startTime: newStartTime.getTime(),
        endTime: newEndTime.getTime(),
        styleFamily: "arcgis"
      },
      {
        overwriteRoutes: true
      }
    );

    // simulating the session expiration
    session["setEndTime"](new Date(Date.now() - 1000));
    session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));

    // wait for the refresh and expiration events
    const refreshOne = session.refreshCredentials();
    const refreshTwo = session.refreshCredentials();

    expect(refreshOne).toEqual(refreshTwo);
  });

  describe("enableCheckingExpirationTime", () => {
    test("should emit an event as soon as we start checking expiration time", async () => {
      const session = createMockSession();

      // simulating the session expiration
      session["setEndTime"](new Date(Date.now() - 1000));
      session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));
      session.enableCheckingExpirationTime();

      // Create a promise that resolves when the expired event is emitted
      const expiredPromise = new Promise<any>((resolve) => {
        session.once("expired", (e) => {
          resolve(e);
        });
      });

      // wait for the expired event
      const expired = await expiredPromise;
      expect(expired.token).toBe(session.token);
    });

    test("shenablebe no side effects when calling startCheckingExpirationTime multiple times", async () => {
      const session = createMockSession();

      // simulating the session expiration
      session["setEndTime"](new Date(Date.now() - 1000));
      session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));

      // Start checking expiration time multiple times
      session.enableCheckingExpirationTime();
      session.enableCheckingExpirationTime();
      session.enableCheckingExpirationTime();

      // Create a promise that resolves when the expired event is emitted
      const expiredPromise = new Promise<any>((resolve) => {
        session.once("expired", (e) => {
          resolve(e);
        });
      });

      // wait for the expired event
      const expired = await expiredPromise;
      expect(expired.token).toBe(session.token);
    });

    test("should be no side effects when calling disableCheckingExpirationTime multiple times", async () => {
      const session = createMockSession();

      // simulating the session expiration
      session["setEndTime"](new Date(Date.now() - 1000));
      session["setExpires"](new Date(Date.now() - DEFAULT_SAFETY_MARGIN));

      // Start checking expiration time
      session.enableCheckingExpirationTime();

      // Stop checking expiration time multiple times
      session.disableCheckingExpirationTime();
      session.disableCheckingExpirationTime();
      session.disableCheckingExpirationTime();

      // Create a promise that resolves when the expired event is emitted
      const expiredPromise = new Promise<any>((resolve) => {
        session.once("expired", (e) => {
          resolve(e);
        });
      });

      // wait for the expired event
      const expired = await expiredPromise;
      expect(expired.token).toBe(session.token);
    });
  });
});
