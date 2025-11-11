/**
 * Template asset pipeline 11ty plugin.
 */

// Shortcodes.
import ProcessAssets from './src/ProcessAssets.js';
import assetLink from './src/shortcodes/assetLink.js';
import scriptLink from './src/shortcodes/scriptLink.js';

// Default options.
const defaultOptions = {
  styles: {
    enabled: false,
    inExtension: 'css',
    inDirectory: './_assets/css',
    outExtension: 'css',
    outDirectory: '_assets/css',
    collection: '_styles',
    production: false,
  },
  scripts: {
    enabled: false,
    inExtension: 'js',
    inDirectory: './_assets/js',
    outExtension: 'js',
    outDirectory: '_assets/js',
    collection: '_scripts',
    production: false,
  }
};

async function eleventyTemplateAssetPipeline(eleventyConfig, pluginOptions = {}) {
  // Validate eleventyConfig parameter
  if (!eleventyConfig || typeof eleventyConfig !== 'object') {
    throw new TypeError(
      'eleventyTemplateAssetPipeline requires eleventyConfig as the first parameter. ' +
      'This is typically provided automatically by Eleventy when you use eleventyConfig.addPlugin().'
    );
  }

  // Validate pluginOptions parameter
  if (pluginOptions !== null && typeof pluginOptions !== 'object') {
    throw new TypeError(
      `Plugin options must be an object, received ${typeof pluginOptions}. ` +
      'Example: eleventyConfig.addPlugin(assetPipeline, { styles: { enabled: true, ... } })'
    );
  }

  const options = Object.assign({}, defaultOptions, pluginOptions);

  // Validate options structure for styles if provided
  if (pluginOptions.styles && typeof pluginOptions.styles !== 'object') {
    throw new TypeError(
      `options.styles must be an object, received ${typeof pluginOptions.styles}`
    );
  }

  // Validate options structure for scripts if provided
  if (pluginOptions.scripts && typeof pluginOptions.scripts !== 'object') {
    throw new TypeError(
      `options.scripts must be an object, received ${typeof pluginOptions.scripts}`
    );
  }

  // Shortcodes.
  eleventyConfig.addShortcode('assetLink', assetLink);
  eleventyConfig.addShortcode('scriptLink', scriptLink);

  // Virtual templates.
  if (options.styles.enabled) {
    try {
      eleventyConfig.addTemplate('styles.11ty.js', new ProcessAssets(options.styles));
      eleventyConfig.addCollection(options.styles.collection, function (collectionsApi) {
        return collectionsApi.getAll().filter(function (item) {
          return 'asset' in item.data && item.data.asset.includes(options.styles.collection);
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to initialize styles processing: ${error.message}. ` +
        'Check your styles configuration in the plugin options.'
      );
    }
  }
  if (options.scripts.enabled) {
    try {
      eleventyConfig.addTemplate('scripts.11ty.js', new ProcessAssets(options.scripts));
      eleventyConfig.addCollection(options.scripts.collection, function (collectionsApi) {
        return collectionsApi.getAll().filter(function (item) {
          return 'asset' in item.data && item.data.asset.includes(options.scripts.collection);
        });
      });
    } catch (error) {
      throw new Error(
        `Failed to initialize scripts processing: ${error.message}. ` +
        'Check your scripts configuration in the plugin options.'
      );
    }
  }
}

export default eleventyTemplateAssetPipeline;
