import {
  createApiKey,
  updateApiKey
} from "@esri/arcgis-rest-developer-credentials";
import { ArcGISIdentityManager } from "@esri/arcgis-rest-request";

const authentication = await ArcGISIdentityManager.signIn({
  username: "patrickarlt.devext.247",
  password: "patrickarlt.devext.2471a",
  portal: "https://devext.arcgis.com/sharing/rest"
});

const response = await createApiKey({
  authentication,
  title: "xyz_title",
  description: "xyz_desc",
  tags: ["xyz_tag1", "xyz_tag2"],
  privileges: ["premium:user:geocode:temporary"],
  generateToken1: true,
  apiToken1ExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
});

console.log(response);

const updated = await updateApiKey({
  authentication,
  itemId: response.item.id,
  httpReferrers: ["https://example.com"],
  generateToken2: true,
  apiToken2ExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) // 30 days
});

console.log(updated);
