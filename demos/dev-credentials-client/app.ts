import {
  Privileges,
  ICreateApiKeyOptions,
  createApiKey,
  updateApiKey,
  IUpdateApiKeyOptions,
  getApiKey,
  IGetApiKeyOptions
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

declare let $: any;

let isEdit = false;
let selectedRow: any;

let session: ArcGISIdentityManager;

const clientId = "xwQy4KdPdZw3J6aN";
const host = window.location.origin;
const redirectUri = host + "/apikeyManagement.html";

const serializedSession = localStorage.getItem("__ARCGIS_REST_USER_SESSION__");

const clearSession = () => {
  session.signOut();
  localStorage.removeItem("__ARCGIS_REST_USER_SESSION__");
  location.replace(host + "/index.html");
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
      location.replace(host + "/index.html");
    });
} else {
  session = ArcGISIdentityManager.deserialize(serializedSession);
  const tokenRemainingTime =
    session.tokenExpires.getTime() - new Date().getTime(); // in seconds

  if (tokenRemainingTime <= 0) {
    clearSession();
  }

  setTimeout(clearSession, tokenRemainingTime * 1000);

  // active session (signed in)
  console.log(session.token);
  const contentElement = document.getElementById("content") as HTMLElement;
  contentElement.style.display = "block";
  document.addEventListener("DOMContentLoaded", () => {
    const pageTitleElement = document.getElementById(
      "pageTitle"
    ) as HTMLElement;
    const privilegesElement = document.getElementById(
      "privileges"
    ) as HTMLSelectElement;
    const titleElement = document.getElementById("title") as HTMLInputElement;
    const descElement = document.getElementById("desc") as HTMLInputElement;
    const titleAndDescElement = document.getElementById(
      "titleAndDesc"
    ) as HTMLElement;
    const createKeyElement = document.getElementById(
      "createKey"
    ) as HTMLButtonElement;
    const signOutElement = document.getElementById(
      "signOut"
    ) as HTMLButtonElement;
    const selectedKeyElement = document.getElementById(
      "selectedKey"
    ) as HTMLElement;
    const paragraphElement = document.querySelector(
      "p"
    ) as HTMLParagraphElement;
    const inputForm = document.getElementById("form") as HTMLFormElement;

    pageTitleElement.innerHTML = `APIKey Management (sign in as: ${session.username})`;

    // populate user's privileges into multi-select input
    const privilegesSelectOptions: string[] = Object.keys(Privileges);
    privilegesSelectOptions.forEach((val, idx) => {
      privilegesSelectOptions[idx] = `<option value="${val}">${val}</option>`;
    });
    privilegesElement.innerHTML = privilegesSelectOptions.join("");

    const select2Referrer = $("#httpreferrer").select2({
      tags: true,
      width: "100%"
    });
    const select2Privilege = $("#privileges").select2({ width: "100%" });

    const table = $("#datatable").DataTable({
      columns: [
        { data: "itemId" },
        { data: "apiKey" },
        { data: "privileges" },
        { data: "httpReferrers" },
        { data: "modified" }
      ],
      searching: false
    });

    inputForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const selectedPrivileges: Array<keyof typeof Privileges> = [];
      select2Privilege.select2("data").forEach((element: any) => {
        selectedPrivileges.push(element.id as keyof typeof Privileges);
      });

      const selectedReferrers: string[] = [];
      select2Referrer.select2("data").forEach((element: any) => {
        selectedReferrers.push(element.id);
      });

      // create/edit button click
      try {
        if (!isEdit) {
          // create
          if (!titleElement.checkValidity()) {
            titleElement.classList.add("is-invalid");
            return false;
          }
          titleElement.classList.remove("is-invalid");

          const title = titleElement.value;
          const desc = descElement.value;

          const option: ICreateApiKeyOptions = {
            authentication: session,
            title: title,
            description: desc,
            httpReferrers: selectedReferrers,
            privileges: selectedPrivileges
          };
          const apiKeyInfo = await createApiKey(option);
          paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
            apiKeyInfo,
            null,
            2
          )}</code></pre>`;
          table.rows
            .add([
              {
                ...apiKeyInfo,
                modified: apiKeyInfo.modified.toLocaleString()
              }
            ])
            .draw();
        } else {
          // edit
          const option: IUpdateApiKeyOptions = {
            authentication: session,
            itemId: table.row(selectedRow).data().itemId,
            httpReferrers: selectedReferrers,
            privileges: selectedPrivileges
          };
          const apiKeyInfo = await updateApiKey(option);
          paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
            apiKeyInfo,
            null,
            2
          )}</code></pre>`;
          table
            .row(selectedRow)
            .data({
              ...apiKeyInfo,
              modified: apiKeyInfo.modified.toLocaleString()
            })
            .draw();
        }
      } catch (e) {
        console.log(e);
        alert("see console output for error");
      }
    });

    // select/de-select table row
    $("#datatable tbody").on("click", "tr", async function () {
      if ($(this).hasClass("selected")) {
        // de-select a row
        $(this).removeClass("selected");
        selectedRow = null;
        isEdit = false;
        paragraphElement.innerHTML = "";
        titleAndDescElement.style.display = "flex";
        selectedKeyElement.innerHTML = "Selected: ";
        createKeyElement.innerHTML = "Create";

        $("#httpreferrer").val(null).trigger("change");
        $("#privileges").val(null).trigger("change");
      } else {
        // select row
        table.$("tr.selected").removeClass("selected");
        $(this).addClass("selected");
        selectedRow = this;
        isEdit = true;

        const getApiKeyOptions: IGetApiKeyOptions = {
          authentication: session,
          itemId: table.row(selectedRow).data().itemId
        };
        const getApiKeyResponse = await getApiKey(getApiKeyOptions);
        paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
          getApiKeyResponse,
          null,
          2
        )}</code></pre>`;
        titleAndDescElement.style.display = "none";
        selectedKeyElement.innerHTML = `Selected: ${getApiKeyResponse.itemId}`;
        createKeyElement.innerHTML = "Edit";

        $("#httpreferrer")
          .val(getApiKeyResponse.httpReferrers)
          .trigger("change");
        $("#privileges").val(getApiKeyResponse.privileges).trigger("change");
      }
    });
    signOutElement.addEventListener("click", clearSession);
  });
}
