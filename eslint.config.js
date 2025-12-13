// 🌷 Lovely Boutique - ESLint Configuration
// -----------------------------------------
// Clean, modern, and performance-friendly ESLint setup for React + Vite

import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: [
      "dist/",
      "build/",
      "node_modules/",
      ".vite/",
      "coverage/",
      "*.config.js",
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      prettier,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      /* ✨ Code Quality */
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          semi: true,
          printWidth: 100,
          trailingComma: "es5",
        },
      ],

      /* 💅 React Best Practices */
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", // Vite handles this automatically
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      "react/no-unescaped-entities": "off",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],

      /* ⚡ Hooks Rules */
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* ♿ Accessibility */
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/no-autofocus": "off",
    },
  },
];
