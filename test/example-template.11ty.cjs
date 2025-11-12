/**
 * Example CommonJS 11ty template file
 * This demonstrates the correct pattern for using ProcessAssets in a .cjs file
 */

const ProcessAssetsPromise = require("../src/ProcessAssets.cjs");

// Mock processFile function
async function processFile(file, _production) {
  return `/* processed: ${file} */`;
}

// Export a Promise that resolves to the ProcessAssets instance
// This is the correct pattern for CommonJS 11ty template files
module.exports = ProcessAssetsPromise.then(ProcessAssets => {
  return new ProcessAssets({
    inExtension: "css",
    inDirectory: "./test/fixtures",
    outExtension: "css",
    outDirectory: "_assets/css",
    collection: "_test_styles",
    processFile: processFile,
    production: false,
  });
});
