/**
 * Compresses oversized product catalog images (thumbnails, faces, composites).
 * Run: node scripts/optimize-product-catalog-images.mjs
 */
import { readFile, rename, unlink, stat, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PRODUCTS_TS = path.join(ROOT, "src", "constants", "products.ts");
const INDO_PRODUCTS_TS = path.join(ROOT, "src", "constants", "indo-products.ts");

/** Only process assets referenced in the product registry. */
const ASSET_PATH_PATTERN = /"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi;

const SIZE_THRESHOLD_BYTES = 1_500_000;
const MIN_SAVINGS_RATIO = 0.08;

const LISTING_PREVIEW_MAX_EDGE = 1280;
const LISTING_PREVIEW_QUALITY = 78;

function isDemoWorkAssetPath(assetPath) {
	const fileName = path.basename(assetPath);
	if (fileName.endsWith(".listing.webp")) {
		return false;
	}

	return /^PC/i.test(fileName);
}

const PROFILE_BY_HINT = [
	{ test: (p) => /panorama/i.test(p), skip: true },
	{ test: (p) => isDemoWorkAssetPath(p), skip: true },
	{ test: (p) => /faces|6 faces|6 FACES/i.test(p), maxEdge: 2800, quality: 82 },
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

function collectIndoAssetPaths(indoSource) {
	const paths = new Set();
	const squareSkus = new Set(["GS881042", "GS881045", "GS883009", "SS886101", "SS886106"]);
	const skuPattern = /skuCode:\s*"((?:GS|SS)\d+)"/g;
	const compositePattern = /hasFullFacesComposite:\s*(true|false)/g;

	const skus = [...indoSource.matchAll(skuPattern)].map((m) => m[1]);
	const composites = [...indoSource.matchAll(compositePattern)].map((m) => m[1] === "true");

	for (let index = 0; index < skus.length; index += 1) {
		const sku = skus[index];
		const sizeFolder = squareSkus.has(sku) ? "100X100" : "60X120";
		const base = `/assets/${sizeFolder}/INDO ${sku}`;
		paths.add(`${base}/${sku}.jpg`);
		paths.add(`${base}/${sku}_PhoiCanh.jpg`);
		if (composites[index]) {
			paths.add(`${base}/${sku}_FullFaces.jpg`);
		}
	}
	return paths;
}

const SYNCED_SIZE_FOLDERS = ["100X100", "120X120"];

async function collectSyncedSizeAssetPaths() {
	const paths = new Set();
	const assetsRoot = path.join(PUBLIC_DIR, "assets");

	for (const sizeFolder of SYNCED_SIZE_FOLDERS) {
		const folderRoot = path.join(assetsRoot, sizeFolder);
		let productDirs;
		try {
			productDirs = await readdir(folderRoot, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const productDir of productDirs) {
			if (!productDir.isDirectory()) continue;
			const productPath = path.join(folderRoot, productDir.name);
			const files = await readdir(productPath, { withFileTypes: true });
			for (const file of files) {
				if (!file.isFile()) continue;
				if (!/\.(jpe?g|png|webp)$/i.test(file.name)) continue;
				if (file.name.endsWith(".listing.webp")) continue;
				paths.add(`/assets/${sizeFolder}/${productDir.name}/${file.name}`);
			}
		}
	}

	return paths;
}

async function collectAssetPaths() {
	const [productsSource, indoSource] = await Promise.all([
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);
	const paths = new Set(collectIndoAssetPaths(indoSource));

	for (const match of productsSource.matchAll(ASSET_PATH_PATTERN)) {
		const assetPath = match[1];
		if (!assetPath.includes("Ảnh Panorama")) {
			paths.add(assetPath);
		}
	}

	for (const syncedPath of await collectSyncedSizeAssetPaths()) {
		paths.add(syncedPath);
	}

	return [...paths].sort();
}

function getListingPreviewAssetPath(assetPath) {
	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".listing.webp");
}

async function generateListingPreview(assetPath) {
	if (!isDemoWorkAssetPath(assetPath)) {
		return { assetPath, status: "skip-not-demo" };
	}

	const absoluteSourcePath = path.join(
		PUBLIC_DIR,
		assetPath.replace(/^\//, "").split("/").join(path.sep),
	);
	const listingAssetPath = getListingPreviewAssetPath(assetPath);
	const absoluteListingPath = path.join(
		PUBLIC_DIR,
		listingAssetPath.replace(/^\//, "").split("/").join(path.sep),
	);

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

	const outputBuffer = await outputPipeline
		.webp({ quality: LISTING_PREVIEW_QUALITY })
		.toBuffer();

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

	const absolutePath = path.join(PUBLIC_DIR, assetPath.replace(/^\//, "").split("/").join(path.sep));
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
	const assetPaths = await collectAssetPaths();
	console.log(`Found ${assetPaths.length} catalog asset paths in products.ts\n`);

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

	const optimized = results.filter((r) => r.status === "optimized");
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
