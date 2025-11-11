/**
 * Render link to processed asset.
 *
 * @param {array} collection - The collection of assets.
 * @param {string} key - The asset key to look up.
 * @param {object} attributes - Optional HTML attributes for the link tag.
 * @param {object} options - Optional configuration.
 * @param {boolean} options.throwOnMissing - Whether to throw an error if asset is not found (default: false).
 * @returns {string} The link tag HTML or empty string if not found.
 * @throws {TypeError} If parameters are invalid.
 * @throws {Error} If asset is not found and throwOnMissing is true.
 */
const assetLink = function(collection, key, attributes = {}, options = {}) {
  // Support legacy 3-argument call where 3rd arg might have throwOnMissing
  if (attributes && typeof attributes === 'object' && 'throwOnMissing' in attributes && Object.keys(attributes).length === 1) {
    options = attributes;
    attributes = {};
  }

  // Validate collection parameter
  if (collection === undefined || collection === null) {
    const errorMsg =
      'assetLink requires a collection as the first parameter. ' +
      'Usage: assetLink(collections._styles, "main.css"). ' +
      'Make sure the collection is defined in your template.';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[assetLink Error] ${errorMsg}`);
    return '';
  }

  // Validate that collection is iterable
  if (!Array.isArray(collection) && typeof collection[Symbol.iterator] !== 'function') {
    const errorMsg =
      `assetLink collection must be an array or iterable, received ${typeof collection}. ` +
      'Pass a collection from Eleventy: assetLink(collections._styles, "main.css")';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[assetLink Error] ${errorMsg}`);
    return '';
  }

  // Validate key parameter
  if (typeof key !== 'string') {
    const errorMsg =
      `assetLink key must be a string, received ${typeof key}. ` +
      'Example: assetLink(collections._styles, "main.css")';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[assetLink Error] ${errorMsg}`);
    return '';
  }

  if (key.trim() === '') {
    const errorMsg =
      'assetLink key cannot be empty. ' +
      'Provide the filename of the asset: assetLink(collections._styles, "main.css")';

    if (options.throwOnMissing) {
      throw new Error(errorMsg);
    }
    console.error(`[assetLink Error] ${errorMsg}`);
    return '';
  }

  // Validate attributes parameter
  if (attributes !== null && typeof attributes !== 'object') {
    const errorMsg =
      `assetLink attributes must be an object, received ${typeof attributes}. ` +
      'Example: assetLink(collections._styles, "main.css", { media: "print" })';

    if (options.throwOnMissing) {
      throw new TypeError(errorMsg);
    }
    console.error(`[assetLink Error] ${errorMsg}`);
    return '';
  }

  // Set default rel attribute if not provided
  if (!('rel' in attributes)) {
    attributes.rel = 'stylesheet';
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
        console.error(`[assetLink Error] ${errorMsg}`);
        return '';
      }

      // Add integrity and crossorigin if available
      if ('integrity' in item.data && item.data.integrity != undefined) {
        attributes.integrity = item.data.integrity;
        attributes.crossorigin = "anonymous";
      }

      // Build attribute string
      let attributeString = '';
      for (let attribute in attributes) {
        attributeString += `${attribute}="${attributes[attribute]}" `;
      }

      return `<link href="${item.url}" ${attributeString}/>`;
    }
  }

  // Asset not found
  const errorMsg =
    `Asset "${key}" not found in collection. ` +
    'Available keys: ' +
    Array.from(collection)
      .filter(item => item?.data?.key)
      .map(item => item.data.key)
      .join(', ') || '(none)';

  if (options.throwOnMissing) {
    throw new Error(errorMsg);
  }
  console.warn(`[assetLink Warning] ${errorMsg}`);
  return '';
}

export default assetLink;
