export function get(request, response, next) {
  console.log("refreshing session");
  request.session.userSession
    .refreshSession()
    .then(newSession => {
      console.log("session refreshed");
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
