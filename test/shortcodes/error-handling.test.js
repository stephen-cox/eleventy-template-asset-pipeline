import test from 'ava';
import assetLink from '../../src/shortcodes/assetLink.js';
import scriptLink from '../../src/shortcodes/scriptLink.js';

// Mock collection data
const mockCollection = [
  {
    data: {
      key: 'main.css',
      integrity: 'sha512-ABC123',
    },
    url: '/_assets/css/main-HASH123.css',
  },
  {
    data: {
      key: 'app.js',
    },
    url: '/_assets/js/app.js',
  },
];

// ============================================================================
// assetLink error handling tests
// ============================================================================

test('assetLink - returns empty string when collection is undefined (default behavior)', t => {
  const result = assetLink(undefined, 'main.css');
  t.is(result, '');
});

test('assetLink - throws when collection is undefined and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(undefined, 'main.css', {}, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires a collection/i);
  t.true(error.message.includes('first parameter'));
});

test('assetLink - returns empty string when collection is null (default behavior)', t => {
  const result = assetLink(null, 'main.css');
  t.is(result, '');
});

test('assetLink - throws when collection is null and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(null, 'main.css', {}, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires a collection/i);
});

test('assetLink - returns empty string when collection is not iterable (default behavior)', t => {
  const result = assetLink({ notAnArray: true }, 'main.css');
  t.is(result, '');
});

test('assetLink - throws when collection is not iterable and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink({ notAnArray: true }, 'main.css', {}, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /collection must be an array or iterable/i);
});

test('assetLink - returns empty string when key is not a string (default behavior)', t => {
  const result = assetLink(mockCollection, 123);
  t.is(result, '');
});

test('assetLink - throws when key is not a string and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, 123, {}, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /key must be a string/i);
});

test('assetLink - returns empty string when key is empty (default behavior)', t => {
  const result = assetLink(mockCollection, '   ');
  t.is(result, '');
});

test('assetLink - throws when key is empty and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, '   ', {}, { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /key cannot be empty/i);
});

test('assetLink - returns empty string when attributes is not an object (default behavior)', t => {
  const result = assetLink(mockCollection, 'main.css', 'invalid');
  t.is(result, '');
});

test('assetLink - throws when attributes is not an object and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, 'main.css', 'invalid', { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /attributes must be an object/i);
});

test('assetLink - returns empty string when asset not found (default behavior)', t => {
  const result = assetLink(mockCollection, 'nonexistent.css');
  t.is(result, '');
});

test('assetLink - throws when asset not found and throwOnMissing is true', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, 'nonexistent.css', {}, { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /not found in collection/i);
  t.true(error.message.includes('Available keys'));
});

test('assetLink - handles malformed collection items gracefully', t => {
  const malformedCollection = [
    null,
    undefined,
    { noData: true },
    { data: null },
    { data: { key: 'valid.css' }, url: '/_assets/css/valid.css' },
  ];

  const result = assetLink(malformedCollection, 'valid.css');
  t.true(result.includes('href="/_assets/css/valid.css"'));
});

test('assetLink - throws when item has no URL and throwOnMissing is true', t => {
  const collectionWithoutURL = [
    {
      data: { key: 'broken.css' },
      // url is missing
    },
  ];

  const error = t.throws(() => {
    assetLink(collectionWithoutURL, 'broken.css', {}, { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /found but has no valid URL/i);
});

test('assetLink - supports legacy throwOnMissing as 3rd parameter', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, 'nonexistent.css', { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /not found in collection/i);
});

// ============================================================================
// scriptLink error handling tests
// ============================================================================

test('scriptLink - returns empty string when collection is undefined (default behavior)', t => {
  const result = scriptLink(undefined, 'app.js');
  t.is(result, '');
});

test('scriptLink - throws when collection is undefined and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink(undefined, 'app.js', { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires a collection/i);
  t.true(error.message.includes('first parameter'));
});

test('scriptLink - returns empty string when collection is null (default behavior)', t => {
  const result = scriptLink(null, 'app.js');
  t.is(result, '');
});

test('scriptLink - throws when collection is null and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink(null, 'app.js', { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /requires a collection/i);
});

test('scriptLink - returns empty string when collection is not iterable (default behavior)', t => {
  const result = scriptLink({ notAnArray: true }, 'app.js');
  t.is(result, '');
});

test('scriptLink - throws when collection is not iterable and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink({ notAnArray: true }, 'app.js', { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /collection must be an array or iterable/i);
});

test('scriptLink - returns empty string when key is not a string (default behavior)', t => {
  const result = scriptLink(mockCollection, 123);
  t.is(result, '');
});

test('scriptLink - throws when key is not a string and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink(mockCollection, 123, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.regex(error.message, /key must be a string/i);
});

test('scriptLink - returns empty string when key is empty (default behavior)', t => {
  const result = scriptLink(mockCollection, '   ');
  t.is(result, '');
});

test('scriptLink - throws when key is empty and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink(mockCollection, '   ', { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /key cannot be empty/i);
});

test('scriptLink - returns empty string when script not found (default behavior)', t => {
  const result = scriptLink(mockCollection, 'nonexistent.js');
  t.is(result, '');
});

test('scriptLink - throws when script not found and throwOnMissing is true', t => {
  const error = t.throws(() => {
    scriptLink(mockCollection, 'nonexistent.js', { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /not found in collection/i);
  t.true(error.message.includes('Available keys'));
});

test('scriptLink - handles malformed collection items gracefully', t => {
  const malformedCollection = [
    null,
    undefined,
    { noData: true },
    { data: null },
    { data: { key: 'valid.js' }, url: '/_assets/js/valid.js' },
  ];

  const result = scriptLink(malformedCollection, 'valid.js');
  t.true(result.includes('src="/_assets/js/valid.js"'));
});

test('scriptLink - throws when item has no URL and throwOnMissing is true', t => {
  const collectionWithoutURL = [
    {
      data: { key: 'broken.js' },
      // url is missing
    },
  ];

  const error = t.throws(() => {
    scriptLink(collectionWithoutURL, 'broken.js', { throwOnMissing: true });
  }, { instanceOf: Error });

  t.regex(error.message, /found but has no valid URL/i);
});

// ============================================================================
// Integration tests - error messages include helpful context
// ============================================================================

test('assetLink - error messages include helpful examples', t => {
  const error = t.throws(() => {
    assetLink(null, 'test.css', {}, { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.true(error.message.includes('Usage:') || error.message.includes('Example:'));
});

test('scriptLink - error messages include helpful examples', t => {
  const error = t.throws(() => {
    scriptLink(null, 'test.js', { throwOnMissing: true });
  }, { instanceOf: TypeError });

  t.true(error.message.includes('Usage:') || error.message.includes('Example:'));
});

test('assetLink - lists available keys when asset not found', t => {
  const error = t.throws(() => {
    assetLink(mockCollection, 'missing.css', {}, { throwOnMissing: true });
  }, { instanceOf: Error });

  t.true(error.message.includes('Available keys'));
  t.true(error.message.includes('main.css'));
});

test('scriptLink - lists available keys when script not found', t => {
  const error = t.throws(() => {
    scriptLink(mockCollection, 'missing.js', { throwOnMissing: true });
  }, { instanceOf: Error });

  t.true(error.message.includes('Available keys'));
  t.true(error.message.includes('app.js'));
});
