/** Surface finish inferred from SKU prefix (GP/GS glossy, SS satin, G matte). */
export const TILE_FINISH = {
	glossy: "glossy",
	satin: "satin",
	matte: "matte",
} as const;

export type TileFinish = (typeof TILE_FINISH)[keyof typeof TILE_FINISH];

/** Maps SKU code prefix to the simulated tile surface finish overlay. */
export function inferTileFinish(skuCode: string): TileFinish {
	const normalizedSku = skuCode.trim().toUpperCase();

	if (normalizedSku.startsWith("GP") || normalizedSku.startsWith("GS")) {
		return TILE_FINISH.glossy;
	}

	if (normalizedSku.startsWith("SS")) {
		return TILE_FINISH.satin;
	}

	return TILE_FINISH.matte;
}
