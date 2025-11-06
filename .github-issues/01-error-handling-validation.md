# Add comprehensive error handling and input validation

**Labels:** `enhancement`, `priority:high`

## Overview
The plugin currently lacks robust error handling and input validation, which can lead to cryptic failures or unexpected behavior when users misconfigure the plugin or when file operations fail.

## Problems to Address

### 1. Missing Error Handling
- No try-catch blocks around `processFile()` calls in `ProcessAssets.js`
- File system errors (missing directories, permission issues) fail silently or with unclear errors
- No graceful handling when asset processing tools (PostCSS, Webpack, etc.) fail

### 2. No Input Validation
- Missing validation for required config parameters
- No type checking for `processFile` (should be a function)
- No path sanitization (potential security concern)
- No validation that directories exist before attempting to process

### 3. Silent Failures in Shortcodes
- Both `assetLink` and `scriptLink` return empty strings on error
- Only logs to console but doesn't warn user clearly during build
- Missing assets might not be noticed until runtime

## Proposed Solutions

### Error Handling
```javascript
async processDirectory() {
  let files = [];

  try {
    for (const file of await glob(`${this.inDirectory}/*.${this.inExtension}`)) {
      if (file.endsWith('.11ty.js')) continue;

      try {
        const content = await this.processFile(file, this.production);
        // ... rest of processing
      } catch (error) {
        console.error(`Failed to process file ${file}:`, error);
        throw new Error(`Asset processing failed for ${file}: ${error.message}`);
      }
    }
  } catch (error) {
    throw new Error(`Failed to process directory ${this.inDirectory}: ${error.message}`);
  }

  return files;
}
```

### Input Validation
```javascript
constructor(config) {
  // Validate required parameters
  if (!config.inDirectory) {
    throw new Error('ProcessAssets: inDirectory is required');
  }
  if (!config.processFile || typeof config.processFile !== 'function') {
    throw new Error('ProcessAssets: processFile must be a function');
  }

  // Validate paths don't contain suspicious patterns
  const suspiciousPattern = /\.\./;
  if (suspiciousPattern.test(config.inDirectory)) {
    throw new Error('ProcessAssets: Directory paths cannot contain ".."');
  }

  // ... rest of constructor
}
```

### Better Shortcode Errors
```javascript
if (collection === undefined) {
  throw new Error('Asset link shortcode: collection is undefined. Did you pass the collection to the template?');
}

// After loop when key not found
throw new Error(`Asset key '${key}' not found in collection. Available keys: ${collection.map(i => i.data.key).join(', ')}`);
```

## Acceptance Criteria
- [ ] Add try-catch blocks around all async file operations
- [ ] Validate all required config parameters in constructors
- [ ] Type-check function parameters (e.g., processFile must be a function)
- [ ] Sanitize file paths to prevent directory traversal
- [ ] Shortcodes throw helpful errors instead of returning empty strings
- [ ] Error messages include context and suggestions for fixing
- [ ] Add tests for error conditions
- [ ] Update documentation with error handling examples

## Priority
High - This affects reliability and developer experience significantly
