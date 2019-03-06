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
