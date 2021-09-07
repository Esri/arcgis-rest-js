module.exports = globalThis.fetch; // To enable: import fetch from 'cross-fetch'
module.exports.default = globalThis.fetch; // For TypeScript consumers without esModuleInterop.
module.exports.fetch = globalThis.fetch; // To enable: import {fetch} from 'cross-fetch'
module.exports.Headers = globalThis.Headers;
module.exports.Request = globalThis.Request;
module.exports.Response = globalThis.Response;
