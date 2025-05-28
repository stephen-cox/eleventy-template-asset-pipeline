/**
 * Template asset pipeline 11ty plugin.
 */

// Shortcodes.
const ProcessAssets = require('./src/ProcessAssets');
const assetLink = require('./src/shortcodes/assetLink');
const scriptLink = require('./src/shortcodes/scriptLink');

// Virtual templates.
const ProcessScripts = require('./src/templates/ProcessScripts');
const ProcessStyles = require('./src/templates/ProcessStyles');

// Default options.
const defaultOptions = {
  styles: {
    enabled: false,
    class: 'ProcessAssets',
    inExtension: 'css',
    inDirectory: './_assets/css',
    outExtension: 'css',
    outDirectory: '_assets/css',
    collection: '_styles',
    production: false,
  },
  scripts: {
    enabled: false,
    class: 'ProcessAssets',
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
    eleventyConfig.addTemplate('styles.11ty.js', eval('new ' + options.styles.class + '(options.styles)'));
    eleventyConfig.addCollection(options.styles.collection, function (collectionsApi) {
      return collectionsApi.getAll().filter(function (item) {
			  return 'asset' in item.data && item.data.asset.includes(options.styles.collection);
		  });
    });
  }
  if (options.scripts.enabled) {
    eleventyConfig.addTemplate('scripts.11ty.js', eval('new ' + options.scripts.class + '(options.scripts)'));
    eleventyConfig.addCollection(options.scripts.collection, function (collectionsApi) {
      return collectionsApi.getAll().filter(function (item) {
			  return 'asset' in item.data && item.data.asset.includes(options.scripts.collection);
		  });
    });
  }
}

module.exports = eleventyTemplateAssetPipeline;
