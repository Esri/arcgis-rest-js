describe('Matcher', function () {

  describe('toBe', function () {

    it('should diff booleans', function () {
      expect(true).toBe(false);
    });

    it('should diff strings', function () {
      expect('foo').toBe('bar');
    });

    it('should diff strings', function () {
      expect('yo banana apple').toBe('yo gavana apple');
    });

    it('should diff string with dots and whitespaces', function () {
      function fn() {
        expect('yo. banana. apple').toBe('yo. gavana. \n apple');
      }
      fn();
    });

    it('should diff strings with newlines', function () {
      expect('yo banana apple').toBe('yo banana \napple');
    });

    it('should diff strings with tabs', function () {
      expect('yo ba\tnana apple').toBe('yo gavana ap\tple');
    });

    it('should diff strings with single space diff', function () {
      expect('foo bar').toBe('foo  bar');
    });

    it('should diff arrays', function () {
      var a = [1, 2, 3];
      var b = [1, 2, 4];
      expect(a).toBe(b);
    });

    it('should diff undefined with string with newlines', function () {
      expect(void 0).toBe('yo ban\nana apple');
    });

    it('should NOT diff', function () {
      expect(true).not.toBe(true);
    });

  });

  describe('toBeDefined', function () {

    it('should NOT diff', function () {
      expect(void 0).toBeDefined();
    });

  });

  describe('toBeTruthy', function () {

    it('should NOT diff', function () {
      expect(false).toBeTruthy();
    });

  });

  describe('toBeUndefined', function () {

    it('should diff', function () {
      expect('defined').toBeUndefined();
    });

  });

  describe('toBeCloseTo', function () {

    it('should NOT diff', function () {
      expect('defined').toBeCloseTo(5);
    });

  });

});
