# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive documentation improvements
- Examples directory with working configurations for PostCSS, Webpack, Sass, and esbuild
- API Reference documentation
- Troubleshooting section in README
- Performance optimization guidelines
- Browser compatibility information
- Comparison with alternative solutions

## [0.2.1] - 2024

### Added

- TypeScript type definitions for enhanced IDE support
- Dual package exports for CommonJS and ES modules
- Comprehensive module support documentation

### Changed

- Improved documentation with detailed module import examples
- Enhanced file extension guide for Eleventy templates

### Fixed

- Prettier formatting issues
- Package-lock.json consistency

## [0.2.0] - 2024

### Added

- Code quality improvements with ESLint and Prettier integration
- Automated linting and formatting checks
- Test coverage improvements
- Comprehensive error handling and validation
- Path sanitization to prevent directory traversal attacks
- Input validation for all configuration parameters
- Detailed error messages with helpful guidance

### Changed

- Improved error handling throughout the codebase
- Enhanced type checking for function parameters
- Better validation of ProcessAssets configuration
- Improved shortcode error handling with optional strict mode

### Fixed

- Security vulnerabilities related to path handling
- Various edge cases in error handling

## [0.1.0] - 2024

### Added

- Initial release
- ProcessAssets class for asset pipeline processing
- Support for virtual templates (styles and scripts)
- Cache busting with SHA-512 hashing in production mode
- SRI (Subresource Integrity) hash generation
- `assetLink` shortcode for stylesheet links
- `scriptLink` shortcode for script tags
- Development and production build modes
- Support for PostCSS, Webpack, Sass, and other asset processors
- Configurable input/output directories and file extensions
- Collection-based asset organization
- ES Module and CommonJS interoperability

### Features

- Asset pipeline integration with Eleventy build process
- Automatic hash-based cache busting
- Integrity attribute generation for enhanced security
- Flexible processFile function for custom asset processing
- Support for multiple input directories
- Automatic 11ty template file exclusion

[Unreleased]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/releases/tag/v0.1.0
