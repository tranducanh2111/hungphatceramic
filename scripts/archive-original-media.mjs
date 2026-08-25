/**
 * Moves large originals to public/assets/_archive/originals/ after optimized sidecars exist.
 * Run: pnpm archive:product-media
 */
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import {
	ARCHIVE_ROOT,
	PUBLIC_ASSETS,
	PRODUCTS_TS,
	SIZE_THRESHOLD_BYTES,
	collectAllCatalogAssetPaths,
	collectAllFacesImagePaths,
	getDetailPreviewAssetPath,
	isSidecarAssetPath,
	requiresDetailWebp,
	toAbsoluteAssetPath,
	toArchiveAssetPath,
} from "./lib/product-asset-paths.mjs";
import { readdir } from "node:fs/promises";

const DRY_RUN = process.argv.includes("--dry-run");

async function fileExists(absolutePath) {
	try {
		await stat(absolutePath);
		return true;
	} catch {
		return false;
	}
}

async function archiveAsset(assetPath, allFacesImagePaths) {
	const absoluteSourcePath = toAbsoluteAssetPath(assetPath);
	const absoluteArchivePath = toArchiveAssetPath(assetPath);
	const detailPath = getDetailPreviewAssetPath(assetPath);
	const absoluteDetailPath = toAbsoluteAssetPath(detailPath);

	let sourceStat;
	try {
		sourceStat = await stat(absoluteSourcePath);
	} catch {
		return { assetPath, status: "missing-source" };
	}

	if (sourceStat.size <= SIZE_THRESHOLD_BYTES) {
		return { assetPath, status: "skip-small", sizeMb: (sourceStat.size / 1e6).toFixed(2) };
	}

	if (!requiresDetailWebp(assetPath, allFacesImagePaths)) {
		return { assetPath, status: "skip-in-place", sizeMb: (sourceStat.size / 1e6).toFixed(2) };
	}

	if (!(await fileExists(absoluteDetailPath))) {
		return { assetPath, status: "missing-detail-webp", detailPath };
	}

	if (await fileExists(absoluteArchivePath)) {
		return { assetPath, status: "already-archived" };
	}

	if (DRY_RUN) {
		return {
			assetPath,
			status: "would-archive",
			sizeMb: (sourceStat.size / 1e6).toFixed(2),
			archivePath: `/assets/_archive/originals/${assetPath.replace(/^\/assets\//, "")}`,
			optimizedReplacement: detailPath,
		};
	}

	await mkdir(path.dirname(absoluteArchivePath), { recursive: true });
	await rename(absoluteSourcePath, absoluteArchivePath);

	return {
		assetPath,
		status: "archived",
		sizeMb: (sourceStat.size / 1e6).toFixed(2),
		archivePath: `/assets/_archive/originals/${assetPath.replace(/^\/assets\//, "")}`,
		optimizedReplacement: detailPath,
		archivedAt: new Date().toISOString(),
	};
}

async function main() {
	const productsSource = await readFile(PRODUCTS_TS, "utf8");
	const allFacesImagePaths = collectAllFacesImagePaths(productsSource);
	const assetPaths = await collectAllCatalogAssetPaths();
	const manifestEntries = [];
	const results = [];

	for (const assetPath of assetPaths) {
		const result = await archiveAsset(assetPath, allFacesImagePaths);
		results.push(result);

		if (result.status === "archived" || result.status === "would-archive") {
			manifestEntries.push({
				sourcePath: result.assetPath,
				archivePath: result.archivePath,
				optimizedReplacement: result.optimizedReplacement,
				sizeMb: result.sizeMb,
				archivedAt: result.archivedAt ?? null,
				dryRun: DRY_RUN,
			});
		}

		const detail = [result.status, result.sizeMb ? `${result.sizeMb}MB` : "", result.detailPath ?? ""]
			.filter(Boolean)
			.join(" ");
		if (result.status !== "skip-small" && result.status !== "skip-in-place") {
			console.log(`${result.assetPath}: ${detail}`);
		}
	}

	const archived = results.filter((result) => result.status === "archived");
	const missingDetail = results.filter((result) => result.status === "missing-detail-webp");

	if (!DRY_RUN && manifestEntries.length > 0) {
		await mkdir(ARCHIVE_ROOT, { recursive: true });
		const manifestPath = path.join(ARCHIVE_ROOT, "manifest.json");
		let existingEntries = [];
		try {
			const raw = await readFile(manifestPath, "utf8");
			existingEntries = JSON.parse(raw).entries ?? [];
		} catch {
			existingEntries = [];
		}

		const mergedBySource = new Map(existingEntries.map((entry) => [entry.sourcePath, entry]));
		for (const entry of manifestEntries) {
			mergedBySource.set(entry.sourcePath, entry);
		}

		await writeFile(
			manifestPath,
			`${JSON.stringify({ updatedAt: new Date().toISOString(), entries: [...mergedBySource.values()] }, null, 2)}\n`,
			"utf8",
		);
	}

	console.log(`\n${DRY_RUN ? "Would archive" : "Archived"} ${archived.length} file(s).`);
	console.log(`Blocked (missing .detail.webp): ${missingDetail.length}`);

	if (missingDetail.length > 0) {
		process.exitCode = 1;
	}

	await archiveLargeOrphans(await collectAllCatalogAssetPaths());
}

async function archiveLargeOrphans(referencedPaths) {
	const referencedAbsolute = new Set(referencedPaths.map(toAbsoluteAssetPath));
	const orphanArchiveRoot = path.join(ARCHIVE_ROOT, "orphans");
	let archivedOrphans = 0;

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

			const relativePath = path.relative(PUBLIC_ASSETS, absolutePath).split(path.sep).join("/");
			const archivePath = path.join(orphanArchiveRoot, relativePath.split("/").join(path.sep));

			if (DRY_RUN) {
				console.log(`${relativePath}: would-archive-orphan ${(fileStat.size / 1e6).toFixed(2)}MB`);
				archivedOrphans += 1;
				continue;
			}

			await mkdir(path.dirname(archivePath), { recursive: true });
			await rename(absolutePath, archivePath);
			console.log(`${relativePath}: archived-orphan ${(fileStat.size / 1e6).toFixed(2)}MB`);
			archivedOrphans += 1;
		}
	}

	await walk(PUBLIC_ASSETS);
	if (archivedOrphans > 0) {
		console.log(`\n${DRY_RUN ? "Would archive" : "Archived"} ${archivedOrphans} orphan file(s).`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
