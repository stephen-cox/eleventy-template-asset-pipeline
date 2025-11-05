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

  const options = Object.assign({}, defaultOptions, pluginOptions);

  // Shortcodes.
  eleventyConfig.addShortcode('assetLink', assetLink);
  eleventyConfig.addShortcode('scriptLink', scriptLink);

  // Virtual templates.
  if (options.styles.enabled) {
    eleventyConfig.addTemplate('styles.11ty.js', new ProcessAssets(options.styles));
    eleventyConfig.addCollection(options.styles.collection, function (collectionsApi) {
      return collectionsApi.getAll().filter(function (item) {
			  return 'asset' in item.data && item.data.asset.includes(options.styles.collection);
		  });
    });
  }
  if (options.scripts.enabled) {
    eleventyConfig.addTemplate('scripts.11ty.js', new ProcessAssets(options.scripts));
    eleventyConfig.addCollection(options.scripts.collection, function (collectionsApi) {
      return collectionsApi.getAll().filter(function (item) {
			  return 'asset' in item.data && item.data.asset.includes(options.scripts.collection);
		  });
    });
  }
}

export default eleventyTemplateAssetPipeline;
