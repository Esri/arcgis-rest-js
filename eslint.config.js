// @ts-check
import eslint from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettierConfig from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "url";

const gitignorePath = fileURLToPath(new URL(".gitignore", import.meta.url));

export default defineConfig(
  globalIgnores(["**/openapi-types.ts"]),
  includeIgnoreFile(gitignorePath, "Imported .gitignore patterns"),
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      prettierConfig
    ],
    ignores: ["openapi-types.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowInterfaces: "with-single-extends", allowObjectTypes: "always" }
      ],
      "import/extensions": ["error", "ignorePackages"],
      "prefer-spread": "off",

      // remove import/no-unresolved once https://github.com/import-js/eslint-plugin-import/issues/2111 is resolved
      "import/no-unresolved": "off"
    }
  }
);
