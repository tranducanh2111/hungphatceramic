/**
 * Downloads and synchronizes INDO and Ấn Độ tile assets from Google Drive into catalog paths.
 *
 * Usage:
 *   node scripts/download-indo-assets.mjs --folder=1SEUdG3OIiRZ_BNxTKPLB2GRBFiSYv-Z4
 *   pnpm download:indo-assets
 *
 * Preserves authentic Drive FullFaces layouts (PNG, JPG, PDF-extracted/rendered)
 * and optimizes them directly to catalog resolution without synthetic grid distortion.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { processFullFacesAsset } from "./lib/drive-fullfaces-handler.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "public", "assets");

const DEFAULT_DRIVE_FOLDER_ID = "1SEUdG3OIiRZ_BNxTKPLB2GRBFiSYv-Z4";
const ENTRY_PATTERN = /id="entry-([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

const SQUARE_80_SKUS = new Set(["GS881042", "GS881045", "GS883009", "SS886101", "SS886106"]);
const SQUARE_100_SKUS = new Set(["GP10C41", "GP10C46", "GP10C49"]);
const RECT_60_120_SKUS = new Set(["SS1261307", "SS1261310", "SS1261311", "SS1261315"]);

function parseArgs(argv) {
	const options = { folderId: DEFAULT_DRIVE_FOLDER_ID, nested: true };
	for (const arg of argv) {
		if (arg.startsWith("--folder=")) {
			options.folderId = arg.slice("--folder=".length).trim();
		} else if (arg === "--flat") {
			options.nested = false;
		}
	}
	return options;
}

function embeddedFolderUrl(folderId) {
	return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
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
	let response = await fetch(baseUrl, { redirect: "manual" });

	let cookies = [];
	const setCookie = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
	if (setCookie.length) {
		cookies = setCookie.map((c) => c.split(";")[0]);
	} else if (response.headers.get("set-cookie")) {
		cookies = [response.headers.get("set-cookie").split(";")[0]];
	}

	if (response.status >= 300 && response.status < 400) {
		const loc = response.headers.get("location");
		response = await fetch(loc, {
			headers: { Cookie: cookies.join("; ") },
		});
	}

	const contentType = response.headers.get("content-type") ?? "";
	if (contentType.includes("text/html")) {
		const html = await response.text();
		const confirmMatch =
			html.match(/confirm=([0-9A-Za-z_]+)/) ??
			html.match(/download_warning[^>]*>[\s\S]*?confirm=([0-9A-Za-z_]+)/) ??
			html.match(/name="confirm"\s+value="([^"]+)"/);
		if (confirmMatch) {
			const confirmUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${confirmMatch[1]}`;
			response = await fetch(confirmUrl, {
				headers: { Cookie: cookies.join("; ") },
			});
		} else {
			throw new Error(`Drive returned HTML without confirm token for ${fileId}`);
		}
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length < 512) {
		throw new Error(`Download too small for ${fileId} (${buffer.length} bytes)`);
	}
	return buffer;
}

const VALID_SKUS = new Set([...SQUARE_80_SKUS, ...SQUARE_100_SKUS, ...RECT_60_120_SKUS]);

function parseProductFolderLabel(label) {
	const skuMatch = label.match(/\b(GS|SS|GP)\s*(\d+[A-Z0-9]*)\b/i);
	if (!skuMatch) {
		return null;
	}

	const sku = `${skuMatch[1].toUpperCase()}${skuMatch[2].toUpperCase()}`;
	if (!VALID_SKUS.has(sku)) {
		return null;
	}

	const sizeFolder = /80\s*[x×]\s*80/i.test(label) || SQUARE_80_SKUS.has(sku)
		? "80X80"
		: /100\s*[x×]\s*100/i.test(label) || SQUARE_100_SKUS.has(sku)
			? "100X100"
			: "60X120";

	return { sku, sizeFolder };
}

function isFullFacesFileName(name) {
	return /full[\s_-]*faces/i.test(name) || /\b\d+\s*faces\b/i.test(name);
}

/** Map non-fullfaces Drive filenames inside nested product folders to catalog filenames. */
function mapNestedCatalogFilenames(sku, driveFilename) {
	const stem = driveFilename.replace(/\.(jpe?g|png|webp|tif)$/i, "");
	const targets = new Set();

	if (/ambience/i.test(stem) || /phoi\s*canh/i.test(stem) || /^pc\s+/i.test(stem)) {
		const ambienceIndexMatch = stem.match(/(?:ambience|phoi\s*canh|\bpc\b)[_\s-]*(\d+)/i);
		const ambienceIndex = ambienceIndexMatch ? Number.parseInt(ambienceIndexMatch[1], 10) : 1;
		targets.add(
			ambienceIndex <= 1 ? `${sku}_PhoiCanh.jpg` : `${sku}_PhoiCanh_${ambienceIndex}.jpg`,
		);
		return [...targets];
	}

	const faceMatch = stem.match(/_F(\d+)$/i) ?? stem.match(/-R(\d+)$/i);
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
	if (/^(gs|ss|gp)\d+/i.test(normalizedStem.replace(/\s/g, ""))) {
		targets.add(`${sku}.jpg`);
		return [...targets];
	}

	return [...targets];
}

async function syncProductFolder(productFolder, sizeHint) {
	const productMeta = parseProductFolderLabel(productFolder.name);
	if (!productMeta) {
		return { downloaded: 0, skipped: 0 };
	}

	const sku = productMeta.sku;
	const sizeFolder = sizeHint ?? productMeta.sizeFolder;
	const targetDir = path.join(ASSETS, sizeFolder, `INDO ${sku}`);
	const entries = await listDriveFolder(productFolder.fileId);

	console.log(`\nProduct ${sku} (${sizeFolder}) ← Drive folder "${productFolder.name}" (${entries.length} items)`);

	let downloaded = 0;
	let skipped = 0;

	for (const entry of entries) {
		// 1. Check FullFaces asset
		if (isFullFacesFileName(entry.name)) {
			try {
				const targetFullFacesPath = path.join(targetDir, `${sku}_FullFaces.jpg`);
				await processFullFacesAsset(entry.fileId, entry.name, targetFullFacesPath);
				downloaded += 1;
			} catch (err) {
				console.warn(`  ✗ Failed FullFaces for ${entry.name}: ${err.message}`);
				skipped += 1;
			}
			continue;
		}

		// 2. Regular images (Faces, Ambience, Hero)
		if (/\.(jpe?g|png)$/i.test(entry.name)) {
			const catalogNames = mapNestedCatalogFilenames(sku, entry.name);
			if (catalogNames.length === 0) {
				continue;
			}

			try {
				const buffer = await downloadDriveFile(entry.fileId);
				for (const catalogName of catalogNames) {
					const targetPath = path.join(targetDir, catalogName);
					await mkdir(targetDir, { recursive: true });
					await writeFile(targetPath, buffer);
					downloaded += 1;
					console.log(`  ✓ ${path.relative(ASSETS, targetPath)} ← ${entry.name} (${(buffer.length / 1024).toFixed(0)} KB)`);
				}
			} catch (err) {
				console.warn(`  ✗ ${entry.name}: ${err.message}`);
				skipped += 1;
			}
		}
	}

	return { downloaded, skipped };
}

async function crawlFolderRecursively(folderId, depth = 0, currentSizeHint = null) {
	if (depth > 4) return { downloaded: 0, skipped: 0 };

	const entries = await listDriveFolder(folderId);
	let totalDownloaded = 0;
	let totalSkipped = 0;

	for (const entry of entries) {
		if (entry.name.includes(".") && !entry.name.endsWith(".cdr")) {
			// File at category root, skip
			continue;
		}

		// Determine size hint from folder names (e.g. 80x80, 60x120, 100x100)
		let sizeHint = currentSizeHint;
		if (/80\s*[x×]\s*80/i.test(entry.name)) {
			sizeHint = "80X80";
		} else if (/100\s*[x×]\s*100/i.test(entry.name)) {
			sizeHint = "100X100";
		} else if (/60\s*[x×]\s*120/i.test(entry.name)) {
			sizeHint = "60X120";
		}

		const productMeta = parseProductFolderLabel(entry.name);
		if (productMeta) {
			const { downloaded, skipped } = await syncProductFolder(entry, sizeHint);
			totalDownloaded += downloaded;
			totalSkipped += skipped;
		} else {
			// Subfolder (e.g. "Gạch INDO", "80x80", etc.)
			const { downloaded, skipped } = await crawlFolderRecursively(entry.fileId, depth + 1, sizeHint);
			totalDownloaded += downloaded;
			totalSkipped += skipped;
		}
	}

	return { downloaded: totalDownloaded, skipped: totalSkipped };
}

async function main() {
	const { folderId } = parseArgs(process.argv.slice(2));
	console.log(`Starting Drive asset sync from folder: ${folderId}`);

	const { downloaded, skipped } = await crawlFolderRecursively(folderId);
	console.log(`\nSync finished: ${downloaded} assets synced/optimized, ${skipped} skipped.`);
	console.log("Run next: pnpm generate:detail-media && pnpm sync:product-size-assets && pnpm ensure:product-media --strict");
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
