# Code quality improvements

**Labels:** `enhancement`, `refactoring`, `priority:medium`

## Overview
Several code quality improvements that would make the codebase more maintainable and consistent.

## Issues to Address

### 1. Console Logging Inconsistency
**Files:** `src/shortcodes/assetLink.js`, `src/shortcodes/scriptLink.js`

Currently there's inconsistent error logging:
- Line 7 in both files uses `console.error()` for undefined collection
- Lines 32/22 use `console.log()` for key not found (similar error condition)

**Recommendation:** Use consistent logging levels
```javascript
// For user-facing errors
console.error(`Asset key '${key}' not found in collection.`);

// For debugging/info
console.log(`Processing ${file}...`);
```

### 2. Duplicated Collection Filter Logic
**File:** `index.js` lines 43-47 and 51-55

The same collection filtering logic is repeated:
```javascript
return collectionsApi.getAll().filter(function (item) {
  return 'asset' in item.data && item.data.asset.includes(options.styles.collection);
});
```

**Recommendation:** Extract to helper function
```javascript
function createAssetCollectionFilter(collectionName) {
  return function (collectionsApi) {
    return collectionsApi.getAll().filter(function (item) {
      return 'asset' in item.data && item.data.asset.includes(collectionName);
    });
  };
}

// Usage
eleventyConfig.addCollection(options.styles.collection, createAssetCollectionFilter(options.styles.collection));
```

### 3. Inconsistent Indentation
**File:** `index.js` lines 45-46, 53-54

```javascript
return 'asset' in item.data && item.data.asset.includes(options.styles.collection);
// Should align with standard indentation
```

### 4. Missing JSDoc Comments
**Files:** `src/shortcodes/assetLink.js`, `src/shortcodes/scriptLink.js`

Functions are missing JSDoc with:
- `@param` tags for parameters
- `@returns` tag for return value
- `@throws` tag for potential errors (once error handling is added)

**Example:**
```javascript
/**
 * Render link tag for processed asset.
 *
 * @param {Array} collection - Collection of processed assets
 * @param {string} key - Asset key/filename to reference
 * @param {Object} attributes - HTML attributes for the link tag
 * @returns {string} HTML link tag or empty string if not found
 */
const assetLink = function(collection, key, attributes = {}) {
  // ...
}
```

## Acceptance Criteria
- [ ] Standardize console logging (error vs log vs warn)
- [ ] Extract duplicated collection filter logic to helper function
- [ ] Fix indentation inconsistencies
- [ ] Add comprehensive JSDoc comments to all exported functions
- [ ] Update tests if needed for refactored code
- [ ] Ensure no breaking changes

## Priority
Medium - Improves maintainability but doesn't affect functionality
