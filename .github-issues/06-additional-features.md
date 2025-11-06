# Additional features

**Labels:** `enhancement`, `feature`, `priority:low`

## Overview
Nice-to-have features that could enhance the plugin but aren't critical for core functionality.

## Proposed Features

### 1. Configurable Hash Algorithm
**Current:** SHA-512 is hardcoded in `ProcessAssets.js:103`

**Proposal:** Make hash algorithm configurable
```javascript
constructor(config) {
  // ...
  this.hashAlgorithm = config.hashAlgorithm || 'sha512';
  this.hashLength = config.hashLength || 10;
}

// In processDirectory()
const hash = crypto.createHash(this.hashAlgorithm);
const hashString = hash.update(content).digest().toString('base64url');
const destination = `${basename}-${hashString.slice(0, this.hashLength).toUpperCase()}.${this.outExtension}`;
```

**Benefits:**
- Shorter hashes (sha256) for smaller filenames
- Compatibility with systems expecting specific hash formats
- Future-proofing (can switch to newer algorithms)

**Configuration:**
```javascript
{
  styles: {
    hashAlgorithm: 'sha256',  // or 'sha384', 'sha512'
    hashLength: 8,
    // ...
  }
}
```

---

### 2. Source Map Support
**Proposal:** Optional source map generation and linking

```javascript
async processDirectory() {
  // ...
  const result = await this.processFile(file, this.production);

  let content, sourceMap;
  if (typeof result === 'object' && result.code) {
    // processFile returned { code, map }
    content = result.code;
    sourceMap = result.map;
  } else {
    content = result;
  }

  files.push({
    index: filename,
    source: file,
    destination: `${this.outDirectory}/${destination}`,
    content: content,
    sourceMap: sourceMap,
    integrity: this.production ? `sha512-${hash}` : undefined,
  });
}

// In render()
async render({ item }) {
  if (item.sourceMap && !this.production) {
    // Append source map comment
    return item.content + `\n/*# sourceMappingURL=${path.basename(item.destination)}.map */`;
  }
  return item.content;
}
```

**Usage:**
```javascript
processFile: async (file, production) => {
  const result = await postcss(plugins).process(css, {
    from: file,
    map: !production ? { inline: false } : false
  });

  return {
    code: result.css,
    map: result.map ? result.map.toString() : null
  };
}
```

**Benefits:**
- Better debugging in development
- Accurate line numbers in browser DevTools
- Stack traces point to original source

---

### 3. Multi-directory Support Enhancement
**Current:** Array support exists but is buggy (now fixed)

**Proposal:** Better multi-directory handling with priority/ordering

```javascript
{
  styles: {
    inDirectory: [
      { path: './src/styles', priority: 1 },
      { path: './vendor/styles', priority: 2 }
    ],
    // Or simple array (existing behavior)
    inDirectory: ['./src/styles', './vendor/styles']
  }
}
```

**Use cases:**
- Process vendor CSS before custom CSS
- Override patterns
- Merge multiple asset sources

---

### 4. Custom Hash Encoding
**Current:** Manual string replacement for base64 characters

**File:** `ProcessAssets.js:104`
```javascript
.replace(/\//g, '').replace(/\+/g, '')
```

**Proposal:** Use proper base64url encoding
```javascript
const hashString = hash.update(content).digest().toString('base64url');
// base64url is filesystem-safe (no /, +, or =)
```

**Benefits:**
- Cleaner code
- Standard encoding method
- No manual character replacement

---

### 5. Watch Mode Optimization
**Proposal:** Cache processed assets to avoid reprocessing unchanged files

```javascript
constructor(config) {
  // ...
  this.cache = new Map(); // file path -> { mtime, content, hash }
}

async processDirectory() {
  const fs = await import('fs/promises');

  for (const file of await glob(`${this.inDirectory}/*.${this.inExtension}`)) {
    const stats = await fs.stat(file);
    const cached = this.cache.get(file);

    // Use cached version if file hasn't changed
    if (cached && cached.mtime === stats.mtimeMs) {
      files.push(cached.result);
      continue;
    }

    const content = await this.processFile(file, this.production);
    // ... process and cache result
  }
}
```

**Benefits:**
- Faster incremental builds
- Reduced CPU usage during watch mode
- Better development experience

---

### 6. Asset Manifest Generation
**Proposal:** Generate a JSON manifest of all processed assets

```javascript
{
  production: true,
  generateManifest: true,
  manifestPath: '_data/assetManifest.json'
}
```

**Generated manifest:**
```json
{
  "main.css": {
    "original": "main.css",
    "processed": "_assets/css/main-ABC123.css",
    "integrity": "sha512-...",
    "size": 12345,
    "mtime": "2024-01-15T10:30:00Z"
  }
}
```

**Use cases:**
- Service worker precaching
- Build analysis
- External tools integration
- CDN upload scripts

---

### 7. Conditional Processing
**Proposal:** Skip processing in certain conditions

```javascript
{
  styles: {
    enabled: true,
    skipIf: (file) => file.includes('.min.'),
    // or
    processIf: (file) => !file.includes('vendor'),
  }
}
```

**Use cases:**
- Skip already-minified files
- Process only certain file patterns
- Conditional vendor code handling

## Implementation Priority

**High value, low effort:**
1. Custom hash encoding (use base64url) - Easy fix
2. Configurable hash algorithm - Simple addition

**Medium value, medium effort:**
3. Asset manifest generation - Useful for advanced use cases
4. Source map support - Better DX

**Lower priority:**
5. Watch mode optimization - Nice but Eleventy handles this
6. Multi-directory priority - Edge case
7. Conditional processing - Can be done in processFile

## Acceptance Criteria
Each feature should include:
- [ ] Implementation in source code
- [ ] Tests for new functionality
- [ ] Documentation in README
- [ ] Example usage
- [ ] Backward compatibility maintained

## Priority
Low - These are enhancements that improve specific use cases but aren't needed for basic functionality
