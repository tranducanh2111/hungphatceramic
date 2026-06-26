export type TileFinish = "glossy" | "matte" | "satin";

/**
 * Derive surface finish from the SKU prefix or filename.
 * Checked in priority order: GP > GS > SS > G (matte default).
 */
export function inferTileFinish(skuCode: string): TileFinish {
	const code = skuCode.trim().toUpperCase();
	if (code.startsWith("GP") || code.startsWith("GS")) {
		return "glossy";
	}
	if (code.startsWith("SS")) {
		return "satin";
	}
	return "matte";
}
