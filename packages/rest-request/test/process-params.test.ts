import { processParams } from "../src/index";

describe("processParams", () => {
  it("should pass non Date, Function, Array and Object params through", () => {
    const params = {
      foo: "foo",
      bar: 1
    };

    const expected = {
      foo: "foo",
      bar: 1
    };
    expect(processParams(params)).toEqual(expected);
  });

  it("should encode Dates as timestamps", () => {
    const date = new Date();

    const params = {
      foo: date
    };

    const expected = {
      foo: date.getTime()
    };
    expect(processParams(params)).toEqual(expected);
  });

  it("should not encode a function", () => {
    const params = {
      foo() {} // tslint:disable-line no-empty
    };

    expect(processParams(params)).toEqual({});
  });

  it("should stringify objects", () => {
    const params = {
      foo: {
        bar: "bar"
      }
    };

    const expected = {
      foo: '{"bar":"bar"}'
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should stringify  arrays of objects", () => {
    const params = {
      foo: [
        {
          bar: "bar"
        }
      ]
    };

    const expected = {
      foo: '[{"bar":"bar"}]'
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should comma seperate arrays of non objects", () => {
    const params = {
      foo: ["bar", "baz"]
    };

    const expected = {
      foo: "bar,baz"
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should stringify booleans", () => {
    const params = {
      foo: true
    };

    const expected = {
      foo: "true"
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should exclude null and undefined", () => {
    const params: any = {
      foo: null,
      bar: undefined
    };

    expect(processParams(params)).toEqual({});
  });
});
