# Webpack Example

This example demonstrates how to use the Eleventy Template Asset Pipeline plugin with Webpack to process JavaScript files.

## Features

- Webpack 5 bundling
- ES6+ transpilation with Babel
- Module bundling and code splitting
- Development and production modes
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
webpack/
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies
├── _assets/
│   └── js/
│       ├── _scripts.11ty.js  # ProcessAssets template
│       ├── app.js            # Main entry point
│       └── modules/
│           ├── greeting.js   # Example module
│           └── utils.js      # Utility functions
├── _includes/
│   └── layout.njk        # Example layout template
└── index.md              # Example page
```

## How It Works

### 1. ProcessAssets Template (\_scripts.11ty.js)

Instead of configuring via `.eleventy.js`, this example uses a JavaScript template that creates a ProcessAssets instance:

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

### 2. ProcessFile Function with Webpack

The processFile function configures and runs Webpack:

```js
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV === "production";

	const webpackConfig = {
		mode: production ? "production" : "development",
		entry: file,
		output: {
			filename: path.basename(file),
			path: path.resolve("/"),
		},
		// ... Babel and other loaders
	};

	const compiler = webpack(webpackConfig);
	compiler.outputFileSystem = mfs;

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			// Handle compilation
		});
	});
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

## Webpack Configuration

### Babel Loader

Transpiles modern JavaScript to ES5 for broader browser support:

```js
module: {
	rules: [
		{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env"],
				},
			},
		},
	];
}
```

### Memory File System

Uses memfs to avoid writing intermediate files:

```js
import { fs as mfs } from "memfs";

compiler.outputFileSystem = mfs;
compiler.inputFileSystem = fs;
compiler.intermediateFileSystem = mfs;
```

## Customization

### Add Source Maps

```js
const webpackConfig = {
	devtool: production ? false : "inline-source-map",
	// ... rest of config
};
```

### Code Splitting

```js
optimization: {
	splitChunks: {
		chunks: "all";
	}
}
```

### Additional Loaders

```bash
npm install css-loader style-loader
```

```js
{
	test: /\.css$/,
	use: ['style-loader', 'css-loader']
}
```

## Tips

1. **Entry Points**: Only top-level JS files are processed as entry points
2. **Imports**: Use ES6 imports to include other modules
3. **Memory**: Uses in-memory filesystem for better performance
4. **Errors**: Check Webpack compilation errors in console output
