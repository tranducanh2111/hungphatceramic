/**
 * Audits product folders for interior demo-work images vs catalog registrations.
 * Run: node scripts/audit-demo-work-assets.mjs
 */
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	INDO_PRODUCTS_TS,
	PRODUCTS_TS,
	PUBLIC_ASSETS,
	toAbsoluteAssetPath,
} from "./lib/product-asset-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZE_FOLDERS = ["60X120", "80X80", "100X100", "120X120"];

const SCENE_IMAGE_PATTERN = /sceneImages:\s*\[([\s\S]*?)\]/g;
const SLUG_PATTERN = /slug:\s*"([^"]+)"/;
const SKU_PATTERN = /skuCode:\s*"([^"]+)"/;
const NAME_PATTERN = /name:\s*"([^"]+)"/;
const THUMBNAIL_PATTERN = /thumbnailUrl:\s*"(\/assets\/[^"]+)"/;

function isCatalogDemoWorkFileName(fileName) {
	return /^PC/i.test(fileName);
}

function isLikelyInteriorShowcaseFileName(fileName) {
	if (/\.(listing|detail)\.webp$/i.test(fileName)) return false;
	if (!/\.(jpe?g|png|webp)$/i.test(fileName)) return false;
	if (isCatalogDemoWorkFileName(fileName)) return true;
	if (/phoi\s*canh|phoicanh|ambience|panorama|ứng dụng|demo|interior|room|space/i.test(fileName)) {
		return true;
	}
	return false;
}

function isTileOnlyFileName(fileName) {
	if (isLikelyInteriorShowcaseFileName(fileName)) return false;
	if (/faces|fullfaces|6 faces|6 FACES/i.test(fileName)) return true;
	if (/^PC/i.test(fileName)) return false;
	if (/^\(.*\)\.jpe?g$/i.test(fileName)) return true;
	if (/_[Ff]\d+\.jpe?g$/i.test(fileName)) return true;
	if (/^\d+[\s_-]/.test(fileName)) return true;
	if (/\.(jpe?g|png)$/i.test(fileName)) return true;
	return false;
}

function parseSceneImagePaths(block) {
	const paths = [];
	for (const match of block.matchAll(/"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi)) {
		paths.push(match[1]);
	}
	return paths;
}

function parseCatalogEntries(source, sourceLabel) {
	const entries = [];
	const blocks = source.match(/\t\{[\s\S]*?\n\t\},/g) ?? [];

	for (const block of blocks) {
		const slug = block.match(SLUG_PATTERN)?.[1];
		const skuCode = block.match(SKU_PATTERN)?.[1];
		const name = block.match(NAME_PATTERN)?.[1];
		const thumbnailUrl = block.match(THUMBNAIL_PATTERN)?.[1];
		if (!slug || !thumbnailUrl) continue;

		const sceneImages = [];
		for (const sceneMatch of block.matchAll(SCENE_IMAGE_PATTERN)) {
			sceneImages.push(...parseSceneImagePaths(sceneMatch[1]));
		}

		entries.push({
			source: sourceLabel,
			slug,
			skuCode: skuCode ?? slug,
			name: name ?? slug,
			thumbnailUrl,
			sceneImages,
			registeredDemoWork: sceneImages.filter((assetPath) =>
				isCatalogDemoWorkFileName(path.basename(assetPath)),
			),
			registeredScenes: sceneImages.filter(
				(assetPath) => !isCatalogDemoWorkFileName(path.basename(assetPath)),
			),
			assetDir: path.dirname(thumbnailUrl).replace(/^\/assets\//, "").split("/").join(path.sep),
			sizeFolder: thumbnailUrl.match(/\/assets\/(60X120|80X80|100X100|120X120)\//)?.[1] ?? "unknown",
		});
	}

	return entries;
}

async function listFolderFiles(relativeAssetDir) {
	const absoluteDir = path.join(PUBLIC_ASSETS, relativeAssetDir);
	let entries;
	try {
		entries = await readdir(absoluteDir, { withFileTypes: true });
	} catch {
		return null;
	}

	const files = [];
	for (const entry of entries) {
		if (!entry.isFile()) continue;
		if (!/\.(jpe?g|png|webp)$/i.test(entry.name)) continue;
		if (/\.(listing|detail)\.webp$/i.test(entry.name)) continue;
		files.push(entry.name);
	}
	return files.sort();
}

async function fileExists(assetPath) {
	try {
		const fileStat = await stat(toAbsoluteAssetPath(assetPath));
		return fileStat.isFile();
	} catch {
		return false;
	}
}

async function main() {
	const [productsSource, indoSource] = await Promise.all([
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);

	const catalog = [
		...parseCatalogEntries(productsSource, "products.ts"),
		...parseCatalogEntries(indoSource, "indo-products.ts"),
	];

	const missingRegistered = [];
	const missingDemoWork = [];
	const unregisteredShowcase = [];
	const registeredButMissingFile = [];

	for (const product of catalog) {
		const folderFiles = await listFolderFiles(product.assetDir);
		if (folderFiles === null) {
			missingRegistered.push({
				...product,
				issue: "asset folder missing",
			});
			continue;
		}

		const folderDemoWork = folderFiles.filter(isCatalogDemoWorkFileName);
		const folderShowcase = folderFiles.filter(isLikelyInteriorShowcaseFileName);
		const folderTileOnly = folderFiles.filter(isTileOnlyFileName);

		for (const registeredPath of product.registeredDemoWork) {
			const exists = await fileExists(registeredPath);
			if (!exists) {
				registeredButMissingFile.push({
					slug: product.slug,
					name: product.name,
					missingPath: registeredPath,
				});
			}
		}

		for (const registeredPath of product.registeredScenes) {
			const exists = await fileExists(registeredPath);
			if (!exists) {
				registeredButMissingFile.push({
					slug: product.slug,
					name: product.name,
					missingPath: registeredPath,
					note: "non-PC scene (not shown in demo-work carousel)",
				});
			}
		}

		const registeredDemoBasenames = new Set(
			product.registeredDemoWork.map((assetPath) => path.basename(assetPath).toLowerCase()),
		);
		const unregistered = folderShowcase.filter(
			(fileName) => !registeredDemoBasenames.has(fileName.toLowerCase()),
		);

		if (unregistered.length > 0) {
			unregisteredShowcase.push({
				slug: product.slug,
				name: product.name,
				folder: product.assetDir,
				files: unregistered,
				registeredDemoWork: product.registeredDemoWork.map((p) => path.basename(p)),
			});
		}

		if (product.registeredDemoWork.length === 0 && folderDemoWork.length === 0) {
			missingDemoWork.push({
				slug: product.slug,
				name: product.name,
				folder: product.assetDir,
				sizeFolder: product.sizeFolder,
				folderShowcaseCandidates: folderShowcase,
				folderTileFiles: folderTileOnly.slice(0, 6),
				registeredScenes: product.registeredScenes.map((p) => path.basename(p)),
			});
		}
	}

	console.log(`Audited ${catalog.length} catalog products.\n`);

	if (registeredButMissingFile.length > 0) {
		console.log(`=== Registered scene/demo paths missing on disk (${registeredButMissingFile.length}) ===`);
		for (const item of registeredButMissingFile) {
			console.log(`  ${item.slug}: ${item.missingPath}${item.note ? ` (${item.note})` : ""}`);
		}
		console.log("");
	}

	if (missingDemoWork.length > 0) {
		console.log(`=== No PC-* demo work (catalog + folder) (${missingDemoWork.length}) ===`);
		for (const item of missingDemoWork) {
			console.log(`  ${item.slug} — ${item.name}`);
			console.log(`    folder: ${item.folder}`);
			if (item.registeredScenes.length > 0) {
				console.log(`    registered non-PC scenes: ${item.registeredScenes.join(", ")}`);
			}
			if (item.folderShowcaseCandidates.length > 0) {
				console.log(
					`    showcase-like files in folder (not wired as PC demo work): ${item.folderShowcaseCandidates.join(", ")}`,
				);
			} else {
				console.log(`    no interior showcase files detected in folder`);
			}
		}
		console.log("");
	}

	if (unregisteredShowcase.length > 0) {
		console.log(`=== Showcase files in folder but not registered as PC demo work (${unregisteredShowcase.length}) ===`);
		for (const item of unregisteredShowcase) {
			console.log(`  ${item.slug} — ${item.name}`);
			console.log(`    unregistered: ${item.files.join(", ")}`);
			if (item.registeredDemoWork.length > 0) {
				console.log(`    registered PC: ${item.registeredDemoWork.join(", ")}`);
			}
		}
		console.log("");
	}

	// Scan for PC files in folders that don't map to any catalog product primary folder
	const catalogDirs = new Set(catalog.map((product) => product.assetDir.replace(/\\/g, "/")));
	const orphanPcFiles = [];

	for (const sizeFolder of SIZE_FOLDERS) {
		const sizeRoot = path.join(PUBLIC_ASSETS, sizeFolder);
		let productDirs;
		try {
			productDirs = await readdir(sizeRoot, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const productDir of productDirs) {
			if (!productDir.isDirectory()) continue;
			const relativeDir = `${sizeFolder}/${productDir.name}`.replace(/\\/g, "/");
			const files = await listFolderFiles(relativeDir);
			if (!files) continue;

			const pcFiles = files.filter(isCatalogDemoWorkFileName);
			if (pcFiles.length === 0) continue;

			const inCatalog = catalogDirs.has(relativeDir);
			if (!inCatalog) {
				orphanPcFiles.push({ folder: relativeDir, pcFiles });
			}
		}
	}

	if (orphanPcFiles.length > 0) {
		console.log(`=== PC-* files in folders not tied to a catalog primary path (${orphanPcFiles.length}) ===`);
		for (const item of orphanPcFiles) {
			console.log(`  ${item.folder}: ${item.pcFiles.join(", ")}`);
		}
		console.log("");
	}

	const healthyCount =
		catalog.length -
		missingDemoWork.length -
		registeredButMissingFile.filter((item) => !item.note).length;

	console.log("Summary:");
	console.log(`  Products with PC demo work wired: ${catalog.length - missingDemoWork.length}`);
	console.log(`  Products missing PC demo work: ${missingDemoWork.length}`);
	console.log(`  Registered PC paths missing on disk: ${registeredButMissingFile.filter((item) => !item.note).length}`);
	console.log(`  Products with unregistered showcase files: ${unregisteredShowcase.length}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
