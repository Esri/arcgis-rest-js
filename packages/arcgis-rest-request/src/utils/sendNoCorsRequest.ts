import { requestConfig } from "../requestConfig.js";

/**
 * Send a no-cors request to the passed uri. This is used to pick up
 * a cookie from a 3rd party server to meet a requirement of some authentication
 * flows.
 * @param url
 * @returns
 */
export function sendNoCorsRequest(url: string): Promise<void> {
  // drop any query params, other than f=json
  const urlObj = new URL(url);
  url = urlObj.origin + urlObj.pathname;

  if (urlObj.search.includes("f=json")) {
    url += "?f=json";
  }

  const origin = urlObj.origin;

  // If we have already sent a no-cors request to this url, return the promise
  // so we don't send multiple requests
  if (requestConfig.pendingNoCorsRequests[origin]) {
    return requestConfig.pendingNoCorsRequests[origin];
  }

  // Make the request and add to the cache
  requestConfig.pendingNoCorsRequests[origin] = fetch(url, {
    mode: "no-cors",
    credentials: "include",
    cache: "no-store"
  })
    .then((response) => {
      // Add to the list of cross-origin no-cors domains
      // if the domain is not already in the list
      if (requestConfig.noCorsDomains.indexOf(origin) === -1) {
        requestConfig.noCorsDomains.push(origin);
      }

      // Hold the timestamp of this request so we can decide when to
      // send another request to this domain
      requestConfig.crossOriginNoCorsDomains[origin.toLowerCase()] = Date.now();

      // Remove the pending request from the cache
      delete requestConfig.pendingNoCorsRequests[origin];

      // Due to limitations of fetchMock at the version of the tooling
      // in this project, we can't mock the response type of a no-cors request
      // and thus we can't test this. So we are going to comment this out
      // and leave it in place for now. If we need to test this, we can
      // update the tooling to a version that supports this. Also
      // JS SDK does not do this check, so we are going to leave it out for now.

      // ================================================================
      // no-cors requests are opaque to javascript
      // and thus will always return a response with a type of "opaque"
      // if (response.type === "opaque") {
      //   return Promise.resolve();
      // } else {
      //   // Not sure if this is possible, but since we have a check above
      //   // lets handle the else case
      //   return Promise.reject(
      //     new Error(`no-cors request to ${origin} not opaque`)
      //   );
      // }
      // ================================================================
    })
    .catch((e) => {
      // Not sure this is necessary, but if the request fails
      // we should remove it from the pending requests
      // and return a rejected promise with some information
      delete requestConfig.pendingNoCorsRequests[origin];
      return Promise.reject(new Error(`no-cors request to ${origin} failed`));
    });
  // return the promise
  return requestConfig.pendingNoCorsRequests[origin];
}

/**
 * Allow us to get the no-cors domains that are registered
 * so we can pass them into the identity manager
 * @returns
 */
export function getRegisteredNoCorsDomains(): string[] {
  // return the no-cors domains
  return requestConfig.noCorsDomains;
}

/**
 * Register the domains that are allowed to be used in no-cors requests
 * This is called by `request` when the portal/self response is intercepted
 * and the `.authorizedCrossOriginNoCorsDomains` property is set.
 * @param authorizedCrossOriginNoCorsDomains
 */
export function registerNoCorsDomains(
  authorizedCrossOriginNoCorsDomains: string[]
): void {
  // register the domains
  authorizedCrossOriginNoCorsDomains.forEach((domain: string) => {
    // ensure domain is lower case and ensure protocol is included
    domain = domain.toLowerCase();
    if (/^https?:\/\//.test(domain)) {
      addNoCorsDomain(domain);
    } else {
      // no protocol present, so add http and https
      addNoCorsDomain("http://" + domain);
      addNoCorsDomain("https://" + domain);
    }
  });
}

/**
 * Ensure we don't get duplicate domains in the no-cors domains list
 * @param domain
 */
function addNoCorsDomain(url: string): void {
  // Since the caller of this always ensures a protocol is present
  // we can safely use the URL constructor to get the origin
  // and add it to the no-cors domains list
  const uri = new URL(url);
  const domain = uri.origin;
  if (requestConfig.noCorsDomains.indexOf(domain) === -1) {
    requestConfig.noCorsDomains.push(domain);
  }
}

/**
 *  Is the origin of the passed url in the no-cors domains list?
 * @param url
 * @returns
 */
export function isNoCorsDomain(url: string): boolean {
  let result = false;

  if (requestConfig.noCorsDomains.length) {
    // is the current url in the no-cors domains?
    const origin = new URL(url).origin.toLowerCase();
    result = requestConfig.noCorsDomains.some((domain) => {
      return origin.includes(domain);
    });
  }

  return result;
}

/**
 * Is the origin of the passed url in the no-cors domains list
 * and do we need to send a no-cors request?
 *
 * @param url
 * @returns
 */
export function isNoCorsRequestRequired(url: string): boolean {
  let result = false;
  // is the current origin in the no-cors domains?
  if (isNoCorsDomain(url)) {
    const origin = new URL(url).origin.toLowerCase();

    // check if we have sent a no-cors request to this domain in the last hour
    const lastRequest = requestConfig.crossOriginNoCorsDomains[origin] || 0;
    if (Date.now() - 60 * 60000 > lastRequest) {
      result = true;
    }
  }

  return result;
}
