import "isomorphic-fetch";
import "isomorphic-form-data";
import sirv from "sirv";
import express from "express";
import session from "express-session";
import compression from "compression";
import * as sapper from "../__sapper__/server.js";
import SessionFileStore from "session-file-store";
import { UserSession } from "@esri/arcgis-rest-auth";
import { Store } from "svelte/store.js";
import { userInfoMiddleware } from "./userInfoMiddleware";

// setup file storeage for user sessions
const FileStore = SessionFileStore(session);

// load and setup our config variables from out .env file
require("dotenv").config();
const { PORT, NODE_ENV, ENCRYPTION_KEY, SESSION_SECRET } = process.env;
const dev = NODE_ENV === "development";

// start express
express()
  // configure express middleware
  .use(
    // compress responses
    compression({ threshold: 0 }),

    // serve static assets like images, css ect...
    sirv("static", { dev }),

    // setup sessions, express will set a cookie on the client
    // to keep track of a session id and rehydrate the
    // correstponding session on the server.
    session({
      name: "webmap-checker-session",
      secret: SESSION_SECRET,
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
        ttl: 2592000000 / 1000, // 30 days in seconds
        retries: 1,
        secret: ENCRYPTION_KEY,

        // custom encoding and decoding for sessions means we can
        // initalize a single `UserSession` object for use with rest js
        encoder: sessionObj => {
          sessionObj.userSession = sessionObj.userSession.serialize();
          return JSON.stringify(sessionObj);
        },
        decoder: sessionContents => {
          const sessionObj = JSON.parse(sessionContents);
          sessionObj.userSession = UserSession.deserialize(
            sessionObj.userSession
          );
          return sessionObj;
        }
      })
    }),

    // next check for a session and if we have one fetch additional information
    // the rest api for use in our app.
    userInfoMiddleware,

    // finally we can setup sapper by creating a Store that will syncronize
    // server side data with the client
    sapper.middleware({
      store: request => {
        let userSession;

        // since the store is shared between the client and server
        // we dont want to put refresh tokens in it.
        if (request.session && request.session.userSession) {
          userSession = request.session.userSession.toJSON();
          delete userSession.refreshToken;
          delete userSession.refreshTokenExpires;
        }

        // now we can initalize the store with our session (from the encrypted
        // file) and the org and user info which userInfoMiddleware attached to
        // the request object.
        return new Store({
          session: userSession,
          user: request.session ? request.session.userInfo : undefined,
          org: request.session ? request.session.orgInfo : undefined
        });
      }
    })
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
