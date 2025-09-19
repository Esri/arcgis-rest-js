import { expect, test, describe, beforeEach } from "vitest";
import fetchMock from "fetch-mock";
import {
  startNewSession,
  IStartSessionResponse
} from "../../src/utils/startNewSession.js";
import { MOCK_START_TIME, MOCK_END_TIME } from "../test-utils.js";

const MOCK_URL = "https://example.com/startSession";
const MOCK_AUTH = "fake-token";

describe("startNewSession", () => {
  beforeEach(() => {
    fetchMock.restore();
  });

  test("returns correct results from the API", async () => {
    const MOCK_RESPONSE: IStartSessionResponse = {
      sessionToken: "abc123",
      startTime: MOCK_START_TIME.getTime(),
      endTime: MOCK_END_TIME.getTime(),
      styleFamily: "arcgis"
    };

    fetchMock.getOnce(
      {
        url: `${MOCK_URL}?f=json&styleFamily=arcgis&durationSeconds=43200&token=${MOCK_AUTH}`
      },
      {
        status: 200,
        body: MOCK_RESPONSE
      }
    );

    const result = await startNewSession({
      startSessionUrl: MOCK_URL,
      authentication: MOCK_AUTH
    });

    expect(result).toEqual(MOCK_RESPONSE);
  });

  test("sends correct params when styleFamily and duration are provided", async () => {
    const MOCK_RESPONSE: IStartSessionResponse = {
      sessionToken: "abc123",
      startTime: MOCK_START_TIME.getTime(),
      endTime: MOCK_START_TIME.getTime() + 1000 * 60 * 60, // 1 hour later
      styleFamily: "open"
    };

    fetchMock.getOnce(
      {
        url: `${MOCK_URL}?f=json&styleFamily=open&durationSeconds=3600&token=${MOCK_AUTH}`
      },
      {
        status: 200,
        body: MOCK_RESPONSE
      }
    );

    const result = await startNewSession({
      startSessionUrl: MOCK_URL,
      authentication: MOCK_AUTH,
      styleFamily: "open",
      duration: 3600
    });

    expect(result).toEqual(MOCK_RESPONSE);
  });
});
