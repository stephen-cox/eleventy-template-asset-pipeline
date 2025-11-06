/**
 * This file tests that the package can be required from a CommonJS file.
 * This is the actual use case for users with CommonJS .eleventy.js configs.
 */

async function testCommonJSUsage() {
  console.log('Testing CommonJS require()...');

  try {
    // This is how users would use it from a CommonJS file
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

    console.log('✓ Plugin executed successfully with mock config');
    console.log('\n✅ CommonJS interop test PASSED');
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
