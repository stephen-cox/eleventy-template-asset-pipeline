/**
 * CommonJS wrapper for ProcessAssets module.
 */

module.exports = (async () => {
  const { default: ProcessAssets } = await import('./ProcessAssets.js');
  return ProcessAssets;
})();
