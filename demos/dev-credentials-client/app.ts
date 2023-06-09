import {
  createAPIKey,
  ICreateApiKeyOptions,
  Privileges
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

let session: ArcGISIdentityManager;

const clientId = "xwQy4KdPdZw3J6aN";
const host = window.location.origin;
const redirectUri =
  host + "/demos/dev-credentials-client/apikeyManagement.html";

const serializedSession = localStorage.getItem("__ARCGIS_REST_USER_SESSION__");

const clearSession = () => {
  session.signOut();
  localStorage.removeItem("__ARCGIS_REST_USER_SESSION__");
  location.replace(host + "/demos/dev-credentials-client/index.html");
};

if (serializedSession === null || serializedSession === "undefined") {
  // Empty session (not signed in) needs complete sign in
  ArcGISIdentityManager.completeOAuth2({
    popup: false,
    clientId: clientId,
    redirectUri: redirectUri
  })
    .then((manager) => {
      localStorage.setItem("__ARCGIS_REST_USER_SESSION__", manager.serialize());
      window.location.reload();
    })
    .catch(() => {
      // Failed completeOAuth2 needs re-direct to sign in page
      location.replace(host + "/demos/dev-credentials-client/index.html");
    });
} else {
  session = ArcGISIdentityManager.deserialize(serializedSession);
  const tokenRemainingTime =
    session.tokenExpires.getTime() - new Date().getTime(); // in seconds

  if (tokenRemainingTime <= 0) clearSession();

  setTimeout(clearSession, tokenRemainingTime * 1000);

  // active session (signed in)
  const contentElement = document.getElementById("content")!;
  contentElement.style.display = "block";
  document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.getElementById("title") as HTMLInputElement;
    const descElement = document.getElementById("desc") as HTMLInputElement;
    const createKeyElement = document.getElementById(
      "createKey"
    ) as HTMLButtonElement;
    const signOutElement = document.getElementById(
      "signOut"
    ) as HTMLButtonElement;
    const paragraphElement = document.querySelector("p")!;
    const pageTitleElement = document.getElementById("pageTitle")!;
    const privilegesElement = document.getElementById(
      "privileges"
    ) as HTMLSelectElement;
    pageTitleElement.innerHTML = `APIKey Management (sign in as: ${session.username})`;

    // populate user's privileges into multi-select input
    session.getUser().then((usr) => {
      const privilegesSelectOptions = usr.privileges!;
      privilegesSelectOptions.forEach((val, idx) => {
        privilegesSelectOptions[idx] = `<option value="${val}">${val}</option>`;
      });
      privilegesElement.innerHTML = privilegesSelectOptions.join("");
    });

    createKeyElement.addEventListener("click", async () => {
      const title = titleElement.value;
      const desc = descElement.value;
      const selectedPrivileges: Array<keyof typeof Privileges> = [];

      Object.entries(privilegesElement.selectedOptions).forEach((entry) => {
        const [key, value] = entry;
        selectedPrivileges.push(value.value as keyof typeof Privileges);
      });

      try {
        const option: ICreateApiKeyOptions = {
          authentication: session,
          title: title,
          description: desc,
          httpReferrers: [],
          privileges: selectedPrivileges
        };

        const apiKeyInfo = await createAPIKey(option);
        paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
          apiKeyInfo,
          null,
          2
        )}</code></pre>`;
      } catch (e) {
        console.log(e);
        alert("see console output for error");
      }
    });

    signOutElement.addEventListener("click", clearSession);
  });
}
