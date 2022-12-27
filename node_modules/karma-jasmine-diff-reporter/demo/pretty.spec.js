describe('Option', function () {

  describe('Pretty print', function () {

    it('should pretty diff arrays', function () {
      var a = [5, 'foo', { moo: true }];
      var b = [10, 'bar', { moo: false }];
      expect(a).toEqual(b);
    });

    it('should pretty diff objects', function () {
      var a = {
        foo: 'bar',
        baz: 5,
        tux: {
          a: {
            b: 4,
            c: ['foo', true]
          }
        },
        qux: true
      };
      var b = {
        foo: 'baz',
        bar: 10,
        tux: {
          a: {
            b: 4,
            c: ['foo', false]
          }
        },
        qqx: true
      };

      expect(a).toEqual(b);
    });

    it('should pretty diff dirty objects', function () {
      var a = { foo: "ba', r Object({ ,, []\\", baz: 5, qux: true };
      var b = { foo: "ba', r \\\'Object({ ,, []\\", batz: 5, qux: false };
      expect(a).toEqual(b);
    });

  });

});
