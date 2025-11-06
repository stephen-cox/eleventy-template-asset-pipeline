# Documentation improvements

**Labels:** `documentation`, `priority:low`

## Overview
The plugin would benefit from additional documentation to help users troubleshoot issues, understand best practices, and contribute to the project.

## Missing Documentation

### 1. CHANGELOG.md
A changelog following [Keep a Changelog](https://keepachangelog.com/) format to track version history.

**Example structure:**
```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with 41 tests using AVA
- TypeScript definitions for better DX

### Fixed
- Critical security vulnerability: removed eval() usage
- Bug where inDirectory array logic was being overwritten

### Changed
- Migrated to ES modules
- Updated glob.sync() to async glob()

## [0.1.1] - 2024-XX-XX

### Fixed
- Strip unwanted characters from file hash

## [0.1.0] - 2024-XX-XX

### Added
- Initial release
- ProcessAssets class for asset processing
- Virtual templates for styles and scripts
- assetLink and scriptLink shortcodes
- SRI integrity hash generation
```

### 2. CONTRIBUTING.md
Guidelines for contributors covering:
- How to set up development environment
- How to run tests
- Code style guidelines
- How to submit pull requests
- How to report bugs

**Example sections:**
```markdown
# Contributing

## Development Setup
1. Clone the repository
2. Run `npm install`
3. Run `npm test` to ensure everything works

## Running Tests
- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode

## Code Style
- We use ES modules
- Follow existing code style
- Add tests for new features
- Update documentation

## Pull Requests
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Update README if needed
6. Submit PR with clear description
```

### 3. Enhanced README Sections

#### Troubleshooting Section
```markdown
## Troubleshooting

### Assets not found in production
**Problem:** Cache-busted filenames don't match

**Solution:** Ensure you're passing the collection to your template:
\`\`\`javascript
{% assetLink collections._styles, 'main.css' %}
\`\`\`

### "processFile is not a function" error
**Problem:** Missing or invalid processFile configuration

**Solution:** Ensure processFile is an async function:
\`\`\`javascript
processFile: async (file, production) => {
  // Your processing logic
  return processedContent;
}
\`\`\`

### Permission denied errors
**Problem:** Plugin can't read/write to directories

**Solution:** Check directory permissions and paths are correct
```

#### Performance Considerations
```markdown
## Performance

### Development Mode
- No cache busting (faster builds)
- No minification (optional in your processFile)
- Files rebuild on every change

### Production Mode
- Cache-busted filenames (better browser caching)
- SRI integrity hashes generated
- Apply minification in your processFile function

### Tips
- Use PostCSS's `postcss-import` to process a single entry file
- Configure your build tools to skip source maps in production
- Consider using Eleventy's --incremental flag for large projects
```

#### Browser Compatibility
```markdown
## Browser Compatibility

### Subresource Integrity (SRI)
SRI hashes are generated in production mode. Browser support:
- Chrome 45+
- Firefox 43+
- Safari 11.1+
- Edge 17+

For older browsers, SRI hashes are safely ignored.

### ES Modules
If using `type="module"` scripts, consider providing a nomodule fallback:
\`\`\`javascript
{% scriptLink collections._scripts, 'app.modern.js', { type: 'module' } %}
{% scriptLink collections._scripts, 'app.legacy.js', { nomodule: true } %}
\`\`\`
```

#### Comparison with Alternatives
```markdown
## Why Use This Plugin?

### vs. Separate Build Tools (Gulp, Grunt)
- ✅ Integrated with Eleventy build
- ✅ No separate watch process needed
- ✅ Automatic SRI hash generation
- ❌ Less mature tooling ecosystem

### vs. Eleventy Assets Plugin
- ✅ More flexible (any processing function)
- ✅ Virtual templates or class subclassing
- ✅ Built-in cache busting
- ❌ Requires more configuration

### vs. Manual Asset Pipeline
- ✅ Handles cache busting automatically
- ✅ SRI hashes for security
- ✅ Collection-based asset management
- ❌ Learning curve for configuration
```

### 4. Examples Directory
Create `examples/` directory with working examples:
- `examples/postcss/` - PostCSS setup
- `examples/webpack/` - Webpack setup
- `examples/sass/` - Sass/SCSS setup
- `examples/esbuild/` - esbuild setup

Each with:
- Working `.eleventy.js` config
- Sample input files
- `package.json` with dependencies
- README explaining the setup

### 5. API Reference
Dedicated API documentation section:
```markdown
## API Reference

### ProcessAssets

#### Constructor
\`\`\`javascript
new ProcessAssets(config)
\`\`\`

**Parameters:**
- `config.collection` (string, optional) - Collection name. Default: `'_assets'`
- `config.inDirectory` (string|array) - Input directory or directories
- `config.inExtension` (string) - File extension to process (without dot)
- `config.outDirectory` (string) - Output directory
- `config.outExtension` (string) - Output file extension (without dot)
- `config.processFile` (function) - Async function to process files
- `config.production` (boolean, optional) - Production mode flag. Default: `false`

**Returns:** ProcessAssets instance

#### Methods
...
```

## Acceptance Criteria
- [ ] Add CHANGELOG.md with version history
- [ ] Add CONTRIBUTING.md with contributor guidelines
- [ ] Add troubleshooting section to README
- [ ] Add performance considerations to README
- [ ] Add browser compatibility notes to README
- [ ] Add comparison with alternatives to README
- [ ] Create examples directory with working examples
- [ ] Add API reference documentation
- [ ] Ensure all code examples are tested and working

## Priority
Low - Nice to have but doesn't affect core functionality
