import js from "@eslint/js";
import onlyWarn from "eslint-plugin-only-warn";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";
import turboPlugin from "eslint-plugin-turbo";
import prettierRecommended from "eslint-plugin-prettier/recommended";

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    plugins: {
      onlyWarn,
      "turbo": turboPlugin,
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "no-console": "warn",
      "turbo/no-undeclared-env-vars": "warn",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },

    ignores: ["dist/**"],
  },
];
