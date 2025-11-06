/**
 * CommonJS wrapper for scriptLink shortcode.
 */

module.exports = (async () => {
  const { default: scriptLink } = await import('./scriptLink.js');
  return scriptLink;
})();
