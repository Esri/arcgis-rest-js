module.exports.getFetch = function getFetch() {
  return import("node-fetch").then((module) => {
    return {
      fetch: module.default,
      Headers: module.Headers,
      Request: module.Request,
      Response: module.Response,
    };
  });
};
