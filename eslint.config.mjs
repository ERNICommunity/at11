import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["dist/*", "eslint.config.mjs"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
)), {
    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
        },

        parser: tsParser,
        ecmaVersion: 2019,
        sourceType: "module",
    },

    rules: {
        "max-len": ["error", {
            code: 140,
            tabWidth: 4,
        }],

        semi: ["error", "always"],
        quotes: ["error", "double"],
        "comma-dangle": ["error", "never"],

        "no-console": ["warn", {
            allow: ["warn", "error"],
        }],

        "no-unused-vars": "off",
        "object-curly-spacing": ["error", "always"],

        "keyword-spacing": ["error", {
            after: true,
        }],

        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": 1,

        "@typescript-eslint/no-inferrable-types": ["warn", {
            ignoreParameters: true,
        }],

        "@typescript-eslint/no-unused-vars": ["warn", {
            args: "none",
        }],
    },
}];
