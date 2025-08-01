// Karma configuration
// Generated on Thu Jul 13 2017 11:01:30 GMT-0700 (PDT)
const fs = require("fs");

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript"],

    // list of files / patterns to load in the browser
    files: [
      "packages/arcgis-rest-demographics/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-developer-credentials/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-elevation/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-feature-service/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-geocoding/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-places/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-portal/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-request/{src,test}/**/!(*.test.live).ts",
      "packages/arcgis-rest-routing/{src,test}/**/!(*.test.live).ts",
      "scripts/test-helpers.ts"
    ],

    // list of files to exclude
    exclude: [
      "packages/*/{src,test}/**/*.test.live.ts",
      "packages/*/dist/**/*"
    ],

    karmaTypescriptConfig: {
      coverageOptions: {
        instrumentation: true,
        threshold: {
          global: {
            statements: 100,
            branches: 100,
            functions: 100,
            lines: 100
          }
        }
      },
      reports: {
        json: {
          directory: "coverage",
          filename: "coverage.json"
        },
        html: "coverage",
        cobertura: "coverage/cobertura.xml"
      },
      compilerOptions: {
        module: "commonjs"
      },
      tsconfig: "./tsconfig.json",
      bundlerOptions: {
        transforms: [
          require("karma-typescript-es6-transform")({
            presets: [
              [
                "env",
                {
                  targets: {
                    browsers: ["last 2 Chrome versions"]
                  }
                }
              ]
            ]
          })
        ],
        resolve: {
          // karmas resolver cant figure out the symlinked deps from lerna
          // so we need to manually alias each package here.
          alias: fs
            .readdirSync("packages")
            .filter((p) => p[0] !== ".")
            .reduce(
              (alias, p) => {
                if (
                  p !== "arcgis-rest-fetch" &&
                  p !== "arcgis-rest-form-data"
                ) {
                  alias[`@esri/${p}`] = `packages/${p}/src/index.ts`;
                }
                return alias;
              },
              {
                "@types/terraformer__arcgis": `packages/arcgis-rest-geocoding/node_modules/@terraformer/arcgis/dist/t-arcgis.esm.js`,
                "@esri/arcgis-rest-fetch": `packages/arcgis-rest-fetch/browser-ponyfill.js`,
                "@esri/arcgis-rest-form-data": `packages/arcgis-rest-form-data/browser-ponyfill.js`
              }
            )
        }
      }
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.ts": ["karma-typescript"] // *.tsx for React Jsx
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["jasmine-diff", "dots", "karma-typescript"],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'Chrome',
      // 'ChromeCanary',
      // 'Firefox',
      // 'Safari',
      // 'IE'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"]
      },
      ChromeDebugging: {
        base: "Chrome",
        flags: ["--remote-debugging-port=9333"]
      }
    }
  });
};
