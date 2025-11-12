# API Reference

Complete API documentation for the Eleventy Template Asset Pipeline plugin.

## Table of Contents

- [Plugin Configuration](#plugin-configuration)
- [ProcessAssets Class](#processassets-class)
- [Shortcodes](#shortcodes)
- [Type Definitions](#type-definitions)

## Plugin Configuration

### Main Plugin Function

```js
eleventyTemplateAssetPipeline(eleventyConfig, options);
```

**Parameters:**

- `eleventyConfig` (Object) - Eleventy configuration object
- `options` (Object) - Plugin configuration options

**Options:**

```js
{
	styles: {
		enabled: boolean,      // Enable styles virtual template
		collection: string,    // Collection name (default: "_styles")
		inExtension: string,   // Input file extension (e.g., "css")
		inDirectory: string,   // Input directory path
		outExtension: string,  // Output file extension (e.g., "css")
		outDirectory: string,  // Output directory path
		processFile: function, // File processing function
		production: boolean    // Production mode flag
	},
	scripts: {
		enabled: boolean,      // Enable scripts virtual template
		collection: string,    // Collection name (default: "_scripts")
		inExtension: string,   // Input file extension (e.g., "js")
		inDirectory: string,   // Input directory path
		outExtension: string,  // Output file extension (e.g., "js")
		outDirectory: string,  // Output directory path
		processFile: function, // File processing function
		production: boolean    // Production mode flag
	}
}
```

**Example:**

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

---

## ProcessAssets Class

### Constructor

Creates a new ProcessAssets instance for processing asset files.

```js
new ProcessAssets(config);
```

**Parameters:**

- `config` (Object) - Configuration object

**Config Properties:**

| Property       | Type               | Required | Default    | Description                                 |
| -------------- | ------------------ | -------- | ---------- | ------------------------------------------- |
| `inDirectory`  | string \| string[] | Yes      | -          | Input directory path(s)                     |
| `inExtension`  | string             | Yes      | -          | Input file extension (without dot)          |
| `outDirectory` | string             | Yes      | -          | Output directory path                       |
| `outExtension` | string             | Yes      | -          | Output file extension (without dot)         |
| `collection`   | string             | No       | "\_assets" | Eleventy collection name                    |
| `production`   | boolean            | No       | false      | Enable production mode (cache busting, SRI) |
| `processFile`  | function           | No       | -          | Async function to process files             |

**Example:**

```js
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

const processor = new ProcessAssets({
	inDirectory: "./_assets/css",
	inExtension: "css",
	outDirectory: "_assets/css",
	outExtension: "css",
	collection: "_styles",
	production: process.env.ELEVENTY_ENV === "production",
	processFile: async (file, production) => {
		// Process and return content
		return processedContent;
	},
});

export default processor;
```

**Validation:**

The constructor validates all parameters and throws descriptive errors:

- Missing required parameters
- Invalid types
- Empty strings
- Directory traversal attempts (paths containing `..`)
- Invalid collection names

### Properties

#### `collection`

- **Type:** `string`
- **Description:** Name of the Eleventy collection to add processed assets to
- **Default:** `"_assets"`

#### `inDirectory`

- **Type:** `string[]`
- **Description:** Array of input directory paths to search for files

#### `inExtension`

- **Type:** `string`
- **Description:** File extension to process (without dot)

#### `outDirectory`

- **Type:** `string`
- **Description:** Directory path for output files

#### `outExtension`

- **Type:** `string`
- **Description:** File extension for output files (without dot)

#### `production`

- **Type:** `boolean`
- **Description:** Production mode flag
- **Default:** `false`

#### `processFile`

- **Type:** `function`
- **Description:** Async function to process files
- **Signature:** `async (filePath: string, production: boolean) => string`

### Methods

#### `data()`

Returns Eleventy frontmatter data for the template.

```js
async data()
```

**Returns:** `Promise<Object>` - Frontmatter configuration object

**Return Value:**

```js
{
	eleventyComputed: {
		key: ({ item }) => item.index,
		integrity: ({ item }) => item.integrity
	},
	permalink: ({ item }) => item.destination,
	pagination: {
		addAllPagesToCollections: true,
		alias: "item",
		data: "data",
		size: 1
	},
	layout: "",
	tags: [this.collection],
	asset: [this.collection],
	data: [/* processed files */]
}
```

#### `processDirectory()`

Processes all top-level files in the input directory.

```js
async processDirectory()
```

**Returns:** `Promise<Array<Object>>` - Array of processed file objects

**Return Value (Development Mode):**

```js
[
	{
		index: "main.css", // Original filename
		source: "./_assets/css/main.css", // Source path
		destination: "_assets/css/main.css", // Output path
		content: "/* processed CSS */", // Processed content
	},
];
```

**Return Value (Production Mode):**

```js
[
	{
		index: "main.css", // Original filename
		source: "./_assets/css/main.css", // Source path
		destination: "_assets/css/main-ABC123XYZ.css", // Cache-busted path
		content: "/* processed CSS */", // Processed content
		integrity: "sha512-...", // SRI hash
	},
];
```

**Behavior:**

- Searches for files matching `inDirectory/*.inExtension`
- Excludes files ending in `.11ty.js`
- Calls `processFile()` for each file
- In production: generates SHA-512 hash for cache busting and SRI
- In development: uses original filenames

**Errors:**

- Throws if `processFile` is not configured
- Throws if `processFile` returns `null` or `undefined`
- Throws if file processing fails
- Warns if no files are found

#### `render()`

Renders the processed file content.

```js
async render({ item })
```

**Parameters:**

- `item` (Object) - Processed file object from `processDirectory()`

**Returns:** `Promise<string>` - The file content

**Example:**

```js
const content = await processor.render({
	item: {
		content: "/* processed CSS */",
	},
});
```

---

## Shortcodes

### assetLink

Generates a `<link>` tag for a processed asset.

```js
assetLink(collection, key, attributes?, options?)
```

**Parameters:**

| Parameter    | Type   | Required | Default | Description                                       |
| ------------ | ------ | -------- | ------- | ------------------------------------------------- |
| `collection` | Array  | Yes      | -       | Eleventy collection (e.g., `collections._styles`) |
| `key`        | string | Yes      | -       | Asset key/filename (e.g., `"main.css"`)           |
| `attributes` | Object | No       | `{}`    | HTML attributes for the link tag                  |
| `options`    | Object | No       | `{}`    | Configuration options                             |

**Attributes:**

Any valid HTML link attributes:

```js
{
	rel: "stylesheet",       // Default
	media: "print",
	type: "text/css",
	// ... any other attributes
}
```

**Options:**

```js
{
	throwOnMissing: boolean; // Throw error if asset not found (default: false)
}
```

**Returns:** `string` - Generated HTML link tag or empty string if not found

**Examples:**

```html
<!-- Basic usage -->
{% assetLink collections._styles, 'main.css' %}
<!-- Output: <link href="/_assets/css/main.css" rel="stylesheet" /> -->

<!-- With attributes -->
{% assetLink collections._styles, 'print.css', { media: 'print' } %}
<!-- Output: <link href="/_assets/css/print.css" rel="stylesheet" media="print" /> -->

<!-- Production output (with SRI) -->
<link
	href="/_assets/css/main-ABC123XYZ.css"
	rel="stylesheet"
	integrity="sha512-..."
	crossorigin="anonymous"
/>

<!-- Strict mode -->
{% assetLink collections._styles, 'main.css', {}, { throwOnMissing: true } %}
```

**Automatic Features:**

- Adds `integrity` attribute in production (if available)
- Adds `crossorigin="anonymous"` when integrity is present
- Defaults `rel` to `"stylesheet"` if not specified

**Error Handling:**

- Returns empty string if asset not found (default)
- Logs warning to console with available keys
- Throws error if `throwOnMissing: true`
- Validates all parameters with helpful error messages

### scriptLink

Generates a `<script>` tag for a processed script asset.

```js
scriptLink(collection, key, options?)
```

**Parameters:**

| Parameter    | Type   | Required | Default | Description                                        |
| ------------ | ------ | -------- | ------- | -------------------------------------------------- |
| `collection` | Array  | Yes      | -       | Eleventy collection (e.g., `collections._scripts`) |
| `key`        | string | Yes      | -       | Asset key/filename (e.g., `"app.js"`)              |
| `options`    | Object | No       | `{}`    | Configuration options                              |

**Options:**

```js
{
	throwOnMissing: boolean; // Throw error if asset not found (default: false)
}
```

**Returns:** `string` - Generated HTML script tag or empty string if not found

**Examples:**

```html
<!-- Basic usage -->
{% scriptLink collections._scripts, 'app.js' %}
<!-- Output: <script src="/_assets/js/app.js" defer></script> -->

<!-- Production output (with SRI) -->
<script
	src="/_assets/js/app-ABC123XYZ.js"
	integrity="sha512-..."
	crossorigin="anonymous"
	defer
></script>

<!-- Strict mode -->
{% scriptLink collections._scripts, 'app.js', { throwOnMissing: true } %}
```

**Automatic Features:**

- Adds `defer` attribute by default
- Adds `integrity` attribute in production (if available)
- Adds `crossorigin="anonymous"` when integrity is present

**Error Handling:**

- Returns empty string if asset not found (default)
- Logs warning to console with available keys
- Throws error if `throwOnMissing: true`
- Validates all parameters with helpful error messages

---

## Type Definitions

TypeScript type definitions are available for enhanced IDE support.

### Import Types

```ts
import type ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";
import type { assetLink, scriptLink } from "@src-dev/eleventy-template-asset-pipeline";
```

### ProcessAssets Types

```ts
interface ProcessAssetsConfig {
	inDirectory: string | string[];
	inExtension: string;
	outDirectory: string;
	outExtension: string;
	collection?: string;
	production?: boolean;
	processFile?: (file: string, production: boolean) => Promise<string>;
}

interface ProcessedFile {
	index: string;
	source: string;
	destination: string;
	content: string;
	integrity?: string;
}

class ProcessAssets {
	constructor(config: ProcessAssetsConfig);
	data(): Promise<object>;
	processDirectory(): Promise<ProcessedFile[]>;
	render(data: { item: ProcessedFile }): Promise<string>;
}
```

### Shortcode Types

```ts
interface AssetLinkAttributes {
	rel?: string;
	media?: string;
	type?: string;
	[key: string]: any;
}

interface ShortcodeOptions {
	throwOnMissing?: boolean;
}

function assetLink(
	collection: any[],
	key: string,
	attributes?: AssetLinkAttributes,
	options?: ShortcodeOptions,
): string;

function scriptLink(collection: any[], key: string, options?: ShortcodeOptions): string;
```

### Plugin Types

```ts
interface PluginConfig {
	styles?: {
		enabled: boolean;
		collection?: string;
		inExtension: string;
		inDirectory: string;
		outExtension: string;
		outDirectory: string;
		processFile: (file: string, production: boolean) => Promise<string>;
		production?: boolean;
	};
	scripts?: {
		enabled: boolean;
		collection?: string;
		inExtension: string;
		inDirectory: string;
		outExtension: string;
		outDirectory: string;
		processFile: (file: string, production: boolean) => Promise<string>;
		production?: boolean;
	};
}

function eleventyTemplateAssetPipeline(eleventyConfig: any, pluginConfig?: PluginConfig): void;
```

---

## Error Messages

The plugin provides detailed error messages to help with debugging:

### Configuration Errors

```
Missing required configuration parameters: inExtension, outDirectory.
ProcessAssets requires: inDirectory, inExtension, outDirectory, outExtension.
Example: { inDirectory: "./_assets/css", inExtension: "css", ... }
```

### Path Validation Errors

```
Invalid config.inDirectory: Directory traversal not allowed.
Path "../../../etc/passwd" contains ".." after normalization.
Use absolute paths or paths relative to your project root.
```

### ProcessFile Errors

```
No processFile function configured.
Provide a processFile function in the configuration:
{ processFile: async (filePath, isProduction) => { /* process and return content */ } }
```

### Asset Not Found

```
Asset "main.css" not found in collection.
Available keys: theme.css, print.css
```

---

## Best Practices

1. **Always validate config**: The plugin validates all inputs, but it's good to understand requirements
2. **Use async/await**: All processing functions should be async
3. **Return strings**: processFile must return a string (the processed content)
4. **Handle errors**: Wrap processFile in try-catch for better error messages
5. **Use shortcodes**: Prefer `assetLink` and `scriptLink` over hardcoded URLs
6. **Environment variables**: Use `process.env.ELEVENTY_ENV` for production detection
7. **Type safety**: Import TypeScript types for better IDE support

---

## Examples

See the [`examples/`](./examples/) directory for complete working examples:

- [PostCSS](./examples/postcss/) - CSS processing with PostCSS
- [Webpack](./examples/webpack/) - JavaScript bundling with Webpack
- [Sass](./examples/sass/) - SCSS compilation
- [esbuild](./examples/esbuild/) - Fast JavaScript bundling

---

## See Also

- [README.md](./README.md) - Main documentation
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines
