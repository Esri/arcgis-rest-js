import { UserSession } from "@esri/arcgis-rest-auth";

require("dotenv").config();

const { CLIENT_ID, REDIRECT_URI } = process.env;

export function get(request, response, next) {
  UserSession.authorize(
    {
      clientId: CLIENT_ID,
      redirectUri: REDIRECT_URI
    },
    response
  );
}
