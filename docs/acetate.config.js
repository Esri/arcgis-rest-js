const _ = require("lodash");
const path = require("path");
const slug = require("slug");
const { prettyifyUrl } = require("acetate/lib/utils.js");
const PACKAGES = ["arcgis-core"];
const { inspect } = require("util");

/**
 * This function formats the exported children of each package so we can easily
 * add then as pages to Acetate later.
 */
function processChildren(children, package) {
  return children.map(child => {
    /**
     * add the following to each API ref page
     * * src - where the virtual "source file" will go in Acetate
     * * pageUrl - precalculate the Acetate page URL, `url` is reserved by Acetate
     * * icon - best guess of how to match icon names to typescript types
     */
    const src = `api/${package.name}/${child.name}.html`;

    return Object.assign(child, {
      src,
      pageUrl: prettyifyUrl(src),
      icon: `tsd-kind-${slug(child.kindString).toLowerCase()}`,
      package: package.name
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
        exported.concat(processChildren(file.children, typedoc)),
      []
    );

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

  acetate.filter("inspect", function(obj) {
    return inspect(obj, { depth: 3 });
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
      .filter(child => !child.flags || (child.flags && child.flags.isExported))
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

  const API_ID_INDEX = _.keyBy(
    _.reduce(
      APIREF,
      (children, package) => {
        return children.concat(package.children);
      },
      []
    ),
    c => c.id
  );

  const API_NAME_INDEX = _.keyBy(
    _.reduce(
      APIREF,
      (children, package) => {
        return children.concat(package.children);
      },
      []
    ),
    c => c.name
  );
  acetate.global("API_ID_INDEX", API_ID_INDEX);
  acetate.global("API_NAME_INDEX", API_NAME_INDEX);
  acetate.global("API_TOOLS", {
    findById: function(id) {
      return API_ID_INDEX[id + ""];
    },
    findByName: function(name) {
      return API_NAME_INDEX[_.trim(name)];
    },
    findChildById: function(id, children) {
      return children.find(c => c.id === id);
    }
  });

  acetate.helper("iconClasses", function(ctx, child) {
    const parentClass = ctx.page.kindString
      ? `tsd-parent-kind-${slug(ctx.page.kindString).toLowerCase()}`
      : "";

    if (!child) {
      return parentClass;
    }

    const childClass = `tsd-kind-${slug(child.kindString).toLowerCase()}`;

    return [parentClass, childClass].join(" ");
  });
};
