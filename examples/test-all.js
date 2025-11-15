#!/usr/bin/env node
/**
 * Test runner for all examples
 * Runs tests for each example directory
 */

import { execSync } from "child_process";
import { readdirSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all example directories
const examples = readdirSync(__dirname, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)
	.filter((name) => !name.startsWith(".") && !name.startsWith("_"));

console.log(`\n🧪 Testing ${examples.length} examples...\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const example of examples) {
	const exampleDir = join(__dirname, example);
	const testFile = join(exampleDir, "test.js");

	if (!existsSync(testFile)) {
		console.log(`⚠️  Skipping ${example} (no test file)\n`);
		continue;
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log(`Testing: ${example}`);
	console.log("=".repeat(60));

	try {
		// Install dependencies if node_modules doesn't exist
		const nodeModules = join(exampleDir, "node_modules");
		if (!existsSync(nodeModules)) {
			console.log(`📦 Installing dependencies for ${example}...`);
			execSync("npm install", {
				cwd: exampleDir,
				stdio: "inherit",
			});
		}

		// Run the test
		execSync("npm test", {
			cwd: exampleDir,
			stdio: "inherit",
		});

		passed++;
	} catch (_error) {
		failed++;
		failures.push(example);
		console.error(`\n❌ ${example} test failed\n`);
	}
}

// Print summary
console.log(`\n${"=".repeat(60)}`);
console.log("Test Summary");
console.log("=".repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failures.length > 0) {
	console.log(`\nFailed examples:`);
	failures.forEach((example) => console.log(`  - ${example}`));
}

console.log(`\n${"=".repeat(60)}\n`);

// Exit with error if any tests failed
process.exit(failed > 0 ? 1 : 0);
