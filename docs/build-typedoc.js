const { spawn } = require("child_process");
const { join, resolve, sep } = require("path");
const { readFile, writeFile } = require("fs");
const _ = require("lodash");
const OUTPUT = join(process.cwd(), "docs", "src", `typedoc.json`);
const { prettyifyUrl } = require("acetate/lib/utils.js");
const slug = require("slug");
const minimatch = require("minimatch");

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
       * We dont care about the files we need need all their children so reduce
       * this to just a general list of everything in the entire project.
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
        child.name = _.first(child.name.split(sep));
        child.package = child.name;
        return child;
      });
    })
    .then(children => {
      /**
       * `children` is currently a list of all TypeScript soruce files in
       * `packages`. `children.children` is an array of all declarations in that
       * source file. We need to concat all `children.children` arrays togather
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
       * Now that we have a list of all declarations accross the entire project
       * we can begin to generate additonal information about each declaration.
       * For example we can now determine the `src` of the page page that will
       * be generated for this declaration. Each `declaration` will also have
       * `children` which we can generate and `icon` property for. These
       * additonal properties, `src`, `pageUrl`, `icon` and `children` are then
       * merged into the `declaration`.
       */
      return declarations.map(declaration => {
        const src = `api/${declaration.package}/${declaration.name}.html`;
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
       * page `src`, a `pageUrl`, an `icon` and a list of `declarations`.
       */
      return {
        declarations,
        packages: _(declarations)
          .map(d => d.package)
          .uniq()
          .reduce((packages, package) => {
            const src = `api/${package}.html`;
            const pkg = require(`${process.cwd()}/packages/${package}/package.json`);

            packages.push({
              package,
              pkg,
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
       * `declaration` has a unique numerical `id` property. We occassionally
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
