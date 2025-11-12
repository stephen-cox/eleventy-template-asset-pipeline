/**
 * HTML attributes for the link tag.
 */
export interface LinkAttributes {
	/**
	 * The rel attribute for the link tag.
	 * @default "stylesheet"
	 */
	rel?: string;

	/**
	 * The media attribute for the link tag.
	 */
	media?: string;

	/**
	 * Subresource integrity hash (automatically added for production builds).
	 */
	integrity?: string;

	/**
	 * CORS setting (automatically added for production builds with integrity).
	 */
	crossorigin?: string;

	/**
	 * Any other HTML attributes for the link tag.
	 */
	[key: string]: string | undefined;
}

/**
 * Options for assetLink shortcode.
 */
export interface AssetLinkOptions {
	/**
	 * Whether to throw an error if the asset is not found.
	 * If false, logs a warning and returns an empty string.
	 * @default false
	 */
	throwOnMissing?: boolean;
}

/**
 * Eleventy collection item structure for assets.
 */
export interface AssetCollectionItem {
	/**
	 * The URL of the processed asset.
	 */
	url: string;

	/**
	 * Data associated with the asset.
	 */
	data: {
		/**
		 * The asset key (original filename).
		 */
		key: string;

		/**
		 * Subresource integrity hash (only in production builds).
		 */
		integrity?: string;
	};
}

/**
 * Render a link tag to a processed asset.
 *
 * @param collection - The Eleventy collection of assets (e.g., collections._styles)
 * @param key - The asset key to look up (original filename)
 * @param attributes - Optional HTML attributes for the link tag
 * @param options - Optional configuration
 * @returns The link tag HTML or empty string if not found
 * @throws {TypeError} If parameters are invalid
 * @throws {Error} If asset is not found and throwOnMissing is true
 *
 * @example
 * ```js
 * // Basic usage
 * assetLink(collections._styles, "main.css")
 * // Returns: <link href="/assets/css/main.css" rel="stylesheet" />
 *
 * // With custom attributes
 * assetLink(collections._styles, "print.css", { media: "print" })
 * // Returns: <link href="/assets/css/print.css" rel="stylesheet" media="print" />
 *
 * // With error throwing
 * assetLink(collections._styles, "missing.css", {}, { throwOnMissing: true })
 * // Throws: Error: Asset "missing.css" not found in collection
 * ```
 */
declare function assetLink(
	collection: Iterable<AssetCollectionItem>,
	key: string,
	attributes?: LinkAttributes,
	options?: AssetLinkOptions,
): string;

export default assetLink;
