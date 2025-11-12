/**
 * Options for scriptLink shortcode.
 */
export interface ScriptLinkOptions {
	/**
	 * Whether to throw an error if the script asset is not found.
	 * If false, logs a warning and returns an empty string.
	 * @default false
	 */
	throwOnMissing?: boolean;
}

/**
 * Eleventy collection item structure for script assets.
 */
export interface ScriptCollectionItem {
	/**
	 * The URL of the processed script asset.
	 */
	url: string;

	/**
	 * Data associated with the script asset.
	 */
	data: {
		/**
		 * The script asset key (original filename).
		 */
		key: string;

		/**
		 * Subresource integrity hash (only in production builds).
		 */
		integrity?: string;
	};
}

/**
 * Render a script tag to a processed script asset.
 *
 * @param collection - The Eleventy collection of script assets (e.g., collections._scripts)
 * @param key - The script asset key to look up (original filename)
 * @param options - Optional configuration
 * @returns The script tag HTML or empty string if not found
 * @throws {TypeError} If parameters are invalid
 * @throws {Error} If script asset is not found and throwOnMissing is true
 *
 * @example
 * ```js
 * // Basic usage
 * scriptLink(collections._scripts, "app.js")
 * // Returns: <script src="/assets/js/app.js" defer></script>
 *
 * // Production build with integrity (automatic)
 * scriptLink(collections._scripts, "app.js")
 * // Returns: <script src="/assets/js/app-ABC123.js" integrity="sha512-..." crossorigin="anonymous" defer></script>
 *
 * // With error throwing
 * scriptLink(collections._scripts, "missing.js", { throwOnMissing: true })
 * // Throws: Error: Script asset "missing.js" not found in collection
 * ```
 */
declare function scriptLink(
	collection: Iterable<ScriptCollectionItem>,
	key: string,
	options?: ScriptLinkOptions,
): string;

export default scriptLink;
