# Claude Context for Eleventy Template Asset Pipeline

This file provides context for Claude (AI assistant) when working on this project.

## Project Overview

**Name:** `@src-dev/eleventy-template-asset-pipeline`
**Type:** Eleventy (11ty) Plugin
**Purpose:** Integrate asset pipelines (CSS, JS, etc.) into the Eleventy build process without requiring separate task runners like Gulp.

**Key Features:**

- Process assets during 11ty build
- Production cache-busting with content hashes
- Subresource Integrity (SRI) hash generation
- Virtual templates or direct class subclassing
- Works with any processing tool (PostCSS, Sass, Webpack, esbuild)

## Architecture

### Core Components

1. **`index.js`** - Plugin entry point
   - Exports the main plugin function
   - Registers shortcodes (`assetLink`, `scriptLink`)
   - Creates virtual templates for styles/scripts when enabled
   - Manages default configuration

2. **`src/ProcessAssets.js`** - Core asset processing class
   - Discovers files using glob patterns
   - Processes files through user-provided `processFile` function
   - Generates cache-busting filenames in production
   - Creates SRI integrity hashes (SHA-512)
   - Implements Eleventy's pagination system

3. **`src/shortcodes/assetLink.js`** - CSS/asset link generator
   - Renders `<link>` tags with SRI when available
   - Accepts custom HTML attributes

4. **`src/shortcodes/scriptLink.js`** - Script tag generator
   - Renders `<script>` tags with defer
   - Includes SRI when available

### Technology Stack

- **Language:** JavaScript (ES Modules)
- **Module System:** ES6 imports/exports (`type: "module"` in package.json)
- **Testing:** AVA test framework (same as Eleventy core)
- **Dependencies:**
  - `glob` v11.x - File pattern matching (async API)
  - `@11ty/eleventy` (devDependency)
  - `ava` (devDependency)

## Project Structure

```
eleventy-template-asset-pipeline/
├── index.js                      # Plugin entry point
├── index.d.ts                    # TypeScript definitions (main)
├── package.json                  # Package config (ES modules)
├── package-lock.json             # Lock file (committed)
├── ava.config.js                 # AVA test configuration
├── eslint.config.js              # ESLint configuration
├── .prettierrc.json              # Prettier configuration
├── README.md                     # User documentation
├── LICENSE                       # MIT License
├── .gitignore                    # Git ignore (node_modules only)
├── claude.md                     # This file - context for Claude
│
├── src/
│   ├── ProcessAssets.js          # Core processing class
│   ├── ProcessAssets.d.ts        # TypeScript definitions
│   └── shortcodes/
│       ├── assetLink.js          # <link> tag generator
│       ├── assetLink.d.ts        # TypeScript definitions
│       ├── scriptLink.js         # <script> tag generator
│       └── scriptLink.d.ts       # TypeScript definitions
│
├── test/
│   ├── ProcessAssets.test.js     # ProcessAssets tests (19 tests)
│   ├── plugin.test.js            # Plugin config tests (10 tests)
│   ├── shortcodes/
│   │   ├── assetLink.test.js     # assetLink tests (10 tests)
│   │   └── scriptLink.test.js    # scriptLink tests (10 tests)
│   └── fixtures/
│       ├── sample.css             # Test CSS file
│       ├── sample.js              # Test JS file
│       └── nested/
│           └── nested.css         # For testing that nested files are ignored
│
├── .github/
│   ├── workflows/
│   │   ├── test.yml              # GitHub Actions CI
│   │   └── README.md             # Workflow documentation
│   └── issues/                   # (if created)
│
└── .github-issues/                # Issue templates
    ├── README.md
    ├── 01-error-handling-validation.md
    ├── 02-code-quality-improvements.md
    ├── 03-typescript-support.md
    ├── 04-enhanced-shortcode-flexibility.md
    ├── 05-documentation-improvements.md
    └── 06-additional-features.md
```

## Important Technical Details

### Critical Security Fixes Made

1. **FIXED:** Removed `eval()` from index.js:50
   - Was: `eval('new ' + options.scripts.class + '(options.scripts)')`
   - Now: Direct instantiation with `new ProcessAssets(options.scripts)`
   - This was a CRITICAL security vulnerability

2. **FIXED:** inDirectory array bug in ProcessAssets.js
   - Lines 40-45 wrapped in array, then line 46 overwrote it
   - Line 46 has been removed

### Cross-Platform Considerations

**Path separators:**

- Unix/Linux/macOS use `/`
- Windows uses `\`
- Always use `[\/\\]` in regex patterns for paths
- Tests must pass on all platforms (Ubuntu, Windows, macOS)

**Line endings:**

- Unix: LF (`\n`)
- Windows: CRLF (`\r\n`)
- Not currently an issue but be aware

### ES Module Conventions

```javascript
// ✅ Correct (ES modules)
import crypto from "crypto";
import { glob } from "glob";
export default MyClass;

// ❌ Wrong (CommonJS - don't use)
const crypto = require("crypto");
module.exports = MyClass;
```

### Testing Approach

**Framework:** AVA (Eleventy's standard)

**Test Organization:**

- 41 total tests across 4 files
- Each component has dedicated test file
- Tests cover success cases, error cases, edge cases
- Cross-platform path handling required

**Running Tests:**

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
npx ava test/ProcessAssets.test.js  # Specific file
```

**Test Patterns:**

```javascript
// Good: Cross-platform path regex
t.regex(file.path, /test[\/\\]fixtures[\/\\]sample\.css$/);

// Bad: Unix-only path regex
t.regex(file.path, /test\/fixtures\/sample\.css$/);
```

### CI/CD Setup

**GitHub Actions** (`.github/workflows/test.yml`):

- Runs on push/PR to `main` or `develop`
- Tests on Node.js 18.x, 20.x, 22.x
- Tests on Ubuntu, Windows, macOS (9 combinations)
- Uses `npm ci` (requires package-lock.json)
- Status badge in README

**Requirements:**

- `package-lock.json` MUST be committed
- Tests MUST pass on all platforms
- `fail-fast: false` to catch platform-specific issues

## Development Workflow

### Making Changes

1. **Create/switch to feature branch**
2. **Make changes** to source files
3. **Add/update tests** for changes
4. **Run tests locally:** `npm test`
5. **Run linter:** `npm run lint`
6. **Format code:** `npm run format`
7. **Verify formatting:** `npm run format:check`
8. **Commit with descriptive message** (only after all checks pass)
9. **Push and create PR**
10. **Verify CI passes** on all platforms

**IMPORTANT:** Always run linting and formatting before committing. This ensures code quality and consistency.

### Common Tasks

#### Adding a New Feature

1. Update relevant source file(s)
2. Add tests in corresponding test file
3. Update README.md with usage examples
4. Ensure all 41+ tests pass
5. Consider cross-platform implications

#### Fixing a Bug

1. Write a failing test that reproduces the bug
2. Fix the bug in source
3. Verify test now passes
4. Verify all other tests still pass
5. Add regression test to prevent recurrence

#### Adding New Dependencies

```bash
npm install --save package-name        # Runtime dependency
npm install --save-dev package-name    # Dev dependency
```

- Always commit updated `package-lock.json`
- Justify new dependencies (minimize bloat)
- Check license compatibility (MIT preferred)

### Code Style Guidelines

1. **ES Modules:** Always use `import`/`export`
2. **Async/Await:** Prefer over callbacks or raw promises
3. **JSDoc:** Add for all exported functions
4. **Comments:** Explain "why", not "what"
5. **Error Handling:** Validate inputs and provide clear error messages
6. **Console Logging:** Be consistent (error vs log vs warn)
7. **Linting:** Run `npm run lint` - Uses ESLint with Eleventy core style
8. **Formatting:** Run `npm run format` - Uses Prettier for consistent code style

**Code Quality Tools:**

- **ESLint** (`eslint.config.js`) - Enforces code quality and style rules
- **Prettier** (`.prettierrc.json`) - Ensures consistent formatting
- **Always run both before committing** - This is non-negotiable

### Git Conventions

**Commit Messages:**

- Use descriptive multi-line messages
- First line: Brief summary (50 chars)
- Blank line
- Detailed explanation with context
- Use bullet points for lists

**Example:**

```
Add TypeScript definitions for better DX

- Create index.d.ts with full type coverage
- Add types for ProcessAssets class
- Add types for shortcode functions
- Update package.json with "types" field

Improves developer experience for TypeScript users with
autocomplete and type checking.
```

## Known Issues & Limitations

### High Priority (Should Fix Soon)

1. ~~**No error handling**~~ - FIXED: Comprehensive error handling added (issue #1)
2. ~~**No input validation**~~ - FIXED: Input validation added (issue #1)
3. ~~**Inconsistent logging**~~ - FIXED: Consistent error handling (issue #1)

### Medium Priority

4. ~~**No TypeScript definitions**~~ - FIXED: Complete TypeScript support added (issue #4)
5. **scriptLink inflexible** - No custom attributes like assetLink
6. **Duplicated code** - Collection filter logic repeated

### Low Priority (Nice to Have)

7. **No source map support** - Would help debugging
8. **Hardcoded SHA-512** - Could be configurable
9. **Limited documentation** - Missing CHANGELOG, CONTRIBUTING, examples

**See `.github-issues/` for detailed issue templates**

## Working with This Codebase

### When Adding Features

**Consider:**

- Is this a breaking change? (Avoid if possible)
- Does it work on all platforms? (Windows path issues are common)
- Are there tests for success AND failure cases?
- Is the API intuitive for users?
- Does it fit the plugin's scope?

**Don't:**

- Add dependencies without strong justification
- Use platform-specific code without cross-platform fallbacks
- Use `eval()`, `Function()`, or other code execution mechanisms
- Ignore failing tests or skip CI checks
- Mix CommonJS and ES modules

### When Reviewing Code

**Check for:**

- ✅ All tests pass on all platforms
- ✅ New features have tests
- ✅ No security vulnerabilities introduced
- ✅ Backward compatibility maintained
- ✅ Documentation updated
- ✅ Code follows existing style
- ✅ Cross-platform compatibility

### Important Files NOT to Modify

- `package-lock.json` - Only update via `npm install`
- `.github/workflows/test.yml` - CI config (be very careful)
- Test fixtures in `test/fixtures/` - Tests depend on exact content

## Debugging Tips

### Test Failures

**Path issues:**

```javascript
// Check what path is actually being generated
console.log("Path:", files[0].source);
// Then update regex to match both / and \
```

**Async issues:**

```javascript
// Ensure all async functions use await
await processor.processDirectory();
// Not: processor.processDirectory();
```

**Platform-specific failures:**

- Check GitHub Actions logs for specific platform
- Look for path separator issues
- Check for case-sensitivity issues (Windows is case-insensitive)

### Local Development

**Test on Windows (if on Unix):**

- Use WSL (Windows Subsystem for Linux) for testing
- Or use GitHub Actions as smoke test

**Debug glob patterns:**

```javascript
import { glob } from "glob";
const files = await glob("test/fixtures/*.css");
console.log("Found files:", files);
```

**Debug hash generation:**

```javascript
const hash = crypto.createHash("sha512").update(content).digest().toString("base64url");
console.log("Hash:", hash.slice(0, 10));
```

## Context for Common Questions

### "Why is package-lock.json committed?"

For published npm packages, committing the lock file is best practice:

- Ensures reproducible builds
- Required for `npm ci` in CI/CD
- Prevents surprise dependency updates

### "Why ES modules?"

- Modern standard (Node.js 14+ fully supports)
- Eleventy v3 uses ES modules
- Better for tree-shaking
- Cleaner syntax
- Future-proof

### "Why AVA for testing?"

- Official Eleventy testing framework
- Fast (concurrent tests)
- Clean API
- Good error messages
- Well-maintained

### "Why test on multiple Node versions?"

- Node 18.x: Current LTS, production standard
- Node 20.x: Active LTS, recommended for most
- Node 22.x: Current release, future compatibility

Users may be on any of these versions.

### "Why test on multiple OS?"

Path handling differs significantly:

- Windows: `C:\Users\...`, backslashes
- Unix: `/home/...`, forward slashes
- macOS: Similar to Unix but occasional edge cases

## Quick Reference

### Run Tests

```bash
npm test                    # All tests once
npm run test:watch          # Watch mode
```

### Code Quality Checks (REQUIRED before committing)

```bash
npm run lint                # Check for linting errors
npm run lint:fix            # Auto-fix linting errors
npm run format              # Format code with Prettier
npm run format:check        # Verify code is formatted
```

### Pre-Commit Checklist

```bash
npm test                    # ✅ All tests must pass
npm run lint                # ✅ No linting errors
npm run format              # ✅ Code must be formatted
npm run format:check        # ✅ Verify formatting
```

### Install Dependencies

```bash
npm install                 # Install all deps
npm ci                      # Clean install from lock file
```

### Verify Changes

```bash
npm test                    # Must pass
npm run lint                # Must pass
npm run format:check        # Must pass
git status                  # Check what changed
git diff                    # Review changes
```

### Common Git Commands

```bash
git add -A                  # Stage all changes
git status                  # Check status
git commit -m "..."         # Commit with message
git push origin branch      # Push to remote
```

## Project Goals

1. **Simplicity** - Easy to configure and use
2. **Flexibility** - Works with any asset processing tool
3. **Reliability** - Well-tested, cross-platform
4. **Security** - SRI hashes, no eval(), validated inputs
5. **Performance** - Efficient builds, minimal overhead
6. **Developer Experience** - Clear errors, good documentation

## Related Projects

- **Eleventy** - https://www.11ty.dev/
- **PostCSS** - https://postcss.org/
- **Webpack** - https://webpack.js.org/
- **esbuild** - https://esbuild.github.io/

## Useful Resources

- [Eleventy Plugin Docs](https://www.11ty.dev/docs/plugins/)
- [AVA Documentation](https://github.com/avajs/ava)
- [Node.js Path Module](https://nodejs.org/api/path.html)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Last Updated:** 2025-11-12
**Plugin Version:** 0.2.1
**Maintained By:** Stephen Cox <web@stephencox.net>

---

## For Future Claude Sessions

When working on this project:

1. Always check this file first for context
2. **ALWAYS run before committing (in this order):**
   - `npm test` - All tests must pass
   - `npm run lint` - No linting errors allowed
   - `npm run format` - Format all code
   - `npm run format:check` - Verify formatting is correct
3. Consider cross-platform implications
4. Maintain backward compatibility
5. Follow ES module conventions
6. Add tests for new features
7. Update this file if architecture changes significantly

**PRE-COMMIT REQUIREMENTS (CRITICAL):**

```bash
# Run this before EVERY commit:
npm test && npm run lint && npm run format && npm run format:check
```

If any of these fail, DO NOT commit. Fix the issues first.

**Recent Major Changes:**

- 2025-11-12: Added TypeScript type definitions (issue #4)
- 2025-11-12: Added ESLint and Prettier for code quality
- 2025-11-12: Established mandatory pre-commit checks
- 2025-11-06: Added comprehensive test suite (41 tests)
- 2025-11-06: Fixed critical eval() security vulnerability
- 2025-11-06: Fixed inDirectory array bug
- 2025-11-06: Migrated to ES modules
- 2025-11-06: Added GitHub Actions CI
- 2025-11-06: Fixed cross-platform path issues in tests
