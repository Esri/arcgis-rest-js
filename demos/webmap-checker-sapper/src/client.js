import * as sapper from "../__sapper__/client.js";
import { Store } from "svelte/store.js";
import { UserSession } from "@esri/arcgis-rest-auth";

// sapper will have already rendered the HTML page in a specific state
// based on the Store we defined in server.js but we need to rehydrate that
// state on the client and start sapper.
sapper.start({
  target: document.querySelector("#app"),
  store: data => {
    // `data` is whatever was in the Store on the server side.
    // if we have a session we can create a new UserSession that we can
    // use with ArcGIS REST JS on the client.
    return new Store({
      session: data && data.session ? new UserSession(data.session) : null,
      user: data.user,
      org: data.org
    });
  }
});
