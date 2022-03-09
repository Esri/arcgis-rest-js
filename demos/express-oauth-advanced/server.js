import "dotenv/config";
import express from "express";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import session from "express-session";
import SessionFileStore from "session-file-store";
import { readFile } from "fs/promises";

const FileStore = SessionFileStore(session);

const app = express();

const credentials = {
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI
};

app.use(
  session({
    name: "webmap-checker-session",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 2592000000 // 30 days in milliseconds
    },

    // store session data in a secure, encrypted file
    // sessions will be loaded from these files and decrypted
    // at the end of every request the state of `request.session`
    // will be saved back to disk.
    store: new FileStore({
      ttl: 60 * 60 * 24 * 7 * 2, // 2 weeks in seconds
      retries: 1,
      secret: process.env.ENCRYPTION_KEY,

      // custom encoding and decoding for sessions means we can
      // initalize a single `UserSession` object for use with rest js
      encoder: (sessionObj) => {
        sessionObj.arcgis = sessionObj.arcgis.serialize();
        return JSON.stringify(sessionObj);
      },
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

app.get("/", (req, res) => {
  res.send(`<a href="/authorize">Sign in with ArcGIS</a>`);
});

app.get("/authorize", function (req, res) {
  // send the user to the authorization screen
  ArcGISIdentityManager.authorize(credentials, res);
});

app.get("/refresh", function (req, res) {
  if (!req.session.arcgis) {
    response.json({ error: "unable to refresh" });
    return;
  }

  req.session.arcgis
    .refreshSession()
    .then((newSession) => {
      req.session.userSession = newSession;
      const serializedSession = newSession.toJSON();
      delete serializedSession.refreshToken;
      delete serializedSession.refreshTokenExpires;
      res.json(serializedSession);
    })
    .catch((error) => {
      res.json({
        error: error.toString()
      });
    });
});

// the after authorizing the user is redirected to /authenticate
app.get("/authenticate", async function (req, res) {
  req.session.arcgis = await ArcGISIdentityManager.exchangeAuthorizationCode(
    credentials,
    req.query.code
  );

  // once we have the session set redirect the user to the /webmaps
  // route so they can use the app.
  res.redirect("/app");
});

app.get("/app", (req, res) => {
  readFile("app.html", { encoding: "utf-8" }).then((contents) => {
    const serializedSession = req.session.arcgis.toJSON();
    delete serializedSession.refreshToken;
    delete serializedSession.refreshTokenExpires;
    contents = contents.replace(
      "<body>",
      `<body><pre>${JSON.stringify(serializedSession, null, 2)}</pre>`
    );
    contents = contents.replace(
      "SESSION_JSON",
      JSON.stringify(serializedSession)
    );
    res.send(contents);
  });
});

app.listen(3000, function () {
  console.log("visit http://localhost:3000/authorize to test the application!");
});
