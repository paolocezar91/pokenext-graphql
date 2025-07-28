import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

const config = defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { 
    files: ["**/*.js"],
    languageOptions: { 
      sourceType: "commonjs",
      globals: globals.node // Include Node.js globals
    }, 
    
  },
]);

export default config;