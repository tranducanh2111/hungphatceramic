/**
 * Audits product catalog media: existence, size, and required optimized sidecars.
 * Run: pnpm audit:product-media
 */
import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	PUBLIC_ASSETS,
	PRODUCTS_TS,
	REPORT_DIR,
	SIZE_THRESHOLD_BYTES,
	collectAllCatalogAssetPaths,
	collectAllFacesImagePaths,
	collectRuntimeDetailSources,
	getDetailPreviewAssetPath,
	getListingPreviewAssetPath,
	isDemoWorkAssetPath,
	isPanoramaAssetPath,
	isSidecarAssetPath,
	requiresDetailWebp,
	requiresListingWebp,
	statAsset,
	toAbsoluteAssetPath,
} from "./lib/product-asset-paths.mjs";

const STRICT = process.argv.includes("--strict");

async function collectLargeOrphanFiles(referencedPaths) {
	const referencedAbsolute = new Set(referencedPaths.map(toAbsoluteAssetPath));
	const orphans = [];

	async function walk(directory) {
		let entries;
		try {
			entries = await readdir(directory, { withFileTypes: true });
		} catch {
			return;
		}

		for (const entry of entries) {
			const absolutePath = path.join(directory, entry.name);
			if (entry.isDirectory()) {
				if (entry.name === "_archive") continue;
				await walk(absolutePath);
				continue;
			}

			if (!/\.(jpe?g|png|webp)$/i.test(entry.name)) continue;
			if (isSidecarAssetPath(entry.name)) continue;

			const fileStat = await stat(absolutePath);
			if (fileStat.size <= SIZE_THRESHOLD_BYTES) continue;
			if (referencedAbsolute.has(absolutePath)) continue;

			orphans.push({
				path: `/assets/${path.relative(PUBLIC_ASSETS, absolutePath).split(path.sep).join("/")}`,
				sizeMb: Number((fileStat.size / 1e6).toFixed(2)),
			});
		}
	}

	await walk(PUBLIC_ASSETS);
	return orphans.sort((a, b) => b.sizeMb - a.sizeMb);
}

async function auditAsset(assetPath, allFacesImagePaths) {
	const sourceStat = await statAsset(assetPath);
	const detailPath = getDetailPreviewAssetPath(assetPath);
	const listingPath = getListingPreviewAssetPath(assetPath);
	const needsDetail = requiresDetailWebp(assetPath, allFacesImagePaths);
	const needsListing = requiresListingWebp(assetPath);

	const detailStat = await statAsset(detailPath);
	const listingStat = await statAsset(listingPath);
	const isArchivedOriginal =
		!sourceStat.exists && needsDetail && detailStat.exists;

	return {
		assetPath,
		exists: sourceStat.exists,
		isArchivedOriginal,
		sizeMb: sourceStat.sizeMb,
		isLarge: sourceStat.sizeBytes > SIZE_THRESHOLD_BYTES,
		isDemoWork: isDemoWorkAssetPath(assetPath),
		isPanorama: isPanoramaAssetPath(assetPath),
		needsDetailWebp: needsDetail,
		needsListingWebp: needsListing,
		detailPath,
		detailExists: detailStat.exists,
		detailSizeMb: detailStat.sizeMb,
		listingPath,
		listingExists: listingStat.exists,
		listingSizeMb: listingStat.sizeMb,
		missingDetail: needsDetail && !detailStat.exists,
		missingListing: needsListing && !listingStat.exists,
		missingSource: !sourceStat.exists && !isArchivedOriginal,
	};
}

async function auditRuntimeDetailPaths() {
	const runtimeSources = await collectRuntimeDetailSources();
	const missing = [];

	for (const sourcePath of runtimeSources) {
		const detailPath = getDetailPreviewAssetPath(sourcePath);
		const detailStat = await statAsset(detailPath);
		const sourceStat = await statAsset(sourcePath);

		if (!detailStat.exists && sourceStat.exists) {
			missing.push({ sourcePath, detailPath });
		}
	}

	return missing;
}

async function main() {
	const productsSource = await readFile(PRODUCTS_TS, "utf8");
	const allFacesImagePaths = collectAllFacesImagePaths(productsSource);
	const assetPaths = await collectAllCatalogAssetPaths();
	const audits = [];

	for (const assetPath of assetPaths) {
		audits.push(await auditAsset(assetPath, allFacesImagePaths));
	}

	const missingRuntimeDetail = await auditRuntimeDetailPaths();

	const missingSources = audits.filter((entry) => entry.missingSource);
	const archivedOriginals = audits.filter((entry) => entry.isArchivedOriginal);
	const missingDetail = audits.filter((entry) => entry.missingDetail);
	const missingListing = audits.filter((entry) => entry.missingListing);
	const largeActive = audits.filter(
		(entry) => entry.exists && entry.isLarge && !entry.needsDetailWebp,
	);
	const largePendingArchive = audits.filter(
		(entry) => entry.exists && entry.isLarge && entry.needsDetailWebp && entry.detailExists,
	);
	const largeUnoptimized = audits.filter(
		(entry) => entry.exists && entry.isLarge && entry.needsDetailWebp && !entry.detailExists,
	);

	const orphans = await collectLargeOrphanFiles(assetPaths);

	const report = {
		generatedAt: new Date().toISOString(),
		archiveRoot: "/assets/_archive/originals/",
		summary: {
			totalPaths: assetPaths.length,
			missingSources: missingSources.length,
			archivedOriginals: archivedOriginals.length,
			missingDetailWebp: missingDetail.length,
			missingListingWebp: missingListing.length,
			largeInPlaceAssets: largeActive.length,
			largeReadyToArchive: largePendingArchive.length,
			largeMissingDetailWebp: largeUnoptimized.length,
			largeOrphans: orphans.length,
			missingRuntimeDetailWebp: missingRuntimeDetail.length,
		},
		missingRuntimeDetail,
		archivedOriginals,
		missingSources,
		missingDetail,
		missingListing,
		largeUnoptimized,
		largePendingArchive,
		largeActive,
		orphans: orphans.slice(0, 50),
		audits,
	};

	await mkdir(REPORT_DIR, { recursive: true });
	const reportPath = path.join(REPORT_DIR, "product-media-audit.json");
	await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

	console.log(`Audited ${assetPaths.length} catalog asset path(s).`);
	console.log(`Report: ${reportPath}\n`);
	console.log(`Missing sources: ${missingSources.length}`);
	console.log(`Archived originals (detail sidecar present): ${archivedOriginals.length}`);
	console.log(`Missing .detail.webp: ${missingDetail.length}`);
	console.log(`Missing .listing.webp: ${missingListing.length}`);
	console.log(`Large files pending detail sidecar: ${largeUnoptimized.length}`);
	console.log(`Large files ready to archive: ${largePendingArchive.length}`);
	console.log(`Large in-place assets (faces/thumbs): ${largeActive.length}`);
	console.log(`Large orphan files (unreferenced): ${orphans.length}`);
	console.log(`Missing runtime .detail.webp (with source): ${missingRuntimeDetail.length}`);

	if (missingRuntimeDetail.length > 0) {
		console.log("\nMissing runtime .detail.webp (first 15):");
		for (const entry of missingRuntimeDetail.slice(0, 15)) {
			console.log(`  ${entry.detailPath}`);
		}
	}

	if (missingDetail.length > 0) {
		console.log("\nMissing .detail.webp (first 10):");
		for (const entry of missingDetail.slice(0, 10)) {
			console.log(`  ${entry.assetPath} → ${entry.detailPath}`);
		}
	}

	if (
		STRICT &&
		(missingDetail.length > 0 ||
			missingListing.length > 0 ||
			missingSources.length > 0 ||
			missingRuntimeDetail.length > 0)
	) {
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
