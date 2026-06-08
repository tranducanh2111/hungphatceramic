/**
 * Full per-product demo-work audit (catalog + disk + runtime sidecar resolution).
 * Run: node scripts/audit-demo-work-full.mjs
 */
import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	INDO_PRODUCTS_TS,
	PRODUCTS_TS,
	PUBLIC_ASSETS,
	PUBLIC_DIR,
	toAbsoluteAssetPath,
} from "./lib/product-asset-paths.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SIZE_FOLDERS = ["60X120", "80X80", "100X100", "120X120"];

function getDetailPreviewPath(assetPath) {
	if (assetPath.endsWith(".detail.webp")) return assetPath;
	return assetPath.replace(/\.(jpe?g|png|webp)$/i, ".detail.webp");
}

function isPcDemo(fileName) {
	return /^PC/i.test(fileName);
}

function isPhoiCanhDemo(fileName) {
	return /_PhoiCanh/i.test(fileName);
}

function isVenoraDemo(fileName) {
	return /^Venora\./i.test(fileName);
}

function isRuntimeDemoWorkPath(assetPath) {
	const fileName = path.basename(assetPath);
	return isPcDemo(fileName) || isPhoiCanhDemo(fileName) || isVenoraDemo(fileName);
}

function isLikelyShowcaseFileName(fileName) {
	if (/\.(listing|detail)\.webp$/i.test(fileName)) return false;
	if (!/\.(jpe?g|png|webp)$/i.test(fileName)) return false;
	if (isPcDemo(fileName) || isPhoiCanhDemo(fileName)) return true;
	if (/ambience|panorama|ứng dụng|interior|venora/i.test(fileName)) return true;
	return false;
}

async function pathResolvable(assetPath) {
	for (const candidate of [assetPath, getDetailPreviewPath(assetPath)]) {
		try {
			const fileStat = await stat(toAbsoluteAssetPath(candidate));
			if (fileStat.isFile()) return { ok: true, resolved: candidate };
		} catch {
			// try next
		}
	}
	return { ok: false, resolved: assetPath };
}

function parseScenePaths(block) {
	return [...block.matchAll(/"(\/assets\/[^"]+\.(?:jpe?g|png|webp))"/gi)].map((m) => m[1]);
}

function parseProductsTs(source) {
	const entries = [];
	for (const block of source.match(/\t\{[\s\S]*?\n\t\},/g) ?? []) {
		const slug = block.match(/slug:\s*"([^"]+)"/)?.[1];
		const name = block.match(/name:\s*"([^"]+)"/)?.[1];
		const thumb = block.match(/thumbnailUrl:\s*"(\/assets\/[^"]+)"/)?.[1];
		if (!slug || !thumb) continue;
		const sceneMatch = block.match(/sceneImages:\s*\[([\s\S]*?)\]/);
		const sceneImages = sceneMatch ? parseScenePaths(sceneMatch[1]) : [];
		entries.push({
			slug,
			name: name ?? slug,
			thumbnailUrl: thumb,
			sceneImages,
			assetDir: path.dirname(thumb).replace(/^\/assets\//, "").split("/").join(path.sep),
		});
	}
	return entries;
}

function parseIndoProductsTs(source) {
	const entries = [];
	const seedBlocks = source.match(/\{[\s\S]*?hasFullFacesComposite[\s\S]*?\}/g) ?? [];
	for (const block of seedBlocks) {
		const sku = block.match(/skuCode:\s*"([^"]+)"/)?.[1];
		const format = block.match(/format:\s*"([^"]+)"/)?.[1];
		const sceneCount = Number.parseInt(block.match(/sceneCount:\s*(\d+)/)?.[1] ?? "1", 10);
		const marketingName = block.match(/marketingName:\s*"([^"]+)"/)?.[1];
		if (!sku || !format) continue;
		const sizeFolder = format === "square80" ? "80X80" : format === "square" ? "100X100" : "60X120";
		const assetBase = `/assets/${sizeFolder}/INDO ${sku}`;
		const sceneImages = [`${assetBase}/${sku}_PhoiCanh.jpg`];
		for (let i = 2; i <= sceneCount; i += 1) {
			sceneImages.push(`${assetBase}/${sku}_PhoiCanh_${i}.jpg`);
		}
		entries.push({
			slug: `indo-${sku.toLowerCase()}`,
			name: marketingName ? `INDO ${sku} ${marketingName}` : `INDO ${sku}`,
			thumbnailUrl: `${assetBase}/${sku}.jpg`,
			sceneImages,
			assetDir: `INDO ${sku}`.replace(/^/, `${sizeFolder}${path.sep}`),
		});
	}
	return entries;
}

async function listShowcaseFiles(relativeDir) {
	const absoluteDir = path.join(PUBLIC_ASSETS, relativeDir);
	let dirents;
	try {
		dirents = await readdir(absoluteDir, { withFileTypes: true });
	} catch {
		return null;
	}
	return dirents
		.filter((d) => d.isFile())
		.map((d) => d.name)
		.filter((name) => isLikelyShowcaseFileName(name))
		.sort();
}

async function main() {
	const [productsSource, indoSource] = await Promise.all([
		readFile(PRODUCTS_TS, "utf8"),
		readFile(INDO_PRODUCTS_TS, "utf8"),
	]);

	const catalog = [...parseProductsTs(productsSource), ...parseIndoProductsTs(indoSource)];
	const rows = [];

	for (const product of catalog) {
		const registeredPc = product.sceneImages.filter((p) => isPcDemo(path.basename(p)));
		const registeredPhoi = product.sceneImages.filter((p) => isPhoiCanhDemo(path.basename(p)));
		const registeredOtherScenes = product.sceneImages.filter(
			(p) => !isRuntimeDemoWorkPath(p) && !/panorama/i.test(p),
		);

		const pcResolvable = [];
		const pcBroken = [];
		for (const assetPath of registeredPc) {
			const result = await pathResolvable(assetPath);
			if (result.ok) pcResolvable.push(result.resolved);
			else pcBroken.push(assetPath);
		}

		const phoiResolvable = [];
		const phoiBroken = [];
		for (const assetPath of registeredPhoi) {
			const result = await pathResolvable(assetPath);
			if (result.ok) phoiResolvable.push(result.resolved);
			else phoiBroken.push(assetPath);
		}

		const folderFiles = await listShowcaseFiles(product.assetDir);
		const folderMissing = folderFiles === null;

		const registeredDemoBasenames = new Set(
			[...registeredPc, ...registeredPhoi].map((p) => path.basename(p).toLowerCase()),
		);
		const unregisteredInFolder =
			folderFiles?.filter((f) => !registeredDemoBasenames.has(f.toLowerCase())) ?? [];

		const registeredDemoWork = product.sceneImages.filter(isRuntimeDemoWorkPath);
		const demoResolvable = [];
		const demoBroken = [];
		for (const assetPath of registeredDemoWork) {
			const result = await pathResolvable(assetPath);
			if (result.ok) demoResolvable.push(result.resolved);
			else demoBroken.push(assetPath);
		}

		const brokenAfterFix = demoBroken;

		let status = "ok";
		if (registeredDemoWork.length === 0 && registeredOtherScenes.length > 0) status = "non-pc-scene-only";
		else if (registeredDemoWork.length === 0) status = "no-demo-registered";
		if (brokenAfterFix.length > 0) status = `${status}+broken-files`;
		if (folderMissing) status = "folder-missing";

		rows.push({
			slug: product.slug,
			name: product.name,
			folder: product.assetDir,
			status,
			registeredPc: registeredPc.map((p) => path.basename(p)),
			registeredPhoi: registeredPhoi.map((p) => path.basename(p)),
			otherScenes: registeredOtherScenes.map((p) => path.basename(p)),
			pcResolvable: pcResolvable.length,
			pcBroken,
			phoiResolvable: phoiResolvable.length,
			phoiBroken,
			folderShowcase: folderFiles ?? [],
			unregisteredInFolder,
			registeredDemoCount: registeredDemoWork.length,
			demoResolvable: demoResolvable.length,
			demoBroken,
		});
	}

	console.log(`Full audit: ${rows.length} products (${catalog.length})\n`);

	const noDemo = rows.filter((r) => r.status === "no-demo-registered" || r.status === "non-pc-scene-only");
	const broken = rows.filter((r) => r.status.includes("broken-files"));
	const unregistered = rows.filter((r) => r.unregisteredInFolder.length > 0);

	if (noDemo.length > 0) {
		console.log(`=== No PC/PhoiCanh demo work registered (${noDemo.length}) ===`);
		for (const r of noDemo) {
			console.log(`  ${r.slug} — ${r.name}`);
			console.log(`    folder: ${r.folder}`);
			if (r.otherScenes.length) console.log(`    other scenes: ${r.otherScenes.join(", ")}`);
			if (r.folderShowcase.length) console.log(`    showcase in folder: ${r.folderShowcase.join(", ")}`);
			else console.log(`    no showcase files in folder`);
		}
		console.log("");
	}

	if (broken.length > 0) {
		console.log(`=== Registered demo paths not resolvable (jpg or .detail.webp) (${broken.length}) ===`);
		for (const r of broken) {
			console.log(`  ${r.slug}`);
			if (r.pcBroken.length) console.log(`    PC missing: ${r.pcBroken.join(", ")}`);
			if (r.phoiBroken.length) console.log(`    PhoiCanh missing: ${r.phoiBroken.join(", ")}`);
			if (r.folderShowcase.length) console.log(`    folder has: ${r.folderShowcase.join(", ")}`);
		}
		console.log("");
	}

	if (unregistered.length > 0) {
		console.log(`=== Showcase files in folder but not in sceneImages (${unregistered.length}) ===`);
		for (const r of unregistered) {
			console.log(`  ${r.slug}: ${r.unregisteredInFolder.join(", ")}`);
		}
		console.log("");
	}

	console.log("Per-product summary:");
	for (const r of rows) {
		const demoLabel =
			r.registeredDemoCount > 0
				? `demo work: ${r.demoResolvable}/${r.registeredDemoCount} resolvable`
				: "no demo";
		console.log(`  ${r.slug.padEnd(28)} ${demoLabel.padEnd(52)} [${r.status}]`);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
