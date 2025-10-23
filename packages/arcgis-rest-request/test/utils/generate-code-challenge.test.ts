import { describe, test, expect } from "vitest";
import { generateCodeChallenge } from "../../src/utils/generate-code-challenge.js";
import { isBrowser } from "../../../../scripts/test-helpers.js";

describe("generateCodeChallenge()", () => {
  if (isBrowser) {
    test("should give the SHA256 of a string", async () => {
      const challenge = await generateCodeChallenge(
        "Lorem ipsum dolor sit amet quis. "
      );
      expect(challenge).toBe("Y4LuScIpNxbzZrRiIB9mFSevbPo9xVNAPnAClooocN0");
    });

    test("should resolve with the plain string in non-secure environments", async () => {
      const challenge = await generateCodeChallenge(
        "Lorem ipsum dolor sit amet quis. ",
        {
          isSecureContext: false,
          crypto: undefined
        } as any
      );
      expect(challenge).toBe(null);
    });
  }
});
