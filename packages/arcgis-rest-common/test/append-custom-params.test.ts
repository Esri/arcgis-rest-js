/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { appendCustomParams } from "../src/util/append-custom-params";
import { IRequestOptions } from "@esri/arcgis-rest-request/src";

describe("appendCustomParams() helper", () => {
  it("should assign custom params from a sub class of IRequestOptions", () => {
    interface ICustomOptions extends IRequestOptions {
      foo: string;
    }

    expect(
      appendCustomParams<ICustomOptions>({ foo: "bar" }, ["foo"], {
        httpMethod: "GET"
      })
    ).toEqual({
      httpMethod: "GET",
      params: {
        foo: "bar"
      }
    });
  });

  it("should assign custom params even if theyre falsey", () => {
    interface IFalseyCustomOptions extends IRequestOptions {
      foo: boolean;
    }

    expect(
      appendCustomParams<IFalseyCustomOptions>({ foo: false }, ["foo"], {
        httpMethod: "GET"
      })
    ).toEqual({
      httpMethod: "GET",
      params: {
        foo: false
      }
    });
  });

  it("should pass through manual params if nothing is present to overwrite them", () => {
    interface IEmptyCustomOptions extends IRequestOptions {
      foo?: boolean;
    }

    expect(
      appendCustomParams<IEmptyCustomOptions>({}, ["foo"], {
        httpMethod: "GET",
        params: {
          foo: "bar"
        }
      })
    ).toEqual({
      httpMethod: "GET",
      params: {
        foo: "bar"
      }
    });
  });
});
