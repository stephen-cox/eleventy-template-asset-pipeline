/**
 * Process CSS files.
 */

const fs = require('fs');
const postcss = require('postcss');
const atImport = require('postcss-import')
const ProcessAssets = require('../ProcessAssets');


/**
 * ProcessStyles class.
 */
class ProcessStyles extends ProcessAssets {

  /**
   * Process CSS with PostCSS function.
   */
  async processFile(file) {
    const css = await fs.readFileSync(file);

    // Production build.
    if (this.production) {
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

}

module.exports = ProcessStyles;
