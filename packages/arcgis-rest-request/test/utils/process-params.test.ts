/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { processParams, requiresFormData } from "../../src/index";

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
      foo: true,
      bar: false
    };

    const expected = {
      foo: "true",
      bar: "false"
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should exclude null and undefined, but not a zero", () => {
    const params: any = {
      foo: null,
      bar: undefined,
      baz: 0
    };

    const expected = {
      baz: 0
    };

    expect(processParams(params)).toEqual(expected);
  });

  it("should not require form data for simple requests", () => {
    expect(
      requiresFormData({
        string: "string"
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        number: 123
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        date: new Date()
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        boolean: true
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        array: []
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        object: {}
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        fn: () => {
          return;
        }
      })
    ).toBeFalsy();

    expect(
      requiresFormData({
        falsy: null
      })
    ).toBeFalsy();
  });

  it("should require form data for multipart requests", () => {
    const binaryObj =
      typeof File !== "undefined"
        ? new File(["foo"], "foo.txt", {
            type: "text/plain"
          })
        : Buffer.from("");

    expect(
      requiresFormData({
        binary: binaryObj
      })
    ).toBeTruthy();
  });

  it("should require form data for mixed multipart requests", () => {
    const binaryObj =
      typeof File !== "undefined"
        ? new File(["foo"], "foo.txt", {
            type: "text/plain"
          })
        : Buffer.from("");

    expect(
      requiresFormData({
        string: "string",
        binary: binaryObj
      })
    ).toBeTruthy();
  });
});
