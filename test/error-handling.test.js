import test from "ava";
import ProcessAssets from "../src/ProcessAssets.js";

// Simple processFile function for testing
const simpleProcessFile = async (file) => {
	const fs = await import("fs");
	return fs.promises.readFile(file, "utf8");
};

// Test constructor validation
test("ProcessAssets constructor - throws on missing config", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets();
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /configuration must be an object/i);
});

test("ProcessAssets constructor - throws on null config", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets(null);
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /configuration must be an object/i);
});

test("ProcessAssets constructor - throws on array config", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets([]);
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /configuration must be an object/i);
});

test("ProcessAssets constructor - throws on missing required parameters", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /missing required configuration parameters/i);
	t.true(error.message.includes("inDirectory"));
	t.true(error.message.includes("inExtension"));
	t.true(error.message.includes("outDirectory"));
	t.true(error.message.includes("outExtension"));
});

test("ProcessAssets constructor - throws on missing inDirectory", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /missing required configuration parameters/i);
	t.true(error.message.includes("inDirectory"));
});

test("ProcessAssets constructor - throws on invalid collection type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				collection: 123,
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /collection must be a string/i);
});

test("ProcessAssets constructor - throws on empty collection", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				collection: "  ",
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /collection cannot be empty/i);
});

test("ProcessAssets constructor - throws on invalid production type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
				production: "yes",
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /production must be a boolean/i);
});

test("ProcessAssets constructor - throws on empty inDirectory array", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: [],
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /inDirectory array cannot be empty/i);
});

test("ProcessAssets constructor - throws on invalid inExtension type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: 123,
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /inExtension must be a string/i);
});

test("ProcessAssets constructor - throws on empty inExtension", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "  ",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /inExtension cannot be empty/i);
});

test("ProcessAssets constructor - throws on invalid outDirectory type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: 123,
				outExtension: "css",
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /outDirectory must be a string/i);
});

test("ProcessAssets constructor - throws on empty outDirectory", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "  ",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /outDirectory cannot be empty/i);
});

test("ProcessAssets constructor - throws on invalid outExtension type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: 123,
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /outExtension must be a string/i);
});

test("ProcessAssets constructor - throws on empty outExtension", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "  ",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /outExtension cannot be empty/i);
});

test("ProcessAssets constructor - throws on invalid processFile type", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
				processFile: "not a function",
			});
		},
		{ instanceOf: TypeError },
	);

	t.regex(error.message, /processFile must be a function/i);
});

test("ProcessAssets constructor - throws on directory traversal in inDirectory", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "../../../etc",
				inExtension: "css",
				outDirectory: "_assets/css",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /directory traversal not allowed/i);
});

test("ProcessAssets constructor - throws on directory traversal in outDirectory", (t) => {
	const error = t.throws(
		() => {
			new ProcessAssets({
				inDirectory: "./test/fixtures",
				inExtension: "css",
				outDirectory: "../../../var/www",
				outExtension: "css",
			});
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /directory traversal not allowed/i);
});

test("ProcessAssets.processDirectory() - throws when no processFile is configured", async (t) => {
	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures",
		inExtension: "css",
		outDirectory: "_assets/css",
		outExtension: "css",
	});

	const error = await t.throwsAsync(
		async () => {
			await processor.processDirectory();
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /no processFile function configured/i);
});

test("ProcessAssets.processDirectory() - handles processFile errors gracefully", async (t) => {
	const failingProcessFile = async () => {
		throw new Error("Simulated processing error");
	};

	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures",
		inExtension: "css",
		outDirectory: "_assets/css",
		outExtension: "css",
		processFile: failingProcessFile,
	});

	const error = await t.throwsAsync(
		async () => {
			await processor.processDirectory();
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /failed to process file/i);
	t.true(error.message.includes("Simulated processing error"));
});

test("ProcessAssets.processDirectory() - throws when processFile returns null", async (t) => {
	const nullProcessFile = async () => null;

	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures",
		inExtension: "css",
		outDirectory: "_assets/css",
		outExtension: "css",
		processFile: nullProcessFile,
	});

	const error = await t.throwsAsync(
		async () => {
			await processor.processDirectory();
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /processFile function returned null/i);
});

test("ProcessAssets.processDirectory() - throws when processFile returns undefined", async (t) => {
	const undefinedProcessFile = async () => undefined;

	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures",
		inExtension: "css",
		outDirectory: "_assets/css",
		outExtension: "css",
		processFile: undefinedProcessFile,
	});

	const error = await t.throwsAsync(
		async () => {
			await processor.processDirectory();
		},
		{ instanceOf: Error },
	);

	t.regex(error.message, /processFile function returned undefined/i);
});

test("ProcessAssets.processDirectory() - handles empty directories gracefully", async (t) => {
	const processor = new ProcessAssets({
		inDirectory: "./test/fixtures/nonexistent",
		inExtension: "css",
		outDirectory: "_assets/css",
		outExtension: "css",
		processFile: simpleProcessFile,
	});

	// This should not throw - empty directories are acceptable
	const files = await processor.processDirectory();
	t.true(Array.isArray(files));
	t.is(files.length, 0);
});
