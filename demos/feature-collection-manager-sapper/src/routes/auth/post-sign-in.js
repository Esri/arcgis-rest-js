import { UserSession } from "@esri/arcgis-rest-auth";

require("dotenv").config();

const { CLIENT_ID, REDIRECT_URI } = process.env;

export async function get(request, response, next) {
  // exchange the auth token for a full `UserSession`
  request.session.userSession = await UserSession.exchangeAuthorizationCode(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    },
    request.query.code
  );

  response.redirect("/webmaps");
}
