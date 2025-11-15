# Sass Example

This example demonstrates how to use the Eleventy Template Asset Pipeline plugin with Sass/SCSS to process stylesheets.

## Features

- Sass/SCSS compilation
- Nested rules and variables
- Mixins and functions
- Partials and imports
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
sass/
├── .eleventy.js          # Eleventy configuration
├── package.json          # Dependencies
├── _assets/
│   └── scss/
│       ├── main.scss     # Main SCSS file with imports
│       ├── _variables.scss # Variables partial
│       ├── _mixins.scss    # Mixins partial
│       └── _components.scss # Components partial
├── _includes/
│   └── layout.njk        # Example layout template
└── index.md              # Example page
```

## How It Works

### 1. Configuration (.eleventy.js)

The plugin is configured to:

- Process SCSS files from `_assets/scss/`
- Compile to CSS using Sass
- Apply different output styles for dev vs production
- Output to `_site/_assets/css/`

### 2. ProcessFile Function

```js
async function processFile(file, production) {
	const result = sass.compile(file, {
		style: production ? "compressed" : "expanded",
		loadPaths: [path.dirname(file)],
	});
	return result.css;
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

## Sass Features

### Variables

```scss
$primary-color: #3b82f6;
$spacing-unit: 1rem;

.button {
	background: $primary-color;
	padding: $spacing-unit;
}
```

### Nesting

```scss
.card {
	padding: 1rem;

	&__title {
		font-size: 1.5rem;
	}

	&:hover {
		transform: translateY(-2px);
	}
}
```

### Mixins

```scss
@mixin flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.container {
	@include flex-center;
}
```

### Partials

Files starting with `_` are partials and imported with `@use`:

```scss
@use "variables";
@use "mixins";
```

## Customization

### Add Autoprefixer

Combine with PostCSS for autoprefixing:

```bash
npm install postcss autoprefixer
```

```js
import postcss from "postcss";
import autoprefixer from "autoprefixer";

async function processFile(file, production) {
	const result = sass.compile(file, {
		style: production ? "compressed" : "expanded",
	});

	const postcssResult = await postcss([autoprefixer]).process(result.css, { from: undefined });

	return postcssResult.css;
}
```

### Source Maps

Enable source maps for development:

```js
const result = sass.compile(file, {
	style: production ? "compressed" : "expanded",
	sourceMap: !production,
});
```

## Tips

1. **Partials**: Use `_` prefix for imported files
2. **@use vs @import**: Prefer `@use` over deprecated `@import`
3. **Load Paths**: Configure paths for node_modules imports
4. **Performance**: Sass is faster than node-sass (deprecated)
5. **Variables**: Define common values in `_variables.scss`
