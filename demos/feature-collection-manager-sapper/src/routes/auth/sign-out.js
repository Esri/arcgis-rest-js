export function get(request, response, next) {
  request.session.destroy(function(err) {
    response.redirect("/");
  });
}
