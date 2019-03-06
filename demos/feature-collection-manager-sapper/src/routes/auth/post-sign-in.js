import { UserSession } from "@esri/arcgis-rest-auth";

// setup config variables
require("dotenv").config();
const { CLIENT_ID, REDIRECT_URI } = process.env;

// a user will be redirected to /auth/post-sign-in after completing the sign in
// form in ArcGIS Online. We will allow UserSession.exchangeAuthorizationCode to
// trade the oAuth authorization code for a token and create a user session.
// We can then add that user session to the request.
export async function get(request, response, next) {
  // exchange the auth token for a full `UserSession`
  request.session.userSession = await UserSession.exchangeAuthorizationCode(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    },
    request.query.code
  );

  // once we have the session set redirect the user to the /webmaps
  // route so they can use the app.
  response.redirect("/webmaps");
}
