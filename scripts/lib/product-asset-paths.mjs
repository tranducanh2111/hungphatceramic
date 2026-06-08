/**
 * Shared product asset path collection and sidecar naming for catalog scripts.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(__dirname, "..", "..");
export const PUBLIC_DIR = path.join(ROOT, "public");
export const PUBLIC_ASSETS = path.join(PUBLIC_DIR, "assets");
export const ARCHIVE_ROOT = path.join(PUBLIC_ASSETS, "_archive", "originals");
export const PRODUCTS_TS = path.join(ROOT, "src", "constants", "products.ts");
export const INDO_PRODUCTS_TS = path.join(ROOT, "src", "constants", "indo-products.ts");
export const REPORT_DIR = path.join(ROOT, "scripts", "reports");

export const ASSET_PATH_PATTERN = /"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi;
export const ALL_FACES_IMAGE_PATTERN = /allFacesImage:\s*"(\/assets\/[^"]+)"/g;
export const SIZE_THRESHOLD_BYTES = 1_500_000;
export const SYNCED_SIZE_FOLDERS = ["100X100", "120X120"];
export const SOURCE_SIZE_FOLDERS = ["60X120", "80X80"];
export const SQUARE_FORMAT_MIRROR_FOLDER = "80X80";

/** Default mirror targets per canonical source folder (`sync-product-size-assets.mjs`). */
export const BASE_SYNC_TARGETS_BY_SOURCE = {
	"60X120": ["100X100", "120X120"],
	"80X80": ["100X100", "120X120"],
};

const PRODUCT_BLOCK_PATTERN = /\t\{[\s\S]*?\n\t\},/g;

export function isDemoWorkAssetPath(assetPath) {
	const fileName = path.basename(assetPath);
	if (fileName.endsWith(".listing.webp") || fileName.endsWith(".detail.webp")) {
		return false;
	}
	if (/^PC/i.test(fileName)) {
		return true;
	}
	if (/_PhoiCanh/i.test(fileName)) {
		return true;
	}
	if (/^Venora\./i.test(fileName)) {
		return true;
	}
	return false;
}

export function isPanoramaAssetPath(assetPath) {
	return /panorama/i.test(assetPath) || /Ảnh Panorama/i.test(assetPath);
}

export function isCompositeFacesAssetPath(assetPath) {
	return /faces|6 faces|6 FACES|FullFaces/i.test(path.basename(assetPath));
}

export function isSidecarAssetPath(assetPath) {
	return /\.(listing|detail)\.webp$/i.test(assetPath);
}

export function getListingPreviewAssetPath(assetPath) {
	if (assetPath.endsWith(".listing.webp")) {
		return assetPath;
	}
	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".listing.webp");
}

export function getDetailPreviewAssetPath(assetPath) {
	if (assetPath.endsWith(".detail.webp")) {
		return assetPath;
	}
	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".detail.webp");
}

export function toAbsoluteAssetPath(assetPath) {
	return path.join(PUBLIC_DIR, assetPath.replace(/^\//, "").split("/").join(path.sep));
}

export function toArchiveAssetPath(assetPath) {
	const relative = assetPath.replace(/^\/assets\//, "");
	return path.join(ARCHIVE_ROOT, relative.split("/").join(path.sep));
}

export function remapAssetPathForSizeFolder(assetPath, targetFolder) {
	return assetPath.replace(/\/assets\/(60X120|80X80|100X100|120X120)\//, `/assets/${targetFolder}/`);
}

export function getSourceSizeFolder(assetPath) {
	return SOURCE_SIZE_FOLDERS.find((folder) => assetPath.includes(`/assets/${folder}/`)) ?? null;
}

/**
 * 60×120 products that also sell 80×80 need an extra mirror into `80X80/`
 * (e.g. Travertine G12T01 / G12T06 under `Travertine T01 T06/`).
 */
export function collectAssetPathsRequiringSquareMirror(productsSource) {
	const paths = new Set();

	for (const block of productsSource.match(PRODUCT_BLOCK_PATTERN) ?? []) {
		if (!block.includes("80×80cm") || !block.includes("/assets/60X120/")) {
			continue;
		}

		for (const match of block.matchAll(ASSET_PATH_PATTERN)) {
			paths.add(match[1]);
		}
	}

	return paths;
}

/** Resolve all size-folder mirrors that must exist on disk for a registry asset path. */
export function getSyncTargetFolders(assetPath, squareMirrorPaths) {
	const sourceFolder = getSourceSizeFolder(assetPath);
	if (!sourceFolder) {
		return [];
	}

	const targets = [...BASE_SYNC_TARGETS_BY_SOURCE[sourceFolder]];

	if (sourceFolder === "60X120" && squareMirrorPaths.has(assetPath)) {
		targets.unshift(SQUARE_FORMAT_MIRROR_FOLDER);
	}

	return targets;
}

/** Runtime / audit expansion folders for a source catalog path (matches sync + `?size=` remaps). */
export function getRuntimeMirrorFolders(assetPath, squareMirrorPaths) {
	return getSyncTargetFolders(assetPath, squareMirrorPaths);
}

export function collectAllFacesImagePaths(productsSource) {
	const paths = new Set();
	for (const match of productsSource.matchAll(ALL_FACES_IMAGE_PATTERN)) {
		paths.add(match[1]);
	}
	return paths;
}

export function requiresDetailWebp(assetPath, allFacesImagePaths) {
	if (isSidecarAssetPath(assetPath)) {
		return false;
	}
	if (isDemoWorkAssetPath(assetPath)) {
		return true;
	}
	if (isPanoramaAssetPath(assetPath)) {
		return true;
	}
	if (allFacesImagePaths?.has(assetPath) || isCompositeFacesAssetPath(assetPath)) {
		return true;
	}
	return false;
}

/**
 * Paths that resolveDetailGalleryImagePath() maps at runtime (incl. ?size= remaps).
 * Panoramas stay in 60X120 Ảnh Panorama — not expanded to synced size folders.
 */
export async function collectRuntimeDetailSources() {
	const [productsSource, indoSource] = await Promise.all([
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);

	const allFacesImagePaths = collectAllFacesImagePaths(productsSource);
	const paths = new Set([...allFacesImagePaths]);

	for (const source of [productsSource, indoSource]) {
		for (const match of source.matchAll(ASSET_PATH_PATTERN)) {
			const assetPath = match[1];
			if (isDemoWorkAssetPath(assetPath)) {
				paths.add(assetPath);
			} else if (isPanoramaAssetPath(assetPath)) {
				paths.add(assetPath);
			}
		}
	}

	// INDO assets are built in code — no literal `/assets/...` strings in indo-products.ts.
	for (const assetPath of collectIndoAssetPaths(indoSource)) {
		if (isDemoWorkAssetPath(assetPath)) {
			paths.add(assetPath);
		}
	}

	const squareMirrorPaths = collectAssetPathsRequiringSquareMirror(productsSource);
	const expanded = new Set(paths);
	for (const assetPath of paths) {
		if (isPanoramaAssetPath(assetPath)) {
			continue;
		}
		if (!getSourceSizeFolder(assetPath)) {
			continue;
		}
		for (const targetFolder of getRuntimeMirrorFolders(assetPath, squareMirrorPaths)) {
			expanded.add(remapAssetPathForSizeFolder(assetPath, targetFolder));
		}
	}

	return [...expanded].sort();
}

export function requiresListingWebp(assetPath) {
	return isDemoWorkAssetPath(assetPath);
}

export function collectIndoAssetPaths(indoSource) {
	const paths = new Set();
	const squareSkus = new Set(["GS881042", "GS881045", "GS883009"]);
	const square80Skus = new Set(["SS886101", "SS886106"]);
	const seedBlocks = indoSource.match(/\{[\s\S]*?hasFullFacesComposite[\s\S]*?\}/g) ?? [];

	for (const block of seedBlocks) {
		const sku = block.match(/skuCode:\s*"((?:GS|SS)\d+)"/)?.[1];
		if (!sku) continue;

		const sceneCount = Number.parseInt(block.match(/sceneCount:\s*(\d+)/)?.[1] ?? "1", 10);
		const hasFullFacesComposite = block.includes("hasFullFacesComposite: true");

		const sizeFolder = square80Skus.has(sku)
			? "80X80"
			: squareSkus.has(sku)
				? "100X100"
				: "60X120";
		const base = `/assets/${sizeFolder}/INDO ${sku}`;

		paths.add(`${base}/${sku}.jpg`);
		paths.add(`${base}/${sku}_PhoiCanh.jpg`);
		for (let sceneIndex = 2; sceneIndex <= sceneCount; sceneIndex += 1) {
			paths.add(`${base}/${sku}_PhoiCanh_${sceneIndex}.jpg`);
		}
		if (hasFullFacesComposite) {
			paths.add(`${base}/${sku}_FullFaces.jpg`);
		}
	}

	return paths;
}

export function parseRegistryAssetPaths(source) {
	const paths = new Set();
	for (const match of source.matchAll(ASSET_PATH_PATTERN)) {
		const assetPath = match[1];
		if (!isSidecarAssetPath(assetPath)) {
			paths.add(assetPath);
		}
	}
	return paths;
}

export async function collectSyncedSizeAssetPaths() {
	const paths = new Set();

	for (const sizeFolder of SYNCED_SIZE_FOLDERS) {
		const folderRoot = path.join(PUBLIC_ASSETS, sizeFolder);
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
				if (isSidecarAssetPath(file.name)) continue;
				paths.add(`/assets/${sizeFolder}/${productDir.name}/${file.name}`);
			}
		}
	}

	return paths;
}

/** Registry paths from products.ts + indo + synced size mirrors. */
export async function collectAllCatalogAssetPaths() {
	const [productsSource, indoSource] = await Promise.all([
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);

	const paths = new Set([
		...collectIndoAssetPaths(indoSource),
		...parseRegistryAssetPaths(productsSource),
		...parseRegistryAssetPaths(indoSource),
	]);

	for (const syncedPath of await collectSyncedSizeAssetPaths()) {
		paths.add(syncedPath);
	}

	return [...paths].sort();
}

export async function statAsset(assetPath) {
	try {
		const fileStat = await stat(toAbsoluteAssetPath(assetPath));
		return {
			exists: true,
			sizeBytes: fileStat.size,
			sizeMb: Number((fileStat.size / 1e6).toFixed(2)),
		};
	} catch {
		return { exists: false, sizeBytes: 0, sizeMb: 0 };
	}
}

