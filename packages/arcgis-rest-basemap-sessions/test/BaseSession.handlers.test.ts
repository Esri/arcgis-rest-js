import { describe, expect, test } from "vitest";

import { BaseSession } from "../src/BaseSession.js";

describe("BaseSession static handlers", () => {
  test("are callable no-op handlers used for docs", () => {
    expect(() => {
      BaseSession.error(new Error("test"));
      BaseSession.expired({
        token: "token",
        startTime: new Date(0),
        endTime: new Date(1),
        expires: new Date(1)
      });
      BaseSession.refreshed({
        previous: {
          token: "prev",
          startTime: new Date(0),
          endTime: new Date(1),
          expires: new Date(1)
        },
        current: {
          token: "curr",
          startTime: new Date(1),
          endTime: new Date(2),
          expires: new Date(2)
        }
      });
    }).not.toThrow();
  });
});
