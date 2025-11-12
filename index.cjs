/**
 * CommonJS wrapper for the ESM module.
 * This allows the package to be used from both CommonJS and ESM environments.
 */

module.exports = async function eleventyTemplateAssetPipeline(eleventyConfig, pluginOptions = {}) {
	const { default: plugin } = await import("./index.js");
	return plugin(eleventyConfig, pluginOptions);
};
