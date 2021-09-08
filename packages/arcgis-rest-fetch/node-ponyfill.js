import * as nodeFetch from "node-fetch";

export function getFetch() {
  return Promise.resolve({
    fetch: nodeFetch.default,
    Headers: nodeFetch.Headers,
    Response: nodeFetch.Responese,
    Request: nodeFetch.request,
  });
}
