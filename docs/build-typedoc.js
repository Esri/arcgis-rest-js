const { spawn } = require("child_process");
const { join, resolve, sep } = require("path");
const { readFile, writeFile } = require("fs");
const _ = require("lodash");
const OUTPUT = join(process.cwd(), "docs", "src", `typedoc.json`);
const { prettyifyUrl } = require("acetate/lib/utils.js");
const slug = require("slug");

(function generateTypeDoc() {
  return new Promise((resolve, reject) => {
    const typedoc = spawn(
      "typedoc",
      [
        "-json",
        OUTPUT,
        "--ignoreCompilerErrors",
        "--exclude",
        '"*.test.ts"',
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
      return json.children.reduce(
        (allChildren, fileChildren) => allChildren.concat(fileChildren),
        []
      );
    })
    .then(children => {
      return children.filter(c => !!c.children);
    })
    .then(children => {
      return children.map(child => {
        child.name = child.name.replace(/\"/g, "") + ".ts";
        return child;
      });
    })
    .then(children => {
      return children.map(child => {
        child.name = _.first(child.name.split(sep));
        child.package = child.name;
        return child;
      });
    })
    .then(children => {
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
      return children.map(child => {
        const src = `api/${child.package}/${child.name}.html`;
        let children;

        if (child.children) {
          children = child.children.map(grandchild => {
            grandchild.icon = `tsd-kind-${slug(
              grandchild.kindString
            ).toLowerCase()} tsd-parent-kind-${slug(
              child.kindString
            ).toLowerCase()}`;

            if (grandchild.signatures) {
              grandchild.signatures = grandchild.signatures.map(sig => {
                sig.icon = grandchild.icon;
                return sig;
              });
            }

            return grandchild;
          });
        }

        return Object.assign(child, {
          src,
          pageUrl: prettyifyUrl(src),
          icon: `tsd-kind-${slug(child.kindString).toLowerCase()}`,
          children
        });
      });
    })
    .then(children => {
      return {
        children,
        packages: _(children)
          .map(c => c.package)
          .uniq()
          .reduce((packages, package) => {
            const src = `api/${package}.html`;

            packages.push({
              package,
              name: package,
              children: children.filter(c => c.package === package),
              icon: "tsd-kind-module",
              src,
              pageUrl: prettyifyUrl(src)
            });
            return packages;
          }, [])
      };
    })
    .then(api => {
      api.index = api.children.reduce((index, child) => {
        index[child.id] = child;
        return index;
      }, {});

      return api;
    })
    .then(api => {
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
