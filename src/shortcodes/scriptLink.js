/**
 * Render script to processed asset.
 *
 * @param {array} collection - The collection of script assets.
 * @param {string} key - The asset key to look up.
 * @param {object} options - Optional configuration.
 * @param {boolean} options.throwOnMissing - Whether to throw an error if asset is not found (default: false).
 * @returns {string} The script tag HTML or empty string if not found.
 * @throws {TypeError} If parameters are invalid.
 * @throws {Error} If asset is not found and throwOnMissing is true.
 */
const scriptLink = function(collection, key, options = {}) {
  // Validate collection parameter
  if (collection === undefined || collection === null) {
    const errorMsg =
      'scriptLink requires a collection as the first parameter. ' +
      'Usage: scriptLink(collections._scripts, "app.js"). ' +
      'Make sure the collection is defined in your template.';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[scriptLink Error] ${errorMsg}`);
    return '';
  }

  // Validate that collection is iterable
  if (!Array.isArray(collection) && typeof collection[Symbol.iterator] !== 'function') {
    const errorMsg =
      `scriptLink collection must be an array or iterable, received ${typeof collection}. ` +
      'Pass a collection from Eleventy: scriptLink(collections._scripts, "app.js")';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[scriptLink Error] ${errorMsg}`);
    return '';
  }

  // Validate key parameter
  if (typeof key !== 'string') {
    const errorMsg =
      `scriptLink key must be a string, received ${typeof key}. ` +
      'Example: scriptLink(collections._scripts, "app.js")';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[scriptLink Error] ${errorMsg}`);
    return '';
  }

  if (key.trim() === '') {
    const errorMsg =
      'scriptLink key cannot be empty. ' +
      'Provide the filename of the script: scriptLink(collections._scripts, "app.js")';

    if (options.throwOnMissing) {
      throw new Error(errorMsg);
    }
    console.error(`[scriptLink Error] ${errorMsg}`);
    return '';
  }

  // Search for the asset in the collection
  for (let item of collection) {
    // Validate item structure
    if (!item || typeof item !== 'object') {
      continue;
    }

    if (!item.data || typeof item.data !== 'object') {
      continue;
    }

    if (item.data.key === key) {
      // Validate that item has a URL
      if (!item.url || typeof item.url !== 'string') {
        const errorMsg =
          `Asset "${key}" found but has no valid URL. ` +
          'This may indicate a problem with asset processing.';

        if (options.throwOnMissing) {
          throw new Error(errorMsg);
        }
        console.error(`[scriptLink Error] ${errorMsg}`);
        return '';
      }

      // Build script tag with integrity if available
      if ('integrity' in item.data && item.data.integrity != undefined) {
        return `<script src="${item.url}" integrity="${item.data.integrity}" crossorigin="anonymous" defer></script>`;
      }
      else {
        return `<script src="${item.url}" defer></script>`;
      }
    }
  }

  // Asset not found
  const errorMsg =
    `Script asset "${key}" not found in collection. ` +
    'Available keys: ' +
    Array.from(collection)
      .filter(item => item?.data?.key)
      .map(item => item.data.key)
      .join(', ') || '(none)';

  if (options.throwOnMissing) {
    throw new Error(errorMsg);
  }
  console.warn(`[scriptLink Warning] ${errorMsg}`);
  return '';
}

export default scriptLink;
