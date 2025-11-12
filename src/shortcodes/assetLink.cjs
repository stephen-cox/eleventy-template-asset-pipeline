/**
 * CommonJS wrapper for assetLink shortcode.
 */

module.exports = (async () => {
	const { default: assetLink } = await import("./assetLink.js");
	return assetLink;
})();
