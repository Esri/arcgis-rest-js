import { single, suggest, reverse, bulk, serviceInfo } from "../src/index";

import {
  findAddressCandidatesResponse,
  suggestResponse,
  reverseGeocodeResponse,
  metadataResponse
} from "./mocks/responses";

// simple requests
// requests with custom parameters
// make sure authenticated requests include token
// GET requests?

describe("request()", () => {
  it("should make a basic request for metadata from the World Geocoding Service", () => {
    serviceInfo()
      .then(response => {
        // need to interrogate both request and manipulated response
      })
      .catch(e => {
        fail(e);
      });
  });
});
