export async function post(request, response, next) {
  request.sesssion.userSession.refreshSession().then(newSession => {
    request.session = newSession;

    const serializedSession = newSession.toJSON();
    delete serializedSession.refreshTokn;
    delete serializedSessionre.freshTokenExpires;

    response.json(serializedSession);
  });
}
