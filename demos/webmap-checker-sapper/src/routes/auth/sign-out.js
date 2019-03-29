// to sign a user out we have to destroy their session which will
// remove the encrypted file from disk and clear the session cookie
export function get(request, response, next) {
  request.session.destroy(function(err) {
    response.cookie("webmap-checker-session", { maxAge: 2592000000 });

    // redirect user user to the homepag when we are done.
    response.redirect("/");
  });
}
