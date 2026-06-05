/**
 * Resizes partner logos to a shared height (aspect ratio preserved).
 * Reads: public/assets/partners/source/*.png
 * Writes: public/assets/partners/normalized/*.png
 *
 * Run: pnpm normalize:partner-logos
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PARTNERS_DIR = path.join(ROOT, "public", "assets", "partners");
const SOURCE_DIR = path.join(PARTNERS_DIR, "source");
const OUTPUT_DIR = path.join(PARTNERS_DIR, "normalized");

const TARGET_HEIGHT_PX = 142;
const PARTNER_IDS = ["sunpower", "taicera", "guocera"];

async function ensureSourceBackups() {
	await mkdir(SOURCE_DIR, { recursive: true });

	for (const partnerId of PARTNER_IDS) {
		const fileName = `${partnerId}.png`;
		const legacyPath = path.join(PARTNERS_DIR, fileName);
		const sourcePath = path.join(SOURCE_DIR, fileName);

		try {
			await readFile(sourcePath);
		} catch {
			await copyFile(legacyPath, sourcePath);
			console.log(`Backed up ${fileName} → source/`);
		}
	}
}

async function main() {
	await ensureSourceBackups();
	await mkdir(OUTPUT_DIR, { recursive: true });

	for (const partnerId of PARTNER_IDS) {
		const fileName = `${partnerId}.png`;
		const inputPath = path.join(SOURCE_DIR, fileName);
		const outputPath = path.join(OUTPUT_DIR, fileName);

		const buffer = await sharp(inputPath)
			.resize({ height: TARGET_HEIGHT_PX, fit: "inside", withoutEnlargement: false })
			.png()
			.toBuffer();

		await writeFile(outputPath, buffer);
		const { width, height } = await sharp(buffer).metadata();
		console.log(`${partnerId}: ${width}×${height}px → normalized/${fileName}`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
