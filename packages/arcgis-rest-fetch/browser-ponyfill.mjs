export function getFetch() {
  return Promise.resolve({
    fetch: globalThis.fetch,
    Headers: globalThis.Headers,
    Response: globalThis.Response,
    Request: globalThis.Request
  });
}
