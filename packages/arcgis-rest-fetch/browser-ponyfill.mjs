export function getFetch() {
  return Promise.resolve({
    fetch: globalThis.fetch,
    Headers: globalThis.Headers,
    Response: globalThis.Responese,
    Request: globalThis.request,
  });
}
