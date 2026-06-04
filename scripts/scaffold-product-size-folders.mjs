/**
 * Creates asset directories only when you are about to add files (no .gitkeep).
 * INDO square/large paths are populated by `pnpm download:indo-assets`.
 *
 * Usage:
 *   node scripts/scaffold-product-size-folders.mjs --indo-rect
 *   node scripts/scaffold-product-size-folders.mjs --product "Inspire G12962J" --sizes 100X100,120X120
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const INDO_TS = path.join(ROOT, "src", "constants", "indo-products.ts");
const ASSETS = path.join(ROOT, "public", "assets");

const INDO_RECT_SEED_PATTERN =
	/skuCode:\s*"((?:GS|SS)\d+)",\s*\n\s*format:\s*"rect"/g;

async function readFileUtf8(filePath) {
	const { readFile } = await import("node:fs/promises");
	return readFile(filePath, "utf8");
}

function collectIndoRectSkus(indoSource) {
	const skus = [];
	for (const match of indoSource.matchAll(INDO_RECT_SEED_PATTERN)) {
		skus.push(match[1]);
	}
	return skus;
}

function parseArgs(argv) {
	const options = { indoRect: false, productName: null, sizeFolders: [] };

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--indo-rect") {
			options.indoRect = true;
		} else if (arg === "--product" && argv[index + 1]) {
			options.productName = argv[++index];
		} else if (arg === "--sizes" && argv[index + 1]) {
			options.sizeFolders = argv[++index].split(",").map((s) => s.trim());
		}
	}

	return options;
}

async function ensureDirs(sizeFolder, productNames) {
	await mkdir(path.join(ASSETS, sizeFolder), { recursive: true });
	for (const productName of productNames) {
		await mkdir(path.join(ASSETS, sizeFolder, productName), { recursive: true });
	}
}

async function scaffold() {
	const { indoRect, productName, sizeFolders } = parseArgs(process.argv.slice(2));
	const created = [];

	if (indoRect) {
		const indoSource = await readFileUtf8(INDO_TS);
		const labels = collectIndoRectSkus(indoSource).map((sku) => `INDO ${sku}`);
		await ensureDirs("60X120", labels);
		created.push(`60X120 (${labels.length} INDO large-format folders)`);
	}

	if (productName && sizeFolders.length > 0) {
		for (const sizeFolder of sizeFolders) {
			await ensureDirs(sizeFolder, [productName]);
			created.push(`${sizeFolder}/${productName}`);
		}
	}

	if (created.length === 0) {
		console.log(
			"No directories created. Examples:\n" +
				"  node scripts/scaffold-product-size-folders.mjs --indo-rect\n" +
				'  node scripts/scaffold-product-size-folders.mjs --product "Inspire G12962J" --sizes 100X100,120X120',
		);
		return;
	}

	console.log(`Created: ${created.join("; ")}`);
}

scaffold().catch((error) => {
	console.error(error);
	process.exit(1);
});
