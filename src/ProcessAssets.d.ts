/**
 * Configuration object for ProcessAssets class.
 */
export interface ProcessAssetsConfig {
	/**
	 * Collection name to add all processed files to.
	 * @default "_assets"
	 */
	collection?: string;

	/**
	 * Directory or directories to process. Can be a single path or an array of paths.
	 */
	inDirectory: string | string[];

	/**
	 * File extension to process (without the dot).
	 * @example "css", "js"
	 */
	inExtension: string;

	/**
	 * Directory to write processed files to.
	 */
	outDirectory: string;

	/**
	 * File extension for output files (without the dot).
	 * @example "css", "js"
	 */
	outExtension: string;

	/**
	 * Whether this is a production build. When enabled, adds content hashing for cache busting.
	 * @default false
	 */
	production?: boolean;

	/**
	 * Function to process each file. Should return the processed file content.
	 * @param filePath - Path to the file being processed
	 * @param isProduction - Whether this is a production build
	 * @returns The processed file content
	 */
	processFile?: (filePath: string, isProduction: boolean) => Promise<string | Buffer>;
}

/**
 * Represents a processed asset file.
 */
export interface ProcessedAsset {
	/**
	 * The original filename used as an index/key.
	 */
	index: string;

	/**
	 * The source file path.
	 */
	source: string;

	/**
	 * The destination path where the file will be written.
	 */
	destination: string;

	/**
	 * The processed file content.
	 */
	content: string | Buffer;

	/**
	 * Subresource integrity hash (only in production builds).
	 */
	integrity?: string;
}

/**
 * ProcessAssets class for handling asset pipelines in Eleventy.
 */
export default class ProcessAssets {
	/**
	 * Collection name for the processed assets.
	 */
	collection: string;

	/**
	 * Array of input directories.
	 */
	inDirectory: string[];

	/**
	 * Input file extension.
	 */
	inExtension: string;

	/**
	 * Output directory.
	 */
	outDirectory: string;

	/**
	 * Output file extension.
	 */
	outExtension: string;

	/**
	 * Whether this is a production build.
	 */
	production: boolean;

	/**
	 * Function to process each file.
	 */
	processFile?: (filePath: string, isProduction: boolean) => Promise<string | Buffer>;

	/**
	 * Initialize a new ProcessAssets instance.
	 * @param config - Configuration object
	 */
	constructor(config: ProcessAssetsConfig);

	/**
	 * Returns the frontmatter data for the Eleventy template.
	 * This includes pagination configuration and processed asset data.
	 */
	data(): Promise<{
		eleventyComputed: {
			key: (data: { item: ProcessedAsset }) => string;
			integrity: (data: { item: ProcessedAsset }) => string | undefined;
		};
		permalink: (data: { item: ProcessedAsset }) => string;
		pagination: {
			addAllPagesToCollections: boolean;
			alias: string;
			data: string;
			size: number;
		};
		layout: string;
		tags: string[];
		asset: string[];
		data: ProcessedAsset[];
	}>;

	/**
	 * Process all files in the configured directories.
	 * @returns Array of processed assets
	 */
	processDirectory(): Promise<ProcessedAsset[]>;

	/**
	 * Render a single asset item.
	 * @param data - Data object containing the item to render
	 * @returns The rendered content
	 */
	render(data: { item: ProcessedAsset }): Promise<string | Buffer>;
}
