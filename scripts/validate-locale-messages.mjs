/**
 * Ensures locale message files share identical key sets (leaf paths only).
 * Run: pnpm validate:locale-messages
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MESSAGES_DIR = path.join(__dirname, "../src/messages");
const LOCALE_FILES = ["en.json", "vi.json"];

/** @param {unknown} value @param {string} prefix @returns {Map<string, string>} */
function collectLeafEntries(value, prefix = "") {
	/** @type {Map<string, string>} */
	const entries = new Map();

	if (typeof value === "string") {
		entries.set(prefix, value);
		return entries;
	}

	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		throw new TypeError(
			`Invalid message value at "${prefix || "<root>"}": expected nested object or string leaf.`,
		);
	}

	for (const [key, nestedValue] of Object.entries(value)) {
		const nestedPrefix = prefix ? `${prefix}.${key}` : key;
		for (const [leafKey, leafValue] of collectLeafEntries(nestedValue, nestedPrefix)) {
			entries.set(leafKey, leafValue);
		}
	}

	return entries;
}

/** @param {string} fileName */
async function loadLocaleEntries(fileName) {
	const filePath = path.join(MESSAGES_DIR, fileName);
	const raw = await readFile(filePath, "utf8");

	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		throw new Error(`Failed to parse ${fileName}: ${message}`);
	}

	if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
		throw new Error(`${fileName} must contain a JSON object at the root.`);
	}

	return collectLeafEntries(parsed);
}

/** @param {string[]} keys */
function formatKeyList(keys) {
	return keys.map((key) => `  - ${key}`).join("\n");
}

async function main() {
	const localeEntries = new Map();

	for (const fileName of LOCALE_FILES) {
		localeEntries.set(fileName, await loadLocaleEntries(fileName));
	}

	const [enFileName, viFileName] = LOCALE_FILES;
	const enEntries = localeEntries.get(enFileName);
	const viEntries = localeEntries.get(viFileName);

	const missingInVi = [...enEntries.keys()].filter((key) => !viEntries.has(key)).sort();
	const missingInEn = [...viEntries.keys()].filter((key) => !enEntries.has(key)).sort();

	if (missingInVi.length === 0 && missingInEn.length === 0) {
		console.log(
			`Locale message keys are in sync (${enEntries.size} keys in ${enFileName} and ${viFileName}).`,
		);
		return;
	}

	console.error("Locale message key parity check failed.\n");

	if (missingInVi.length > 0) {
		console.error(`Missing in ${viFileName} (present in ${enFileName}):`);
		console.error(formatKeyList(missingInVi));
		console.error("");
	}

	if (missingInEn.length > 0) {
		console.error(`Missing in ${enFileName} (present in ${viFileName}):`);
		console.error(formatKeyList(missingInEn));
		console.error("");
	}

	console.error(
		"Add every missing key to the corresponding locale file so both files share the same key set.",
	);
	process.exitCode = 1;
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
