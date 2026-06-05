/**
 * Mirrors catalog assets into size folders consumed by `?size=` remaps.
 * - 60X120 / 80X80 → 100X100 & 120X120 (always)
 * - 60X120 → 80X80 when the product also lists 80×80cm (e.g. Travertine G12T01/T06)
 * Run: pnpm sync:product-size-assets
 */
import { copyFile, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import {
	ASSET_PATH_PATTERN,
	INDO_PRODUCTS_TS,
	PRODUCTS_TS,
	PUBLIC_ASSETS,
	collectAssetPathsRequiringSquareMirror,
	getSourceSizeFolder,
	getSyncTargetFolders,
	remapAssetPathForSizeFolder,
} from "./lib/product-asset-paths.mjs";

const SKIP_PATH_HINTS = [/panorama/i, /Ảnh Panorama/i];

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

function getSidecarPaths(assetPath) {
	const base = assetPath.replace(/\.(jpe?g|png|webp)$/i, "");
	return [`${base}.listing.webp`, `${base}.detail.webp`];
}

async function copyIfNeeded(sourceRelative, targetRelative) {
	const sourceAbsolute = path.join(
		PUBLIC_ASSETS,
		sourceRelative.replace(/^\/assets\//, "").split("/").join(path.sep),
	);
	const targetAbsolute = path.join(
		PUBLIC_ASSETS,
		targetRelative.replace(/^\/assets\//, "").split("/").join(path.sep),
	);

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

async function syncCatalogAsset(assetPath, squareMirrorPaths) {
	const results = { copied: 0, skipped: 0, missing: 0 };
	const pathsToSync = [assetPath, ...getSidecarPaths(assetPath)];
	const targetFolders = getSyncTargetFolders(assetPath, squareMirrorPaths);

	for (const sourcePath of pathsToSync) {
		for (const targetFolder of targetFolders) {
			const targetPath = remapAssetPathForSizeFolder(sourcePath, targetFolder);
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
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);

	const squareMirrorPaths = collectAssetPathsRequiringSquareMirror(productsSource);
	const assetPaths = [...new Set([...parseAssetPaths(productsSource), ...parseAssetPaths(indoSource)])].filter(
		(assetPath) => getSourceSizeFolder(assetPath),
	);

	let totalCopied = 0;
	let totalMissing = 0;

	for (const assetPath of assetPaths) {
		const { copied, missing } = await syncCatalogAsset(assetPath, squareMirrorPaths);
		totalCopied += copied;
		totalMissing += missing;
	}

	const mirrorNote =
		squareMirrorPaths.size > 0
			? ` (+80X80 for ${squareMirrorPaths.size} cross-format 60×120 asset path(s))`
			: "";

	console.log(
		`Synced ${assetPaths.length} source assets${mirrorNote}: ${totalCopied} copied, ${totalMissing} missing sources.`,
	);
	if (totalCopied > 0) {
		console.log("Run: pnpm optimize:product-images");
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
