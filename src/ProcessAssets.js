/**
 * Javascript template class to process static assets.
 */

const crypto = require('crypto');
const fs = require('fs');
const fsPromises = fs.promises;
const glob = require('glob');
const path = require('path');


/**
 * ProcessAssets class.
 */
class ProcessAssets {

  /**
   * Initialise new ProcessAssets instance.
   *
   * @param {object} config Class configuration object.
   * @param {string} config.collection Collection to add all processed files to;. Default _assets.
   * @param {string} config.inDirectory Directory to process.
   * @param {string} config.inExtension File extension to process.
   * @param {string} config.outDirectory Directory to write files to.
   * @param {string} config.outExtension File extension to output.
   * @param {boolean} config.production Is this a production build.
   */
  constructor(config) {
    if ('collection' in config) {
      this.collection = config.collection;
    }
    else {
      this.collection = '_assets';
    }
    if ('production' in config) {
      this.production = config.production;
    }
    else {
      this.production = false;
    }
    this.inDirectory = config.inDirectory;
    this.inExtension = config.inExtension;
    this.outDirectory = config.outDirectory;
    this.outExtension = config.outExtension;
  }

  /**
   * Frontmatter.
   */
  async data() {
    return {
      eleventyComputed: {
        key: ({ item }) => item.index,
        integrity: ({ item }) => item.integrity,
      },
      permalink: ({ item }) => `${item.destination}`,
      pagination: {
        addAllPagesToCollections: true,
        alias: 'item',
        data: 'data',
        size: 1,
      },
      layout: '',
      //tags: [this.collection],
      asset: [this.collection],
      data: await this.processDirectory(),
    };
  }

  /**
   * Load and process all the top-level files.
   *
   * This method iterates over all the files in the inDirectory and
   * calls the processFile method for each file.
   *
   * @returns {array} Array of processed files.
   */
  async processDirectory() {
    let files = [];

    // Find all style files in top-level directory.
    for (const file of glob.sync(`${this.inDirectory}/*.${this.inExtension}`)) {

      // Don't process 11ty JS template files.
      if (file.endsWith('.11ty.js')) {
        continue;
      }

      const basename = path.basename(file, `.${this.inExtension}`);
      const filename = `${basename}.${this.inExtension}`;
      const content = await this.processFile(file);

      // Production build.
      if (this.production) {

        // Add hash of the content to destination file name for cache busting.
        const sha512 = crypto.createHash('sha512');
        const hash = sha512.update(content).digest().toString('base64');
        const destination = `${basename}-${hash.slice(0, 10).toUpperCase()}.${this.outExtension}`;

        files.push({
          index: filename,
          source: file,
          destination: `${this.outDirectory}/${destination}`,
          content: content,
          integrity: `sha512-${hash}`,
        });
      }

      // Development build.
      else {
        files.push({
          index: filename,
          source: file,
          destination: `${this.outDirectory}/${basename}.${this.outExtension}`,
          content: content,
        });
      }
    }

    return files;
  }

  /**
   * Process a single file.
   *
   * The method should be overridden in child classes.
   *
   * @param {string} file File to process.
   * @returns {Promise} Returns a promise that resolves to the processed content.
   */
  async processFile(file) {

    // This simply reads the file and returns the content.
    // The method should be overridden in child classes.
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Render item.
   */
  async render({ item }) {
    return item.content;
  }
}


module.exports = ProcessAssets;
