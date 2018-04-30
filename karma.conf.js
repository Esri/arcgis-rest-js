// Karma configuration
// Generated on Thu Jul 13 2017 11:01:30 GMT-0700 (PDT)
const fs = require("fs");

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ["jasmine", "karma-typescript"],

    // list of files / patterns to load in the browser
    files: ["packages/*/{src,test}/**/*.ts"],

    // list of files to exclude
    exclude: [],

    karmaTypescriptConfig: {
      reports: {
        lcovonly: "coverage",
        html: "coverage",
        text: ""
      },
      compilerOptions: {
        module: "commonjs"
      },
      tsconfig: "./tsconfig.json",
      bundlerOptions: {
        transforms: [require("karma-typescript-es6-transform")()],
        resolve: {
          // karmas resolver cant figure out the symlinked deps from lerna
          // so we need to manually alias each package here.
          alias: fs
            .readdirSync("packages")
            .filter(p => p[0] !== ".")
            .reduce((alias, p) => {
              alias[`@esri/${p}`] = `packages/${p}/src/index.ts`;
              return alias;
            }, {})
        }
      }
    },

    // coveralls uses this one. still need to figure out how to DRY this up.
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      "**/*.ts": ["karma-typescript"] // *.tsx for React Jsx
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ["jasmine-diff", "dots", "karma-typescript", "coverage", "coveralls"],

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
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
  });
};
