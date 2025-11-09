/**
 * Javascript template class to process static assets.
 */

import crypto from 'crypto';
import { glob } from 'glob';
import path from 'path';


/**
 * Validates and sanitizes a file path to prevent directory traversal attacks.
 *
 * @param {string} filePath The path to validate.
 * @param {string} paramName The parameter name for error messages.
 * @returns {string} The sanitized path.
 * @throws {Error} If the path attempts directory traversal.
 */
function sanitizePath(filePath, paramName = 'path') {
  if (typeof filePath !== 'string') {
    throw new TypeError(`${paramName} must be a string, received ${typeof filePath}`);
  }

  const normalized = path.normalize(filePath);

  // Check for directory traversal attempts
  if (normalized.includes('..')) {
    throw new Error(
      `Invalid ${paramName}: Directory traversal not allowed. ` +
      `Path "${filePath}" contains ".." after normalization. ` +
      `Use absolute paths or paths relative to your project root.`
    );
  }

  return normalized;
}


/**
 * ProcessAssets class.
 */
class ProcessAssets {

  /**
   * Initialise new ProcessAssets instance.
   *
   * @param {object} config Class configuration object.
   * @param {string} config.collection Collection to add all processed files to;. Default _assets.
   * @param {string|array} config.inDirectory Directory to process.
   * @param {string} config.inExtension File extension to process.
   * @param {string} config.outDirectory Directory to write files to.
   * @param {string} config.outExtension File extension to output.
   * @param {boolean} config.production Is this a production build.
   * @param {function} config.processFile Function to process file.
   */
  constructor(config) {
    // Validate that config is an object
    if (!config || typeof config !== 'object' || Array.isArray(config)) {
      throw new TypeError(
        'ProcessAssets configuration must be an object. ' +
        'Received: ' + (config === null ? 'null' : typeof config) + '. ' +
        'Example: new ProcessAssets({ inDirectory: "./src", inExtension: "css", ... })'
      );
    }

    // Validate required parameters
    const requiredParams = ['inDirectory', 'inExtension', 'outDirectory', 'outExtension'];
    const missingParams = requiredParams.filter(param => !(param in config));

    if (missingParams.length > 0) {
      throw new Error(
        `Missing required configuration parameters: ${missingParams.join(', ')}. ` +
        `ProcessAssets requires: ${requiredParams.join(', ')}. ` +
        `Example: { inDirectory: "./_assets/css", inExtension: "css", outDirectory: "_assets/css", outExtension: "css" }`
      );
    }

    // Validate and set collection
    if ('collection' in config) {
      if (typeof config.collection !== 'string') {
        throw new TypeError(`config.collection must be a string, received ${typeof config.collection}`);
      }
      if (config.collection.trim() === '') {
        throw new Error('config.collection cannot be empty');
      }
      this.collection = config.collection;
    }
    else {
      this.collection = '_assets';
    }

    // Validate and set production mode
    if ('production' in config) {
      if (typeof config.production !== 'boolean') {
        throw new TypeError(
          `config.production must be a boolean, received ${typeof config.production}. ` +
          `Use true for production builds or false for development.`
        );
      }
      this.production = config.production;
    }
    else {
      this.production = false;
    }

    // Validate and set inDirectory
    if (config.inDirectory instanceof Array) {
      if (config.inDirectory.length === 0) {
        throw new Error('config.inDirectory array cannot be empty');
      }
      this.inDirectory = config.inDirectory.map((dir, index) =>
        sanitizePath(dir, `config.inDirectory[${index}]`)
      );
    }
    else {
      this.inDirectory = [sanitizePath(config.inDirectory, 'config.inDirectory')];
    }

    // Validate and set inExtension
    if (typeof config.inExtension !== 'string') {
      throw new TypeError(`config.inExtension must be a string, received ${typeof config.inExtension}`);
    }
    if (config.inExtension.trim() === '') {
      throw new Error('config.inExtension cannot be empty. Example: "css" or "js"');
    }
    this.inExtension = config.inExtension;

    // Validate and set outDirectory
    if (typeof config.outDirectory !== 'string') {
      throw new TypeError(`config.outDirectory must be a string, received ${typeof config.outDirectory}`);
    }
    if (config.outDirectory.trim() === '') {
      throw new Error('config.outDirectory cannot be empty. Example: "_assets/css"');
    }
    this.outDirectory = sanitizePath(config.outDirectory, 'config.outDirectory');

    // Validate and set outExtension
    if (typeof config.outExtension !== 'string') {
      throw new TypeError(`config.outExtension must be a string, received ${typeof config.outExtension}`);
    }
    if (config.outExtension.trim() === '') {
      throw new Error('config.outExtension cannot be empty. Example: "css" or "js"');
    }
    this.outExtension = config.outExtension;

    // Validate processFile function if provided
    if ('processFile' in config) {
      if (typeof config.processFile !== 'function') {
        throw new TypeError(
          `config.processFile must be a function, received ${typeof config.processFile}. ` +
          `It should be an async function that processes file content: async (filePath, isProduction) => content`
        );
      }
      this.processFile = config.processFile;
    }
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
      tags: [this.collection],
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

    // Validate processFile is available
    if (!this.processFile) {
      throw new Error(
        'No processFile function configured. ' +
        'Provide a processFile function in the configuration: ' +
        '{ processFile: async (filePath, isProduction) => { /* process and return content */ } }'
      );
    }

    try {
      // Process each directory in inDirectory array
      for (const directory of this.inDirectory) {
        // Find all files in top-level directory.
        const globPattern = `${directory}/*.${this.inExtension}`;
        let matchedFiles;

        try {
          matchedFiles = await glob(globPattern);
        } catch (error) {
          throw new Error(
            `Failed to search for files matching pattern "${globPattern}". ` +
            `Error: ${error.message}. ` +
            `Check that the inDirectory path is valid and accessible.`
          );
        }

        if (matchedFiles.length === 0) {
          // This is not necessarily an error - directory might be empty
          console.warn(
            `No files found matching pattern "${globPattern}". ` +
            `This may be expected if your ${this.inExtension} directory is empty.`
          );
        }

        for (const file of matchedFiles) {
        // Don't process 11ty JS template files.
        if (file.endsWith('.11ty.js')) {
          continue;
        }

        try {
          const basename = path.basename(file, `.${this.inExtension}`);
          const filename = `${basename}.${this.inExtension}`;

          let content;
          try {
            content = await this.processFile(file, this.production);
          } catch (error) {
            throw new Error(
              `Failed to process file "${file}". ` +
              `Error: ${error.message}. ` +
              `Check that the file exists and the processFile function is working correctly.`
            );
          }

          // Validate that processFile returned content
          if (content === undefined || content === null) {
            throw new Error(
              `processFile function returned ${content} for file "${file}". ` +
              `The processFile function must return the processed file content as a string or buffer.`
            );
          }

          // Production build.
          if (this.production) {
            try {
              // Add hash of the content to destination file name for cache busting.
              const sha512 = crypto.createHash('sha512');
              const hash = sha512.update(content).digest().toString('base64');
              const destination = `${basename}-${hash.replace(/\//g, '').replace(/\+/g, '').slice(0, 10).toUpperCase()}.${this.outExtension}`;

              files.push({
                index: filename,
                source: file,
                destination: `${this.outDirectory}/${destination}`,
                content: content,
                integrity: `sha512-${hash}`,
              });
            } catch (error) {
              throw new Error(
                `Failed to generate hash for file "${file}". ` +
                `Error: ${error.message}`
              );
            }
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
        } catch (error) {
          // Re-throw with context if not already wrapped
          if (error.message.includes('Failed to')) {
            throw error;
          }
          throw new Error(
            `Error processing file "${file}": ${error.message}`
          );
        }
      }
      }
    } catch (error) {
      // Re-throw with ProcessAssets context if not already wrapped
      if (error.message.includes('Failed to') || error.message.includes('Error processing')) {
        throw error;
      }
      throw new Error(
        `ProcessAssets.processDirectory() failed: ${error.message}`
      );
    }

    return files;
  }

  /**
   * Render item.
   */
  async render({ item }) {
    return item.content;
  }
}


export default ProcessAssets;
