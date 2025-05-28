/**
 * Process JS files.
 */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { fs: mfs } = require('memfs');
const ProcessAssets = require('../ProcessAssets');


/**
 * ProcessScripts class.
 */
class ProcessScripts extends ProcessAssets {

  /**
   * Process JS files.
   */
  async processFile(file) {
    const production = process.env.ELEVENTY_ENV;

    // Setup webpack.
    const webpackConfig = {
      mode: production ? 'production' : 'development',
      entry: './' + file,
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
          console.error(errors.join('\n'));
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

}

module.exports = ProcessScripts;
