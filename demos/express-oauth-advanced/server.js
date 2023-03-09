import * as dotenv from "dotenv";
import express from "express";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import session from "express-session";
import SessionFileStore from "session-file-store";
import { readFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";

dotenv.config();

// Define some basic server options
const sessionCookeieName = "arcgis-rest-js-advanced-oauth-demo";
const port = parseInt(process.env.PORT);

// Create a new express and file store for our sessions
const FileStore = SessionFileStore(session);

// Create our oauth 2 options objects
const oauthOptions = {
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI
};

// Determine how long we want our session to last we know refresh tokens last 2 weeks so we subtract an hour to provide some padding.
const sessionTTL = 60 * 60 * 24 * 7 * 2 - 60 * 60 * 1; // 2 weeks - 1 hours in seconds;

// Create the express app
const app = express();
app.set("etag", false); // disable caching for demo

// Serve files from the static directory
app.use(
  express.static("static", {
    etag: false
  })
);

// Setup the session middleware
app.use(
  session({
    name: sessionCookeieName, // The name of the cookie to store the session id.
    secret: process.env.SESSION_SECRET, // Secret used to sign the session cookie
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionTTL * 1000 // Set the max age on the cookie to match our session duration
    },

    // Store session data in a secure, encrypted file, sessions will be loaded from these files and decrypted at the end of every request the state of `request.session` will be saved back to disk.
    store: new FileStore({
      ttl: sessionTTL, // Session duration
      secret: process.env.ENCRYPTION_KEY, // Secret used to encrypt and decrypt sessions on disk

      // Define how to encode our session to text for storing in the file. We can use the `serialize()` method on the session for this.
      encoder: (sessionObj) => {
        sessionObj.arcgis = sessionObj.arcgis.serialize();
        return JSON.stringify(sessionObj);
      },

      // Define how to turn the text from the session data back into an object. We can use the `ArcGISIdentityManager.deserialize()` method for this.
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

// Send index.html when the user lands on the homepage
app.get("/", (req, res) => {
  res.sendFile(path.resolve("pages/index.html"));
});

// When a user visits the authorization page start the oAuth 2.0 process. The `ArcGISIdentityManager.authorize()` method will redirect the user to the authorization page.
app.get("/authorize", function (request, response) {
  // set a custom state value, this could be used to identify the user who started the request, here we just use a random
  // string but this could be something like a user identifier.
  oauthOptions.state = randomBytes(20).toString("hex");

  console.log("Starting OAuth Request ID:", oauthOptions.state);

  // send the user to the authorization screen
  ArcGISIdentityManager.authorize(oauthOptions, response);
});

// After authorizing the user is redirected to /authenticate and we can finish the Oauth 2.0 process.
app.get("/authenticate", async function (request, response) {
  console.log("Authorization complete for", request.query.state);

  // Exchange the auth code for a an instance of `ArcGISIdentityManager` save that to the session.
  request.session.arcgis =
    await ArcGISIdentityManager.exchangeAuthorizationCode(
      oauthOptions,
      request.query.code
    );

  // Once we have the session set redirect the user to the /app route so they can use the app.
  response.redirect("/app");
});

// The refresh endpoint is used when the client needs to get a new token.
app.get("/refresh", function (request, response) {
  // return an error if we cannot find a session.
  if (!request.session.arcgis) {
    response.json({ error: "unable to refresh" });
    return;
  }

  // Refresh the session by getting a new access token with our refresh token
  request.session.arcgis
    .refreshCredentials()
    .then((newSession) => {
      // save the new session
      request.session.userSession = newSession;

      // Convert the session to an object and remove the refresh token
      const serializedSession = newSession.toJSON();
      delete serializedSession.refreshToken;
      delete serializedSession.refreshTokenExpires;

      // Respond with the new session data
      response.json(serializedSession);
    })
    .catch((error) => {
      response.json({
        error: error.toString()
      });
    });
});

// Sign the user out of our app by destroying the session the cookie and invalidating the session with ArcGIS
app.get("/sign-out", (request, response) => {
  if (!request.session.arcgis) {
    response.redirect("/");
    return;
  }

  request.session.arcgis.signOut().then(() => {
    request.session.destroy(() => {
      response.clearCookie("arcgis-rest-js-advanced-oauth-demo");
      response.redirect("/");
    });
  });
});

// This handles the application route
app.get("/app", (request, response) => {
  // If there is no session available redirect the user back to the home page
  if (!request.session.arcgis) {
    response.redirect("/");
    return;
  }

  // Next exchange the current refresh token for a new refresh token, this extends the session for another 2 weeks
  Promise.all([
    readFile("pages/app.html", { encoding: "utf-8" }),
    request.session.arcgis.exchangeRefreshToken()
  ]).then(([templateContents, session]) => {
    // Update our session object with the new session
    request.session.arcgis = session;

    // Prepare to send the session to the client
    const serializedSession = session.toJSON();
    delete serializedSession.refreshToken;
    delete serializedSession.refreshTokenExpires;

    // Insert the session info into the HTML
    templateContents = templateContents.replace(
      "SESSION_JSON",
      JSON.stringify(serializedSession)
    );

    // Send the HTML
    response.send(templateContents);
  });
});

// Start the server
app.listen(port, function () {
  console.log(`visit http://localhost:${port} to test the application!`);
});
