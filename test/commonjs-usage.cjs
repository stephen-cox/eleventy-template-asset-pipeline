/**
 * This file tests that the package can be required from a CommonJS file.
 * This is the actual use case for users with CommonJS .eleventy.js configs.
 */

async function testCommonJSUsage() {
  console.log('Testing CommonJS require()...\n');

  try {
    // Test main plugin require
    console.log('1. Testing main plugin require...');
    const plugin = require('../index.cjs');
    console.log('✓ require() successful');
    console.log('  Plugin type:', typeof plugin);
    console.log('  Plugin name:', plugin.name);

    // Test that it can be called
    const mockConfig = {
      addShortcode: () => {},
      addTemplate: () => {},
      addCollection: () => {}
    };

    await plugin(mockConfig, {
      styles: { enabled: true },
      scripts: { enabled: true }
    });

    console.log('✓ Plugin executed successfully with mock config\n');

    // Test ProcessAssets require
    console.log('2. Testing ProcessAssets require...');
    const ProcessAssets = require('../src/ProcessAssets.cjs');
    const PA = await ProcessAssets;
    console.log('✓ ProcessAssets require() successful');
    console.log('  ProcessAssets type:', typeof PA);
    console.log('  ProcessAssets name:', PA.name, '\n');

    // Test assetLink shortcode require
    console.log('3. Testing assetLink shortcode require...');
    const assetLink = require('../src/shortcodes/assetLink.cjs');
    const al = await assetLink;
    console.log('✓ assetLink require() successful');
    console.log('  assetLink type:', typeof al);
    console.log('  assetLink name:', al.name, '\n');

    // Test scriptLink shortcode require
    console.log('4. Testing scriptLink shortcode require...');
    const scriptLink = require('../src/shortcodes/scriptLink.cjs');
    const sl = await scriptLink;
    console.log('✓ scriptLink require() successful');
    console.log('  scriptLink type:', typeof sl);
    console.log('  scriptLink name:', sl.name, '\n');

    console.log('✅ All CommonJS interop tests PASSED');
    return true;
  } catch (error) {
    console.error('✗ CommonJS interop test FAILED:', error.message);
    console.error(error);
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  testCommonJSUsage().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testCommonJSUsage;
