import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default [
  { ignores: ["node_modules", ".next", "coverage", "dist", "cypress", "**/*.css", "**/*.md"] },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      import: importPlugin,
      "unused-imports": unusedImports
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "unused-imports/no-unused-imports": "error",
      "import/order": [
        "warn",
        {
          "groups": [["builtin", "external"], ["internal"], ["parent", "sibling", "index"]],
          "alphabetize": { "order": "asc", "caseInsensitive": true },
          "newlines-between": "always"
        }
      ]
    },
    settings: {
      react: { version: "detect" }
    }
  }
];
