import test from "ava";
import assetLink from "../../src/shortcodes/assetLink.js";

// Mock collection data
const mockCollection = [
  {
    data: {
      key: "main.css",
      integrity: "sha512-ABC123",
    },
    url: "/_assets/css/main-HASH123.css",
  },
  {
    data: {
      key: "theme.css",
    },
    url: "/_assets/css/theme.css",
  },
];

test("assetLink - renders link tag with default attributes", t => {
  const result = assetLink(mockCollection, "theme.css");

  t.regex(result, /<link href=".*" rel="stylesheet" \/>/);
  t.true(result.includes('href="/_assets/css/theme.css"'));
});

test("assetLink - includes integrity and crossorigin when available", t => {
  const result = assetLink(mockCollection, "main.css");

  t.true(result.includes('integrity="sha512-ABC123"'));
  t.true(result.includes('crossorigin="anonymous"'));
  t.true(result.includes('href="/_assets/css/main-HASH123.css"'));
});

test("assetLink - accepts custom attributes", t => {
  const result = assetLink(mockCollection, "theme.css", {
    media: "print",
    type: "text/css",
  });

  t.true(result.includes('rel="stylesheet"')); // Default
  t.true(result.includes('media="print"'));
  t.true(result.includes('type="text/css"'));
});

test("assetLink - allows overriding default rel attribute", t => {
  const result = assetLink(mockCollection, "theme.css", {
    rel: "preload",
  });

  t.true(result.includes('rel="preload"'));
  t.false(result.includes('rel="stylesheet"'));
});

test("assetLink - returns empty string when collection is undefined", t => {
  const result = assetLink(undefined, "main.css");

  t.is(result, "");
});

test("assetLink - returns empty string when key not found", t => {
  const result = assetLink(mockCollection, "nonexistent.css");

  t.is(result, "");
});

test("assetLink - handles empty collection", t => {
  const result = assetLink([], "main.css");

  t.is(result, "");
});

test("assetLink - escapes attribute values", t => {
  const result = assetLink(mockCollection, "theme.css", {
    title: 'My "Theme"',
  });

  t.true(result.includes('title="My "Theme""'));
});

test("assetLink - renders all attributes in output", t => {
  const result = assetLink(mockCollection, "main.css", {
    media: "screen",
    as: "style",
  });

  t.true(result.includes('media="screen"'));
  t.true(result.includes('as="style"'));
  t.true(result.includes('rel="stylesheet"'));
  t.true(result.includes('integrity="sha512-ABC123"'));
  t.true(result.includes('crossorigin="anonymous"'));
});

test("assetLink - self-closing tag format", t => {
  const result = assetLink(mockCollection, "theme.css");

  t.regex(result, /\/>$/);
  t.true(result.startsWith("<link"));
});
