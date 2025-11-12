# Examples

This directory contains complete working examples demonstrating how to use the Eleventy Template Asset Pipeline plugin with different asset processors.

## Available Examples

### [PostCSS](./postcss/)

Demonstrates CSS processing with PostCSS, including:

- PostCSS plugin configuration
- CSS imports with postcss-import
- Autoprefixer for vendor prefixes
- Custom media queries
- Minification with cssnano (production only)
- Virtual template configuration

**Best for:** Modern CSS processing with PostCSS ecosystem

### [Webpack](./webpack/)

Demonstrates JavaScript bundling with Webpack, including:

- Webpack 5 configuration
- Babel transpilation
- ES6 module bundling
- Memory filesystem usage
- Development and production modes
- ProcessAssets template pattern

**Best for:** Complex JavaScript applications requiring advanced bundling features

### [Sass](./sass/)

Demonstrates SCSS/Sass compilation, including:

- Modern `@use` syntax
- Variables and mixins
- Nested rules
- Partials and imports
- Component architecture
- Development vs production output

**Best for:** Teams familiar with Sass/SCSS syntax and features

### [esbuild](./esbuild/)

Demonstrates extremely fast JavaScript bundling with esbuild, including:

- Lightning-fast build times
- Minimal configuration
- ES6+ transpilation
- Tree shaking
- Browser and localStorage APIs
- Interactive components

**Best for:** Modern projects needing fast builds with minimal configuration

## Running the Examples

Each example is a standalone Eleventy project with its own dependencies.

### Setup

1. Navigate to an example directory:

```bash
cd postcss  # or webpack, sass, esbuild
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Example Structure

Each example follows this structure:

```
example-name/
├── README.md              # Detailed documentation
├── .eleventy.js           # Eleventy configuration
├── package.json           # Dependencies and scripts
├── _assets/               # Source assets
│   ├── css/ or scss/     # Styles (for CSS examples)
│   └── js/               # Scripts (for JS examples)
├── _includes/
│   └── layout.njk        # Layout template
└── index.md              # Example page
```

## Choosing an Example

| Use Case                                 | Recommended Example |
| ---------------------------------------- | ------------------- |
| Modern CSS with PostCSS plugins          | PostCSS             |
| Complex JavaScript applications          | Webpack             |
| Sass/SCSS stylesheets                    | Sass                |
| Fast builds for modern browsers          | esbuild             |
| Starting a new project                   | PostCSS or esbuild  |
| Migrating from Gulp/Grunt                | Any (see below)     |
| TypeScript support                       | esbuild or Webpack  |
| Maximum build speed                      | esbuild             |
| Maximum flexibility and plugin ecosystem | Webpack or PostCSS  |

## Comparison

| Feature        | PostCSS | Webpack | Sass     | esbuild |
| -------------- | ------- | ------- | -------- | ------- |
| **Speed**      | Fast    | Slow    | Fast     | Fastest |
| **Complexity** | Low     | High    | Low      | Low     |
| **Plugins**    | Many    | Most    | Built-in | Limited |
| **File Type**  | CSS     | JS      | CSS      | JS      |
| **Config**     | Simple  | Complex | Simple   | Minimal |
| **TypeScript** | N/A     | Yes     | N/A      | Yes     |

## Key Concepts

### Virtual Templates vs ProcessAssets Templates

**Virtual Templates (PostCSS, Sass):**

- Configured in `.eleventy.js`
- Plugin creates the template automatically
- Simpler for straightforward use cases

**ProcessAssets Templates (Webpack, esbuild):**

- Manual `_scripts.11ty.js` template file
- More control over configuration
- Better for complex processing

### Development vs Production

All examples demonstrate:

- **Development mode:** Faster builds, original filenames, easier debugging
- **Production mode:** Cache busting, minification, SRI hashes

Set via environment variable:

```bash
ELEVENTY_ENV=production eleventy
```

### Common Patterns

All examples follow these patterns:

1. **processFile function:** Processes individual files
2. **Collection-based:** Assets available in Eleventy collections
3. **Shortcodes:** Use `assetLink` or `scriptLink` in templates
4. **Cache busting:** Automatic in production mode
5. **SRI hashes:** Generated automatically in production

## Combining Examples

You can use multiple processors in one project:

```js
// .eleventy.js
export default function (eleventyConfig) {
	// Add PostCSS for styles
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

	// Add esbuild for scripts via _scripts.11ty.js template
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline);
}
```

## Customization

Each example can be customized:

1. **Add more processors:** Install and configure additional tools
2. **Change paths:** Modify `inDirectory` and `outDirectory`
3. **Add plugins:** Install and configure processor-specific plugins
4. **Modify output:** Change minification, transpilation targets, etc.

## Common Issues

See the main [README Troubleshooting section](../README.md#troubleshooting) for common issues and solutions.

## Additional Resources

- [Main README](../README.md) - Plugin documentation
- [API Reference](../API.md) - Complete API documentation
- [CONTRIBUTING](../CONTRIBUTING.md) - Contributing guidelines
- [CHANGELOG](../CHANGELOG.md) - Version history

## Questions?

If you have questions about the examples:

1. Check the example's README.md
2. Review the main plugin documentation
3. Look at the API reference
4. Open an issue on GitHub
