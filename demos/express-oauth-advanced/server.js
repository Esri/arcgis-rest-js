import "dotenv/config";
import express from "express";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import session from "express-session";
import SessionFileStore from "session-file-store";
import { readFile } from "fs/promises";
import { randomBytes } from "crypto";

/**
 * Create a new express and file store for our sessions
 */
const app = express();
const FileStore = SessionFileStore(session);

/**
 * Create our oauth 2 options objects
 */
const oauthOptions = {
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI
};

/**
 * Determine how long we want our session to last we know refresh tokens last 2 weeks so we subtract an hour to provide some padding.
 */
const sessionTTL = 60 * 60 * 24 * 7 * 2 - 60 * 60 * 1; // 2 weeks - 1 hours in seconds;

/**
 * Setup the session middleware
 */
app.use(
  session({
    name: "arcgis-rest-js-advanced-oauth-demo", // the name of the cookie to store the session id.
    secret: process.env.SESSION_SECRET, // secret used to sign the session cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionTTL * 1000 // set the max age on the cookie to match our session duration
    },

    // store session data in a secure, encrypted file, sessions will be loaded from these files and decrypted
    // at the end of every request the state of `request.session` will be saved back to disk.
    store: new FileStore({
      ttl: sessionTTL, // session duration
      secret: process.env.ENCRYPTION_KEY, // secret used to encrypt and decrypt sessions on disk

      // define how to encode our session to text for storing in the file. We can use the `serialize()` method on the session for this.
      encoder: (sessionObj) => {
        sessionObj.arcgis = sessionObj.arcgis.serialize();
        return JSON.stringify(sessionObj);
      },

      // define how to turn the text from the session data back into an object. We can use the `ArcGISIdentityManager.deserialize()` method for this.
      decoder: (sessionContents) => {
        const sessionObj = JSON.parse(sessionContents);
        if (sessionObj.arcgis) {
          sessionObj.arcgis = ArcGISIdentityManager.deserialize(
            sessionObj.arcgis
          );
        }

        return sessionObj;
      }
    })
  })
);

// Render a link to the authorization page on the homepage
app.get("/", (request, response) => {
  response.send(`<a href="/authorize">Sign in with ArcGIS</a>`);
});

// When a user visits the authorization page start the oauth 2 process. The `ArcGISIdentityManager.authorize()` method will redirect the user to the authorization page.
app.get("/authorize", function (request, response) {
  // set a custom state value, this could be used to identify the user who started the request, here we just use a random string but this could be
  // something like a user identifier.
  oauthOptions.state = randomBytes(20).toString("hex");

  console.log("Starting OAuth Request ID:", oauthOptions.state);

  // send the user to the authorization screen
  ArcGISIdentityManager.authorize(oauthOptions, response);
});

// the after authorizing the user is redirected to /authenticate and we can finish the Oauth 2.0 process.
app.get("/authenticate", async function (request, response) {
  console.log("Authorization complete for", request.query.state);
  console.log(request.query);
  // exchange the auth code for a an instance of `ArcGISIdentityManager` save that to the session.
  request.session.arcgis =
    await ArcGISIdentityManager.exchangeAuthorizationCode(
      oauthOptions,
      request.query.code
    );
  console.log(request.session.arcgis);
  // once we have the session set redirect the user to the /app route so they can use the app.
  response.redirect("/app");
});

// The refresh endpoint is used when the client needs to get a new token.
app.get("/refresh", function (request, response) {
  // return an error if we cannot find a session.
  if (!request.session.arcgis) {
    response.json({ error: "unable to refresh" });
    return;
  }

  // refresh the session
  request.session.arcgis
    .refreshCredentials()
    .then((newSession) => {
      request.session.userSession = newSession;

      // convert the session to an object and remove the refresh token
      const serializedSession = newSession.toJSON();
      delete serializedSession.refreshToken;
      delete serializedSession.refreshTokenExpires;

      // respond with the new session data
      request.json(serializedSession);
    })
    .catch((error) => {
      response.json({
        error: error.toString()
      });
    });
});

// This handles the application route
app.get("/app", (request, response) => {
  // if there is no session available redirect the user back to the home page
  if (!request.session.arcgis) {
    response.redirect("/");
    return;
  }
  console.log(request.session.arcgis);
  // next exchange the current refresh token for a new refresh token, this extends the session for another 2 weeks
  // we also read the template for the app.
  Promise.all([
    readFile("app.html", { encoding: "utf-8" }),
    request.session.arcgis.exchangeRefreshToken()
  ]).then(([templateContents, freshSession]) => {
    // update our session object with the new session
    request.session.arcgis = freshSession;

    // prepare to send the session to the client
    const serializedSession = freshSession.toJSON();
    delete serializedSession.refreshToken;
    delete serializedSession.refreshTokenExpires;

    // insert the session into the HTML
    templateContents = templateContents.replace(
      "<body>",
      `<body><pre>${JSON.stringify(serializedSession, null, 2)}</pre>`
    );
    templateContents = templateContents.replace(
      "SESSION_JSON",
      JSON.stringify(serializedSession)
    );

    // send the HTML
    response.send(templateContents);
  });
});

app.listen(3000, function () {
  console.log("visit http://localhost:3000/authorize to test the application!");
});
