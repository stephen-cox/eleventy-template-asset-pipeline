import test from "ava";
import eleventyTemplateAssetPipeline from "../index.js";

// Mock Eleventy config
class MockEleventyConfig {
  constructor() {
    this.shortcodes = {};
    this.templates = {};
    this.collections = {};
  }

  addShortcode(name, fn) {
    this.shortcodes[name] = fn;
  }

  addTemplate(name, template) {
    this.templates[name] = template;
  }

  addCollection(name, fn) {
    this.collections[name] = fn;
  }
}

test("plugin - registers assetLink shortcode", async t => {
  const config = new MockEleventyConfig();
  await eleventyTemplateAssetPipeline(config);

  t.truthy(config.shortcodes.assetLink);
  t.is(typeof config.shortcodes.assetLink, "function");
});

test("plugin - registers scriptLink shortcode", async t => {
  const config = new MockEleventyConfig();
  await eleventyTemplateAssetPipeline(config);

  t.truthy(config.shortcodes.scriptLink);
  t.is(typeof config.shortcodes.scriptLink, "function");
});

test("plugin - does not create virtual templates when disabled", async t => {
  const config = new MockEleventyConfig();
  await eleventyTemplateAssetPipeline(config, {
    styles: { enabled: false },
    scripts: { enabled: false },
  });

  t.is(Object.keys(config.templates).length, 0);
  t.is(Object.keys(config.collections).length, 0);
});

test("plugin - creates styles virtual template when enabled", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      inExtension: "css",
      inDirectory: "./test/fixtures",
      outExtension: "css",
      outDirectory: "_assets/css",
      collection: "_styles",
      processFile: mockProcessFile,
    },
  });

  t.truthy(config.templates["styles.11ty.js"]);
  t.truthy(config.collections._styles);
});

test("plugin - creates scripts collection when enabled", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    scripts: {
      enabled: true,
      inExtension: "js",
      inDirectory: "./test/fixtures",
      outExtension: "js",
      outDirectory: "_assets/js",
      collection: "_scripts",
      processFile: mockProcessFile,
      class: "ProcessAssets", // Use the default class
    },
  });

  t.truthy(config.collections._scripts);
});

test("plugin - merges options with defaults", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      inDirectory: "./_assets/css",
      inExtension: "css",
      outDirectory: "_assets/css",
      outExtension: "css",
      processFile: mockProcessFile,
      // production should use default (false)
    },
  });

  t.truthy(config.templates["styles.11ty.js"]);
  // Verify that defaults were applied for production
  t.is(config.templates["styles.11ty.js"].production, false);
  t.pass();
});

test("plugin - accepts custom collection names", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      collection: "myCustomStyles",
      inDirectory: "./_assets/css",
      inExtension: "css",
      outDirectory: "_assets/css",
      outExtension: "css",
      processFile: mockProcessFile,
    },
  });

  t.truthy(config.collections.myCustomStyles);
  t.falsy(config.collections._styles);
});

test("plugin - collection filter works correctly", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      collection: "_styles",
      inDirectory: "./_assets/css",
      inExtension: "css",
      outDirectory: "_assets/css",
      outExtension: "css",
      processFile: mockProcessFile,
    },
  });

  // Mock collections API
  const mockCollectionsApi = {
    getAll: () => [
      { data: { asset: ["_styles"] } },
      { data: { asset: ["_scripts"] } },
      { data: {} },
      { data: { asset: ["_styles", "_other"] } },
    ],
  };

  const filtered = config.collections._styles(mockCollectionsApi);

  t.is(filtered.length, 2); // Should include items with _styles in asset array
  t.true(filtered.every(item => item.data.asset.includes("_styles")));
});

test("plugin - production flag is passed through", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      production: true,
      inDirectory: "./_assets/css",
      inExtension: "css",
      outDirectory: "_assets/css",
      outExtension: "css",
      processFile: mockProcessFile,
    },
  });

  const template = config.templates["styles.11ty.js"];
  t.is(template.production, true);
});

test("plugin - development flag is passed through", async t => {
  const config = new MockEleventyConfig();
  const mockProcessFile = async (file) => file;

  await eleventyTemplateAssetPipeline(config, {
    styles: {
      enabled: true,
      production: false,
      inDirectory: "./_assets/css",
      inExtension: "css",
      outDirectory: "_assets/css",
      outExtension: "css",
      processFile: mockProcessFile,
    },
  });

  const template = config.templates["styles.11ty.js"];
  t.is(template.production, false);
});
