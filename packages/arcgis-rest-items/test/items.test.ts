import { search } from "../src/index";

import * as fetchMock from "fetch-mock";

import { SearchResponse } from "./mocks/responses";

describe("search", () => {
  // let paramsSpy: jasmine.Spy;

  // beforeEach(() => {
  //   paramsSpy = spyOn(FormData.prototype, "append").and.callThrough();
  // });

  // afterAll(() => {
  //   paramsSpy.calls.reset();
  // });

  afterEach(fetchMock.restore);

  it("should make a simple, single search request", done => {
    fetchMock.once("*", SearchResponse);

    search({
      q: "DC AND typekeywords:hubSiteApplication",
      num: 1,
      start: 1,
      sortField: "title",
      sortDir: "asc"
    })
      .then(response => {
        expect(fetchMock.called()).toEqual(true);
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual(
          "https://www.arcgis.com/sharing/rest/search?f=json&q=DC%20AND%20typekeywords%3AhubSiteApplication&num=1&start=1&sortField=title&sortDir=asc"
        );
        expect(options.method).toBe("GET");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
