import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import reactDom from "eslint-plugin-react-dom";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactX from "eslint-plugin-react-x";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig([
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
  },

  // ====================
  // Ignore
  // ====================
  globalIgnores(["**/dist/**", "**/build/**", "**/coverage/**", "**/.vite/**"]),

  // ====================
  // App (React + TS)
  // ====================
  {
    files: ["src/**/*.{ts,tsx}"],

    extends: [
      js.configs.recommended,

      // TypeScript
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,

      // React
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      reactX.configs["recommended-typescript"],
      reactDom.configs.recommended,

      // Prettier
      prettier,
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.es2024,
      },

      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      // ====================
      // React
      // ====================
      // react-hooks로 대체
      "react-x/error-boundaries": "off",
      "react-x/exhaustive-deps": "off",
      "react-x/purity": "off",
      "react-x/rules-of-hooks": "off",
      "react-x/set-state-in-effect": "off",
      "react-x/set-state-in-render": "off",
      "react-x/static-components": "off",
      "react-x/unsupported-syntax": "off",
      "react-x/use-memo": "off",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],

      // ====================
      // Hooks
      // ====================
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // ====================
      // Import sort
      // ====================
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // ====================
      // TypeScript unused
      // ====================
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-floating-promises": "error",

      // ====================
      // Type import
      // ====================
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],

      // ====================
      // Console
      // ====================
      "no-console": [
        isProd ? "error" : "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },

  // ====================
  // Node (config files)
  // ====================
  {
    files: ["**/*.config.{js,ts}", "**/*.config.*.{js,ts}"],

    extends: [js.configs.recommended, tseslint.configs.recommended],

    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: "module",
    },

    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "no-console": "off",
    },
  },
]);
