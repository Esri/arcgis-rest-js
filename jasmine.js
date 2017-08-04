require("ts-node").register({
  compilerOptions: {
    listFiles: true,
    module: "commonjs",
    allowJs: true
  }
});

var Jasmine = require("jasmine");
var jasmine = new Jasmine();

jasmine.loadConfig({
  spec_dir: "packages",
  spec_files: ["support/**/*.d.ts", "**/*.test.ts"],
  stopSpecOnExpectationFailure: false,
  random: false
});

jasmine.execute();
