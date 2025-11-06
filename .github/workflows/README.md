# GitHub Actions Workflows

This directory contains GitHub Actions workflows for continuous integration and automated testing.

## test.yml

### Purpose
Automatically runs the test suite on every push and pull request to ensure code quality and prevent regressions.

### Triggers
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop` branches

### Test Matrix
Tests are run across multiple environments to ensure compatibility:

| Node.js Version | Operating Systems |
|----------------|-------------------|
| 18.x (LTS)     | Ubuntu, Windows, macOS |
| 20.x (LTS)     | Ubuntu, Windows, macOS |
| 22.x (Current) | Ubuntu, Windows, macOS |

**Total:** 9 test combinations (3 Node versions × 3 operating systems)

### Jobs

#### 1. Test Job
Runs the AVA test suite across the matrix of Node.js versions and operating systems.

**Steps:**
1. Checkout the repository code
2. Setup Node.js with the specified version
3. Install dependencies using `npm ci` (clean install)
4. Run tests with `npm test`
5. Upload test artifacts (Ubuntu + Node 20 only)

**Why these Node versions?**
- **18.x:** Current LTS, widely used in production
- **20.x:** Active LTS, recommended for most users
- **22.x:** Current release, ensures future compatibility

#### 2. Lint Job
Prepared for future ESLint integration (currently commented out).

**Steps:**
1. Checkout the repository code
2. Setup Node.js 20.x
3. Install dependencies
4. Run ESLint (when configured)

### Status Badge

The README.md displays a status badge showing the current test status:

```markdown
[![Tests](https://github.com/stephen-cox/eleventy-template-asset-pipeline/actions/workflows/test.yml/badge.svg)](https://github.com/stephen-cox/eleventy-template-asset-pipeline/actions/workflows/test.yml)
```

The badge shows:
- ✅ **Passing** - All tests passed on all platforms
- ❌ **Failing** - One or more tests failed
- 🟡 **Running** - Tests currently executing

### Configuration Options

#### fail-fast: false
Tests continue running on other platforms even if one fails. This helps identify platform-specific issues.

#### cache: 'npm'
Node.js setup caches npm dependencies to speed up subsequent runs.

#### npm ci vs npm install
Uses `npm ci` for clean, reproducible installs based on package-lock.json.

### Viewing Results

1. **On GitHub:**
   - Go to the **Actions** tab in the repository
   - Click on a workflow run to see detailed results
   - Expand individual jobs to see test output

2. **On Pull Requests:**
   - Test status appears automatically on PRs
   - Required checks can be configured to prevent merging if tests fail

### Local Testing

Before pushing, run the same tests locally:

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Run tests on a specific file
npx ava test/ProcessAssets.test.js
```

### Adding More Checks

To add ESLint when ready:

1. Install ESLint:
   ```bash
   npm install --save-dev eslint
   ```

2. Add lint script to package.json:
   ```json
   {
     "scripts": {
       "lint": "eslint ."
     }
   }
   ```

3. Uncomment the lint steps in `test.yml`

### Troubleshooting

#### Tests fail on Windows but pass on Linux/macOS
- Check for path separator issues (`/` vs `\`)
- Use `path.join()` or `path.resolve()` for cross-platform paths
- Verify line endings (CRLF vs LF)

#### Tests fail on specific Node versions
- Check for Node.js API changes between versions
- Review the changelog for breaking changes
- Consider using feature detection instead of version checks

#### Workflow not running
- Verify branch names match the trigger configuration
- Check repository settings → Actions → General
- Ensure workflows are enabled for the repository

### Security

- Workflows use official GitHub Actions (`actions/checkout@v4`, `actions/setup-node@v4`)
- Dependencies are pinned to specific versions
- No secrets or credentials are required for testing
- Test results are uploaded as artifacts (visible only to repo collaborators)

### Performance

- Average workflow duration: ~2-5 minutes
- Matrix jobs run in parallel
- npm cache reduces dependency install time
- `fail-fast: false` may increase duration but provides better feedback

## Future Workflows

Consider adding:
- **publish.yml** - Automated npm publishing on release
- **codeql.yml** - Code security scanning
- **coverage.yml** - Code coverage reporting
- **dependabot.yml** - Automated dependency updates
