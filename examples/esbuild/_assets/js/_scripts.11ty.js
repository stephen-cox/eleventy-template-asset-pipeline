/**
 * Process JavaScript files using esbuild.
 */

import esbuild from "esbuild";
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

/**
 * Process JS files with esbuild.
 *
 * @param {string} file - Path to the JavaScript file
 * @returns {Promise<string>} Bundled JavaScript content
 */
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV === "production";

	try {
		const result = await esbuild.build({
			entryPoints: [file],
			bundle: true,
			minify: production,
			format: "esm",
			target: ["es2020"],
			platform: "browser",
			write: false,
			sourcemap: production ? false : "inline",
			treeShaking: true,
		});

		// Return the bundled code
		return result.outputFiles[0].text;
	} catch (error) {
		console.error(`esbuild error for ${file}:`, error);
		throw error;
	}
}

export default new ProcessAssets({
	inExtension: "js",
	inDirectory: import.meta.dirname,
	outExtension: "js",
	outDirectory: "_assets/js",
	collection: "_scripts",
	processFile: processFile,
	production: process.env.ELEVENTY_ENV === "production" || process.env.ELEVENTY_ENV === "stage",
});
