/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { describe, test, expect } from "vitest";
import { processParams, requiresFormData } from "../../src/index.js";

describe("processParams", () => {
  test("should pass non Date, Function, Array and Object params through", () => {
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

  test("should encode Dates as timestamps", () => {
    const date = new Date();

    const params = {
      foo: date
    };

    const expected = {
      foo: date.getTime()
    };
    expect(processParams(params)).toEqual(expected);
  });

  test("should not encode a function", () => {
    const params = {
      foo() {} // tslint:disable-line no-empty
    };

    expect(processParams(params)).toEqual({});
  });

  test("should stringify objects", () => {
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

  test("should stringify arrays of objects", () => {
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

  test("should comma separate arrays of non objects", () => {
    const params = {
      foo: ["bar", "baz"]
    };

    const expected = {
      foo: "bar,baz"
    };

    expect(processParams(params)).toEqual(expected);
  });

  test("should pass array of arrays through", () => {
    const params = {
      foo: [["bar1"], ["baz1", "baz2"]]
    };

    const expected = {
      foo: [["bar1"], ["baz1", "baz2"]]
    };

    expect(processParams(params)).toEqual(expected);
  });

  test("should stringify booleans", () => {
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

  test("should exclude null and undefined, but not a zero", () => {
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

  test("should not require form data for simple requests", () => {
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

  test("should require form data for multipart requests", () => {
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

  test("should require form data for mixed multipart requests", () => {
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
