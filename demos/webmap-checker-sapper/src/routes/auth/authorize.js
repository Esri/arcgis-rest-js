import { UserSession } from "@esri/arcgis-rest-auth";

// setup config variables
require("dotenv").config();
const { CLIENT_ID, REDIRECT_URI } = process.env;

// when a user accesses /auth/authorize we will allow
// UserSession.authorize to handle the response and
// redirect a user to the OAuth sign in page.
export function get(request, response, next) {
  UserSession.authorize(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    },
    response
  );
}
