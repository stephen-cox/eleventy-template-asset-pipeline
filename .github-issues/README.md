# GitHub Issues for Eleventy Template Asset Pipeline

This directory contains templates for GitHub issues based on the code review recommendations. These issues are organized by priority and grouped by theme.

## How to Create These Issues

Since the GitHub CLI is not available in this environment, you'll need to manually create these issues on GitHub:

1. Go to https://github.com/stephen-cox/eleventy-template-asset-pipeline/issues
2. Click "New Issue"
3. Copy the content from each `.md` file below
4. Paste into the issue body
5. Add the suggested labels
6. Submit the issue

## Issues to Create

### 1. Error Handling and Validation (HIGH PRIORITY)
**File:** `01-error-handling-validation.md`
**Labels:** `enhancement`, `priority:high`

**Why it matters:** Currently the plugin can fail silently or with cryptic errors. Adding proper error handling and validation will make it much more reliable and easier to debug.

**Key improvements:**
- Try-catch blocks around file operations
- Input validation for config parameters
- Better error messages in shortcodes

---

### 2. Code Quality Improvements (MEDIUM PRIORITY)
**File:** `02-code-quality-improvements.md`
**Labels:** `enhancement`, `refactoring`, `priority:medium`

**Why it matters:** Improves maintainability and consistency. No breaking changes, just cleaner code.

**Key improvements:**
- Consistent console logging
- Extract duplicated collection filter logic
- Fix indentation
- Complete JSDoc comments

---

### 3. TypeScript Support (MEDIUM PRIORITY)
**File:** `03-typescript-support.md`
**Labels:** `enhancement`, `typescript`, `DX`, `priority:medium`

**Why it matters:** Significantly improves developer experience for TypeScript users. Provides better autocomplete in all modern editors.

**Key improvements:**
- Hand-written `.d.ts` type definitions
- Full type coverage for all exports
- Examples of TypeScript usage

---

### 4. Enhanced Shortcode Flexibility (MEDIUM PRIORITY)
**File:** `04-enhanced-shortcode-flexibility.md`
**Labels:** `enhancement`, `feature`, `priority:medium`

**Why it matters:** Currently `scriptLink` is inflexible compared to `assetLink`. Making them consistent improves the API.

**Key improvements:**
- Accept custom attributes in `scriptLink`
- Support `type="module"`, `async`, `nomodule`, etc.
- Maintain backward compatibility

---

### 5. Documentation Improvements (LOW PRIORITY)
**File:** `05-documentation-improvements.md`
**Labels:** `documentation`, `priority:low`

**Why it matters:** Better docs = easier adoption and fewer support requests.

**Key additions:**
- CHANGELOG.md
- CONTRIBUTING.md
- Troubleshooting section
- Performance considerations
- Browser compatibility notes
- Working examples

---

### 6. Additional Features (LOW PRIORITY)
**File:** `06-additional-features.md`
**Labels:** `enhancement`, `feature`, `priority:low`

**Why it matters:** Nice-to-have features for advanced use cases.

**Proposed features:**
- Configurable hash algorithm
- Source map support
- Better multi-directory support
- Asset manifest generation
- Watch mode optimization
- Conditional processing

## Priority Guide

**HIGH:** Should be addressed soon - affects reliability and user experience
**MEDIUM:** Valuable improvements - plan for upcoming releases
**LOW:** Nice-to-have - consider for future releases

## Quick Create Script

If you prefer to use the GitHub CLI from your local machine, you can run:

```bash
cd .github-issues

# Issue 1 (High Priority)
gh issue create --title "Add comprehensive error handling and input validation" \
  --label "enhancement,priority:high" \
  --body-file 01-error-handling-validation.md

# Issue 2 (Medium Priority)
gh issue create --title "Code quality improvements" \
  --label "enhancement,refactoring,priority:medium" \
  --body-file 02-code-quality-improvements.md

# Issue 3 (Medium Priority)
gh issue create --title "Add TypeScript type definitions" \
  --label "enhancement,typescript,DX,priority:medium" \
  --body-file 03-typescript-support.md

# Issue 4 (Medium Priority)
gh issue create --title "Enhanced shortcode flexibility" \
  --label "enhancement,feature,priority:medium" \
  --body-file 04-enhanced-shortcode-flexibility.md

# Issue 5 (Low Priority)
gh issue create --title "Documentation improvements" \
  --label "documentation,priority:low" \
  --body-file 05-documentation-improvements.md

# Issue 6 (Low Priority)
gh issue create --title "Additional features" \
  --label "enhancement,feature,priority:low" \
  --body-file 06-additional-features.md
```

## After Creating Issues

Once issues are created, you may want to:
1. Pin the high-priority issue(s) to keep them visible
2. Create a project board to track progress
3. Link related issues together
4. Set milestones for target versions

## Notes

These issues were generated from a comprehensive code review on 2025-11-06. They represent thoughtful improvements based on:
- Security best practices
- Code quality standards
- Developer experience considerations
- Comparison with similar 11ty plugins

Not all issues need to be implemented immediately - prioritize based on your project goals and user feedback!
