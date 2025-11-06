# Enhanced shortcode flexibility

**Labels:** `enhancement`, `feature`, `priority:medium`

## Overview
Currently `assetLink` accepts custom attributes while `scriptLink` does not. Making `scriptLink` more flexible would improve the developer experience and enable more use cases.

## Current Limitations

### scriptLink is inflexible
**File:** `src/shortcodes/scriptLink.js`

```javascript
// Current implementation hardcodes 'defer'
return `<script src="${item.url}" defer></script>`;
```

**Use cases that aren't supported:**
- `type="module"` for ES modules
- `async` instead of `defer`
- `nomodule` for legacy fallback scripts
- Custom data attributes
- `crossorigin` without integrity
- Multiple custom attributes

### Inconsistent API
- `assetLink(collection, key, attributes)` - accepts attributes object
- `scriptLink(collection, key)` - no attributes parameter

## Proposed Solution

### Make scriptLink accept attributes object
```javascript
/**
 * Render script tag for processed asset.
 *
 * @param {Array} collection - Collection of processed assets
 * @param {string} key - Asset key/filename to reference
 * @param {Object} attributes - HTML attributes for the script tag
 * @returns {string} HTML script tag or empty string if not found
 */
const scriptLink = function(collection, key, attributes = {}) {

  if (collection === undefined) {
    console.error('Script link collection not found.');
    return '';
  }

  // Apply default 'defer' if no loading attribute specified
  if (!('defer' in attributes) && !('async' in attributes)) {
    attributes.defer = true;
  }

  for (let item of collection) {
    if (item.data.key === key) {

      // Add integrity if available
      if ('integrity' in item.data && item.data.integrity != undefined) {
        attributes.integrity = item.data.integrity;
        attributes.crossorigin = attributes.crossorigin || "anonymous";
      }

      // Build attribute string
      let attributeString = '';
      for (let attribute in attributes) {
        if (attributes[attribute] === true) {
          // Boolean attributes (defer, async, nomodule)
          attributeString += `${attribute} `;
        } else {
          attributeString += `${attribute}="${attributes[attribute]}" `;
        }
      }

      return `<script src="${item.url}" ${attributeString}></script>`;
    }
  }

  console.error(`Asset key '${key}' not found in collection.`);
  return '';
}
```

## Usage Examples

### ES Module with type="module"
```javascript
{% scriptLink collections._scripts, 'app.js', { type: 'module' } %}
// Output: <script src="/_assets/js/app-HASH.js" type="module" integrity="sha512-..." crossorigin="anonymous"></script>
```

### Async loading instead of defer
```javascript
{% scriptLink collections._scripts, 'analytics.js', { async: true } %}
// Output: <script src="/_assets/js/analytics.js" async></script>
```

### Legacy fallback with nomodule
```javascript
{% scriptLink collections._scripts, 'legacy.js', { nomodule: true, defer: true } %}
// Output: <script src="/_assets/js/legacy.js" nomodule defer></script>
```

### Custom data attributes
```javascript
{% scriptLink collections._scripts, 'widget.js', { 'data-config': 'production', defer: true } %}
// Output: <script src="/_assets/js/widget.js" data-config="production" defer></script>
```

## Backward Compatibility

The change is backward compatible:
```javascript
// Old usage (still works, defaults to defer)
{% scriptLink collections._scripts, 'app.js' %}

// New usage (explicitly control attributes)
{% scriptLink collections._scripts, 'app.js', { async: true } %}
```

## Additional Considerations

### Also improve assetLink for boolean attributes
Currently `assetLink` doesn't handle boolean attributes well. Consider:
```javascript
// For <link rel="preload" as="script">
if (attributes[attribute] === true) {
  attributeString += `${attribute} `;
} else {
  attributeString += `${attribute}="${attributes[attribute]}" `;
}
```

## Acceptance Criteria
- [ ] Add optional `attributes` parameter to `scriptLink`
- [ ] Default to `defer` if no loading attribute specified
- [ ] Handle boolean attributes (defer, async, nomodule) correctly
- [ ] Update `assetLink` to handle boolean attributes
- [ ] Ensure backward compatibility (no breaking changes)
- [ ] Add tests for new attribute handling
- [ ] Update README with new usage examples
- [ ] Add JSDoc comments for new parameter

## Priority
Medium - Useful feature but current functionality works for most use cases
