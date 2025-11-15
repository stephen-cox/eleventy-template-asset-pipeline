# Contributing to Eleventy Template Asset Pipeline

Thank you for your interest in contributing to the Eleventy Template Asset Pipeline! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Code Style Standards](#code-style-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project adheres to a code of conduct that promotes a welcoming and inclusive environment. Please be respectful and considerate in all interactions.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR-USERNAME/eleventy-template-asset-pipeline.git
cd eleventy-template-asset-pipeline
```

3. Add the upstream repository as a remote:

```bash
git remote add upstream https://github.com/stephen-cox/eleventy-template-asset-pipeline.git
```

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Verify the setup by running tests:

```bash
npm test
```

3. Check code formatting and linting:

```bash
npm run lint
npm run format:check
```

## Development Workflow

### Creating a Branch

Create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Use descriptive branch names:

- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation changes
- `refactor/` for code refactoring

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure all tests pass
4. Follow the code style standards
5. Update documentation if needed

### Committing Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "Add feature: description of what was added"
```

Good commit message examples:

- `Add support for custom hash algorithms`
- `Fix cache busting for nested directories`
- `Update README with Sass example`
- `Refactor path sanitization logic`

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Code Style Standards

This project uses ESLint and Prettier to maintain consistent code style.

### ESLint

- Run ESLint to check for code issues:

```bash
npm run lint
```

- Automatically fix issues where possible:

```bash
npm run lint:fix
```

### Prettier

- Check formatting:

```bash
npm run format:check
```

- Automatically format code:

```bash
npm run format
```

### Style Guidelines

- Use tabs for indentation
- Use semicolons
- Use double quotes for strings
- Maximum line length: 120 characters (enforced by Prettier)
- Use ES6+ features (the project is ES Module-based)
- Add JSDoc comments for all functions and classes
- Use descriptive variable and function names

### Code Organization

- Keep functions focused and single-purpose
- Extract complex logic into separate functions
- Use meaningful variable names
- Add comments for complex logic
- Follow existing patterns in the codebase

## Testing

This project uses AVA for testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

- Place test files in the `test/` directory
- Name test files with `.test.js` extension
- Write tests for all new features
- Write tests for bug fixes to prevent regression
- Aim for high test coverage

Example test structure:

```js
import test from "ava";
import ProcessAssets from "../src/ProcessAssets.js";

test("ProcessAssets: should process files correctly", async (t) => {
	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures",
		inExtension: "css",
		outDirectory: "./test/output",
		outExtension: "css",
		processFile: async (file) => {
			return "processed content";
		},
	});

	const result = await processor.processDirectory();
	t.truthy(result);
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Test edge cases and error conditions
- Test both success and failure paths
- Validate error messages and types

## Pull Request Process

### Before Submitting

1. Ensure all tests pass: `npm test`
2. Check linting: `npm run lint`
3. Check formatting: `npm run format:check`
4. Update documentation if needed
5. Update CHANGELOG.md with your changes
6. Rebase your branch on the latest main if needed

### Submitting a Pull Request

1. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

2. Go to the GitHub repository and create a pull request
3. Fill out the pull request template with:
   - Clear description of changes
   - Motivation and context
   - Related issue numbers (if applicable)
   - Screenshots (for UI changes)
   - Testing steps

### Pull Request Requirements

- All tests must pass
- Code must pass linting checks
- Code must be properly formatted
- New features must include tests
- Bug fixes must include regression tests
- Documentation must be updated
- CHANGELOG.md must be updated

### Review Process

- Maintainers will review your pull request
- Address any feedback or requested changes
- Keep the pull request focused on a single change
- Be responsive to comments and questions
- Once approved, a maintainer will merge your PR

## Bug Reports

### Before Reporting

1. Check if the bug has already been reported
2. Verify you're using the latest version
3. Test with a minimal reproduction case

### Creating a Bug Report

Include the following information:

1. **Description**: Clear description of the bug
2. **Steps to Reproduce**: Minimal steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**:
   - Node.js version
   - npm version
   - Operating system
   - Plugin version
6. **Code Sample**: Minimal code that reproduces the issue
7. **Error Messages**: Full error messages and stack traces

Example bug report template:

```markdown
## Bug Description

Brief description of the bug

## Steps to Reproduce

1. Create a ProcessAssets instance with...
2. Call processDirectory()
3. Observe error

## Expected Behavior

The files should be processed without errors

## Actual Behavior

Error thrown: [error message]

## Environment

- Node.js: v20.0.0
- npm: 10.0.0
- OS: macOS 14.0
- Plugin version: 0.2.1

## Code Sample

[Minimal reproduction code]

## Error Message

[Full error and stack trace]
```

## Feature Requests

### Proposing a Feature

1. Check if the feature has already been requested
2. Ensure the feature aligns with the project goals
3. Provide a clear use case

### Feature Request Template

Include:

1. **Feature Description**: What you want to add
2. **Motivation**: Why this feature is needed
3. **Use Case**: How it would be used
4. **Proposed Implementation**: Ideas for implementation (optional)
5. **Alternatives**: Other approaches considered

## Questions?

If you have questions about contributing:

- Open a discussion on GitHub
- Check existing issues and pull requests
- Review the documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project.

Thank you for contributing to the Eleventy Template Asset Pipeline!
