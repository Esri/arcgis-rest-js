const path = require("path");
const fs = require("fs");
const { inspect } = require("util");
const _ = require("lodash");
const slug = require("slug");

module.exports = function(acetate) {
  /**
   * Load all .html and markdown pages in the `src` folder, assigning them a
   * default layout.
   */
  acetate.load("**/*.+(html|md)", {
    metadata: {
      layout: "_layout:main"
    }
  });

  acetate.load("js/index.js", {
    metadata: {
      layout: false,
      prettyUrl: false
    }
  });

  /**
   * Add a different layout for guides. Add an array of `titleSegments` to go
   * inbetween the page title and the "Esri REST JS" title suffix.
   */
  acetate.metadata("guides/**/*", {
    layout: "guides/_layout:content",
    titleSegments: ["Guide"]
  });

  /**
   * Now we need to make a new query called `guides` that will be used to render
   * the guide navigation.
   */
  acetate.query(
    /**
     * results will be accessible as `queries.guides` in templates
     */
    "guides",
    /**
     * start by getting all markdown pages in the `guides` folder
     */
    "guides/**/*.md",
    /**
     * Now map over each page extracting values from it into a new array.
     */
    page => {
      return {
        title: page.navTitle || page.title,
        order: page.order,
        group: page.group,
        url: page.url
      };
    },
    /**
     * Now reduce our array from the previous step sorting the items into sections
     * based on their `group` property.
     */
    (sections, item) => {
      if (!item.group) {
        return sections;
      }

      // does this items `section` already have a `section` in `sections`?
      const idx = _.findIndex(sections, section => section.id === item.group);

      if (idx >= 0) {
        // if it does push this item into it.
        sections[idx].items.push(item);
      } else {
        // if it does not push a new `section` into `sections`.
        sections.push({
          name: _.startCase(item.group.replace(/\d-/, "")),
          id: item.group,
          items: [item]
        });
      }

      /**
       * sort our sections by their `id` (which starts with a number) an sort
       * each sections items by their `order` property
       */
      return _(sections)
        .sortBy("id")
        .map(section => {
          section.items = _.sortBy(section.items, "order");
          return section;
        })
        .value();
    },
    /**
     * The initial value for the above reduce function.
     */
    []
  );

  /**
   * Load the typedoc.json file as a page in Acetate. This makes the watcher
   * start looking for changes and we can listen for the events later.
   */
  acetate.load("typedoc.json", {
    metadata: {
      layout: false,
      prettyUrl: false
    }
  });

  /**
   * Use Acetates generate helper to generate a page for each `declaration`
   * and `package` in the typedoc.json.
   */
  acetate.generate((createPage, callback) => {
    fs.readFile(
      path.join(acetate.root, "src", "typedoc.json"),
      (e, contents) => {
        const typedoc = JSON.parse(contents.toString());

        const declarationPages = typedoc.declarations.map(declaration => {
          return createPage.fromTemplate(
            declaration.src,
            path.join(acetate.sourceDir, "api", "_declaration.html"),
            Object.assign({}, declaration, {
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
        Promise.all(declarationPages.concat(packagePages)).then(pages => {
          callback(null, pages);
        });
      }
    );
  });

  /**
   * Also register typedoc.json as a global data object called `typedoc`.
   */
  acetate.data("typedoc", "typedoc.json");

  /**
   * Register some tools for working with the typedoc output.
   */
  acetate.global("API_TOOLS", {
    findById: function(typedoc, id) {
      return typedoc.index[id];
    },
    findByName: function(typedoc, name) {
      return typedoc.declarations.find(c => c.name === name);
    },
    findChildById: function(id, children) {
      return children.find(c => c.id === id);
    }
  });

  /**
   * Listen for changes, if we see a change in typedoc.json we know we need to
   * regenerate all the dymanically generated pages so reload this config file.
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

  acetate.helper("cdnUrl", function(context, package) {
    return `https://unpkg.com/${package.name}@${package.version}/dist/umd/${package.name.split(
      "/"
    )[1]}.umd.js`;
  });

  acetate.helper("npmInstallCmd", function(context, package) {
    const peers = package.peerDependencies
      ? Object.keys(package.peerDependencies).map(
          pkg => `${pkg}@${package.peerDependencies[pkg]} `
        )
      : [];
    return `npm install ${package.name} ${peers.join(" ")}`;
  });
};
