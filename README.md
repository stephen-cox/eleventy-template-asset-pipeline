# Eleventy Template asset pipeline plugin

Eleventy plugin to provide asset pipelines as part of the 11ty build process.

This plugin uses [JavaScript templates](https://www.11ty.dev/docs/languages/javascript/) to run an asset pipeline that can be used to process things like CSS and SASS as well as JavaScript and other static assets.

There are two ways to use this, either creating a JS template that loads and configures the ProcessAssets class or take advantage of the styles and scripts [Virtual Templates](https://www.11ty.dev/docs/virtual-templates/) provided by this plugin. In both cases it's necessary to provide an async function that takes the path to a file and returns a Promise with the compiled assets. This allows the use of tools such as PostCSS, Sass and Webpack as part of an Eleventy build without having to use a separate task runner such as Gulp.

## Using the virtual templates

To use the virtual templates, define the processFile function and then pass this with the necessary configuration when initialising the plugin.

For example to process styles using PostCSS, define the processFile function.

```js
/**
 * Process CSS files using PostCSS.
 */
const processFilePostCss = async function(file, production) {
  const css = await fs.readFileSync(file);

  // Production build.
  if (production) {
    return await postcss([
        require('postcss-import'),
        require('autoprefixer'),
        require('postcss-custom-media'),
        require('cssnano')({
            preset: 'default',
        }),
      ]).process(css, { from: file })
      .then(result => result.css);
  }

  // Development build.
  else {
    return await postcss([
        require('postcss-import'),
        require('autoprefixer'),
      ]).process(css, { from: file })
      .then(result => result.css);
  }
}
```

Then configure the plugin to use this plugin to process CSS files in a directory. Using the postcss-import plugin gives the ability to process a single file that loads all your CSS files in subdirectories.

```js
const eleventyTemplateAssetPipeline = require('@src-dev/eleventy-template-asset-pipeline');

eleventyConfig.addPlugin(eleventyTemplateAssetPipeline, {
  styles: {
    enabled: true,
    collection: '_styles',
    inExtension: 'css',
    inDirectory: '_assets/css',
    outExtension: 'css',
    outDirectory: '_assets/css',
    processFile: processFilePostCss,
    production: process.env.ELEVENTY_ENV === 'production',
  }
});
```

## Subclassing ProcessAssets

It's possible to create the JavaScript templates directly, rather than relying on the virtual templates. To do this initialise the plugin in the 11ty config file with no extra settings.

```js
const eleventyTemplateAssetPipeline = require('@src-dev/eleventy-template-asset-pipeline');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(eleventyTemplateAssetPipeline);
}
```

Then in the directory containing files to process (e.g. your CSS or JavaScript files) create an 11ty JavaScript template that exports an instance of the ProcessAssets class with the `processFile` method defined.

To process JavaScript files using Webpack, you would create a `_scripts.11ty.js` file in the root of you scripts directory that looked like:

```js
/**
 * Process JavaScript files using the ProcessAssets class.
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { fs: mfs } = require('memfs');
const ProcessAssets = require('@src-dev/eleventy-template-asset-pipeline/src/ProcessAssets');


/**
 * Process JS files.
 */
async function processFile(file) {
  const production = process.env.ELEVENTY_ENV;

  // Setup Webpack.
  const webpackConfig = {
    mode: production ? 'production' : 'development',
    entry: file,
    output: {
      filename: path.basename(file),
      path: path.resolve('/'),
    },
  };
  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = mfs;
  compiler.inputFileSystem = fs;
  compiler.intermediateFileSystem = mfs;

  // Compile file.
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        const errors = err || (stats.compilation ? stats.compilation.errors : null);
        reject(errors);
        return;
      }

      mfs.readFile(webpackConfig.output.path + '/' + webpackConfig.output.filename, 'utf8', (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  });
}

module.exports = new ProcessAssets({
  inExtension: 'js',
  inDirectory: __dirname,
  outExtension: 'js',
  outDirectory: '_assets/js',
  collection: '_scripts',
  processFile: processFile,
  production: process.env.ELEVENTY_ENV === 'production' || process.env.ELEVENTY_ENV === 'stage',
});
```
