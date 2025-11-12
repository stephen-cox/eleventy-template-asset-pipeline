# esbuild Example

This example demonstrates how to use the Eleventy Template Asset Pipeline plugin with esbuild to process JavaScript files.

## Features

- Extremely fast JavaScript bundling with esbuild
- ES6+ transpilation
- Module bundling
- Tree shaking
- Minification
- Automatic cache busting in production
- SRI hash generation

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Project Structure

```
esbuild/
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies
├── _assets/
│   └── js/
│       ├── _scripts.11ty.js  # ProcessAssets template
│       ├── app.js            # Main entry point
│       └── modules/
│           ├── counter.js    # Counter module
│           └── theme.js      # Theme switcher
├── _includes/
│   └── layout.njk        # Example layout template
└── index.md              # Example page
```

## How It Works

### 1. ProcessAssets Template (\_scripts.11ty.js)

This example uses a JavaScript template that creates a ProcessAssets instance with esbuild:

```js
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

export default new ProcessAssets({
	inExtension: "js",
	inDirectory: import.meta.dirname,
	outExtension: "js",
	outDirectory: "_assets/js",
	collection: "_scripts",
	processFile: processFile,
	production: process.env.ELEVENTY_ENV === "production",
});
```

### 2. ProcessFile Function with esbuild

The processFile function uses esbuild's build API:

```js
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV === "production";

	const result = await esbuild.build({
		entryPoints: [file],
		bundle: true,
		minify: production,
		format: "esm",
		target: ["es2020"],
		write: false,
	});

	return result.outputFiles[0].text;
}
```

### 3. Using in Templates

```html
{% scriptLink collections._scripts, 'app.js' %}
```

This generates:

**Development**:

```html
<script src="/_assets/js/app.js" defer></script>
```

**Production**:

```html
<script
	src="/_assets/js/app-ABC123XYZ.js"
	integrity="sha512-..."
	crossorigin="anonymous"
	defer
></script>
```

## esbuild Configuration

### Basic Options

```js
{
	entryPoints: [file],    // Input file
	bundle: true,            // Bundle all dependencies
	minify: production,      // Minify in production
	format: "esm",          // Output format (esm, cjs, iife)
	target: ["es2020"],     // Target environment
	write: false            // Return output in memory
}
```

### Advanced Options

```js
{
	// Source maps
	sourcemap: production ? false : "inline",

	// Tree shaking
	treeShaking: true,

	// Platform
	platform: "browser",

	// External dependencies (don't bundle)
	external: ["react", "react-dom"],

	// Define constants
	define: {
		"process.env.NODE_ENV": production ? '"production"' : '"development"'
	}
}
```

## Why esbuild?

### Speed

esbuild is **10-100x faster** than other bundlers:

- Written in Go (compiled, not JavaScript)
- Parallel processing
- Minimal overhead

### Simplicity

- Minimal configuration needed
- Built-in TypeScript support
- No loader configuration required

### Comparison

| Feature       | esbuild | Webpack | Rollup |
| ------------- | ------- | ------- | ------ |
| Speed         | ⚡⚡⚡  | 🐌      | 🏃     |
| Configuration | Simple  | Complex | Medium |
| Plugins       | Limited | Many    | Many   |

## Customization

### TypeScript Support

esbuild supports TypeScript out of the box:

```js
{
	entryPoints: ["app.ts"],
	loader: { ".ts": "ts" }
}
```

### CSS Bundling

Bundle CSS with JavaScript:

```js
import "./styles.css";
```

```js
{
	bundle: true,
	loader: { ".css": "css" }
}
```

### JSX/React

```js
{
	loader: { ".jsx": "jsx" },
	jsxFactory: "React.createElement",
	jsxFragment: "React.Fragment"
}
```

## Tips

1. **Speed**: esbuild is ideal for large projects needing fast builds
2. **Simplicity**: Minimal config compared to Webpack
3. **Modern**: Best for modern browsers (ES2020+)
4. **Limitations**: Fewer plugins than Webpack/Rollup
5. **Use Cases**: Perfect for modern SPAs and TypeScript projects
