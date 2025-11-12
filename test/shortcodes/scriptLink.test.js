import test from "ava";
import scriptLink from "../../src/shortcodes/scriptLink.js";

// Mock collection data
const mockCollection = [
  {
    data: {
      key: "main.js",
      integrity: "sha512-XYZ789",
    },
    url: "/_assets/js/main-HASH456.js",
  },
  {
    data: {
      key: "app.js",
    },
    url: "/_assets/js/app.js",
  },
];

test("scriptLink - renders script tag with defer", t => {
  const result = scriptLink(mockCollection, "app.js");

  t.regex(result, /<script src=".*" defer><\/script>/);
  t.true(result.includes('src="/_assets/js/app.js"'));
});

test("scriptLink - includes integrity and crossorigin when available", t => {
  const result = scriptLink(mockCollection, "main.js");

  t.true(result.includes('integrity="sha512-XYZ789"'));
  t.true(result.includes('crossorigin="anonymous"'));
  t.true(result.includes('src="/_assets/js/main-HASH456.js"'));
  t.true(result.includes("defer"));
});

test("scriptLink - always includes defer attribute", t => {
  const resultWithIntegrity = scriptLink(mockCollection, "main.js");
  const resultWithoutIntegrity = scriptLink(mockCollection, "app.js");

  t.true(resultWithIntegrity.includes("defer"));
  t.true(resultWithoutIntegrity.includes("defer"));
});

test("scriptLink - returns empty string when collection is undefined", t => {
  const result = scriptLink(undefined, "main.js");

  t.is(result, "");
});

test("scriptLink - returns empty string when key not found", t => {
  const result = scriptLink(mockCollection, "nonexistent.js");

  t.is(result, "");
});

test("scriptLink - handles empty collection", t => {
  const result = scriptLink([], "main.js");

  t.is(result, "");
});

test("scriptLink - proper closing tag", t => {
  const result = scriptLink(mockCollection, "app.js");

  t.regex(result, /<\/script>$/);
  t.true(result.startsWith("<script"));
});

test("scriptLink - attribute order with integrity", t => {
  const result = scriptLink(mockCollection, "main.js");

  // Check that all attributes are present in some order
  const srcIndex = result.indexOf("src=");
  const integrityIndex = result.indexOf("integrity=");
  const crossoriginIndex = result.indexOf("crossorigin=");
  const deferIndex = result.indexOf("defer");

  t.true(srcIndex > -1);
  t.true(integrityIndex > -1);
  t.true(crossoriginIndex > -1);
  t.true(deferIndex > -1);
});

test("scriptLink - attribute order without integrity", t => {
  const result = scriptLink(mockCollection, "app.js");

  const srcIndex = result.indexOf("src=");
  const deferIndex = result.indexOf("defer");

  t.true(srcIndex > -1);
  t.true(deferIndex > -1);
  t.false(result.includes("integrity"));
  t.false(result.includes("crossorigin"));
});
