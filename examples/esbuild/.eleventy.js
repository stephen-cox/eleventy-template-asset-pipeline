import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";

export default function (eleventyConfig) {
	// Add the asset pipeline plugin without configuration
	// The _scripts.11ty.js template will handle JavaScript processing
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline);

	return {
		dir: {
			input: ".",
			output: "_site",
			includes: "_includes",
		},
	};
}
