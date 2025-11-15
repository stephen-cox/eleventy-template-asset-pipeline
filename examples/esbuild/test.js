/**
 * Simple test to verify esbuild example builds successfully
 */

import { execSync } from "child_process";
import { existsSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Testing esbuild example...");

try {
	// Clean any previous build
	const siteDir = join(__dirname, "_site");
	if (existsSync(siteDir)) {
		rmSync(siteDir, { recursive: true, force: true });
		console.log("✓ Cleaned previous build");
	}

	// Run Eleventy build
	console.log("Running Eleventy build...");
	execSync("npx @11ty/eleventy", {
		cwd: __dirname,
		stdio: "inherit",
		env: { ...process.env, ELEVENTY_ENV: "production" },
	});

	// Verify output exists
	if (!existsSync(siteDir)) {
		throw new Error("Build directory not created");
	}
	console.log("✓ Build directory created");

	// Verify JS output was created
	const jsDir = join(siteDir, "_assets", "js");
	if (!existsSync(jsDir)) {
		throw new Error("JS output directory not created");
	}
	console.log("✓ JS output directory created");

	// Verify index.html was created
	const indexFile = join(siteDir, "index.html");
	if (!existsSync(indexFile)) {
		throw new Error("index.html not created");
	}
	console.log("✓ index.html created");

	console.log("\n✅ esbuild example test passed!");
	process.exit(0);
} catch (error) {
	console.error("\n❌ esbuild example test failed:");
	console.error(error.message);
	process.exit(1);
}
