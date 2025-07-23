import { expect, test } from "vitest";
import { BasemapStyleSession, DEFAULT_SAFETY_MARGIN } from "../src/index.js";

const NOW = Date.now();
const START_TIME = new Date(NOW);
const END_TIME = new Date(NOW + 1000 * 60 * 60 * 12); // 12 hours later
const EXPIRES = new Date(NOW + 1000 * 60 * 60 * 12 - DEFAULT_SAFETY_MARGIN); // 12 hours minus safety margin

test("should create a BasemapStyleSession object from valid parameters", () => {
  const session = new BasemapStyleSession({
    token: "fake-token",
    startSessionUrl: "https://example.com/start-session",
    styleFamily: "arcgis",
    startTime: START_TIME,
    endTime: END_TIME,
    expires: EXPIRES,
    authentication: "token"
  });

  expect(session).toBeDefined();
  expect(session.token).toBe("fake-token");
});
