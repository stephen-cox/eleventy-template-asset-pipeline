import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from "@stylistic/eslint-plugin-js";
import prettier from "eslint-config-prettier";

export const GLOB_TESTS = ["**/test/**/*.js", "**/test/**/*.cjs", "**/*.spec.js", "**/*.test.js"];

export default [
	{
		name: "eleventy-template-asset-pipeline/setup/js",
		...pluginJs.configs.recommended,
	},
	{
		name: "eleventy-template-asset-pipeline/rules/project-specific",
		plugins: {
			"@stylistic/js": stylisticJs,
		},
		languageOptions: {
			globals: {
				...globals.node,
			},
			ecmaVersion: "latest",
			sourceType: "module",
		},
		rules: {
			"no-async-promise-executor": "warn",
			"no-prototype-builtins": "warn",
			"no-unused-vars": "warn",
			"@stylistic/js/space-unary-ops": "error",
		},
	},
	{
		name: "eleventy-template-asset-pipeline/commonjs",
		files: ["**/*.cjs"],
		languageOptions: {
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
		},
	},
	{
		name: "eleventy-template-asset-pipeline/ignores",
		files: GLOB_TESTS,
		rules: {
			"no-unused-vars": "off",
		},
	},
	{
		name: "eleventy-template-asset-pipeline/setup/prettier",
		...prettier,
	},
];
