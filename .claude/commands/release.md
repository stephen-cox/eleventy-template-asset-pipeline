---
description: Prepare a new NPM release with version bump, tests, changelog update, and PR
---

# Release Preparation Command

You are preparing a new NPM release. Follow these steps carefully:

## Arguments

The first argument specifies the version bump type and must be one of: `patch`, `minor`, or `major`

If no argument is provided or the argument is invalid, ask the user which type of release they want to prepare.

## Steps

### 1. Verify Clean Working Directory

First, check that the working directory is clean (no uncommitted changes):

```bash
git status
```

If there are uncommitted changes, stop and ask the user to commit or stash them first.

### 2. Run Tests

Run the test suite and ensure all tests pass:

```bash
npm test
```

If any tests fail, stop and report the failures. Do not proceed until all tests pass.

### 3. Run Linting

Run the linter and ensure there are no errors:

```bash
npm run lint
```

If linting fails, stop and report the errors. Do not proceed until linting passes.

### 4. Bump Version

Run npm version with the specified bump type (patch/minor/major):

```bash
npm version [VERSION_TYPE] --no-git-tag-version
```

This will update the version in package.json and package-lock.json. Note the new version number that was created.

### 5. Update CHANGELOG

Update the CHANGELOG.md file:

1. Read the current CHANGELOG.md
2. Find the `[Unreleased]` section
3. Replace `## [Unreleased]` with:

   ```
   ## [Unreleased]

   ## [NEW_VERSION] - YYYY-MM-DD
   ```

   Where NEW_VERSION is the version from step 4 and YYYY-MM-DD is today's date

4. Update the version comparison links at the bottom:
   - Update the `[Unreleased]` link to compare from the new version to HEAD
   - Add a new link for the new version comparing it to the previous version

**Important**: Only move content that exists under the [Unreleased] section. If the [Unreleased] section is empty (only contains the heading), create the new version section but leave it empty as well.

### 6. Commit Changes

Create a commit with the version bump and changelog update:

```bash
git add package.json package-lock.json CHANGELOG.md
git commit -m "Release [NEW_VERSION]"
```

### 7. Push and Create PR

Push the changes to the remote branch and create a pull request:

```bash
git push -u origin [CURRENT_BRANCH]
gh pr create --title "Release [NEW_VERSION]" --body "Prepare release [NEW_VERSION]

## Changes

[SUMMARY OF CHANGES FROM CHANGELOG]

## Checklist

- [x] Tests pass
- [x] Linting passes
- [x] Version bumped in package.json
- [x] CHANGELOG updated

After merging, the GitHub Actions workflow will automatically publish to NPM."
```

### 8. Summary

Provide a summary of what was done:

- New version number
- Link to the PR
- Reminder that the package will be automatically published to NPM after the PR is merged

## Error Handling

If any step fails:

1. Report the specific error to the user
2. Do not proceed to subsequent steps
3. Provide guidance on how to fix the issue
