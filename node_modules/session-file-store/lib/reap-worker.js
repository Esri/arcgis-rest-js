#!/usr/bin/env node

var helpers = require('./session-file-helpers');

var options = helpers.defaults({
  path: process.argv[2],
  ttl: process.argv[3]
});

if (options.path) {
  options.logFn('[session-file-store:worker] Deleting expired sessions');
  helpers.reap(options);
} else {
  options.logFn('[session-file-store:worker] Reap worker started with invalid path');
  process.exit(1);
}
