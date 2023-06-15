import {
  Privileges,
  createApiKey,
  updateApiKey
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

(async function run() {
  const authentication = await ArcGISIdentityManager.signIn({
    username: "patrickarlt.prod.022",
    password: "devaccount1"
  });

  const apiKeyObject = await createApiKey({
    title: "foo",
    description: "foo",
    tags: [],

    authentication,

    httpReferrers: ["https://foo.com"],
    privileges: [Privileges["portal:apikey:basemaps"]]
  });

  console.log("one:", apiKeyObject.httpReferrers);

  const updatedApiKey = await updateApiKey({
    ...apiKeyObject,
    httpReferrers: [...apiKeyObject.httpReferrers, "https://esri.com"],
    authentication
  });

  console.log("two:", updatedApiKey.httpReferrers);

  const paramsUndefined = await updateApiKey({
    itemId: apiKeyObject.itemId,
    authentication
  });

  console.log("three", paramsUndefined.httpReferrers);

  const paramsEmpty = await updateApiKey({
    itemId: apiKeyObject.itemId,
    privileges: [],
    httpReferrers: [],
    authentication
  });

  console.log("four", paramsEmpty.httpReferrers);
})();
