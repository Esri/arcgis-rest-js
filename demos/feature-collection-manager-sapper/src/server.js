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

require("dotenv").config();

const FileStore = SessionFileStore(session);
const { PORT, NODE_ENV, ENCRYPTION_KEY, SESSION_SECRET } = process.env;
const dev = NODE_ENV === "development";

express() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    session({
      store: new FileStore({
        secret: ENCRYPTION_KEY,
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
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false
    }),
    sapper.middleware({
      store: request => {
        let userSession;
        if (request.session && request.session.userSession) {
          userSession = request.session.userSession.toJSON();
          delete userSession.refreshToken;
          delete userSession.refreshTokenExpires;
        }
        return new Store({
          session: userSession
        });
      }
    })
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });
