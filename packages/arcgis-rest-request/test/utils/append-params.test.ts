/* Copyright (c) 2018-2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { appendCustomParams, IRequestOptions } from "../../src/index";

describe("appendCustomParams", () => {
  it("should not mis-identify standard request options as parameters.", () => {
    const oldOptions: any = {
      foo: "bar",
      headers: {
        Cookie: "monster"
      },
      httpMethod: "GET",
      params: { baz: "luhrman" },
      maxUrlLength: 1064
    };
    
    const newOptions: IRequestOptions = {
      params: {}
    };
    
    appendCustomParams(oldOptions, newOptions);
    
    // all other request options should be mixed in outside this helper method
    expect(typeof newOptions.headers).toEqual("undefined");
    expect(typeof newOptions.httpMethod).toEqual("undefined");
    expect(typeof newOptions.maxUrlLength).toEqual("undefined");
    expect(typeof newOptions.params.baz).toEqual("undefined");
    
    expect(newOptions.params.foo).toEqual("bar");
  });
});
