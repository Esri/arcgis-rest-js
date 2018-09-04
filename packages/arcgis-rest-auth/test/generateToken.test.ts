/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as fetchMock from "fetch-mock";
import { generateToken } from "../src/index";
import { TOMORROW } from "./utils";

const TOKEN_URL = "https://www.arcgis.com/sharing/rest/generateToken";

describe("generateToken()", () => {
  afterEach(fetchMock.restore);

  // to do: remove next time we have a breaking change
  it("should generate a token for a username and password", done => {
    fetchMock.postOnce(TOKEN_URL, {
      token: "token",
      expires: TOMORROW.getTime()
    });

    generateToken(TOKEN_URL, {
      username: "Casey",
      password: "Jones"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          TOKEN_URL
        );
        expect(url).toEqual(TOKEN_URL);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("username=Casey");
        expect(options.body).toContain("password=Jones");
        expect(response.token).toEqual("token");
        expect(response.expires).toEqual(TOMORROW.getTime());
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should generate a token for a username and password as params", done => {
    fetchMock.postOnce(TOKEN_URL, {
      token: "token",
      expires: TOMORROW.getTime()
    });

    generateToken(TOKEN_URL, {
      params: {
        username: "Casey",
        password: "Jones"
      }
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall(
          TOKEN_URL
        );
        expect(url).toEqual(TOKEN_URL);
        expect(options.body).toContain("f=json");
        expect(options.body).toContain("username=Casey");
        expect(options.body).toContain("password=Jones");
        expect(response.token).toEqual("token");
        expect(response.expires).toEqual(TOMORROW.getTime());
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});

describe("generateToken() with custom fetch", () => {
  const oldPromise = Promise;
  const oldFetch = fetch;
  const oldFormData = FormData;

  beforeEach(() => {
    Promise = undefined;
    FormData = undefined;
    Function("return this")().fetch = undefined;
  });

  afterEach(() => {
    Promise = oldPromise;
    FormData = oldFormData;
    Function("return this")().fetch = oldFetch;
  });

  it("should generate a token for a username and password with custom fetch", done => {
    Promise = oldPromise;
    FormData = oldFormData;

    const tokenResponse = {
      token: "token",
      expires: TOMORROW.getTime()
    };

    const MockFetchResponse = {
      ok: true,
      json() {
        return Promise.resolve(tokenResponse);
      },
      blob() {
        return Promise.resolve(new Blob([JSON.stringify(tokenResponse)]));
      },
      text() {
        return Promise.resolve(JSON.stringify(tokenResponse));
      }
    };

    const MockFetch = function() {
      return Promise.resolve(MockFetchResponse);
    };

    generateToken(TOKEN_URL, {
      params: {
        username: "Casey",
        password: "Jones"
      },
      fetch: MockFetch as any
    })
      .then(response => {
        expect(response.token).toEqual(tokenResponse.token);
        expect(response.expires).toEqual(tokenResponse.expires);
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
