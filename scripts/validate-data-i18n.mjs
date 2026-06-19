/**
 * Validates locale message coverage for ID keyed data in src/data/.
 * Run: pnpm validate:data-i18n
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const MESSAGES_DIR = path.join(ROOT, "src/messages");
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
	const raw = await readFile(path.join(MESSAGES_DIR, fileName), "utf8");
	const parsed = JSON.parse(raw);
	return collectLeafEntries(parsed);
}

/** @param {string} relativePath */
async function readDataFile(relativePath) {
	return readFile(path.join(ROOT, relativePath), "utf8");
}

/** @param {string} content @param {RegExp} pattern */
function extractMatches(content, pattern) {
	return [...content.matchAll(pattern)].map((match) => match[1]);
}

/** @param {Map<string, string>} entries @param {string} key */
function hasKey(entries, key) {
	return entries.has(key);
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

	const [productsSource, projectsSource, collectionIdsSource, processSource, testimonialsSource] =
		await Promise.all([
			readDataFile("src/data/catalog/products.ts"),
			readDataFile("src/data/projects/projects.ts"),
			readDataFile("src/data/shared/collection-ids.ts"),
			readDataFile("src/data/landing/process-steps.ts"),
			readDataFile("src/data/landing/testimonials.ts"),
		]);

	const productSlugs = extractMatches(productsSource, /slug: "([^"]+)"/g);
	const projectIds = extractMatches(projectsSource, /id: "([^"]+)"/g).filter(
		(id) => !["specification", "production", "logistics", "aftercare"].includes(id),
	);
	const collectionIds = extractMatches(collectionIdsSource, /"([^"]+)"/g).filter((id) =>
		[
			"inspire",
			"travertine",
			"orient-star",
			"sunshine",
			"architectural",
			"peace",
			"indo",
		].includes(id),
	);
	const processStepIds = extractMatches(processSource, /id: "([^"]+)"/g);
	const testimonialIds = extractMatches(testimonialsSource, /id: "([^"]+)"/g);

	const requiredKeys = [
		...productSlugs.flatMap((slug) => [
			`products.items.${slug}.name`,
			`products.items.${slug}.description`,
		]),
		...collectionIds.map((id) => `collections.${id}.name`),
		...projectIds.flatMap((id) => [
			`landing.projects.items.${id}.title`,
			`pages.projects.heritage.milestones.${id}.title`,
		]),
		...processStepIds.map((id) => `landing.process.steps.${id}.title`),
		...testimonialIds.map((id) => `landing.testimonials.items.${id}.quote`),
	];

	const failures = [];

	for (const fileName of LOCALE_FILES) {
		const entries = localeEntries.get(fileName);
		const missing = requiredKeys.filter((key) => !hasKey(entries, key)).sort();
		if (missing.length > 0) {
			failures.push({ fileName, missing });
		}
	}

	if (failures.length === 0) {
		console.log(
			`Data i18n coverage OK (${requiredKeys.length} required keys present in ${LOCALE_FILES.join(" and ")}).`,
		);
		return;
	}

	console.error("Data i18n validation failed.\n");
	for (const { fileName, missing } of failures) {
		console.error(`Missing in ${fileName}:`);
		console.error(formatKeyList(missing));
		console.error("");
	}

	process.exitCode = 1;
}

main().catch((error) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
