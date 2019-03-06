import * as sapper from "../__sapper__/client.js";
import { Store } from "svelte/store.js";
import { UserSession } from "@esri/arcgis-rest-auth";

sapper.start({
  target: document.querySelector("#app"),
  store: data => {
    // `data` is whatever was in the server-side store
    console.log(data);
    return new Store({
      session: data && data.session ? new UserSession(data.session) : null,
      user: data.user,
      org: data.org
    });
  }
});
