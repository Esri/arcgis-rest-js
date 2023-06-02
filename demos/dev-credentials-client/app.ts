import {
  createAPIKey,
  ICreateApiKeyOptions
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

const usrNameElement = document.getElementById("useName") as HTMLInputElement;
const passwordElement = document.getElementById("pw") as HTMLInputElement;
const titleElement = document.getElementById("title") as HTMLInputElement;
const descElement = document.getElementById("desc") as HTMLInputElement;
const buttonElement = document.querySelector("button")!;
const paragraphElement = document.querySelector("p")!;

buttonElement.addEventListener("click", async () => {
  const usrName = usrNameElement.value;
  const pw = passwordElement.value;
  const title = titleElement.value;
  const desc = descElement.value;

  try {
    const manager = await ArcGISIdentityManager.signIn({
      username: usrName,
      password: pw
    });
    const option: ICreateApiKeyOptions = {
      authentication: manager,
      item: { title: title, type: "API Key", description: desc }, // add item info
      params: { f: "json" },
      appType: "apikey",
      redirect_uris: [],
      httpReferrers: [],
      privileges: [
        "premium:user:geocode:temporary",
        "premium:user:networkanalysis:routing",
        "premium:user:networkanalysis:servicearea",
        "portal:apikey:basemaps"
      ]
    };
    // TODO: Do we need to abstract "redirect_uris", "httpReferrers", "appType"... away from user? (only keep auth, title and description as func input).
    const keyInfo = await createAPIKey(option);
    paragraphElement.innerHTML = `<pre><code>${JSON.stringify(
      keyInfo,
      null,
      2
    )}</code></pre>`;
  } catch (e) {
    console.log(e);
    alert("see console output for error");
  }
});
