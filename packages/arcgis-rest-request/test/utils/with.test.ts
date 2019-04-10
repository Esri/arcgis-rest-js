/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { request, IRequestOptions } from "../../src/index";
import { withUrl } from "../../src/utils/with-url";
import { withOptions } from "../../src/utils/with-options";

import * as fetchMock from "fetch-mock";
import {
  SharingRestInfo,
  SharingRestInfoHTML
} from "../mocks/sharing-rest-info";

describe("withUrl()", () => {
  afterEach(fetchMock.restore);

  it("should wrap a basic request with a default URL", done => {
    fetchMock.once("*", SharingRestInfo);
    const requestWithUrl = withUrl(
      request,
      "https://www.arcgis.com/sharing/rest/info"
    );

    requestWithUrl("")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with a default URL", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomOptions extends IRequestOptions {
      id: string;
    }

    interface ICustomResponse {
      test: string;
    }

    function customRequest(options: ICustomOptions): Promise<ICustomResponse> {
      options.params = {
        id: options.id
      };
      return request(options);
    }

    const requestWithUrl = withUrl(
      customRequest,
      "https://www.arcgis.com/sharing/rest/info"
    );

    requestWithUrl({
      id: "foo"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with multiple parameters with a default URL", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomResponse {
      test: string;
    }

    function customRequest(
      id: string,
      options: IRequestOptions = {}
    ): Promise<ICustomResponse> {
      options = {
        ...options,
        ...{ params: { ...options.params, ...{ id } } }
      };
      return request(options);
    }

    const requestWithUrl = withUrl(
      customRequest,
      "https://www.arcgis.com/sharing/rest/info"
    );

    requestWithUrl("foo")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});

describe("withOptions()", () => {
  afterEach(fetchMock.restore);

  it("should wrap a basic request with default options", done => {
    fetchMock.once("*", SharingRestInfo);
    const requestWithOptions = withOptions(request, {
      headers: {
        "Test-Header": "Test"
      }
    });

    requestWithOptions("https://www.arcgis.com/sharing/rest/info")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with default options", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomOptions extends IRequestOptions {
      id: string;
    }

    interface ICustomResponse {
      test: string;
    }

    function customRequest(options: ICustomOptions): Promise<ICustomResponse> {
      options.params = {
        id: options.id
      };
      return request(options);
    }

    const requestWithOptions = withOptions(customRequest, {
      headers: {
        "Test-Header": "Test"
      }
    });

    requestWithOptions({
      url: "https://www.arcgis.com/sharing/rest/info",
      id: "foo"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with multiple parameters with a default URL", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomResponse {
      test: string;
    }

    function customRequest(
      id: string,
      options: IRequestOptions = {}
    ): Promise<ICustomResponse> {
      options = {
        ...options,
        ...{ params: { ...options.params, ...{ id } } }
      };
      return request(options);
    }

    const requestWithOptions = withOptions(customRequest, {
      headers: {
        "Test-Header": "Test"
      }
    });

    requestWithOptions("foo", {
      url: "https://www.arcgis.com/sharing/rest/info"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});

describe("withOptions() and withUrl() chaining", () => {
  it("should wrap a basic request with default options and a default URL", done => {
    fetchMock.once("*", SharingRestInfo);

    const requestWithOptions = withOptions(request, {
      headers: {
        "Test-Header": "Test"
      }
    });

    const requestWithOptionsAndUrl = withUrl(
      requestWithOptions,
      "https://www.arcgis.com/sharing/rest/info"
    );

    requestWithOptionsAndUrl("")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with default options and a default URL", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomOptions extends IRequestOptions {
      id: string;
    }

    interface ICustomResponse {
      test: string;
    }

    function customRequest(options: ICustomOptions): Promise<ICustomResponse> {
      options.params = {
        id: options.id
      };
      return request(options);
    }

    const customRequestWithUrl = withUrl(
      customRequest,
      "https://www.arcgis.com/sharing/rest/info"
    );

    const customRequestWithUrlAndOptions = withOptions(customRequestWithUrl, {
      headers: {
        "Test-Header": "Test"
      }
    });

    customRequestWithUrlAndOptions({
      id: "foo"
    })
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });

  it("should wrap a custom request implimentation with multiple parameters with a default URL", done => {
    const MockResponse = {
      test: "bar"
    };

    fetchMock.once("*", MockResponse);

    interface ICustomResponse {
      test: string;
    }

    function customRequest(
      id: string,
      options: IRequestOptions = {}
    ): Promise<ICustomResponse> {
      options = {
        ...options,
        ...{ params: { ...options.params, ...{ id } } }
      };
      return request(options);
    }

    const customRequestWithUrl = withUrl(
      customRequest,
      "https://www.arcgis.com/sharing/rest/info"
    );

    const customRequestWithUrlAndOptions = withOptions(customRequestWithUrl, {
      headers: {
        "Test-Header": "Test"
      }
    });

    customRequestWithUrlAndOptions("foo")
      .then(response => {
        const [url, options]: [string, RequestInit] = fetchMock.lastCall("*");
        expect(url).toEqual("https://www.arcgis.com/sharing/rest/info");
        expect(options.body).toContain("id=foo");
        expect((options.headers as any)["Test-Header"]).toBe("Test");
        done();
      })
      .catch(e => {
        fail(e);
      });
  });
});
