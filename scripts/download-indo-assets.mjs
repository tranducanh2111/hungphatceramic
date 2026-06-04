/**
 * Downloads INDO tile JPGs from the public Google Drive folder into catalog paths.
 * Run: node scripts/download-indo-assets.mjs
 * Then: pnpm optimize:product-images
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "public", "assets");

const DRIVE_FOLDER_ID = "1rEh2ZKte59w-NTTw5H9DvrwgrkccX6gA";
const EMBEDDED_VIEW_URL = `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#list`;

/** Square SKUs → 100X100; large-format SKUs → 60X120. */
const SQUARE_SKUS = new Set([
	"GS881042",
	"GS881045",
	"GS883009",
	"SS886101",
	"SS886106",
]);

const ENTRY_PATTERN =
	/id="entry-([^"]+)"[\s\S]*?flip-entry-title">([^<]+)<\/div>/g;

function extractSkuFromFilename(filename) {
	const match = filename.match(/^((?:GS|SS)\d+)/i);
	return match ? match[1].toUpperCase() : null;
}

function resolveTargetDir(sku) {
	const sizeFolder = SQUARE_SKUS.has(sku) ? "100X100" : "60X120";
	return path.join(ASSETS, sizeFolder, `INDO ${sku}`);
}

async function parseDriveEntries(html) {
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

async function main() {
	console.log("Fetching Drive folder listing…");
	const listingResponse = await fetch(EMBEDDED_VIEW_URL);
	if (!listingResponse.ok) {
		throw new Error(`Drive listing failed: ${listingResponse.status}`);
	}

	const html = await listingResponse.text();
	const entries = await parseDriveEntries(html);
	if (entries.length === 0) {
		throw new Error("No JPG entries parsed from Drive folder.");
	}

	console.log(`Found ${entries.length} JPG files. Downloading…`);

	let downloaded = 0;
	let skipped = 0;

	for (const { fileId, filename, sku } of entries) {
		const targetDir = resolveTargetDir(sku);
		const targetPath = path.join(targetDir, filename);

		await mkdir(targetDir, { recursive: true });

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

	console.log(`Done. ${downloaded} saved, ${skipped} failed.`);
	if (downloaded > 0) {
		console.log("Run: pnpm optimize:product-images");
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
