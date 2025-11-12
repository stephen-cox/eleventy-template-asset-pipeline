import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
      }
    },
    rules: {
      "indent": ["error", 2, { SwitchCase: 1 }],
      "quotes": ["error", "double", { avoidEscape: true }],
      "semi": ["error", "always"],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
    }
  },
  {
    files: ["**/*.cjs", "test/**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: "readonly",
        require: "readonly",
        exports: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        console: "readonly",
        process: "readonly",
      }
    }
  }
];
