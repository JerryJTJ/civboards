import eslint from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";
// import _import from "eslint-plugin-import";
import { importX } from "eslint-plugin-import-x";
import { createTypeScriptImportResolver } from "eslint-import-resolver-typescript";
// import typescriptEslint from "@typescript-eslint/eslint-plugin";
// import sortImportsAutofix from "eslint-plugin-sort-imports-es6-autofix";
import jsxA11Y from "eslint-plugin-jsx-a11y";
// import prettier from "eslint-plugin-prettier";
import tsParser from "@typescript-eslint/parser";

export default defineConfig(
	globalIgnores([
		"**/dist/**",
		"**/submodules/**",
		".now/*",
		"**/*.css",
		"**/.changeset",
		"**/dist",
		"esm/*",
		"public/*",
		"tests/*",
		"scripts/*",
		"**/*.config.js",
		"**/.DS_Store",
		"**/node_modules",
		"**/coverage",
		"**/.next",
		"**/build",
		"!**/.commitlintrc.cjs",
		"!**/.lintstagedrc.cjs",
		"!**/jest.config.js",
		"!**/plopfile.js",
		"!**/react-shim.js",
		"!**/tsup.config.ts",
		"eslint.config.mjs",
	]),
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.stylisticTypeChecked,
	// importX.flatConfigs.recommended,
	// importX.flatConfigs.typescript,
	{
		languageOptions: {
			parserOptions: {
				parser: tsParser,
				ecmaVersion: "latest",
				sourceType: "module",
				projectService: true,
				allowDefaultProject: true,
			},
		},
		plugins: {
			"import-x": importX,
			// "sort-imports-es6-autofix": sortImportsAutofix,
		},
		extends: ["import-x/flat/recommended"],
		rules: {
			"import-x/no-dynamic-require": "warn",
			// "sort-imports-es6-autofix/sort-imports-es6": [
			// 	2,
			// 	{
			// 		ignoreCase: false,
			// 		ignoreMemberSort: false,
			// 		memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
			// 	},
			// ],
		},
		settings: {
			"import-x/resolver-next": [
				createTypeScriptImportResolver({
					project: [
						"./tsconfig.json",
						"./frontend/tsconfig.json",
						"./backend/tsconfig.json",
						"./packages/schemas/tsconfig.json",
					],
					alwaysTryTypes: true,
					noWarnOnMultipleProjects: true,
				}),
			],
		},
	},

	// Frontend
	{
		files: ["frontend/**/*.{ts,tsx,js,jsx}"],
		plugins: {
			react: fixupPluginRules(react),
			"react-hooks": reactHooks,
			"unused-imports": unusedImports,
			// import: fixupPluginRules(_import),
			"jsx-a11y": fixupPluginRules(jsxA11Y),
			// prettier: fixupPluginRules(prettier),
		},
		languageOptions: {
			globals: {
				...Object.fromEntries(
					Object.entries(globals.browser).map(([key]) => [key, "off"])
				),
				...globals.node,
			},

			parser: tsParser,
			ecmaVersion: 12,
			sourceType: "module",

			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		rules: {
			"no-console": "warn",
			"react/prop-types": "off",
			"react/jsx-uses-react": "off",
			"react/react-in-jsx-scope": "off",
			"react-hooks/rules-of-hooks": "error",
			"react-hooks/exhaustive-deps": "warn",
			"jsx-a11y/click-events-have-key-events": "warn",
			"jsx-a11y/interactive-supports-focus": "warn",
			// "prettier/prettier": "warn",
			"no-unused-vars": "off",
			"unused-imports/no-unused-vars": "off",
			"unused-imports/no-unused-imports": "warn",

			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					args: "after-used",
					ignoreRestSiblings: false,
					argsIgnorePattern: "^_.*?$",
				},
			],

			// "import/order": [
			// 	"warn",
			// 	{
			// 		groups: [
			// 			"type",
			// 			"builtin",
			// 			"object",
			// 			"external",
			// 			"internal",
			// 			"parent",
			// 			"sibling",
			// 			"index",
			// 		],

			// 		pathGroups: [
			// 			{
			// 				pattern: "~/**",
			// 				group: "external",
			// 				position: "after",
			// 			},
			// 		],

			// 		"newlines-between": "always",
			// 	},
			// ],

			"react/self-closing-comp": "warn",

			"react/jsx-sort-props": [
				"warn",
				{
					callbacksLast: true,
					shorthandFirst: true,
					noSortAlphabetically: false,
					reservedFirst: true,
				},
			],

			"padding-line-between-statements": [
				"warn",
				{
					blankLine: "always",
					prev: "*",
					next: "return",
				},
				{
					blankLine: "always",
					prev: ["const", "let", "var"],
					next: "*",
				},
				{
					blankLine: "any",
					prev: ["const", "let", "var"],
					next: ["const", "let", "var"],
				},
			],
		},
	}
);
