import test from 'ava';

/**
 * Test ESM import (direct)
 */
test('ESM import works', async (t) => {
  const { default: plugin } = await import('../index.js');

  t.is(typeof plugin, 'function', 'ESM default export should be a function');
  t.is(plugin.name, 'eleventyTemplateAssetPipeline', 'Function should have correct name');
});

/**
 * Test CommonJS import via dynamic import
 * (simulates what happens when requiring from CJS)
 */
test('CommonJS wrapper works', async (t) => {
  const plugin = await import('../index.cjs');

  t.is(typeof plugin.default, 'function', 'CJS wrapper should export a function');
  t.is(plugin.default.name, 'eleventyTemplateAssetPipeline', 'Function should have correct name');
});

/**
 * Test that both approaches return the same functionality
 */
test('Both import methods provide same functionality', async (t) => {
  const { default: esmPlugin } = await import('../index.js');
  const { default: cjsPlugin } = await import('../index.cjs');

  // Create mock eleventy config
  const mockConfig = {
    addShortcode: () => {},
    addTemplate: () => {},
    addCollection: () => {}
  };

  // Both should execute without errors
  await t.notThrowsAsync(async () => {
    await esmPlugin(mockConfig, {});
  }, 'ESM plugin should execute');

  await t.notThrowsAsync(async () => {
    await cjsPlugin(mockConfig, {});
  }, 'CJS plugin should execute');
});

/**
 * Test ESM import of ProcessAssets
 */
test('ProcessAssets ESM import works', async (t) => {
  const { default: ProcessAssets } = await import('../src/ProcessAssets.js');

  t.is(typeof ProcessAssets, 'function', 'ProcessAssets should be a class/function');
  t.is(ProcessAssets.name, 'ProcessAssets', 'Should have correct class name');
});

/**
 * Test CommonJS require of ProcessAssets
 */
test('ProcessAssets CommonJS require works', async (t) => {
  const processAssetsModule = await import('../src/ProcessAssets.cjs');
  const ProcessAssets = await processAssetsModule.default;

  t.is(typeof ProcessAssets, 'function', 'ProcessAssets should be a class/function');
  t.is(ProcessAssets.name, 'ProcessAssets', 'Should have correct class name');
});

/**
 * Test ESM import of assetLink shortcode
 */
test('assetLink ESM import works', async (t) => {
  const { default: assetLink } = await import('../src/shortcodes/assetLink.js');

  t.is(typeof assetLink, 'function', 'assetLink should be a function');
  t.is(assetLink.name, 'assetLink', 'Should have correct function name');
});

/**
 * Test CommonJS require of assetLink shortcode
 */
test('assetLink CommonJS require works', async (t) => {
  const assetLinkModule = await import('../src/shortcodes/assetLink.cjs');
  const assetLink = await assetLinkModule.default;

  t.is(typeof assetLink, 'function', 'assetLink should be a function');
  t.is(assetLink.name, 'assetLink', 'Should have correct function name');
});

/**
 * Test ESM import of scriptLink shortcode
 */
test('scriptLink ESM import works', async (t) => {
  const { default: scriptLink } = await import('../src/shortcodes/scriptLink.js');

  t.is(typeof scriptLink, 'function', 'scriptLink should be a function');
  t.is(scriptLink.name, 'scriptLink', 'Should have correct function name');
});

/**
 * Test CommonJS require of scriptLink shortcode
 */
test('scriptLink CommonJS require works', async (t) => {
  const scriptLinkModule = await import('../src/shortcodes/scriptLink.cjs');
  const scriptLink = await scriptLinkModule.default;

  t.is(typeof scriptLink, 'function', 'scriptLink should be a function');
  t.is(scriptLink.name, 'scriptLink', 'Should have correct function name');
});
