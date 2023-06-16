import fetchMock from "fetch-mock";
import { createApiKey } from "../src/createApiKey.js";

describe("createApiKey()", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it("should create an api key with basic parameters", () => {
    fetchMock.post("mockCreateItemUrl", {
      //MockCreateItemResponse
    });

    fetchMock.post("mockRegisterAppUrl", {
      //MockRegisterAppResponse
    });

    fetchMock.post("mockGetItemUrl", {
      //MockGetItemResponse
    });

    return createApiKey({
      // create api key params
    }).then(() => {
      //evalaute the response
    });
  });
});
