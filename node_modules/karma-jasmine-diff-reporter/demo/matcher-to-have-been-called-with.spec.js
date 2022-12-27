describe('Matcher', function () {

  describe('toHaveBeenCalledWith', function () {

    it('should diff objects', function () {
      var spy = jasmine.createSpy('spy');
      var a = { foo: 'bar' };
      var b = { baz: 'qux' };

      spy(a);

      expect(spy).toHaveBeenCalledWith(b);
    });

    it('should diff booleans', function () {
      var spy = jasmine.createSpy('spy');

      spy(true);

      expect(spy).toHaveBeenCalledWith(false);
    });

    it('multiple calls', function () {

      var foo = {
        bar: function () {}
      };

      spyOn(foo, 'bar');

      foo.bar(5);
      foo.bar(6);
      foo.bar(10);

      expect(foo.bar).toHaveBeenCalledWith(8);

    });

    it('Should correctly show spyOn value', function () {
      function createUIEvent(reference) {
        return {
          tag: reference
        };
      }

      var foo = {
        bar: function () {},
        foo: this
      };

      spyOn(foo, 'bar');

      foo.bar({}, createUIEvent(foo));

      expect(foo.bar).toHaveBeenCalledWith({}, {
        bar: function () {},
        foo: 'asd'
      });
    });

  });

});
