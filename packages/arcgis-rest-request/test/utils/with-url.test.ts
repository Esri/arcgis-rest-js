/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "../../src/index";
import { withUrl } from "../../src/utils/with-url";
import * as fetchMock from "fetch-mock";
import {
  SharingRestInfo,
  SharingRestInfoHTML
} from "../mocks/sharing-rest-info";

describe("withUrl()", () => {
  afterEach(fetchMock.restore);

  // it("should wrap a basic request with the proper URL", done => {
  //   fetchMock.once("*", SharingRestInfo);
  //   const requestWithUrl = withUrl(
  //     "https://www.arcgis.com/sharing/rest/info",
  //     request
  //   );

  //   requestWithUrl("")
  //     .then(response => {
  //       const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
  //       expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
  //       expect(options.method).toBe("POST");
  //       expect(response).toEqual(SharingRestInfo);
  //       expect(options.body).toContain("f=json");
  //       done();
  //     })
  //     .catch(e => {
  //       fail(e);
  //     });
  // });

  it("should pass return types properly", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomOptions extends IRequestOptions {
      test: string;
    }

    interface ICustomResponse {
      test: string;
    }

    function customRequest(options: ICustomOptions): Promise<ICustomResponse> {
      return request(options);
    }

    const requestWithUrl = withUrl(
      "https://www.arcgis.com/sharing/rest/info",
      customRequest
    );

    requestWithUrl({ test: "foo" })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.method).toBe("POST");
        expect(response).toEqual(MockResponse);
        expect(options.body).toContain("test=foo");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
