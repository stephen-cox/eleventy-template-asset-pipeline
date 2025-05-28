/**
 * Render link to processed asset.
 */
const assetLink = function(collection, key, attributes = {}) {

  if (collection === undefined) {
    console.error('Asset link collection not found.');
    return '';
  }

  if (!('rel' in attributes)) {
    attributes.rel = 'stylesheet';
  }

  for (let item of collection) {
    if (item.data.key === key) {

      if ('integrity' in item.data && item.data.integrity != undefined) {
        attributes.integrity = item.data.integrity;
        attributes.crossorigin = "anonymous";
      }

      let attributeString = '';
      for (let attribute in attributes) {
        attributeString += `${attribute}="${attributes[attribute]}" `;
      }

      return `<link href="${item.url}" ${attributeString}/>`;
    }
  }

  console.log(`Asset key '${key}' not found in collection.`)
  return '';
}

module.exports = assetLink;
