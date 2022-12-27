module.exports = exports = function(jasmine, env, print) {
  jasmine.loadConfigFile(env.configPath || process.env.JASMINE_CONFIG_PATH);
  if (env.stopOnFailure !== undefined) {
    jasmine.stopSpecOnExpectationFailure(env.stopOnFailure);
  }
  if (env.failFast !== undefined) {
    jasmine.stopOnSpecFailure(env.failFast);
  }
  if (env.seed !== undefined) {
    jasmine.seed(env.seed);
  }
  if (env.random !== undefined) {
    jasmine.randomizeTests(env.random);
  }
  if (env.helpers !== undefined && env.helpers.length) {
    jasmine.addHelperFiles(env.helpers);
  }
  if (env.requires !== undefined && env.requires.length) {
    jasmine.addRequires(env.requires);
  }
  if (env.reporter !== undefined) {
    try {
      var Report = require(env.reporter);
      var reporter = new Report();
      jasmine.clearReporters();
      jasmine.addReporter(reporter);
    } catch(e) {
      print('failed to register reporter "' + env.reporter + '"');
      print(e.message);
      print(e.stack);
    }
  }
  jasmine.showColors(env.color);
};