/**
 * Verifies catalog media is import-complete and optionally generates missing sidecars.
 *
 * Checks:
 * - Registry source files exist (or archived originals with detail sidecar)
 * - Required `.detail.webp` and `.listing.webp` sidecars for demo work / composites / panoramas
 *
 * Run:
 *   pnpm ensure:product-media          # audit only
 *   pnpm ensure:product-media:fix      # audit + generate missing sidecars
 */
import { readFile } from "node:fs/promises";
import {
	PRODUCTS_TS,
	collectAllCatalogAssetPaths,
	collectAllFacesImagePaths,
	collectRuntimeDetailSources,
	getDetailPreviewAssetPath,
	getListingPreviewAssetPath,
	isDemoWorkAssetPath,
	isSidecarAssetPath,
	requiresDetailWebp,
	requiresListingWebp,
	statAsset,
} from "./lib/product-asset-paths.mjs";
import { generateDetailPreview, generateListingPreview } from "./lib/product-media-sidecars.mjs";

const SHOULD_FIX = process.argv.includes("--fix");
const STRICT = process.argv.includes("--strict") || process.argv.includes("--fix");

async function auditCatalogEntry(assetPath, allFacesImagePaths) {
	const sourceStat = await statAsset(assetPath);
	const detailPath = getDetailPreviewAssetPath(assetPath);
	const listingPath = getListingPreviewAssetPath(assetPath);
	const needsDetail = requiresDetailWebp(assetPath, allFacesImagePaths);
	const needsListing = requiresListingWebp(assetPath);

	const detailStat = await statAsset(detailPath);
	const listingStat = await statAsset(listingPath);
	const isArchivedOriginal = !sourceStat.exists && needsDetail && detailStat.exists;

	return {
		assetPath,
		needsDetail,
		needsListing,
		detailPath,
		listingPath,
		sourceExists: sourceStat.exists,
		isArchivedOriginal,
		missingSource: !sourceStat.exists && !isArchivedOriginal,
		missingDetail: needsDetail && !detailStat.exists,
		missingListing: needsListing && !listingStat.exists,
	};
}

async function collectListingTargets(runtimeDetailSources) {
	const targets = new Set();

	for (const assetPath of runtimeDetailSources) {
		if (isDemoWorkAssetPath(assetPath)) {
			targets.add(assetPath);
		}
	}

	return [...targets].sort();
}

async function main() {
	const productsSource = await readFile(PRODUCTS_TS, "utf8");
	const allFacesImagePaths = collectAllFacesImagePaths(productsSource);
	const catalogPaths = await collectAllCatalogAssetPaths();
	const runtimeDetailSources = await collectRuntimeDetailSources();
	const listingTargets = await collectListingTargets(runtimeDetailSources);

	const catalogAudits = [];
	for (const assetPath of catalogPaths) {
		if (isSidecarAssetPath(assetPath)) continue;
		catalogAudits.push(await auditCatalogEntry(assetPath, allFacesImagePaths));
	}

	const missingSources = catalogAudits.filter((entry) => entry.missingSource);
	const missingDetail = catalogAudits.filter((entry) => entry.missingDetail);
	const missingListing = catalogAudits.filter((entry) => entry.missingListing);

	const runtimeDetailGaps = [];
	for (const sourcePath of runtimeDetailSources) {
		const detailPath = getDetailPreviewAssetPath(sourcePath);
		const detailStat = await statAsset(detailPath);
		const sourceStat = await statAsset(sourcePath);
		if (!detailStat.exists && sourceStat.exists) {
			runtimeDetailGaps.push({ sourcePath, detailPath });
		}
	}

	const listingGaps = [];
	for (const sourcePath of listingTargets) {
		const listingPath = getListingPreviewAssetPath(sourcePath);
		const listingStat = await statAsset(listingPath);
		const sourceStat = await statAsset(sourcePath);
		if (!listingStat.exists && sourceStat.exists) {
			listingGaps.push({ sourcePath, listingPath });
		}
	}

	console.log(`Catalog paths audited: ${catalogAudits.length}`);
	console.log(`Runtime detail targets: ${runtimeDetailSources.length}`);
	console.log(`Listing targets (demo work): ${listingTargets.length}\n`);

	if (missingSources.length > 0) {
		console.log(`Missing source files (${missingSources.length}):`);
		for (const entry of missingSources) {
			console.log(`  ${entry.assetPath}`);
		}
		console.log("");
	}

	if (missingDetail.length > 0 || runtimeDetailGaps.length > 0) {
		const detailGapPaths = new Set([
			...missingDetail.map((entry) => entry.assetPath),
			...runtimeDetailGaps.map((entry) => entry.sourcePath),
		]);
		console.log(`Missing .detail.webp (${detailGapPaths.size}):`);
		for (const assetPath of [...detailGapPaths].sort().slice(0, 20)) {
			console.log(`  ${assetPath} → ${getDetailPreviewAssetPath(assetPath)}`);
		}
		if (detailGapPaths.size > 20) {
			console.log(`  … and ${detailGapPaths.size - 20} more`);
		}
		console.log("");
	}

	if (missingListing.length > 0 || listingGaps.length > 0) {
		const listingGapPaths = new Set([
			...missingListing.map((entry) => entry.assetPath),
			...listingGaps.map((entry) => entry.sourcePath),
		]);
		console.log(`Missing .listing.webp (${listingGapPaths.size}):`);
		for (const assetPath of [...listingGapPaths].sort().slice(0, 20)) {
			console.log(`  ${assetPath} → ${getListingPreviewAssetPath(assetPath)}`);
		}
		if (listingGapPaths.size > 20) {
			console.log(`  … and ${listingGapPaths.size - 20} more`);
		}
		console.log("");
	}

	const hasBlockingIssues =
		missingSources.length > 0 ||
		missingDetail.length > 0 ||
		missingListing.length > 0 ||
		runtimeDetailGaps.length > 0 ||
		listingGaps.length > 0;

	if (!SHOULD_FIX) {
		if (hasBlockingIssues) {
			console.log("Run with --fix to generate missing sidecars:");
			console.log("  pnpm ensure:product-media:fix");
		} else {
			console.log("All catalog media is import-complete.");
		}

		if (STRICT && hasBlockingIssues) {
			process.exitCode = 1;
		}
		return;
	}

	console.log("Generating missing sidecars...\n");

	const detailSources = new Set([
		...runtimeDetailSources,
		...missingDetail.map((entry) => entry.assetPath),
		...runtimeDetailGaps.map((entry) => entry.sourcePath),
	]);

	const detailCreated = [];
	const detailFailed = [];
	for (const sourcePath of [...detailSources].sort()) {
		const detailPath = getDetailPreviewAssetPath(sourcePath);
		const detailStat = await statAsset(detailPath);
		const sourceStat = await statAsset(sourcePath);
		if (detailStat.exists || !sourceStat.exists) continue;

		const result = await generateDetailPreview(sourcePath);
		if (result.status === "detail-created" || result.status === "detail-current") {
			detailCreated.push(result);
			console.log(`  detail: ${result.assetPath} (${result.status})`);
		} else {
			detailFailed.push(result);
			console.log(`  detail FAILED: ${sourcePath} (${result.status})`);
		}
	}

	const listingSources = new Set([
		...listingTargets,
		...missingListing.map((entry) => entry.assetPath),
		...listingGaps.map((entry) => entry.sourcePath),
	]);

	const listingCreated = [];
	const listingFailed = [];
	for (const sourcePath of [...listingSources].sort()) {
		const listingPath = getListingPreviewAssetPath(sourcePath);
		const listingStat = await statAsset(listingPath);
		const sourceStat = await statAsset(sourcePath);
		if (listingStat.exists || !sourceStat.exists) continue;

		const result = await generateListingPreview(sourcePath);
		if (result.status === "preview-created" || result.status === "preview-current") {
			listingCreated.push(result);
			console.log(`  listing: ${result.assetPath} (${result.status})`);
		} else {
			listingFailed.push(result);
			console.log(`  listing FAILED: ${sourcePath} (${result.status})`);
		}
	}

	console.log(`\nCreated ${detailCreated.length} .detail.webp and ${listingCreated.length} .listing.webp file(s).`);

	if (detailFailed.length > 0 || listingFailed.length > 0 || missingSources.length > 0) {
		process.exitCode = 1;
		console.log("\nSome issues remain (missing sources or failed generation). Re-run audit:");
		console.log("  pnpm ensure:product-media");
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
