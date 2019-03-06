export function get(request, response, next) {
  request.session.destroy(function(err) {
    response.cookie("connect.sid", { maxAge: 2592000000 });
    response.redirect("/");
  });
}
