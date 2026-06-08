/**
 * Generates .detail.webp sidecars (1920px max) for demo work, composites, panoramas, and oversized faces.
 * Run: pnpm generate:detail-media
 */
import { generateDetailPreview } from "./lib/product-media-sidecars.mjs";
import { collectRuntimeDetailSources, isSidecarAssetPath } from "./lib/product-asset-paths.mjs";

async function main() {
	const targets = await collectRuntimeDetailSources();

	console.log(`Generating .detail.webp for ${targets.length} target asset(s)...\n`);

	const results = [];
	for (const assetPath of targets) {
		if (isSidecarAssetPath(assetPath)) continue;
		const result = await generateDetailPreview(assetPath);
		results.push(result);
		const detail = [
			result.status,
			result.beforeMb ? `${result.beforeMb}MB` : "",
			result.afterMb ? `→ ${result.afterMb}MB` : "",
			result.dimensions ?? "",
		]
			.filter(Boolean)
			.join(" ");
		console.log(`${result.assetPath}: ${detail}`);
	}

	const created = results.filter((result) => result.status === "detail-created");
	console.log(`\nDone. Created ${created.length} .detail.webp file(s).`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
