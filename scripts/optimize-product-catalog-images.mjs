/**
 * Compresses oversized product catalog images (thumbnails, faces, composites)
 * and generates `.listing.webp` sidecars for PC-* demo work.
 * Run: pnpm optimize:product-images
 */
import { readFile, rename, unlink, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
	SIZE_THRESHOLD_BYTES,
	collectAllCatalogAssetPaths,
	getListingPreviewAssetPath,
	isDemoWorkAssetPath,
	isPanoramaAssetPath,
	toAbsoluteAssetPath,
} from "./lib/product-asset-paths.mjs";

const MIN_SAVINGS_RATIO = 0.08;
const LISTING_PREVIEW_MAX_EDGE = 1280;
const LISTING_PREVIEW_QUALITY = 78;

const PROFILE_BY_HINT = [
	{ test: (assetPath) => isPanoramaAssetPath(assetPath), skip: true },
	{ test: (assetPath) => isDemoWorkAssetPath(assetPath), skip: true },
	{ test: (assetPath) => /faces|6 faces|6 FACES|FullFaces/i.test(path.basename(assetPath)), maxEdge: 2800, quality: 82 },
	{ test: () => true, maxEdge: 1600, quality: 84 },
];

function getProfile(assetPath) {
	for (const profile of PROFILE_BY_HINT) {
		if (profile.test(assetPath)) {
			return profile;
		}
	}
	return PROFILE_BY_HINT.at(-1);
}

async function collectOptimizableAssetPaths() {
	const assetPaths = await collectAllCatalogAssetPaths();
	return assetPaths.filter((assetPath) => !isPanoramaAssetPath(assetPath));
}

async function generateListingPreview(assetPath) {
	const absoluteSourcePath = toAbsoluteAssetPath(assetPath);
	const listingAssetPath = getListingPreviewAssetPath(assetPath);
	const absoluteListingPath = toAbsoluteAssetPath(listingAssetPath);

	let sourceStat;
	try {
		sourceStat = await stat(absoluteSourcePath);
	} catch {
		return { assetPath: listingAssetPath, status: "missing-source" };
	}

	try {
		const listingStat = await stat(absoluteListingPath);
		if (listingStat.mtimeMs >= sourceStat.mtimeMs) {
			return {
				assetPath: listingAssetPath,
				status: "preview-current",
				afterMb: (listingStat.size / 1e6).toFixed(2),
			};
		}
	} catch {
		// Generate a new listing preview.
	}

	const inputBuffer = await readFile(absoluteSourcePath);
	const pipeline = sharp(inputBuffer, { failOn: "none", limitInputPixels: false }).rotate();
	const metadata = await pipeline.metadata();
	const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);
	const resizeTo = Math.min(LISTING_PREVIEW_MAX_EDGE, longestEdge);

	let outputPipeline = pipeline;
	if (longestEdge > resizeTo) {
		outputPipeline = outputPipeline.resize({
			width: metadata.width >= metadata.height ? resizeTo : undefined,
			height: metadata.height > metadata.width ? resizeTo : undefined,
			fit: "inside",
			withoutEnlargement: true,
		});
	}

	const outputBuffer = await outputPipeline.webp({ quality: LISTING_PREVIEW_QUALITY }).toBuffer();

	await sharp(outputBuffer).toFile(absoluteListingPath);

	return {
		assetPath: listingAssetPath,
		status: "preview-created",
		beforeMb: (sourceStat.size / 1e6).toFixed(2),
		afterMb: (outputBuffer.length / 1e6).toFixed(2),
		dimensions: `${metadata.width}×${metadata.height} → max ${resizeTo}`,
	};
}

async function optimizeImage(assetPath) {
	const profile = getProfile(assetPath);
	if (profile.skip) {
		return { assetPath, status: "skipped-scene" };
	}

	const absolutePath = toAbsoluteAssetPath(assetPath);
	let fileStat;

	try {
		fileStat = await stat(absolutePath);
	} catch {
		return { assetPath, status: "missing" };
	}

	if (fileStat.size < SIZE_THRESHOLD_BYTES) {
		return { assetPath, status: "ok-size", beforeMb: (fileStat.size / 1e6).toFixed(2) };
	}

	const inputBuffer = await readFile(absolutePath);
	const pipeline = sharp(inputBuffer, { failOn: "none" }).rotate();
	const metadata = await pipeline.metadata();
	const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);
	const resizeTo = Math.min(profile.maxEdge, longestEdge);

	let outputPipeline = pipeline;
	if (longestEdge > resizeTo) {
		outputPipeline = outputPipeline.resize({
			width: metadata.width >= metadata.height ? resizeTo : undefined,
			height: metadata.height > metadata.width ? resizeTo : undefined,
			fit: "inside",
			withoutEnlargement: true,
		});
	}

	const ext = path.extname(absolutePath).toLowerCase();
	const outputBuffer =
		ext === ".png"
			? await outputPipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
			: await outputPipeline.jpeg({ quality: profile.quality, mozjpeg: true }).toBuffer();

	if (outputBuffer.length >= fileStat.size * (1 - MIN_SAVINGS_RATIO)) {
		return {
			assetPath,
			status: "skipped-no-gain",
			beforeMb: (fileStat.size / 1e6).toFixed(2),
			afterMb: (outputBuffer.length / 1e6).toFixed(2),
		};
	}

	const tempPath = `${absolutePath}.opt-tmp`;
	await sharp(outputBuffer).toFile(tempPath);
	await unlink(absolutePath);
	await rename(tempPath, absolutePath);

	return {
		assetPath,
		status: "optimized",
		beforeMb: (fileStat.size / 1e6).toFixed(2),
		afterMb: (outputBuffer.length / 1e6).toFixed(2),
		dimensions: `${metadata.width}×${metadata.height} → max ${resizeTo}`,
	};
}

async function main() {
	const assetPaths = await collectOptimizableAssetPaths();
	console.log(`Found ${assetPaths.length} catalog asset paths\n`);

	const results = [];
	for (const assetPath of assetPaths) {
		const result = await optimizeImage(assetPath);
		results.push(result);
		const detail = [
			result.status,
			result.beforeMb ? `${result.beforeMb}MB` : "",
			result.afterMb ? `→ ${result.afterMb}MB` : "",
			result.dimensions ?? "",
		]
			.filter(Boolean)
			.join(" ");
		console.log(`${assetPath}: ${detail}`);
	}

	const optimized = results.filter((result) => result.status === "optimized");
	console.log(`\nOptimized ${optimized.length} in-place file(s).`);

	const demoWorkPaths = assetPaths.filter((assetPath) => isDemoWorkAssetPath(assetPath));
	console.log(`\nGenerating ${demoWorkPaths.length} listing preview(s) for PC-* demo work...\n`);

	const previewResults = [];
	for (const assetPath of demoWorkPaths) {
		const result = await generateListingPreview(assetPath);
		previewResults.push(result);
		const detail = [
			result.status,
			result.beforeMb ? `${result.beforeMb}MB` : "",
			result.afterMb ? `→ ${result.afterMb}MB` : "",
			result.dimensions ?? "",
		]
			.filter(Boolean)
			.join(" ");
		console.log(`${result.assetPath}: ${detail}`);
	}

	const created = previewResults.filter((result) => result.status === "preview-created");
	console.log(`\nDone. Created ${created.length} listing preview(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
