/**
 * Shared WebP sidecar generation for catalog demo work, composites, and panoramas.
 */
import { mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
	getDetailPreviewAssetPath,
	getListingPreviewAssetPath,
	toAbsoluteAssetPath,
} from "./product-asset-paths.mjs";

export const LISTING_PREVIEW_MAX_EDGE = 1280;
export const LISTING_PREVIEW_QUALITY = 78;
export const DETAIL_PREVIEW_MAX_EDGE = 1920;
export const DETAIL_PREVIEW_QUALITY = 80;

async function ensureParentDirectory(absoluteOutputPath) {
	await mkdir(path.dirname(absoluteOutputPath), { recursive: true });
}

export async function generateListingPreview(assetPath) {
	const absoluteSourcePath = toAbsoluteAssetPath(assetPath);
	const listingAssetPath = getListingPreviewAssetPath(assetPath);
	const absoluteListingPath = toAbsoluteAssetPath(listingAssetPath);

	let sourceStat;
	try {
		sourceStat = await stat(absoluteSourcePath);
	} catch {
		return { assetPath: listingAssetPath, sourcePath: assetPath, status: "missing-source" };
	}

	try {
		const listingStat = await stat(absoluteListingPath);
		if (listingStat.mtimeMs >= sourceStat.mtimeMs) {
			return {
				assetPath: listingAssetPath,
				sourcePath: assetPath,
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

	await ensureParentDirectory(absoluteListingPath);
	await sharp(outputBuffer).toFile(absoluteListingPath);

	return {
		assetPath: listingAssetPath,
		sourcePath: assetPath,
		status: "preview-created",
		beforeMb: (sourceStat.size / 1e6).toFixed(2),
		afterMb: (outputBuffer.length / 1e6).toFixed(2),
		dimensions: `${metadata.width}×${metadata.height} → max ${resizeTo}`,
	};
}

export async function generateDetailPreview(assetPath) {
	const absoluteSourcePath = toAbsoluteAssetPath(assetPath);
	const detailAssetPath = getDetailPreviewAssetPath(assetPath);
	const absoluteDetailPath = toAbsoluteAssetPath(detailAssetPath);

	let sourceStat;
	try {
		sourceStat = await stat(absoluteSourcePath);
	} catch {
		return { assetPath: detailAssetPath, sourcePath: assetPath, status: "missing-source" };
	}

	try {
		const detailStat = await stat(absoluteDetailPath);
		if (detailStat.mtimeMs >= sourceStat.mtimeMs) {
			return {
				assetPath: detailAssetPath,
				sourcePath: assetPath,
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

	await ensureParentDirectory(absoluteDetailPath);
	await sharp(outputBuffer).toFile(absoluteDetailPath);

	return {
		assetPath: detailAssetPath,
		sourcePath: assetPath,
		status: "detail-created",
		beforeMb: (sourceStat.size / 1e6).toFixed(2),
		afterMb: (outputBuffer.length / 1e6).toFixed(2),
		dimensions: `${metadata.width}×${metadata.height} → max ${resizeTo}`,
	};
}
