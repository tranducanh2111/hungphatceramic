/**
 * Compresses oversized product catalog images (thumbnails, faces, composites).
 * Run: node scripts/optimize-product-catalog-images.mjs
 */
import { readFile, rename, unlink, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const PRODUCTS_TS = path.join(ROOT, "src", "constants", "products.ts");

/** Only process assets referenced in the product registry. */
const ASSET_PATH_PATTERN = /"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi;

const SIZE_THRESHOLD_BYTES = 1_500_000;
const MIN_SAVINGS_RATIO = 0.08;

const PROFILE_BY_HINT = [
	{ test: (p) => /panorama/i.test(p) || /PC-/i.test(p), skip: true },
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

async function collectAssetPaths() {
	const source = await readFile(PRODUCTS_TS, "utf8");
	const paths = new Set();
	for (const match of source.matchAll(ASSET_PATH_PATTERN)) {
		const assetPath = match[1];
		if (!assetPath.includes("Ảnh Panorama")) {
			paths.add(assetPath);
		}
	}
	return [...paths].sort();
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
	console.log(`\nDone. Optimized ${optimized.length} file(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
