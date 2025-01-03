import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { getUserContent } from "@esri/arcgis-rest-portal";
import { ApiKey } from "./config.js";

const personalApiKey = ApiKeyManager.fromKey({
  key: ApiKey
});

await getUserContent({
  authentication: personalApiKey
}).then((response) => {
  console.log(response);
});

const username = await personalApiKey.getUsername();

console.log({ username });
