import path from "path";
import * as sass from "sass";
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";

/**
 * Process SCSS files using Sass.
 *
 * @param {string} file - Path to the SCSS file
 * @param {boolean} production - Whether this is a production build
 * @returns {Promise<string>} Compiled CSS content
 */
async function processFile(file, production) {
	const result = sass.compile(file, {
		style: production ? "compressed" : "expanded",
		loadPaths: [path.dirname(file)],
	});

	return result.css;
}

export default function (eleventyConfig) {
	// Add the asset pipeline plugin
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
		styles: {
			enabled: true,
			collection: "_styles",
			inExtension: "scss",
			inDirectory: "_assets/scss",
			outExtension: "css",
			outDirectory: "_assets/css",
			processFile: processFile,
			production: process.env.ELEVENTY_ENV === "production",
		},
	});

	return {
		dir: {
			input: ".",
			output: "_site",
			includes: "_includes",
		},
	};
}
