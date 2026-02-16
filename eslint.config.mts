import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.*"],
  },
  { files: ["**/*.{js,mjs,cjs}"],
  ...js.configs.recommended,
  languageOptions: {
    globals: globals.node, } },
  {
    files: ["**/*.{ts,mts,cts}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: globals.node,
    },},
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "always"],
      "@typescript-eslint/no-explicit-any": "error",
      "eqeqeq": "error",
      "@typescript-eslint/naming-convention": [
  "error",
  { "selector": "variableLike", "format": ["camelCase"] },
  { "selector": "typeLike", "format": ["PascalCase"] }
],    
  }
}
]);
