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
