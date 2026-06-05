/**
 * Generates .detail.webp sidecars (1920px max) for PC-*, composites, panoramas, and oversized faces.
 * Run: pnpm generate:detail-media
 */
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
	collectRuntimeDetailSources,
	getDetailPreviewAssetPath,
	isSidecarAssetPath,
	toAbsoluteAssetPath,
} from "./lib/product-asset-paths.mjs";

const DETAIL_PREVIEW_MAX_EDGE = 1920;
const DETAIL_PREVIEW_QUALITY = 80;

async function generateDetailPreview(assetPath) {
	if (isSidecarAssetPath(assetPath)) {
		return { assetPath, status: "skip-sidecar" };
	}

	const absoluteSourcePath = toAbsoluteAssetPath(assetPath);
	const detailAssetPath = getDetailPreviewAssetPath(assetPath);
	const absoluteDetailPath = toAbsoluteAssetPath(detailAssetPath);

	let sourceStat;
	try {
		sourceStat = await stat(absoluteSourcePath);
	} catch {
		return { assetPath: detailAssetPath, status: "missing-source" };
	}

	try {
		const detailStat = await stat(absoluteDetailPath);
		if (detailStat.mtimeMs >= sourceStat.mtimeMs) {
			return {
				assetPath: detailAssetPath,
				status: "detail-current",
				afterMb: (detailStat.size / 1e6).toFixed(2),
			};
		}
	} catch {
		// Generate a new detail preview.
	}

	const inputBuffer = await readFile(absoluteSourcePath);
	const pipeline = sharp(inputBuffer, { failOn: "none", limitInputPixels: false }).rotate();
	const metadata = await pipeline.metadata();
	const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);
	const resizeTo = Math.min(DETAIL_PREVIEW_MAX_EDGE, longestEdge);

	let outputPipeline = pipeline;
	if (longestEdge > resizeTo) {
		outputPipeline = outputPipeline.resize({
			width: metadata.width >= metadata.height ? resizeTo : undefined,
			height: metadata.height > metadata.width ? resizeTo : undefined,
			fit: "inside",
			withoutEnlargement: true,
		});
	}

	const outputBuffer = await outputPipeline.webp({ quality: DETAIL_PREVIEW_QUALITY }).toBuffer();

	await sharp(outputBuffer).toFile(absoluteDetailPath);

	return {
		assetPath: detailAssetPath,
		status: "detail-created",
		beforeMb: (sourceStat.size / 1e6).toFixed(2),
		afterMb: (outputBuffer.length / 1e6).toFixed(2),
		dimensions: `${metadata.width}×${metadata.height} → max ${resizeTo}`,
	};
}

async function main() {
	const targets = await collectRuntimeDetailSources();

	console.log(`Generating .detail.webp for ${targets.length} target asset(s)...\n`);

	const results = [];
	for (const assetPath of targets) {
		const result = await generateDetailPreview(assetPath);
		results.push(result);
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

	const created = results.filter((result) => result.status === "detail-created");
	console.log(`\nDone. Created ${created.length} .detail.webp file(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
