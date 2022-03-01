import { generateCodeChallenge } from "../../src/utils/generate-code-challenge.js";
import { isBrowser } from "../../../../scripts/test-helpers.js";

describe("decodeQueryString()", () => {
  if (isBrowser) {
    it("should give the SHA256 of a string", () => {
      return generateCodeChallenge("Lorem ipsum dolor sit amet quis. ").then(
        (challenge) => {
          expect(challenge).toBe("Y4LuScIpNxbzZrRiIB9mFSevbPo9xVNAPnAClooocN0");
        }
      );
    });

    it("should resolve with the plain string in non-secure environments", () => {
      return generateCodeChallenge("Lorem ipsum dolor sit amet quis. ", {
        isSecureContext: false,
        crypto: undefined
      } as any).then((challenge) => {
        expect(challenge).toBe(null);
      });
    });
  }
});
