/**
 * TypeScript definitions for @src-dev/eleventy-template-asset-pipeline
 * An Eleventy plugin to provide asset pipelines as part of the 11ty build process.
 */

import ProcessAssets, { ProcessAssetsConfig, ProcessedAsset } from "./src/ProcessAssets.js";
import assetLink, {
	LinkAttributes,
	AssetLinkOptions,
	AssetCollectionItem,
} from "./src/shortcodes/assetLink.js";
import scriptLink, {
	ScriptLinkOptions,
	ScriptCollectionItem,
} from "./src/shortcodes/scriptLink.js";

/**
 * Configuration for styles asset processing.
 */
export interface StylesConfig extends ProcessAssetsConfig {
	/**
	 * Whether styles processing is enabled.
	 * @default false
	 */
	enabled?: boolean;
}

/**
 * Configuration for scripts asset processing.
 */
export interface ScriptsConfig extends ProcessAssetsConfig {
	/**
	 * Whether scripts processing is enabled.
	 * @default false
	 */
	enabled?: boolean;
}

/**
 * Plugin options for eleventy-template-asset-pipeline.
 */
export interface PluginOptions {
	/**
	 * Configuration for CSS/styles processing.
	 */
	styles?: Partial<StylesConfig>;

	/**
	 * Configuration for JavaScript/scripts processing.
	 */
	scripts?: Partial<ScriptsConfig>;
}

/**
 * Eleventy configuration object interface.
 * Represents the eleventyConfig parameter passed to plugins.
 */
export interface EleventyConfig {
	/**
	 * Add a shortcode to Eleventy.
	 */
	addShortcode(name: string, fn: Function): void;

	/**
	 * Add a virtual template to Eleventy.
	 */
	addTemplate(name: string, template: any): void;

	/**
	 * Add a collection to Eleventy.
	 */
	addCollection(name: string, fn: Function): void;

	// Other Eleventy config methods can be added as needed
	[key: string]: any;
}

/**
 * Eleventy Template Asset Pipeline Plugin.
 *
 * Provides asset pipelines for styles and scripts as part of the Eleventy build process.
 * Supports custom processing functions, cache busting, and subresource integrity hashing.
 *
 * @param eleventyConfig - The Eleventy configuration object
 * @param pluginOptions - Plugin configuration options
 *
 * @example
 * ```js
 * // In your .eleventy.js or eleventy.config.js
 * import assetPipeline from "@src-dev/eleventy-template-asset-pipeline";
 * import { readFile } from "fs/promises";
 *
 * export default function(eleventyConfig) {
 *   eleventyConfig.addPlugin(assetPipeline, {
 *     styles: {
 *       enabled: true,
 *       inDirectory: "./_assets/css",
 *       outDirectory: "_site/assets/css",
 *       inExtension: "css",
 *       outExtension: "css",
 *       collection: "_styles",
 *       production: process.env.NODE_ENV === "production",
 *       processFile: async (filePath, isProduction) => {
 *         const content = await readFile(filePath, "utf8");
 *         // Process CSS here (minify, etc.)
 *         return content;
 *       }
 *     },
 *     scripts: {
 *       enabled: true,
 *       inDirectory: "./_assets/js",
 *       outDirectory: "_site/assets/js",
 *       inExtension: "js",
 *       outExtension: "js",
 *       collection: "_scripts",
 *       production: process.env.NODE_ENV === "production",
 *       processFile: async (filePath, isProduction) => {
 *         const content = await readFile(filePath, "utf8");
 *         // Process JS here (minify, bundle, etc.)
 *         return content;
 *       }
 *     }
 *   });
 * }
 * ```
 *
 * @example
 * ```njk
 * {# In your Nunjucks templates #}
 * {% assetLink collections._styles, "main.css" %}
 * {% scriptLink collections._scripts, "app.js" %}
 * ```
 */
declare function eleventyTemplateAssetPipeline(
	eleventyConfig: EleventyConfig,
	pluginOptions?: PluginOptions,
): Promise<void>;

export default eleventyTemplateAssetPipeline;

// Re-export types and classes for direct imports
export {
	ProcessAssets,
	ProcessAssetsConfig,
	ProcessedAsset,
	assetLink,
	LinkAttributes,
	AssetLinkOptions,
	AssetCollectionItem,
	scriptLink,
	ScriptLinkOptions,
	ScriptCollectionItem,
};
