// if a token expires on the client side we don't have to ask then to log in
// again. Instead we can maek a request to /auth/exchange-token. Since this
// request will be same-domain this request will get the session cookie and
// can hydrate request.session.userSession which we can then refresh getting a
// new token which can be used on the client.
export function get(request, response, next) {
  request.session.userSession
    .refreshSession()
    .then(newSession => {
      request.session.userSession = newSession;
      const serializedSession = newSession.toJSON();
      delete serializedSession.refreshToken;
      delete serializedSession.refreshTokenExpires;
      response.json(serializedSession);
    })
    .catch(error => {
      console.error(error);
      response.json(error);
    });
}
