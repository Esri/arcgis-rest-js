require('ts-node').register({
  "ignore": [/node_modules(?!\/lodash-es)/g],
  "compilerOptions": {
    "listFiles": true,
    "module": "commonjs",
    "allowJs": true
  }
});
