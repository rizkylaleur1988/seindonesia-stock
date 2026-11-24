import js from "@eslint/js";
import json from "@eslint/json";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["{src,tests}/**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["{src,tests}/**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { files: ["{src,tests}/**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.node } },
  tseslint.configs.recommended,
  { files: ["{src,tests}/**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  eslintConfigPrettier,
]);
