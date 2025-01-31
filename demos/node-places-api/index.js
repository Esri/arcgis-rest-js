import { ApiKeyManager } from "@esri/arcgis-rest-request";
import { getCategories, IconOptions } from "@esri/arcgis-rest-places";
import * as dotenv from "dotenv";
import fs from "fs";
import find from "unist-util-find";
import { stringify } from "csv-stringify";
import { visit } from "unist-util-visit";

dotenv.config();

// temporarily don't validate the SSL certificate while the service is still in dev
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const authentication = ApiKeyManager.fromKey(process.env.API_KEY);

const { categories } = await getCategories({
  endpoint: "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/categories",
  icon: IconOptions.PNG,
  authentication
});

console.log("Found categories: ", categories.length);

const topLevelCategories = categories.filter((c) => !c.parents?.length);
const childCategories = categories
  .filter((c) => c.parents?.length)
  .sort((a, b) => {
    return (a.fullLabel?.length || 0) - (b.fullLabel?.length || 0);
  });

const tree = {
  type: "root",
  children: topLevelCategories.map((c) => {
    return {
      type: "category",
      id: c.categoryId,
      fullLabel: c.fullLabel || [],
      icon: c.icon,
      children: []
    };
  })
};

childCategories.reduce((tree, child) => {
  child.parents = child.parents || [];
  let currentParentId;
  let parentNode;
  while ((currentParentId = child.parents.shift())) {
    parentNode = find(tree, { id: currentParentId });
  }
  parentNode.children.push({
    type: "category",
    id: child.categoryId,
    fullLabel: child.fullLabel || [],
    icon: child.icon,
    children: []
  });
  return tree;
}, tree);

const labels = [
  ["id", "fullLabel", "depth", "direct children", "all children"]
];

visit(tree, (node) => {
  if (node.type === "category") {
    let childCount = 0;
    visit(node, () => {
      childCount++;
    });
    labels.push([
      node.id,
      node.fullLabel.join(" > "),
      node.fullLabel.length,
      node.children.length,
      childCount
    ]);
  }
});

fs.promises.writeFile("tree.json", JSON.stringify(tree, null, 2));

stringify(labels, function (err, output) {
  fs.promises.writeFile("categoryData.csv", output);
});
