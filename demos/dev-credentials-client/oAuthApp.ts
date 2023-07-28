import {
  createOAuthApp,
  getOAuthApp,
  updateOAuthApp,
  ICreateOAuthAppOption,
  IGetOAuthAppOptions,
  IUpdateOAuthOptions,
  IDeleteOAuthAppOption,
  IDeleteOAuthAppResponse,
  deleteOAuthApp
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

declare let $: any;

let isEdit = false;
let selectedRow: any;

let session: ArcGISIdentityManager;

const clientId = "xwQy4KdPdZw3J6aN";
const host = window.location.origin;
const redirectUri = host + "/oAuthAppManagement.html";

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
    const titleElement = document.getElementById("title") as HTMLInputElement;
    const descElement = document.getElementById("desc") as HTMLInputElement;
    const titleAndDescElement = document.getElementById(
      "titleAndDesc"
    ) as HTMLElement;
    const createAppElement = document.getElementById(
      "submit"
    ) as HTMLButtonElement;
    const deleteButtonElement = document.getElementById(
      "deleteButton"
    ) as HTMLButtonElement;
    const signOutElement = document.getElementById(
      "signOut"
    ) as HTMLButtonElement;
    const selectedAppElement = document.getElementById(
      "selectedApp"
    ) as HTMLElement;
    const paragraphElement = document.querySelector(
      "p"
    ) as HTMLParagraphElement;
    const inputForm = document.getElementById("form") as HTMLFormElement;

    pageTitleElement.innerHTML = `OAuth2.0 App Management (signed in as: ${session.username})`;

    const select2RedirectUri = $("#redirectUri").select2({
      tags: true,
      width: "100%"
    });

    const table = $("#datatable").DataTable({
      columns: [
        { data: "itemId" },
        { data: "client_id" },
        { data: "redirect_uris" },
        { data: "modified" }
      ],
      searching: false
    });

    deleteButtonElement.addEventListener("click", async () => {
      const option: IDeleteOAuthAppOption = {
        authentication: session,
        itemId: table.row(selectedRow).data().itemId
      };
      const deleteResponse: IDeleteOAuthAppResponse = await deleteOAuthApp(
        option
      );
      paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
        deleteResponse,
        null,
        2
      )}</code></pre>`;
      table.row(selectedRow).remove().draw();

      deleteButtonElement.style.display = "none";
      selectedRow = null;
      isEdit = false;
      titleAndDescElement.style.display = "flex";
      selectedAppElement.innerHTML = "Selected: ";
      createAppElement.innerHTML = "Create";
      $("#httpreferrer").val(null).trigger("change");
    });

    inputForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const selectedRedirectUri: string[] = [];
      select2RedirectUri.select2("data").forEach((element: any) => {
        selectedRedirectUri.push(element.id);
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

          const option: ICreateOAuthAppOption = {
            authentication: session,
            title: title,
            snippet: desc,
            redirect_uris: selectedRedirectUri
          };

          const oAuthApp = await createOAuthApp(option);
          paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
            oAuthApp,
            null,
            2
          )}</code></pre>`;
          table.rows
            .add([
              {
                ...oAuthApp,
                modified: oAuthApp.modified.toLocaleString()
              }
            ])
            .draw();
        } else {
          // edit
          const option: IUpdateOAuthOptions = {
            authentication: session,
            itemId: table.row(selectedRow).data().itemId,
            redirect_uris: selectedRedirectUri
          };
          const oAuthApp = await updateOAuthApp(option);
          paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
            oAuthApp,
            null,
            2
          )}</code></pre>`;
          table
            .row(selectedRow)
            .data({
              ...oAuthApp,
              modified: oAuthApp.modified.toLocaleString()
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
        deleteButtonElement.style.display = "none";

        $(this).removeClass("selected");
        selectedRow = null;
        isEdit = false;
        paragraphElement.innerHTML = "";
        titleAndDescElement.style.display = "flex";
        selectedAppElement.innerHTML = "Selected: ";
        createAppElement.innerHTML = "Create";

        $("#redirectUri").val(null).trigger("change");
      } else {
        // select row
        deleteButtonElement.style.display = "initial";
        table.$("tr.selected").removeClass("selected");
        $(this).addClass("selected");
        selectedRow = this;
        isEdit = true;

        const getOAuthAppOptions: IGetOAuthAppOptions = {
          authentication: session,
          itemId: table.row(selectedRow).data().itemId
        };
        const getOAuthAppResponse = await getOAuthApp(getOAuthAppOptions);
        paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
          getOAuthAppResponse,
          null,
          2
        )}</code></pre>`;
        titleAndDescElement.style.display = "none";
        selectedAppElement.innerHTML = `Selected: ${getOAuthAppResponse.itemId}`;
        createAppElement.innerHTML = "Edit";

        $("#redirectUri")
          .val(getOAuthAppResponse.redirect_uris)
          .trigger("change");
      }
    });
    signOutElement.addEventListener("click", clearSession);
  });
}
