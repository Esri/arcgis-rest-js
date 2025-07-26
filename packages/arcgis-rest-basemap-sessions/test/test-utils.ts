import { DEFAULT_SAFETY_MARGIN } from "../src";
import { expect } from "vitest";

const now = Date.now();

export const TWELVE_HOURS = 1000 * 60 * 60 * 12; // 12 hours in milliseconds
export const MOCK_START_TIME = new Date(now);
export const MOCK_END_TIME = new Date(now + TWELVE_HOURS);
export const MOCK_EXPIRES = new Date(
  now + TWELVE_HOURS - DEFAULT_SAFETY_MARGIN
);

expect.extend({
  toStartWith(received, expected) {
    const { isNot } = this;
    return {
      pass: received.startsWith(expected),
      message: () =>
        `${received} does${isNot ? " not" : ""} start with ${expected}`
    };
  }
});
