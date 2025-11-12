import fs from "fs/promises";
import postcss from "postcss";
import eleventyTemplateAssetPipeline from "@src-dev/eleventy-template-asset-pipeline";

/**
 * Process CSS files using PostCSS.
 *
 * @param {string} file - Path to the CSS file
 * @param {boolean} production - Whether this is a production build
 * @returns {Promise<string>} Processed CSS content
 */
async function processFile(file, production) {
	const css = await fs.readFile(file, "utf-8");

	if (production) {
		// Production build: full optimization
		return await postcss([
			require("postcss-import"),
			require("autoprefixer"),
			require("postcss-custom-media"),
			require("cssnano")({
				preset: "default",
			}),
		])
			.process(css, { from: file })
			.then((result) => result.css);
	} else {
		// Development build: minimal processing for faster builds
		return await postcss([require("postcss-import"), require("autoprefixer")])
			.process(css, { from: file })
			.then((result) => result.css);
	}
}

export default function (eleventyConfig) {
	// Add the asset pipeline plugin
	eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
		styles: {
			enabled: true,
			collection: "_styles",
			inExtension: "css",
			inDirectory: "_assets/css",
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
