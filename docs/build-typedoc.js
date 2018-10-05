const spawn = require("cross-spawn");
const { join, resolve } = require("path");
const { readFile, writeFile } = require("fs");
const _ = require("lodash");
const OUTPUT = join(process.cwd(), "docs", "src", `typedoc.json`);
const { prettyifyUrl } = require("acetate/lib/utils.js");
const slug = require("slug");
const minimatch = require("minimatch");
const cheerio = require("cheerio");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

(function generateTypeDoc() {
  return new Promise((resolve, reject) => {
    const typedoc = spawn(
      "typedoc",
      [
        "-json",
        OUTPUT,
        "--ignoreCompilerErrors",
        "--module",
        "common",
        "--tsconfig",
        "./tsconfig.json"
      ],
      {
        stdio: "inherit"
      }
    );

    typedoc.on("close", code => {
      if (code !== 0) {
        reject(code);
        return;
      }

      readFile(OUTPUT, (error, content) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(JSON.parse(content.toString()));
      });
    });
  })
    .then(json => {
      /**
       * `json.children` will be a list of all TypeScript files in our project.
       * We dont care about the files, we just need all their children so we reduce
       * to a single list of everything in the entire project.
       */
      return json.children.reduce(
        (allChildren, fileChildren) => allChildren.concat(fileChildren),
        []
      );
    })
    .then(children => {
      /**
       * We dont want TypeScript files that have been symlinked into `node_modules`
       * folders by Lerna so ignore any child whose source file has `node_modules`
       * in its `fileName`
       */
      return children.filter(
        c => !minimatch(c.sources[0].fileName, "**/node_modules/**")
      );
    })
    .then(children => {
      /**
       * We now only want children that are actual source files, not tests, so
       * filter out all children without `src` in their path.
       */
      return children.filter(c =>
        minimatch(c.sources[0].fileName, "**/src/**/*.ts")
      );
    })
    .then(children => {
      /**
       * Some children might be empty so there is nothing to document in them.
       * For example most `index.ts` files don't have anything besides `import`
       * or `export` so we can safely filter these children out.
       */
      return children.filter(c => !!c.children);
    })
    .then(children => {
      /**
       * The `name` of each child is wrapped in extra quote marks remove these
       * quote marks and add `.ts` back to the end of the `name`,
       */
      return children.map(child => {
        child.name = child.name.replace(/\"/g, "") + ".ts";
        return child;
      });
    })
    .then(children => {
      /**
       * Now determine which `package` each of our children belongs to based on
       * its name.
       */
      return children.map(child => {
        child.name = _.first(child.name.split("/"));
        child.package = child.name;
        return child;
      });
    })
    .then(children => {
      /**
       * `children` is currently a list of all TypeScript source files in
       * `packages`. `children.children` is an array of all declarations in that
       * source file. We need to concat all `children.children` arrays together
       * into a giant array of all declarations in all packages.
       */
      return children.reduce((allChildren, child) => {
        return allChildren.concat(
          child.children.map(c => {
            c.package = child.package;
            return c;
          })
        );
      }, []);
    })
    .then(children => {
      /**
       * Next we remove all children that are not exported out of their files.
       */
      return children.filter(c => c.flags && c.flags.isExported);
    })
    .then(declarations => {
      /**
       * Now that we have a list of all declarations across the entire project
       * we can begin to generate additional information about each declaration.
       * For example we can now determine the `src` of the page that will
       * be generated for this declaration. Each `declaration` will also have
       * `children` which we can generate and define an `icon` property for. These
       * additional properties, `src`, `pageUrl`, `icon` and `children` are then
       * merged into the `declaration`. This also adds a `title`, `description`
       * and `titleSegments` to each page which are used in the template for SEO.
       */
      return declarations.map(declaration => {
        const abbreviatedPackageName = declaration.package.replace("arcgis-rest-", "")
        const src = `arcgis-rest-js/api/${abbreviatedPackageName}/${declaration.name}.html`;
        let children;

        if (declaration.children) {
          children = declaration.children.map(child => {
            child.icon = `tsd-kind-${slug(
              child.kindString
            ).toLowerCase()} tsd-parent-kind-${slug(
              declaration.kindString
            ).toLowerCase()}`;

            if (child.flags.isPrivate) {
              child.icon += ` tsd-is-private`;
            }

            if (child.flags.isProtected) {
              child.icon += ` tsd-is-protected`;
            }

            if (child.flags.isStatic) {
              child.icon += ` tsd-is-static`;
            }

            if (child.signatures) {
              child.signatures = child.signatures.map(sig => {
                sig.icon = child.icon;
                return sig;
              });
            }

            return child;
          });
        }

        declaration.title = declaration.name;
        declaration.titleSegments = ["API Reference"];
        declaration.description =
          declaration.comment && declaration.comment.shortText
            ? cheerio
                .load(md.render(declaration.comment.shortText))
                .text()
                .replace("\n", "")
            : "API Reference documentation for ${child.name}, part of ${declaration.package}.";

        return Object.assign(declaration, {
          src,
          pageUrl: prettyifyUrl(src),
          icon: `tsd-kind-${slug(declaration.kindString).toLowerCase()}`,
          children
        });
      });
    })
    .then(declarations => {
      /**
       * We now have a list of `declarations` that will be used to generate the
       * individual API reference pages, but we still need to generate a landing
       * page for each `package`. Return a new object with our `declarations` and
       * a new property `packages` which is an array of every `package` with a
       * page `src`, a `pageUrl`, an `icon` and a list of `declarations`. This
       * also adds a `title`, `description` and `titleSegments` to each page
       * which are used in the template for SEO.
       */
      return {
        declarations,
        packages: _(declarations)
          .map(d => d.package)
          .uniq()
          .reduce((packages, package) => {
            const abbreviatedPackageName = package.replace("arcgis-rest-", "")
            const src = `arcgis-rest-js/api/${abbreviatedPackageName}.html`;
            const pkg = require(`${process.cwd()}/packages/${package}/package.json`);

            packages.push({
              package,
              pkg,
              title: package,
              description: pkg.description,
              titleSegments: ["API Reference"],
              name: package,
              declarations: declarations.filter(d => d.package === package),
              icon: "tsd-kind-module",
              src,
              pageUrl: prettyifyUrl(src)
            });
            return packages;
          }, [])
      };
    })
    .then(api => {
      /**
       * Since we generated the TypeDoc for the entire project at once each
       * `declaration` has a unique numerical `id` property. We occasionally
       * need to lookup a declaration by its `id` so we can prebuild an index of
       * them here.
       */
      api.index = api.declarations.reduce((index, declaration) => {
        index[declaration.id] = declaration;
        return index;
      }, {});

      return api;
    })
    .then(api => {
      /**
       * In order to power the API reference quick search we can build an array
       * of all declarations and child items
       */
      api.quickSearchIndex = api.declarations.reduce(
        (quickSearchIndex, declaration) => {
          if (declaration.children) {
            quickSearchIndex = quickSearchIndex.concat(
              declaration.children.map(child => {
                return {
                  title: `${declaration.name}.${child.name}`,
                  url: `${declaration.pageUrl}#${child.name}`,
                  icon: child.icon
                };
              })
            );
          }

          return quickSearchIndex.concat([
            {
              title: declaration.name,
              url: declaration.pageUrl,
              icon: declaration.icon
            }
          ]);
        },
        []
      );

      return api;
    })
    .then(api => {
      /**
       * Our final object looks like this:
       *
       * {
       *   packages: [Array of packages.],
       *   declarations: [Array of each exported declaration accross all source files.]
       *   index: { Object mapping each declaration.id as a key with the declaration as its value}
       * }
       *
       * We now export this to the Acetate source directory.
       */
      return new Promise((resolve, reject) => {
        writeFile(OUTPUT, JSON.stringify(api, null, 2), e => {
          if (e) {
            reject(e);
            return;
          }

          resolve(api);
        });
      });
    })
    .catch(e => {
      console.error(e);
    });
})();
