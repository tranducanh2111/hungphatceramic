/**
 * Downloads INDO tile JPGs from public Google Drive folders into catalog paths.
 *
 * Flat folder (legacy SKUs):
 *   node scripts/download-indo-assets.mjs
 *
 * Nested 80×80 product folders:
 *   node scripts/download-indo-assets.mjs --nested
 *
 * Then: pnpm optimize:product-images && pnpm sync:product-size-assets
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "public", "assets");

const FLAT_DRIVE_FOLDER_ID = "1rEh2ZKte59w-NTTw5H9DvrwgrkccX6gA";
const NESTED_DRIVE_FOLDER_ID = "15PlYXiJMhoQvrYaMdPVsyf2itcovBgTE";

const SQUARE_SKUS = new Set(["GS881042", "GS881045", "GS883009", "SS886101", "SS886106"]);
const ENTRY_PATTERN = /id="entry-([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

function parseArgs(argv) {
	const options = { nested: false, folderId: null };
	for (const arg of argv) {
		if (arg === "--nested") {
			options.nested = true;
		} else if (arg.startsWith("--folder=")) {
			options.folderId = arg.slice("--folder=".length).trim();
		}
	}
	return options;
}

function embeddedFolderUrl(folderId) {
	return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
}

function extractSkuFromFilename(filename) {
	const match = filename.match(/^((?:GS|SS)\d+)/i);
	return match ? match[1].toUpperCase() : null;
}

function parseProductFolderLabel(label) {
	const skuMatch = label.match(/\b(GS|SS)\s*(\d+)\b/i);
	if (!skuMatch) {
		return null;
	}

	const sku = `${skuMatch[1].toUpperCase()}${skuMatch[2]}`;
	const sizeFolder = /80\s*[x×]\s*80/i.test(label)
		? "80X80"
		: /100\s*[x×]\s*100/i.test(label)
			? "100X100"
			: /60\s*[x×]\s*120/i.test(label)
				? "60X120"
				: SQUARE_SKUS.has(sku)
					? "100X100"
					: "60X120";

	return { sku, sizeFolder };
}

function resolveFlatTargetDir(sku) {
	const sizeFolder = SQUARE_SKUS.has(sku) ? "100X100" : "60X120";
	return path.join(ASSETS, sizeFolder, `INDO ${sku}`);
}

/** Map Drive filenames inside nested product folders to catalog filenames. */
function mapNestedCatalogFilenames(sku, driveFilename) {
	const stem = driveFilename.replace(/\.jpe?g$/i, "");
	const targets = new Set();

	if (/ambience/i.test(stem)) {
		const ambienceIndexMatch = stem.match(/ambience\s*(\d+)/i);
		const ambienceIndex = ambienceIndexMatch ? Number.parseInt(ambienceIndexMatch[1], 10) : 1;
		targets.add(
			ambienceIndex <= 1 ? `${sku}_PhoiCanh.jpg` : `${sku}_PhoiCanh_${ambienceIndex}.jpg`,
		);
		return [...targets];
	}

	const faceMatch = stem.match(/_F(\d+)$/i);
	if (faceMatch) {
		const faceNumber = faceMatch[1];
		if (faceNumber === "1") {
			targets.add(`${sku}.jpg`);
		}
		targets.add(`${sku}_F${faceNumber}.jpg`);
		return [...targets];
	}

	if (new RegExp(`^${sku}$`, "i").test(stem.replace(/\s+/g, ""))) {
		targets.add(`${sku}.jpg`);
		return [...targets];
	}

	const normalizedStem = stem.replace(/\s+/g, " ").trim();
	if (/^(gs|ss)\d+$/i.test(normalizedStem.replace(/\s/g, ""))) {
		targets.add(`${sku}.jpg`);
		return [...targets];
	}

	// Product hero still (e.g. "Elbrus Gris.jpg") → primary catalog face.
	if (!/_F\d+$/i.test(stem) && !/ambience/i.test(stem)) {
		targets.add(`${sku}.jpg`);
	}

	return [...targets];
}

async function listDriveFolder(folderId) {
	const response = await fetch(embeddedFolderUrl(folderId));
	if (!response.ok) {
		throw new Error(`Drive listing failed for ${folderId}: ${response.status}`);
	}

	const html = await response.text();
	const entries = [];
	for (const match of html.matchAll(ENTRY_PATTERN)) {
		entries.push({ fileId: match[1], name: match[2].trim() });
	}
	return entries;
}

async function downloadDriveFile(fileId) {
	const baseUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
	let response = await fetch(baseUrl, { redirect: "follow" });

	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("text/html")) {
		const html = await response.text();
		const confirmMatch =
			html.match(/confirm=([0-9A-Za-z_]+)/) ??
			html.match(/download_warning[^>]*>[\s\S]*?confirm=([0-9A-Za-z_]+)/);
		if (confirmMatch) {
			response = await fetch(`${baseUrl}&confirm=${confirmMatch[1]}`);
		} else {
			throw new Error(`Drive returned HTML without confirm token for ${fileId}`);
		}
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length < 1024) {
		throw new Error(`Download too small for ${fileId} (${buffer.length} bytes)`);
	}
	return buffer;
}

async function parseFlatDriveEntries(html) {
	const entries = [];
	for (const match of html.matchAll(ENTRY_PATTERN)) {
		const fileId = match[1];
		const filename = match[2].trim();
		if (!/\.jpe?g$/i.test(filename)) {
			continue;
		}
		const sku = extractSkuFromFilename(filename);
		if (!sku) {
			continue;
		}
		entries.push({ fileId, filename, sku });
	}
	return entries;
}

async function downloadFlatFolder(folderId) {
	console.log(`Fetching flat Drive folder ${folderId}…`);
	const entries = await parseFlatDriveEntries(await (await fetch(embeddedFolderUrl(folderId))).text());
	if (entries.length === 0) {
		console.warn("No flat JPG entries found.");
		return { downloaded: 0, skipped: 0 };
	}

	console.log(`Found ${entries.length} flat JPG files. Downloading…`);
	let downloaded = 0;
	let skipped = 0;

	for (const { fileId, filename, sku } of entries) {
		const targetPath = path.join(resolveFlatTargetDir(sku), filename);
		await mkdir(path.dirname(targetPath), { recursive: true });

		try {
			const buffer = await downloadDriveFile(fileId);
			await writeFile(targetPath, buffer);
			downloaded += 1;
			console.log(`  ✓ ${path.relative(ASSETS, targetPath)} (${(buffer.length / 1024).toFixed(0)} KB)`);
		} catch (error) {
			skipped += 1;
			console.warn(`  ✗ ${filename}: ${error instanceof Error ? error.message : error}`);
		}
	}

	return { downloaded, skipped };
}

async function downloadNestedFolder(folderId) {
	console.log(`Fetching nested Drive folder ${folderId}…`);
	const topEntries = await listDriveFolder(folderId);
	const productFolders = topEntries.filter((entry) => !/\.jpe?g$/i.test(entry.name));

	if (productFolders.length === 0) {
		throw new Error("No product subfolders found in nested Drive folder.");
	}

	let downloaded = 0;
	let skipped = 0;

	for (const productFolder of productFolders) {
		const productMeta = parseProductFolderLabel(productFolder.name);
		if (!productMeta) {
			console.warn(`  ✗ Skipping unrecognized folder: ${productFolder.name}`);
			skipped += 1;
			continue;
		}

		const { sku, sizeFolder } = productMeta;
		const targetDir = path.join(ASSETS, sizeFolder, `INDO ${sku}`);
		const fileEntries = (await listDriveFolder(productFolder.fileId)).filter((entry) =>
			/\.jpe?g$/i.test(entry.name),
		);

		console.log(`\n${productFolder.name} → ${path.relative(ASSETS, targetDir)} (${fileEntries.length} JPGs)`);

		for (const fileEntry of fileEntries) {
			const catalogNames = mapNestedCatalogFilenames(sku, fileEntry.name);
			if (catalogNames.length === 0) {
				skipped += 1;
				console.warn(`  ✗ No catalog mapping for ${fileEntry.name}`);
				continue;
			}

			try {
				const buffer = await downloadDriveFile(fileEntry.fileId);
				for (const catalogName of catalogNames) {
					const targetPath = path.join(targetDir, catalogName);
					await mkdir(targetDir, { recursive: true });
					await writeFile(targetPath, buffer);
					downloaded += 1;
					console.log(
						`  ✓ ${path.relative(ASSETS, targetPath)} ← ${fileEntry.name} (${(buffer.length / 1024).toFixed(0)} KB)`,
					);
				}
			} catch (error) {
				skipped += 1;
				console.warn(`  ✗ ${fileEntry.name}: ${error instanceof Error ? error.message : error}`);
			}
		}
	}

	return { downloaded, skipped };
}

async function main() {
	const { nested, folderId } = parseArgs(process.argv.slice(2));

	if (nested) {
		const nestedFolderId = folderId ?? NESTED_DRIVE_FOLDER_ID;
		const { downloaded, skipped } = await downloadNestedFolder(nestedFolderId);
		console.log(`\nNested import done. ${downloaded} saved, ${skipped} failed/skipped.`);
	} else {
		const flatFolderId = folderId ?? FLAT_DRIVE_FOLDER_ID;
		const { downloaded, skipped } = await downloadFlatFolder(flatFolderId);
		console.log(`\nFlat import done. ${downloaded} saved, ${skipped} failed/skipped.`);
	}

	console.log("Next: pnpm optimize:product-images && pnpm sync:product-size-assets");
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
