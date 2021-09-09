// /* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "plugin:node/recommended"
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/ban-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/comma-dangle": ["off"],
    "node/no-missing-import": [
      "error",
      {
        allowModules: [],
        resolvePaths: ["/path/to/a/modules/directory"],
        tryExtensions: [".ts", ".js", ".json", ".node"]
      }
    ]
  }
};

// module.exports = {
//   root: true,
//   parser: "@typescript-eslint/parser",
//   parserOptions: {
//     ecmaVersion: 2018,
//     sourceType: "module"
//   },
//   plugins: ["@typescript-eslint", "import"],
//   extends: ["plugin:import/recommended", "plugin:import/typescript"],
//   rules: {
//     "import/extensions": ["error", "ignorePackages"]
//   },
//   settings: {
//     "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
//     "import/parsers": {
//       "@typescript-eslint/parser": [".ts", ".tsx"]
//     },
//     "import/resolver": {
//       typescript: {
//         // alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
//         // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default
//         // use <root>/path/to/folder/tsconfig.json
//         // project: "./"
//         // Multiple tsconfigs (Useful for monorepos)
//         // use a glob pattern
//         // project: "packages/*/tsconfig.json"
//         // use an array
//         // project: [
//         //   "packages/module-a/tsconfig.json",
//         //   "packages/module-b/tsconfig.json"
//         // ],
//         // // use an array of glob patterns
//         // project: ["packages/*/tsconfig.json", "other-packages/*/tsconfig.json"]
//       }
//     }
//   }
// };
