const _ = require("lodash");
const path = require("path");
const { prettyifyUrl } = require("acetate/lib/utils.js");
var slug = require("slug");

function processChildren(children, name) {
  return children.map(child => {
    // console.log("\n", child, "\n");
    /**
     * add the following to each API ref page
     * * src - where the virtual "source file" should go
     * * id - unique id for this module that we can link to it
     */
    child.src = `api/${name}/${child.name}.html`;
    child.id = `${name}/${child.name}`;
    child.pageUrl = prettyifyUrl(child.src);
    child.icon = `tsd-kind-${slug(child.kindString).toLowerCase()}`;
    return child;
  });
}

const api = ["arcgis-core"].map(module => {
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
    id: typedoc.name,
    pageUrl: prettyifyUrl(src),
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

  acetate.filter("slugify", function(str) {
    return slug(str);
  });

  // generate a page for each item exported from typedoc
  acetate.generate((createPage, callback) => {
    const pages = _(api)
      .reduce((children, package) => {
        return children.concat(package.children);
      }, [])
      .map(child => {
        return createPage.fromTemplate(
          child.src,
          path.join(acetate.sourceDir, "api", "_child.html"),
          Object.assign({}, child, {
            layout: "api/_layout:content"
          })
        );
      });

    Promise.all(pages).then(pages => {
      callback(null, pages);
    });
  });

  // generate an index page for each module
  acetate.generate((createPage, callback) => {
    const pages = _(api).map(package => {
      return createPage.fromTemplate(
        package.src,
        path.join(acetate.sourceDir, "api", "_package.html"),
        Object.assign({}, package, {
          layout: "api/_layout:content"
        })
      );
    });

    Promise.all(pages).then(pages => {
      callback(null, pages);
    });
  });

  acetate.global("api", api);
};
