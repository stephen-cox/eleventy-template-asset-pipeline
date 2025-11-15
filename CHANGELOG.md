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

## [0.2.2] - 2025-11-12

### Added

- Automated NPM publishing workflow for streamlined releases
- TypeScript type definitions for enhanced IDE support and type safety
- ESLint for JavaScript linting with Eleventy core style configuration
- Prettier for code formatting matching Eleventy style guidelines
- Comprehensive linting and formatting checks in CI pipeline

### Changed

- Updated development documentation with mandatory linting and formatting requirements
- Refactored collection filter logic to reduce code duplication (Issue #3)

### Fixed

- Prettier formatting issues across the codebase
- Updated package-lock.json to reflect new development dependencies

## [0.2.1] - 2025-11-11

### Added

- Comprehensive error handling and input validation (Issue #2)

### Fixed

- Fixed sanitizePath to preserve path format for glob compatibility
- Fixed ProcessAssets to properly iterate over inDirectory array

## [0.2.0] - 2025-11-06

### Fixed

- Fixed error in cleaning up hash for cache busting

## Earlier Versions

For earlier version history, please see the [commit history](https://github.com/stephen-cox/eleventy-template-asset-pipeline/commits/main).

[Unreleased]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.2...HEAD
[0.2.2]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/releases/tag/v0.2.0
