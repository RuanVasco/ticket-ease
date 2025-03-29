import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            import: importPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

            "import/order": [
                "error",
                {
                    groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "import/newline-after-import": ["error", { count: 1 }],
            "import/no-duplicates": "error",
            "no-multiple-empty-lines": ["warn", { max: 1 }],
            "prettier/prettier": "warn",
        },
    }
);
