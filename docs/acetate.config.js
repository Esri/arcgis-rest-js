const _ = require("lodash");
const path = require("path");
const slug = require("slug");
const { prettyifyUrl } = require("acetate/lib/utils.js");
const { inspect } = require("util");
const fs = require("fs");

module.exports = function(acetate) {
  acetate.load("**/*.+(html|md)", {
    metadata: {
      layout: "_layout:main"
    }
  });

  /**
   * Load the typedoc.json file as a page in Acetate. This makes the watcher start looking for changes.
   */
  acetate.load("typedoc.json", {
    metadata: {
      layout: false,
      prettyUrl: false
    }
  });

  /**
   * Use Acetates generate helper to generate a page for each `child` and `package` in the typedoc.json.
   */
  acetate.generate((createPage, callback) => {
    fs.readFile(
      path.join(acetate.root, "src", "typedoc.json"),
      (e, contents) => {
        const typedoc = JSON.parse(contents.toString());

        const childPages = typedoc.children.map(child => {
          return createPage.fromTemplate(
            child.src,
            path.join(acetate.sourceDir, "api", "_child.html"),
            Object.assign({}, child, {
              layout: "api/_layout:content"
            })
          );
        });

        const packagePages = typedoc.packages.map(package => {
          return createPage.fromTemplate(
            package.src,
            path.join(acetate.sourceDir, "api", "_package.html"),
            Object.assign({}, package, {
              layout: "api/_layout:content"
            })
          );
        });

        // once all the pages have been generated provide them to Acetate.
        Promise.all(childPages.concat(packagePages)).then(pages => {
          callback(null, pages);
        });
      }
    );
  });

  /**
   * Also register typedoc.json as a global data object called typedoc.
   */
  acetate.data("typedoc", "typedoc.json");

  /**
   * Register some tools for working with the typedoc output.
   */
  acetate.global("API_TOOLS", {
    findById: function(typedoc, id) {
      return typedoc.index[id];
    },
    findChildById: function(id, children) {
      return children.find(c => c.id === id);
    }
  });

  /**
   * Listen for changes, if we see a change in typedoc.json we know we need to regenerate all the dymanically generated pages so reload everything.
   */
  acetate.on("watcher:change", page => {
    if (page.src === "typedoc.json") {
      acetate.reloadConfig();
    }
  });

  /**
   * Template helper for safely inspecting objects with circular references.
   */
  acetate.filter("inspect", function(obj) {
    return inspect(obj, { depth: 3 });
  });
};
