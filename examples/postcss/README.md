# PostCSS Example

This example demonstrates how to use the Eleventy Template Asset Pipeline plugin with PostCSS to process CSS files.

## Features

- PostCSS processing with autoprefixer and cssnano
- CSS imports with postcss-import
- Custom media queries
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
postcss/
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies
├── _assets/
│   └── css/
│       ├── main.css      # Main CSS file with imports
│       ├── _base.css     # Base styles (imported)
│       └── _components.css # Component styles (imported)
├── _includes/
│   └── layout.njk        # Example layout template
└── index.md              # Example page
```

## How It Works

### 1. Configuration (.eleventy.js)

The plugin is configured to:

- Process CSS files from `_assets/css/`
- Use PostCSS with autoprefixer, cssnano, and postcss-import
- Enable different processing for dev vs production
- Output to `_site/_assets/css/`

### 2. ProcessFile Function

```js
async function processFile(file, production) {
	const css = await fs.readFile(file, "utf-8");

	if (production) {
		// Production: full optimization
		return await postcss([
			require("postcss-import"),
			require("autoprefixer"),
			require("postcss-custom-media"),
			require("cssnano"),
		])
			.process(css, { from: file })
			.then((r) => r.css);
	} else {
		// Development: minimal processing
		return await postcss([require("postcss-import"), require("autoprefixer")])
			.process(css, { from: file })
			.then((r) => r.css);
	}
}
```

### 3. Using in Templates

```html
{% assetLink collections._styles, 'main.css' %}
```

This generates:

**Development**:

```html
<link href="/_assets/css/main.css" rel="stylesheet" />
```

**Production**:

```html
<link
	href="/_assets/css/main-ABC123XYZ.css"
	rel="stylesheet"
	integrity="sha512-..."
	crossorigin="anonymous"
/>
```

## PostCSS Plugins Used

- **postcss-import**: Inline @import rules
- **autoprefixer**: Add vendor prefixes automatically
- **postcss-custom-media**: Use custom media queries
- **cssnano**: Minify CSS (production only)

## Customization

### Add More PostCSS Plugins

Install and add to the plugins array:

```bash
npm install postcss-nested
```

```js
const plugins = [
	require("postcss-import"),
	require("postcss-nested"), // Add this
	require("autoprefixer"),
];
```

### Configure Autoprefixer

```js
require("autoprefixer")({
	overrideBrowserslist: ["last 2 versions", "> 1%"],
});
```

### Source Maps

Add source maps for development:

```js
.process(css, {
	from: file,
	map: production ? false : { inline: true }
})
```

## Tips

1. **Import Order**: Use `@import` in main.css to control load order
2. **File Names**: Only top-level files (main.css) are processed
3. **Partials**: Prefix imported files with `_` by convention
4. **Performance**: Keep processFile efficient by caching plugin array
