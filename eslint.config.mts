import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  {
    rules: {
      //"@typescript-eslint/no-unused-vars": "error",
      //"arrow-body-style": ["error", "always"],
      //"capitalized-comments": ["warn", "always"],
      //"@typescript-eslint/no-explicit-any": "error",
      //"@typescript-eslint/no-unsafe-assignment": "error",
      //"@typescript-eslint/no-implicit-any": "error"
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/eqeqeq": [
        "error", 
      {
        "selector": "variable",
        "format": ["camelCase"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      }
    ]
  }
}
]);
