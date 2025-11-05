/**
 * Render script to processed asset.
 */
const scriptLink = function(collection, key) {

  if (collection === undefined) {
    console.error('Script link collection not found.');
    return '';
  }

  for (let item of collection) {
    if (item.data.key === key) {
      if ('integrity' in item.data && item.data.integrity != undefined) {
        return `<script src="${item.url}" integrity="${item.data.integrity}" crossorigin="anonymous" defer></script>`;
      }
      else {
        return `<script src="${item.url}" defer></script>`;
      }
    }
  }

  console.log(`Asset key '${key}' not found in collection.`)
  return '';
}

export default scriptLink;
