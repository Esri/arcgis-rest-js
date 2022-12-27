describe('Option', function () {

  describe('Custom matchers', function () {

    beforeEach(function () {

      jasmine.addMatchers({
        toLookTheSameAs: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              if (typeof expected === 'undefined') {
                expected = '';
              }
              var result = {};
              result.pass = util.equals(actual, expected, customEqualityTesters);

              result.message = 'Expected ' + actual;
              if (result.pass) {
                result.message += ' not';
              }
              result.message += ' to look the same as ' + expected + '.';

              return result;
            }
          };
        }
      });
    });

    it('should diff strings', function () {
      expect('bar').toLookTheSameAs('foo');
    });

    it('should NOT diff strings', function () {
      expect('bar').not.toLookTheSameAs('bar');
    });

    it('should diff objects', function () {
      var a = { foo: 'bar' };
      var b = { baz: 'qux' };
      expect(a).toEqual(b);
    });

    describe('toContain', function () {

      it('should diff string', function () {
        expect('foo bar baz.').toContain('qux');
      });

      it('should diff array', function () {
        expect(['foo', 'bar']).toContain('qux');
      });

    });

  });

});
