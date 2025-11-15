/**
 * Process JavaScript files using Webpack and Babel.
 */

import fs from "fs";
import path from "path";
import webpack from "webpack";
import { fs as mfs } from "memfs";
import ProcessAssets from "@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets";

/**
 * Process JS files with Webpack.
 *
 * @param {string} file - Path to the JavaScript file
 * @returns {Promise<string>} Bundled JavaScript content
 */
async function processFile(file) {
	const production = process.env.ELEVENTY_ENV === "production";

	// Setup Webpack configuration
	const webpackConfig = {
		mode: production ? "production" : "development",
		entry: file,
		output: {
			filename: path.basename(file),
			path: path.resolve("/"),
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env"],
						},
					},
				},
			],
		},
		optimization: {
			minimize: production,
		},
	};

	// Create Webpack compiler with memory filesystem
	const compiler = webpack(webpackConfig);
	compiler.outputFileSystem = mfs;
	compiler.inputFileSystem = fs;
	compiler.intermediateFileSystem = mfs;

	// Compile and return result
	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				reject(err);
				return;
			}

			if (stats.hasErrors()) {
				const errors = stats.compilation ? stats.compilation.errors : [];
				reject(new Error(`Webpack compilation errors: ${errors.join("\n")}`));
				return;
			}

			// Read compiled file from memory filesystem
			const outputPath = webpackConfig.output.path + "/" + webpackConfig.output.filename;
			mfs.readFile(outputPath, "utf8", (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	});
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
