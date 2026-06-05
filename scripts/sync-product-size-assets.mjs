/**
 * Mirrors catalog JPG/PNG assets into 100X100 and 120X120 folders per product.
 * Run: node scripts/sync-product-size-assets.mjs
 * Then: pnpm optimize:product-images
 */
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_ASSETS = path.join(ROOT, "public", "assets");
const PRODUCTS_TS = path.join(ROOT, "src", "constants", "products.ts");
const INDO_TS = path.join(ROOT, "src", "constants", "indo-products.ts");

const TARGET_SIZE_FOLDERS = ["100X100", "120X120"];
const ASSET_PATH_PATTERN = /"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi;
const SOURCE_SIZE_FOLDERS = ["60X120", "80X80"];

const SKIP_PATH_HINTS = [/panorama/i, /Ảnh Panorama/i];

async function readUtf8(filePath) {
	const { readFile } = await import("node:fs/promises");
	return readFile(filePath, "utf8");
}

function shouldSkipAssetPath(assetPath) {
	return SKIP_PATH_HINTS.some((hint) => hint.test(assetPath));
}

function parseAssetPaths(source) {
	const paths = new Set();
	for (const match of source.matchAll(ASSET_PATH_PATTERN)) {
		const assetPath = match[1];
		if (!shouldSkipAssetPath(assetPath)) {
			paths.add(assetPath);
		}
	}
	return [...paths];
}

function remapFolder(assetPath, targetFolder) {
	return assetPath.replace(/\/assets\/(60X120|80X80|100X100|120X120)\//, `/assets/${targetFolder}/`);
}

function getSidecarPaths(assetPath) {
	const base = assetPath.replace(/\.(jpe?g|png|webp)$/i, "");
	return [`${base}.listing.webp`, `${base}.detail.webp`];
}

async function copyIfNeeded(sourceRelative, targetRelative) {
	const sourceAbsolute = path.join(PUBLIC_ASSETS, sourceRelative.replace(/^\/assets\//, "").split("/").join(path.sep));
	const targetAbsolute = path.join(PUBLIC_ASSETS, targetRelative.replace(/^\/assets\//, "").split("/").join(path.sep));

	let sourceStat;
	try {
		sourceStat = await stat(sourceAbsolute);
	} catch {
		return { status: "missing-source", path: sourceRelative };
	}

	if (!sourceStat.isFile()) {
		return { status: "skip", path: sourceRelative };
	}

	await mkdir(path.dirname(targetAbsolute), { recursive: true });

	let targetStat;
	try {
		targetStat = await stat(targetAbsolute);
	} catch {
		targetStat = null;
	}

	if (targetStat && targetStat.mtimeMs >= sourceStat.mtimeMs && targetStat.size === sourceStat.size) {
		return { status: "skipped-existing", path: targetRelative };
	}

	await copyFile(sourceAbsolute, targetAbsolute);
	return { status: "copied", path: targetRelative };
}

function isSourceCatalogAsset(assetPath) {
	return SOURCE_SIZE_FOLDERS.some((folder) => assetPath.includes(`/assets/${folder}/`));
}

async function syncCatalogAsset(assetPath) {
	const results = { copied: 0, skipped: 0, missing: 0 };
	const pathsToSync = [assetPath, ...getSidecarPaths(assetPath)];

	for (const sourcePath of pathsToSync) {
		for (const targetFolder of TARGET_SIZE_FOLDERS) {
			const targetPath = remapFolder(sourcePath, targetFolder);
			const outcome = await copyIfNeeded(sourcePath, targetPath);

			if (outcome.status === "copied") {
				results.copied += 1;
			} else if (outcome.status === "missing-source") {
				if (sourcePath === assetPath) {
					results.missing += 1;
				}
			} else {
				results.skipped += 1;
			}
		}
	}

	return results;
}

async function main() {
	const [productsSource, indoSource] = await Promise.all([
		readUtf8(PRODUCTS_TS),
		readUtf8(INDO_TS),
	]);

	const assetPaths = [
		...new Set([
			...parseAssetPaths(productsSource),
			...parseAssetPaths(indoSource),
		]),
	].filter(isSourceCatalogAsset);

	let totalCopied = 0;
	let totalMissing = 0;

	for (const assetPath of assetPaths) {
		const { copied, missing } = await syncCatalogAsset(assetPath);
		totalCopied += copied;
		totalMissing += missing;
	}

	console.log(
		`Synced ${assetPaths.length} source assets → ${TARGET_SIZE_FOLDERS.join(" & ")}: ${totalCopied} copied, ${totalMissing} missing sources.`,
	);
	if (totalCopied > 0) {
		console.log("Run: pnpm optimize:product-images");
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
