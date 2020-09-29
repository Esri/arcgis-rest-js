import { scrubControlChars } from "../../src/util/scrub-control-chars";

describe('scrubControlChars', function () {
  it('removes control characters', function () {
    let hasAllControlChars = 'foo';
    // C0
    for (let i = 0; i < 32; i++) {
      hasAllControlChars += String.fromCharCode(i);
    }
    hasAllControlChars += 'bar';
    // C1
    for (let i = 128; i < 159; i++) {
      hasAllControlChars += String.fromCharCode(i);
    }
    hasAllControlChars += 'baz';

    // ISO 8859 special char
    hasAllControlChars += String.fromCharCode(160);

    expect(scrubControlChars(hasAllControlChars)).toBe('foobarbaz', "removes all control chars")
  });
});