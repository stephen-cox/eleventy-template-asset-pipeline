import test from "ava";
import ProcessAssets from "../src/ProcessAssets.js";

// Simple processFile function that just returns the content
const simpleProcessFile = async (file) => {
  const fs = await import("fs");
  return fs.promises.readFile(file, "utf8");
};

test("ProcessAssets constructor - sets default collection name", t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
  });

  t.is(processor.collection, "_assets");
});

test("ProcessAssets constructor - accepts custom collection name", t => {
  const processor = new ProcessAssets({
    collection: "_styles",
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
  });

  t.is(processor.collection, "_styles");
});

test("ProcessAssets constructor - sets production mode", t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
    production: true,
  });

  t.is(processor.production, true);
});

test("ProcessAssets constructor - defaults to development mode", t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
  });

  t.is(processor.production, false);
});

test("ProcessAssets.data() - returns correct structure", async t => {
  const processor = new ProcessAssets({
    collection: "_styles",
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
  });

  const data = await processor.data();

  t.truthy(data.eleventyComputed);
  t.is(typeof data.eleventyComputed.key, "function");
  t.is(typeof data.eleventyComputed.integrity, "function");
  t.is(typeof data.permalink, "function");
  t.truthy(data.pagination);
  t.is(data.pagination.size, 1);
  t.is(data.pagination.alias, "item");
  t.is(data.layout, "");
  t.deepEqual(data.tags, ["_styles"]);
  t.deepEqual(data.asset, ["_styles"]);
  t.true(Array.isArray(data.data));
});

test("ProcessAssets.processDirectory() - finds and processes CSS files in development", async t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
    production: false,
  });

  const files = await processor.processDirectory();

  t.true(Array.isArray(files));
  t.is(files.length, 1); // Only sample.css, not nested/nested.css
  t.is(files[0].index, "sample.css");
  t.regex(files[0].source, /test[/\\]fixtures[/\\]sample\.css$/); // Windows uses \, Unix uses /
  t.is(files[0].destination, "_assets/css/sample.css");
  t.truthy(files[0].content);
  t.is(files[0].integrity, undefined); // No integrity in development
});

test("ProcessAssets.processDirectory() - generates cache-busting filenames in production", async t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
    production: true,
  });

  const files = await processor.processDirectory();

  t.true(Array.isArray(files));
  t.is(files.length, 1);
  t.is(files[0].index, "sample.css");
  t.regex(files[0].destination, /^_assets\/css\/sample-[A-Z0-9]{10}\.css$/);
  t.truthy(files[0].integrity);
  t.regex(files[0].integrity, /^sha512-/);
});

test("ProcessAssets.processDirectory() - skips .11ty.js files", async t => {
  const fs = await import("fs");
  const testFile = "./test/fixtures/test.11ty.js";

  // Create a .11ty.js file
  await fs.promises.writeFile(testFile, "module.exports = {};");

  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "js",
    outDirectory: "_assets/js",
    outExtension: "js",
    processFile: simpleProcessFile,
  });

  const files = await processor.processDirectory();

  // Should find sample.js but not test.11ty.js
  const eleventyTemplateFile = files.find(f => f.index === "test.11ty.js");
  t.is(eleventyTemplateFile, undefined);

  // Cleanup
  await fs.promises.unlink(testFile);
});

test("ProcessAssets.processDirectory() - processes JavaScript files", async t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "js",
    outDirectory: "_assets/js",
    outExtension: "js",
    processFile: simpleProcessFile,
  });

  const files = await processor.processDirectory();

  t.true(Array.isArray(files));
  const jsFile = files.find(f => f.index === "sample.js");
  t.truthy(jsFile);
  t.is(jsFile.destination, "_assets/js/sample.js");
});

test("ProcessAssets.render() - returns item content", async t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
  });

  const testContent = "body { margin: 0; }";
  const result = await processor.render({ item: { content: testContent } });

  t.is(result, testContent);
});

test("ProcessAssets.processDirectory() - calls processFile with correct arguments", async t => {
  let capturedFile = null;
  let capturedProduction = null;

  const mockProcessFile = async (file, production) => {
    capturedFile = file;
    capturedProduction = production;
    return "processed content";
  };

  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: mockProcessFile,
    production: true,
  });

  await processor.processDirectory();

  t.regex(capturedFile, /test[/\\]fixtures[/\\]sample\.css$/); // Windows uses \, Unix uses /
  t.is(capturedProduction, true);
});

test("ProcessAssets.processDirectory() - hash consistency", async t => {
  const processor = new ProcessAssets({
    inDirectory: "./test/fixtures",
    inExtension: "css",
    outDirectory: "_assets/css",
    outExtension: "css",
    processFile: simpleProcessFile,
    production: true,
  });

  const files1 = await processor.processDirectory();
  const files2 = await processor.processDirectory();

  // Same content should produce same hash
  t.is(files1[0].destination, files2[0].destination);
  t.is(files1[0].integrity, files2[0].integrity);
});
