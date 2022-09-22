/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
// Karma configuration
// Generated on Thu Jul 13 2017 11:01:30 GMT-0700 (PDT)
const fs = require("fs");
require('dotenv').config();

module.exports = function(config) {
  config.set({
    // this allows debugging
    browserNoActivityTimeout: 12000000,
    browserDisconnectTimeout: 120000,
    pingTimeout: 1200000,

    
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript"],

    // list of files / patterns to load in the browser
    files: [
      "packages/*/{src,harness}/**/*.ts",
      { pattern: 'e2e/test-images/*.jpg', watched: false, included: false, served: true, nocache: false }
    ],

    // list of files to exclude
    exclude: ["packages/*/{src,test}/**/*.d.ts"],

    karmaTypescriptConfig: {
      coverageOptions: {
        // Exclude all files - we don't want code coverage on e2e type tests
        // also critical so that we can debug in the code
        exclude: [
          /\.ts$/i,
          /fixture*/,
          /expected*/
        ],
        threshold: {
          global: {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0,
            excludes: [
              'packages/*/examples/**/*.ts',
              'packages/*/test/**/*.ts',
              'packages/*/harness/**/*.ts',
            ]
          }
        }
      },
      reports: {
        "json": {
          "directory": "coverage",
          "filename": "coverage.json"
        },
        "html": "coverage"
      },
      compilerOptions: {
        module: "commonjs",
        importHelpers: true
      },
      tsconfig: "./tsconfig.json",
      bundlerOptions: {
        // validateSyntax: false,
        transforms: [
          require("karma-typescript-es6-transform")(
            {
                presets: [
                    ["@babel/preset-env", {
                        targets: {
                            chrome: "94"
                        }
                    }]
                ]
            }
          )
        ],
        exclude: ["@esri/arcgis-rest-types"],
        resolve: {
          // karmas resolver cant figure out the symlinked deps from lerna
          // so we need to manually alias each package here.
          alias: fs
            .readdirSync("packages")
            .filter(p => p[0] !== ".")
            .reduce((alias, p) => {
              alias[`@esri/templates-${p}`] = `packages/${p}/src/index.ts`;
              return alias;
            }, {})
        }
      }
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "packages/*/src/**/*.ts": ["karma-typescript"],
      "packages/*/harness/**/*.ts": ["karma-typescript"],
      "packages/*/harness/**/helpers/config.ts": ["karma-typescript", "env"]
    },

    // Expose this as `window.__env__.QACREDS_PSW
    // Used in config files in e2e folders
    envPreprocessor: [
      "QACREDS_PSW",
      "DEVCREDS_PSW",
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    // reporters: ["spec", "karma-typescript", "coverage"],
    reporters: ["dots",  "karma-typescript"],
    coverageReporter: {
      // specify a common output directory
      dir: 'coverage',
      reporters: [
        { type: 'lcov', subdir: 'lcov' }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome',
      'Edge',
      'Firefox'
    ],
    plugins: [
      require('karma-env-preprocessor'),
      require('@chiragrupani/karma-chromium-edge-launcher'),
      require('karma-chrome-launcher'),
      require('karma-coverage'), 
      require('karma-firefox-launcher'),
      require('karma-jasmine'),
      require('karma-jasmine-diff-reporter'),
      require('karma-safari-launcher'),
      require('karma-spec-reporter'),
      require('karma-typescript'),
      require('karma-typescript-es6-transform')
      
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browsers should be started simultaneously
    concurrency: Infinity,
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      },
      ChromeDevTools: {
        base: 'Chrome',
        flags: ['--auto-open-devtools-for-tabs']
      }
    },
  });
};
