# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-08-23

### Fixed

- Subresource Integrity hashes are now standard base64 rather than base64url, so
  browsers can parse them (Issue #25). The SRI grammar admits only standard
  base64, so the previous base64url digests were discarded during parsing and the
  integrity check was skipped entirely — assets were loaded with no verification.
  Cache-busting filenames continue to use base64url, which is correct there.

  **Behaviour change:** integrity checks are now actually enforced. If the bytes
  a site serves differ from the bytes 11ty built — a CDN that recompresses or
  rewrites assets, for example — those assets will now fail to load rather than
  loading unverified.

## [1.0.0] - 2025-11-19

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

[Unreleased]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.2...v1.0.0
[0.2.2]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/stephen-cox/eleventy-template-asset-pipeline/releases/tag/v0.2.0
