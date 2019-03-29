import { UserSession } from "@esri/arcgis-rest-auth";
import { loadModules } from "esri-loader";

export function retryWithNewSession(error, fetch) {
  if (error.name === "ArcGISAuthError") {
    return fetch("/auth/exchange-token")
      .then(exchangeTokenResponse => {
        return exchangeTokenResponse.json();
      })
      .then(sessionInfo => {
        console.log(sessionInfo);
        const newSession = new UserSession(session);

        // if we are in a browser (client side) we are working with an instance
        // of `UserSession` otherwise (server side) we are working with a JSON
        // representation of a session.
        if (process.browser) {
          this.store.set({ session: newSession });

          // if we are in a browser we should also update IdentityManager
          loadModules(["esri/identity/IdentityManager"]).then(([esriId]) => {
            esriId.registerToken(session.toCredential());
          });
        } else {
          this.store.set({ session: sessionInfo });
        }

        return error.retry(newSession, 1);
      });
  }

  throw error;
}
