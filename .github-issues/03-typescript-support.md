# Add TypeScript type definitions

**Labels:** `enhancement`, `typescript`, `DX`, `priority:medium`

## Overview
Adding TypeScript definitions would significantly improve the developer experience for TypeScript users and provide better autocomplete/IntelliSense in modern editors.

## Proposed Implementation

### Option 1: Hand-written `.d.ts` files (Recommended)
Create `index.d.ts` alongside the source files:

```typescript
// index.d.ts
export interface ProcessAssetsConfig {
  /** Collection name to add all processed files to. Default: '_assets' */
  collection?: string;
  /** Input directory or array of directories to process */
  inDirectory: string | string[];
  /** File extension to process (without dot) */
  inExtension: string;
  /** Output directory for processed files */
  outDirectory: string;
  /** Output file extension (without dot) */
  outExtension: string;
  /** Function to process each file */
  processFile: (file: string, production: boolean) => Promise<string>;
  /** Whether this is a production build. Default: false */
  production?: boolean;
}

export interface StylesConfig extends ProcessAssetsConfig {
  /** Enable styles virtual template. Default: false */
  enabled?: boolean;
}

export interface ScriptsConfig extends ProcessAssetsConfig {
  /** Enable scripts virtual template. Default: false */
  enabled?: boolean;
}

export interface PluginOptions {
  styles?: StylesConfig;
  scripts?: ScriptsConfig;
}

export interface EleventyConfig {
  addShortcode(name: string, fn: Function): void;
  addTemplate(name: string, template: any): void;
  addCollection(name: string, fn: Function): void;
}

/**
 * Eleventy Template Asset Pipeline Plugin
 *
 * @param eleventyConfig - Eleventy configuration object
 * @param pluginOptions - Plugin configuration options
 */
export default function eleventyTemplateAssetPipeline(
  eleventyConfig: EleventyConfig,
  pluginOptions?: PluginOptions
): Promise<void>;

export class ProcessAssets {
  constructor(config: ProcessAssetsConfig);
  data(): Promise<any>;
  processDirectory(): Promise<Array<{
    index: string;
    source: string;
    destination: string;
    content: string;
    integrity?: string;
  }>>;
  render(data: { item: any }): Promise<string>;
}

/**
 * Render link tag for processed asset
 */
export function assetLink(
  collection: Array<any>,
  key: string,
  attributes?: Record<string, string>
): string;

/**
 * Render script tag for processed asset
 */
export function scriptLink(
  collection: Array<any>,
  key: string
): string;
```

### Option 2: Auto-generated types
Use tools like `tsc` to auto-generate types from JSDoc comments:
- Add JSDoc comments with types to all functions
- Configure `tsconfig.json` for declaration generation
- Run `tsc` to generate `.d.ts` files automatically

### Package.json updates
```json
{
  "main": "index.js",
  "types": "index.d.ts",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./index.js"
    },
    "./src/ProcessAssets.js": {
      "types": "./src/ProcessAssets.d.ts",
      "import": "./src/ProcessAssets.js"
    }
  }
}
```

## Benefits
- Better IDE autocomplete and IntelliSense
- Catch configuration errors at development time
- Self-documenting API
- Easier for TypeScript users to adopt
- No runtime overhead (types are stripped during compilation)

## Acceptance Criteria
- [ ] Create `index.d.ts` with types for all exported functions and classes
- [ ] Create `src/ProcessAssets.d.ts` for the ProcessAssets class
- [ ] Create types for shortcode functions
- [ ] Update `package.json` with `types` field
- [ ] Test types with a sample TypeScript project
- [ ] Add TypeScript usage example to README
- [ ] Ensure types are published to npm

## Resources
- [TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Eleventy TypeScript Support](https://www.11ty.dev/docs/languages/typescript/)

## Priority
Medium - Improves DX significantly for TS users but doesn't affect functionality
