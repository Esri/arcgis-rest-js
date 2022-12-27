'use strict';

var reporter = require('../../');

module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      '../**/*.spec.js'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['jasmine-diff', 'progress'],

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      reporter
    ],

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
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    jasmineDiffReporter: {
      matchers: {
        toLookTheSameAs: {
          pattern: /Expected ([\S\s]*?) to look the same as ([\S\s]*?)\./,
          reverse: true
        },
        toContain: {
          format: 'primitive',
          pattern: /Expected ([\S\s]*?) to contain ([\S\s]*?)\./,
          reverse: true
        }
      },
      pretty: true,
      multiline: true
    }

  });
};
