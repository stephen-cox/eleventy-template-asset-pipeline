import test from "ava";

/**
 * Test that the CommonJS template pattern (exporting a Promise) works correctly
 */
test("CommonJS template pattern works", async (t) => {
  // Import the example template file
  const templateExport = await import("./example-template.11ty.cjs");

  // The default export should be a Promise
  t.true(templateExport.default instanceof Promise, "Template should export a Promise");

  // Wait for the Promise to resolve
  const processAssets = await templateExport.default;

  // Should be a ProcessAssets instance
  t.is(processAssets.constructor.name, "ProcessAssets", "Should resolve to ProcessAssets instance");
  t.is(typeof processAssets.data, "function", "Should have data method");
  t.is(typeof processAssets.render, "function", "Should have render method");
  t.is(typeof processAssets.processDirectory, "function", "Should have processDirectory method");
});

/**
 * Test that the ProcessAssets instance from CommonJS pattern is functional
 */
test("CommonJS template ProcessAssets instance is functional", async (t) => {
  const templateExport = await import("./example-template.11ty.cjs");
  const processAssets = await templateExport.default;

  // Test that data() method works
  const data = await processAssets.data();

  t.truthy(data, "data() should return something");
  t.is(typeof data.permalink, "function", "Should have permalink function");
  t.true(Array.isArray(data.tags), "Should have tags array");
  t.true(data.tags.includes("_test_styles"), "Should include the collection name in tags");
});
