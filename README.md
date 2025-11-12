# Eleventy Template asset pipeline plugin

[![Tests](https://github.com/stephen-cox/eleventy-template-asset-pipeline/actions/workflows/test.yml/badge.svg)](https://github.com/stephen-cox/eleventy-template-asset-pipeline/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/@src-dev%2Feleventy-template-asset-pipeline.svg)](https://www.npmjs.com/package/@src-dev/eleventy-template-asset-pipeline)

Eleventy plugin to provide asset pipelines as part of the 11ty build process.

This plugin uses [JavaScript templates](https://www.11ty.dev/docs/languages/javascript/) to run an asset pipeline that can be used to process things like CSS and SASS as well as JavaScript and other static assets.

There are two ways to use this, either creating a JS template that loads and configures the ProcessAssets class or take advantage of the styles and scripts [Virtual Templates](https://www.11ty.dev/docs/virtual-templates/) provided by this plugin. In both cases it's necessary to provide an async function that takes the path to a file and returns a Promise with the compiled assets. This allows the use of tools such as PostCSS, Sass and Webpack as part of an Eleventy build without having to use a separate task runner such as Gulp.

## Module Support

This package is published as an ES Module but includes full CommonJS interoperability through dual package exports. Both the main entry point and individual subpaths can be imported using either module system.

### Main Entry Point

**ESM:**

```js
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";
```

**CommonJS:**

```js
const eleventyTemplateAssetPipeline = require("@src-dev/eleventy-template-asset-pipeline");
```

### Importing Individual Modules

You can also import specific modules directly:

**ProcessAssets Class:**

```js
// ESM (.js files or imports)
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

// CommonJS (only in .cjs files or projects without "type": "module")
// The require() returns a Promise, so use .then()
const ProcessAssetsPromise = require("@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets");
```

**Shortcodes:**

```js
// ESM (.js files or imports)
import assetLink from "@src-dev/eleventy-template-asset-pipeline/src/shortcodes/assetLink";
import scriptLink from "@src-dev/eleventy-template-asset-pipeline/src/shortcodes/scriptLink";

// CommonJS (only in .cjs files or projects without "type": "module")
// The require() returns a Promise, so use .then()
const assetLinkPromise = require("@src-dev/eleventy-template-asset-pipeline/src/shortcodes/assetLink");
const scriptLinkPromise = require("@src-dev/eleventy-template-asset-pipeline/src/shortcodes/scriptLink");
```

**Important Notes:**

- `require()` **only works in actual CommonJS files** (`.cjs` extension or projects without `"type": "module"` in package.json)
- If you're using `.js` files in a project with `"type": "module"`, you **must use ESM `import` syntax**
- When using `require()` for individual modules, it returns a **Promise** - you cannot use `await` at the top level of CommonJS files
- Use `.then()` to handle the Promise or export a Promise from your module (see examples below)

### File Extension Guide for 11ty Templates

When creating 11ty template files that use ProcessAssets:

**ESM (Recommended) - Use `.11ty.js` extension:**

```js
// _styles.11ty.js
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

async function processFile(file, production) {
	// Your CSS/JS processing logic here
	return processedContent;
}

export default new ProcessAssets({
	inExtension: "css",
	inDirectory: "./_assets/css",
	outExtension: "css",
	outDirectory: "_assets/css",
	collection: "_styles",
	processFile: processFile,
	production: process.env.ELEVENTY_ENV === "production",
});
```

**CommonJS - Use `.11ty.cjs` extension:**

```js
// _styles.11ty.cjs
const ProcessAssetsPromise = require("@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets");

async function processFile(file, production) {
	// Your CSS/JS processing logic here
	return processedContent;
}

// Export a Promise that resolves to the ProcessAssets instance
module.exports = ProcessAssetsPromise.then((ProcessAssets) => {
	return new ProcessAssets({
		inExtension: "css",
		inDirectory: "./_assets/css",
		outExtension: "css",
		outDirectory: "_assets/css",
		collection: "_styles",
		processFile: processFile,
		production: process.env.ELEVENTY_ENV === "production",
	});
});
```

## Using the virtual templates

To use the virtual templates, define the processFile function and then pass this with the necessary configuration when initialising the plugin.

For example to process styles using PostCSS, define the processFile function.

```js
/**
 * Process CSS files using PostCSS.
 */
const processFilePostCss = async function (file, production) {
	const css = await fs.readFileSync(file);

	// Production build.
	if (production) {
		return await postcss([
			require("postcss-import"),
			require("autoprefixer"),
			require("postcss-custom-media"),
			require("cssnano")({
				preset: "default",
			}),
		])
			.process(css, { from: file })
			.then((result) => result.css);
	}

	// Development build.
	else {
		return await postcss([require("postcss-import"), require("autoprefixer")])
			.process(css, { from: file })
			.then((result) => result.css);
	}
};
```

Then configure the plugin to use this plugin to process CSS files in a directory. Using the postcss-import plugin gives the ability to process a single file that loads all your CSS files in subdirectories.

**ESM (ES Modules):**

```js
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
		styles: {
			enabled: true,
			collection: "_styles",
			inExtension: "css",
			inDirectory: "_assets/css",
			outExtension: "css",
			outDirectory: "_assets/css",
			processFile: processFilePostCss,
			production: process.env.ELEVENTY_ENV === "production",
		},
	});
}
```

**CommonJS:**

```js
const eleventyTemplateAssetPipeline = require("@src-dev/eleventy-template-asset-pipeline");

module.exports = async function (eleventyConfig) {
	await eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
		styles: {
			enabled: true,
			collection: "_styles",
			inExtension: "css",
			inDirectory: "_assets/css",
			outExtension: "css",
			outDirectory: "_assets/css",
			processFile: processFilePostCss,
			production: process.env.ELEVENTY_ENV === "production",
		},
	});
};
```

## Subclassing ProcessAssets

It's possible to create the JavaScript templates directly, rather than relying on the virtual templates. To do this initialise the plugin in the 11ty config file with no extra settings.

**ESM (ES Modules):**

```js
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline);
}
```

**CommonJS:**

```js
const eleventyTemplateAssetPipeline = require("@src-dev/eleventy-template-asset-pipeline");

module.exports = async function (eleventyConfig) {
	await eleventyConfig.addPlugin(eleventyTemplateAssetPipeline);
};
```

Then in the directory containing files to process (e.g. your CSS or JavaScript files) create an 11ty JavaScript template that exports an instance of the ProcessAssets class with the `processFile` method defined.

To process JavaScript files using Webpack, you would create a `_scripts.11ty.js` file in the root of you scripts directory.

**ESM (\_scripts.11ty.js):**

```js
/**
 * Process JavaScript files using the ProcessAssets class.
 */

import fs from "fs";
import path from "path";
import webpack from "webpack";
import { fs as mfs } from "memfs";
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

/**
 * Process JS files.
 */
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV;

	// Setup Webpack.
	const webpackConfig = {
		mode: production ? "production" : "development",
		entry: file,
		output: {
			filename: path.basename(file),
			path: path.resolve("/"),
		},
	};
	const compiler = webpack(webpackConfig);
	compiler.outputFileSystem = mfs;
	compiler.inputFileSystem = fs;
	compiler.intermediateFileSystem = mfs;

	// Compile file.
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err || stats.hasErrors()) {
				const errors = err || (stats.compilation ? stats.compilation.errors : null);
				reject(errors);
				return;
			}

			mfs.readFile(
				webpackConfig.output.path + "/" + webpackConfig.output.filename,
				"utf8",
				(err, data) => {
					if (err) reject(err);
					else resolve(data);
				},
			);
		});
	});
}

export default new ProcessAssets({
	inExtension: "js",
	inDirectory: import.meta.dirname,
	outExtension: "js",
	outDirectory: "_assets/js",
	collection: "_scripts",
	processFile: processFile,
	production: process.env.ELEVENTY_ENV === "production" || process.env.ELEVENTY_ENV === "stage",
});
```

**CommonJS (\_scripts.11ty.cjs):**

```js
/**
 * Process JavaScript files using the ProcessAssets class.
 */

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { fs: mfs } = require("memfs");

// Note: await the require() for individual modules
const ProcessAssetsPromise = require("@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets");

/**
 * Process JS files.
 */
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV;

	// Setup Webpack.
	const webpackConfig = {
		mode: production ? "production" : "development",
		entry: file,
		output: {
			filename: path.basename(file),
			path: path.resolve("/"),
		},
	};
	const compiler = webpack(webpackConfig);
	compiler.outputFileSystem = mfs;
	compiler.inputFileSystem = fs;
	compiler.intermediateFileSystem = mfs;

	// Compile file.
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err || stats.hasErrors()) {
				const errors = err || (stats.compilation ? stats.compilation.errors : null);
				reject(errors);
				return;
			}

			mfs.readFile(
				webpackConfig.output.path + "/" + webpackConfig.output.filename,
				"utf8",
				(err, data) => {
					if (err) reject(err);
					else resolve(data);
				},
			);
		});
	});
}

// Await the ProcessAssets class and create instance
module.exports = ProcessAssetsPromise.then(
	(ProcessAssets) =>
		new ProcessAssets({
			inExtension: "js",
			inDirectory: __dirname,
			outExtension: "js",
			outDirectory: "_assets/js",
			collection: "_scripts",
			processFile: processFile,
			production: process.env.ELEVENTY_ENV === "production" || process.env.ELEVENTY_ENV === "stage",
		}),
);
```

## Error Handling

The plugin includes comprehensive error handling and input validation to help identify configuration issues and provide helpful error messages.

### Configuration Validation

The plugin validates all configuration parameters and provides descriptive error messages when issues are detected:

```js
// Example: Missing required parameters
eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
	styles: {
		enabled: true,
		inDirectory: "./_assets/css",
		// Missing: inExtension, outDirectory, outExtension
	},
});
// Error: Missing required configuration parameters: inExtension, outDirectory, outExtension.
// ProcessAssets requires: inDirectory, inExtension, outDirectory, outExtension.
// Example: { inDirectory: "./_assets/css", inExtension: "css", outDirectory: "_assets/css", outExtension: "css" }
```

### Path Sanitization

The plugin automatically sanitizes file paths to prevent directory traversal attacks:

```js
// Example: Directory traversal attempt
new ProcessAssets({
	inDirectory: "../../../etc/passwd", // This will throw an error
	inExtension: "css",
	outDirectory: "_assets/css",
	outExtension: "css",
});
// Error: Invalid config.inDirectory: Directory traversal not allowed.
// Path "../../../etc/passwd" contains ".." after normalization.
// Use absolute paths or paths relative to your project root.
```

### ProcessFile Validation

The plugin ensures that the `processFile` function is properly defined and returns valid content:

```js
// Example: Missing processFile function
const processor = new ProcessAssets({
	inDirectory: "./_assets/css",
	inExtension: "css",
	outDirectory: "_assets/css",
	outExtension: "css",
	// processFile is not defined
});

await processor.processDirectory();
// Error: No processFile function configured.
// Provide a processFile function in the configuration:
// { processFile: async (filePath, isProduction) => { /* process and return content */ } }
```

### Shortcode Error Handling

The shortcodes (`assetLink` and `scriptLink`) validate their inputs and provide helpful error messages:

```js
// Example: Asset not found
{% assetLink collections._styles, 'nonexistent.css' %}
// Warning: Asset "nonexistent.css" not found in collection.
// Available keys: main.css, theme.css
// Returns: '' (empty string)
```

For stricter error handling, you can enable the `throwOnMissing` option:

```js
// In your template
{% assetLink collections._styles, 'nonexistent.css', {}, { throwOnMissing: true } %}
// Error: Asset "nonexistent.css" not found in collection.
// Available keys: main.css, theme.css
```

### Type Checking

All function parameters are type-checked with helpful error messages:

```js
// Example: Invalid parameter type
assetLink(123, "main.css");
// Error: assetLink collection must be an array or iterable, received number.
// Pass a collection from Eleventy: assetLink(collections._styles, "main.css")
```

### File Processing Errors

When file processing fails, the error includes context about which file failed and why:

```js
// Example: ProcessFile throws an error
async function processFile(file, production) {
	throw new Error("PostCSS compilation failed");
}

// During build:
// Error: Failed to process file "./_assets/css/main.css".
// Error: PostCSS compilation failed.
// Check that the file exists and the processFile function is working correctly.
```

### Best Practices for Error Handling

1. **Always provide all required configuration parameters** to avoid configuration errors
2. **Use try-catch blocks** around your `processFile` function to provide meaningful error messages
3. **Test your configuration** with a small subset of files first
4. **Enable strict mode** (`throwOnMissing: true`) during development to catch missing assets early
5. **Check the console** for warnings about missing assets or empty directories

### Common Error Messages

| Error Message                               | Cause                                        | Solution                                                         |
| ------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `Missing required configuration parameters` | Not all required config options provided     | Add the missing parameters listed in the error                   |
| `Directory traversal not allowed`           | Path contains `..`                           | Use paths relative to your project root without `..`             |
| `processFile must be a function`            | processFile is not defined or has wrong type | Define processFile as an async function                          |
| `Asset not found in collection`             | Referenced asset key doesn't exist           | Check the asset filename and collection name                     |
| `No processFile function configured`        | ProcessAssets created without processFile    | Add processFile to your configuration                            |
| `Failed to process file`                    | Error occurred in processFile function       | Check the underlying error message and fix your processing logic |
