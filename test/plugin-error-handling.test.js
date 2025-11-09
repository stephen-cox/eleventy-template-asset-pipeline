import test from 'ava';
import eleventyTemplateAssetPipeline from '../index.js';

// Mock eleventyConfig object
function createMockEleventyConfig() {
  const templates = [];
  const collections = {};
  const shortcodes = {};

  return {
    addTemplate(name, instance) {
      templates.push({ name, instance });
    },
    addCollection(name, callback) {
      collections[name] = callback;
    },
    addShortcode(name, func) {
      shortcodes[name] = func;
    },
    _templates: templates,
    _collections: collections,
    _shortcodes: shortcodes,
  };
}

test('plugin - throws when eleventyConfig is missing', async t => {
  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline();
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires eleventyConfig/i);
});

test('plugin - throws when eleventyConfig is null', async t => {
  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(null);
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires eleventyConfig/i);
});

test('plugin - throws when eleventyConfig is not an object', async t => {
  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline('not an object');
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires eleventyConfig/i);
});

test('plugin - throws when pluginOptions is not an object', async t => {
  const mockConfig = createMockEleventyConfig();

  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, 'invalid');
  }, { instanceOf: TypeError });

  t.regex(error.message, /options must be an object/i);
});

test('plugin - throws when options.styles is not an object', async t => {
  const mockConfig = createMockEleventyConfig();

  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {
      styles: 'invalid',
    });
  }, { instanceOf: TypeError });

  t.regex(error.message, /styles must be an object/i);
});

test('plugin - throws when options.scripts is not an object', async t => {
  const mockConfig = createMockEleventyConfig();

  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {
      scripts: 'invalid',
    });
  }, { instanceOf: TypeError });

  t.regex(error.message, /scripts must be an object/i);
});

test('plugin - wraps ProcessAssets errors for styles with helpful context', async t => {
  const mockConfig = createMockEleventyConfig();

  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {
      styles: {
        enabled: true,
        // Missing required parameters
      },
    });
  }, { instanceOf: Error });

  t.regex(error.message, /failed to initialize styles processing/i);
  t.true(error.message.includes('configuration'));
});

test('plugin - wraps ProcessAssets errors for scripts with helpful context', async t => {
  const mockConfig = createMockEleventyConfig();

  const error = await t.throwsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {
      scripts: {
        enabled: true,
        // Missing required parameters
      },
    });
  }, { instanceOf: Error });

  t.regex(error.message, /failed to initialize scripts processing/i);
  t.true(error.message.includes('configuration'));
});

test('plugin - accepts valid configuration without errors', async t => {
  const mockConfig = createMockEleventyConfig();

  await t.notThrowsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {
      styles: {
        enabled: true,
        inDirectory: './_assets/css',
        inExtension: 'css',
        outDirectory: '_assets/css',
        outExtension: 'css',
        processFile: async (file) => 'processed content',
      },
    });
  });

  // Verify shortcodes were added
  t.truthy(mockConfig._shortcodes.assetLink);
  t.truthy(mockConfig._shortcodes.scriptLink);

  // Verify template was added
  t.is(mockConfig._templates.length, 1);
  t.is(mockConfig._templates[0].name, 'styles.11ty.js');
});

test('plugin - works with empty options', async t => {
  const mockConfig = createMockEleventyConfig();

  await t.notThrowsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig, {});
  });

  // Shortcodes should still be added
  t.truthy(mockConfig._shortcodes.assetLink);
  t.truthy(mockConfig._shortcodes.scriptLink);

  // No templates should be added when styles/scripts are disabled
  t.is(mockConfig._templates.length, 0);
});

test('plugin - works with default options (no second parameter)', async t => {
  const mockConfig = createMockEleventyConfig();

  await t.notThrowsAsync(async () => {
    await eleventyTemplateAssetPipeline(mockConfig);
  });

  // Shortcodes should still be added
  t.truthy(mockConfig._shortcodes.assetLink);
  t.truthy(mockConfig._shortcodes.scriptLink);
});
