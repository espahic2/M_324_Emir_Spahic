import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.mocha
      } 
    }
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "eqeqeq": "error",
      "no-console": "warn"
    }
  }
];