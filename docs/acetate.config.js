const _ = require("lodash");
const path = require("path");
const slug = require("slug");
const { prettyifyUrl } = require("acetate/lib/utils.js");
const PACKAGES = ["arcgis-core"];

/**
 * This function formats the exported children of each package so we can easily
 * add then as pages to Acetate later.
 */
function processChildren(children, name) {
  return children.map(child => {
    /**
     * add the following to each API ref page
     * * src - where the virtual "source file" will go in Acetate
     * * pageUrl - precalculate the Acetate page URL, `url` is reserved by Acetate
     * * icon - best guess of how to match icon names to typescript types
     */
    const src = `api/${name}/${child.name}.html`;

    return Object.assign(child, {
      src,
      pageUrl: prettyifyUrl(src),
      icon: `tsd-kind-${slug(child.kindString).toLowerCase()}`
    });
  });
}

/**
 * Transforms the generated JSON from TypeDoc into something we can use later. Looks like:
 */
const APIREF = PACKAGES.map(module => {
  const typedoc = require(`./.typedoc_temp/${module}.json`);
  const src = `api/${typedoc.name}.html`;
  const children = _(typedoc.children)
    .filter(file => file.children)
    .reduce(
      (exported, file, index, files) =>
        exported.concat(processChildren(file.children, typedoc.name)),
      []
    )
    .filter(child => !child.flags || (child.flags && child.flags.isExported));

  return {
    name: typedoc.name,
    pageUrl: prettyifyUrl(src),
    icon: "tsd-kind-module",
    src,
    children
  };
});

module.exports = function(acetate) {
  acetate.load("**/*.+(html|md)", {
    metadata: {
      layout: "_layout:main"
    }
  });

  acetate.filter("json", function(obj) {
    return JSON.stringify(obj, null, 2);
  });

  /**
   * Use Acetates generate helper to generate a page for each `child` exported
   * from in each `package` in our processed `APIREF`,
   */
  acetate.generate((createPage, callback) => {
    const pages = _(APIREF)
      // collect all teh children from all packages
      .reduce((children, package) => {
        return children.concat(package.children);
      }, [])
      // call `createPage` (returns a promise) for each child item.
      .map(child => {
        return createPage.fromTemplate(
          child.src,
          path.join(acetate.sourceDir, "api", "_child.html"),
          Object.assign({}, child, {
            layout: "api/_layout:content"
          })
        );
      });

    // once all the pages have been generated provide them to Acetate.
    Promise.all(pages).then(pages => {
      callback(null, pages);
    });
  });

  /**
   * Use Acetates generate helper to generate to create an index page for each
   * `package` in our `APIREF`.
   */
  acetate.generate((createPage, callback) => {
    // call `createPage` (returns a promise) for each package item.
    const pages = _(APIREF).map(package => {
      return createPage.fromTemplate(
        package.src,
        path.join(acetate.sourceDir, "api", "_package.html"),
        Object.assign({}, package, {
          layout: "api/_layout:content"
        })
      );
    });

    // once all the pages have been generated provide them to Acetate.
    Promise.all(pages).then(pages => {
      callback(null, pages);
    });
  });

  // add the APIREF as a global so we can also generate a nav for it with Acetate.
  acetate.global("api", APIREF);
};
