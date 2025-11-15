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

## Troubleshooting

### Cache-Busted Filename Mismatches

**Issue**: The generated cache-busted filename doesn't match the expected file in your template.

**Cause**: The plugin generates unique hashes based on file content, which change when the file changes.

**Solution**:

1. Use the `assetLink` or `scriptLink` shortcodes instead of hardcoding filenames
2. Ensure your template is using the correct collection name
3. Verify the asset key matches your source filename (without hash)

```html
<!-- ❌ Don't hardcode filenames -->
<link href="/assets/css/main-ABC123.css" rel="stylesheet" />

<!-- ✅ Use shortcodes instead -->
{% assetLink collections._styles, 'main.css' %}
```

### Invalid processFile Configuration

**Issue**: Error message "No processFile function configured" or processFile returns undefined.

**Cause**: The processFile function is missing or not returning processed content.

**Solution**:

1. Ensure processFile is defined as an async function
2. Make sure it returns the processed content as a string
3. Check that the function is passed in the configuration

```js
// ✅ Correct processFile implementation
async function processFile(file, production) {
	const content = await fs.readFile(file, "utf-8");
	// Process content here
	return processedContent; // Must return a string
}

// Pass it to the configuration
eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
	styles: {
		enabled: true,
		processFile: processFile, // Include this!
		// ... other config
	},
});
```

### Permission Errors

**Issue**: EACCES or EPERM errors when processing files.

**Cause**: Insufficient permissions to read input files or write output files.

**Solution**:

1. Check file and directory permissions
2. Ensure the output directory exists or can be created
3. Verify you have write permissions in the output directory
4. On Windows, check if files are locked by another process

```bash
# Check permissions (Unix/Linux/macOS)
ls -la _assets/css

# Create output directory if needed
mkdir -p _site/_assets/css

# Fix permissions (Unix/Linux/macOS)
chmod -R 755 _assets
```

### Directory Not Found Errors

**Issue**: Cannot find files in specified inDirectory.

**Cause**: Path is incorrect or relative path is not resolved correctly.

**Solution**:

1. Use paths relative to your Eleventy project root
2. Verify the directory exists
3. Check for typos in the path
4. Ensure you're not using `..` in paths (security restriction)

```js
// ✅ Correct - relative to project root
inDirectory: "./_assets/css";

// ❌ Incorrect - directory traversal not allowed
inDirectory: "../../../css";
```

### Assets Not Appearing in Collections

**Issue**: Collections are empty or missing expected assets.

**Cause**: Collection name mismatch or files not being processed.

**Solution**:

1. Verify the collection name in your template matches the configuration
2. Check that files exist in the inDirectory
3. Ensure files have the correct extension (inExtension)
4. Look for error messages in the build output

```js
// Configuration
collection: "_styles"

// Template - must match exactly
{% assetLink collections._styles, 'main.css' %}
```

### PostCSS/Sass/Webpack Errors

**Issue**: Build fails with CSS or JavaScript processing errors.

**Cause**: Errors in your asset processing configuration or source files.

**Solution**:

1. Test your processFile function independently
2. Check for syntax errors in your CSS/JS files
3. Verify all required dependencies are installed
4. Review your PostCSS/Webpack configuration
5. Add try-catch blocks for better error messages

```js
async function processFile(file, production) {
	try {
		const css = await fs.readFile(file, "utf-8");
		const result = await postcss(plugins).process(css, { from: file });
		return result.css;
	} catch (error) {
		console.error(`Failed to process ${file}:`, error);
		throw error; // Re-throw to see in Eleventy output
	}
}
```

## Performance

### Development vs Production Mode

The plugin optimizes differently for development and production environments:

**Development Mode** (`production: false`):

- No cache busting - files use original names
- Faster builds - skips hash generation
- No integrity hashes - reduces computation
- Easier debugging - predictable filenames

**Production Mode** (`production: true`):

- Cache busting enabled - unique hashes in filenames
- SRI hash generation - enhanced security
- Optimized for deployment - long-term caching

**Setting the Mode**:

```js
// Recommended: Use environment variable
production: process.env.ELEVENTY_ENV === "production"

// Build commands in package.json
{
	"scripts": {
		"build": "ELEVENTY_ENV=production eleventy",
		"dev": "eleventy --serve"
	}
}
```

### Optimization Techniques

#### 1. Minimize processFile Overhead

Keep your processFile function efficient:

```js
// ✅ Good - cache PostCSS plugins
const postcssPlugins = [require("postcss-import"), require("autoprefixer")];

async function processFile(file, production) {
	const css = await fs.readFile(file, "utf-8");
	return await postcss(postcssPlugins).process(css, { from: file });
}

// ❌ Bad - recreates plugins every time
async function processFile(file, production) {
	const css = await fs.readFile(file, "utf-8");
	return await postcss([
		require("postcss-import"), // Loaded on every file!
		require("autoprefixer"),
	]).process(css, { from: file });
}
```

#### 2. Use Multiple Input Directories

Process files from multiple sources efficiently:

```js
new ProcessAssets({
	inDirectory: ["./_assets/css", "./node_modules/some-package/css"],
	inExtension: "css",
	// ... other config
});
```

#### 3. Conditional Processing

Apply different processing based on the environment:

```js
async function processFile(file, production) {
	const css = await fs.readFile(file, "utf-8");

	if (production) {
		// Full optimization for production
		return await postcss([require("postcss-import"), require("autoprefixer"), require("cssnano")])
			.process(css, { from: file })
			.then((r) => r.css);
	} else {
		// Minimal processing for development
		return await postcss([require("postcss-import")])
			.process(css, { from: file })
			.then((r) => r.css);
	}
}
```

#### 4. Optimize Eleventy Build

Combine with Eleventy's incremental builds:

```bash
# Development with watch mode
eleventy --serve --incremental

# Production build
ELEVENTY_ENV=production eleventy
```

### Performance Tips

1. **Limit File Processing**: Only process top-level files (the plugin already does this)
2. **Use Import/Include**: Let your CSS/JS tools handle dependencies (e.g., `@import` in CSS)
3. **Cache Dependencies**: Initialize tools outside processFile when possible
4. **Async Operations**: Always use async/await for I/O operations
5. **Monitor Build Times**: Use Eleventy's built-in performance diagnostics

```bash
# See detailed build performance
DEBUG=Eleventy* eleventy
```

## Browser Compatibility

### Subresource Integrity (SRI) Support

The plugin generates SRI hashes in production mode for enhanced security.

**Browser Support**:

- Chrome/Edge: 45+
- Firefox: 43+
- Safari: 11.1+
- Opera: 32+

**Automatic SRI Implementation**:

In production mode, the plugin automatically generates integrity hashes:

```html
<!-- Generated by assetLink -->
<link
	href="/assets/css/main-ABC123.css"
	rel="stylesheet"
	integrity="sha512-xyz..."
	crossorigin="anonymous"
/>

<!-- Generated by scriptLink -->
<script
	src="/assets/js/app-DEF456.js"
	integrity="sha512-abc..."
	crossorigin="anonymous"
	defer
></script>
```

**Compatibility Considerations**:

- SRI requires CORS configuration for cross-origin assets
- The `crossorigin="anonymous"` attribute is automatically added
- Older browsers ignore the integrity attribute (graceful degradation)

### ES Module Support

The plugin supports both ES modules and CommonJS:

**ES Modules (Recommended)**:

```js
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";
```

**Browser Support**:

- Chrome: 61+
- Edge: 16+
- Firefox: 60+
- Safari: 11+

**Fallback Strategy**:

For broader browser support, use module/nomodule pattern:

```html
<!-- Modern browsers load this -->
<script type="module" src="/assets/js/app.modern.js"></script>

<!-- Legacy browsers load this -->
<script nomodule src="/assets/js/app.legacy.js"></script>
```

### Cache Busting Compatibility

Cache busting works in all browsers:

- Uses filename-based hashing (universal support)
- No browser-specific features required
- Compatible with all CDNs and hosting platforms
- Works with service workers and offline caching

### CSS Features

When using PostCSS or other processors, consider:

**Autoprefixer**: Automatically adds vendor prefixes

```js
const postcssPlugins = [
	require("autoprefixer")({
		browsers: ["last 2 versions", "> 1%"],
	}),
];
```

**Custom Properties**: Consider fallbacks for older browsers

```css
/* Good practice with fallbacks */
.element {
	background: #333; /* Fallback */
	background: var(--bg-color, #333);
}
```

## Comparison with Alternatives

### vs. Gulp

**Gulp**:

- Separate build process
- Requires gulpfile configuration
- More complex setup
- Runs independently of Eleventy

**This Plugin**:

- Integrated with Eleventy build
- Configured in `.eleventy.js`
- Simpler setup for Eleventy projects
- Single build command
- Native access to Eleventy collections

**When to use Gulp**:

- Complex multi-step build processes
- Legacy projects already using Gulp
- Need for advanced task orchestration

**When to use this plugin**:

- Eleventy-focused projects
- Prefer integrated build process
- Want simpler configuration
- Need tight Eleventy integration

### vs. Grunt

**Grunt**:

- Task-based automation
- Gruntfile configuration
- Older, less actively maintained
- Configuration over code

**This Plugin**:

- Code over configuration
- Modern JavaScript/async-await
- Actively maintained
- Purpose-built for Eleventy

**When to use Grunt**:

- Existing Grunt infrastructure
- Preference for configuration-based approach

**When to use this plugin**:

- Modern JavaScript projects
- Eleventy-specific workflows
- Active development and support

### vs. Eleventy Assets Plugin

**Eleventy Assets Plugin**:

- Different approach to asset handling
- May have different features

**This Plugin**:

- JavaScript template-based approach
- Virtual template support
- Built-in cache busting
- SRI hash generation
- Flexible processFile function
- Dual module system support

**Advantages of this plugin**:

1. **Flexibility**: Use any asset processor (PostCSS, Sass, Webpack, esbuild)
2. **Security**: Automatic SRI hash generation
3. **Performance**: Built-in cache busting
4. **Integration**: Native Eleventy collections
5. **Modern**: ES modules and CommonJS support

### vs. Manual Asset Pipeline

**Manual Approach**:

- Separate npm scripts for CSS/JS
- Manual cache busting
- Custom shortcode creation
- Multiple build steps

**This Plugin**:

- Single integrated build
- Automatic cache busting
- Built-in shortcodes
- Unified configuration

**Manual Build Example**:

```json
{
	"scripts": {
		"build:css": "postcss src/css -d dist/css",
		"build:js": "webpack",
		"build:eleventy": "eleventy",
		"build": "npm run build:css && npm run build:js && npm run build:eleventy"
	}
}
```

**With This Plugin**:

```json
{
	"scripts": {
		"build": "eleventy"
	}
}
```

**Advantages of this plugin**:

1. **Simplicity**: Single build command
2. **Consistency**: Everything in `.eleventy.js`
3. **Reliability**: No manual coordination needed
4. **Features**: Cache busting and SRI included
5. **Maintenance**: Less configuration to manage

### Migration Guide

#### From Gulp/Grunt

1. Identify your asset processing tasks
2. Convert task functions to processFile functions
3. Move configuration to `.eleventy.js`
4. Remove gulp/grunt dependencies
5. Update build scripts

#### From Manual Pipeline

1. Install this plugin
2. Create processFile function from your existing scripts
3. Configure plugin in `.eleventy.js`
4. Replace custom shortcodes with built-in ones
5. Simplify package.json scripts

## Contributing and Releases

### Development

When contributing to this project:

1. Fork the repository and create a feature branch
2. Make your changes and ensure all tests pass: `npm test`
3. Run linting: `npm run lint` (or `npm run lint:fix` to auto-fix)
4. Check formatting: `npm run format:check` (or `npm run format` to auto-fix)
5. Submit a pull request to the `main` branch

### Publishing Releases

This package uses automated NPM publishing via GitHub Actions. To publish a new version:

1. **Update the version** in `package.json`:

   ```bash
   npm version patch  # For bug fixes (0.2.1 -> 0.2.2)
   npm version minor  # For new features (0.2.1 -> 0.3.0)
   npm version major  # For breaking changes (0.2.1 -> 1.0.0)
   ```

2. **Push the changes** to the main branch:

   ```bash
   git push origin main
   ```

3. **Create a GitHub Release**:
   - Go to the [Releases page](https://github.com/stephen-cox/eleventy-template-asset-pipeline/releases)
   - Click "Draft a new release"
   - Create a new tag matching the version in `package.json` (e.g., `0.2.2`)
   - Target the `main` branch
   - Add release notes describing the changes
   - Click "Publish release"

4. **Automated Publishing**:
   - GitHub Actions will automatically run tests and linting
   - If all checks pass, the package will be published to NPM with provenance
   - The workflow status can be monitored in the [Actions tab](https://github.com/stephen-cox/eleventy-template-asset-pipeline/actions)

**Important Notes:**

- Only releases from the `main` branch will be published to NPM
- The version in `package.json` must match the release tag
- All tests and linting must pass before publishing
- NPM packages are published with provenance for supply chain security

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
