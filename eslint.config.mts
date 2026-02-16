import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
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
