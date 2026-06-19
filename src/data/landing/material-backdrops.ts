export type TileSize = "60×120cm" | "80×80cm" | "100×100cm" | "120×120cm";

/** Precomputed backdrops (no runtime color sampling) to avoid scroll jank, tones stay close to each tile palette while keeping the slab as the hero. */
export const MATERIAL_BACKDROPS: Record<
	string,
	Partial<Record<TileSize, string>> & { default: string }
> = {
	inspire: {
		default: "linear-gradient(146deg, #102b45 0%, #0b2237 45%, #071a2b 100%)",
		"60×120cm": "linear-gradient(146deg, #15385a 0%, #0e2b46 46%, #071a2b 100%)",
	},
	travertine: {
		default: "linear-gradient(146deg, #2f2418 0%, #231a11 44%, #0f0b07 100%)",
		"60×120cm": "linear-gradient(146deg, #443222 0%, #2e2318 44%, #161008 100%)",
		"80×80cm": "linear-gradient(146deg, #3a2c1e 0%, #2a2117 44%, #130f0a 100%)",
	},
	"orient-star": {
		default: "linear-gradient(146deg, #2d2619 0%, #1f1a12 42%, #0c0906 100%)",
		"60×120cm": "linear-gradient(146deg, #383022 0%, #262015 44%, #0d0b07 100%)",
	},
	sunshine: {
		default: "linear-gradient(146deg, #183245 0%, #10293a 45%, #071a2b 100%)",
		"60×120cm": "linear-gradient(146deg, #214261 0%, #17344d 48%, #091f34 100%)",
		"80×80cm": "linear-gradient(146deg, #1b3b55 0%, #123049 46%, #081f35 100%)",
	},
	architectural: {
		default: "linear-gradient(146deg, #1a1f31 0%, #101526 44%, #080b15 100%)",
		"60×120cm": "linear-gradient(146deg, #262d43 0%, #1a2238 44%, #0c1323 100%)",
	},
	peace: {
		default: "linear-gradient(146deg, #1e2a38 0%, #142030 44%, #071a2b 100%)",
		"60×120cm": "linear-gradient(146deg, #243548 0%, #182a3d 46%, #091f34 100%)",
		"80×80cm": "linear-gradient(146deg, #1f3042 0%, #152535 44%, #081c30 100%)",
	},
	indo: {
		default: "linear-gradient(146deg, #1a2838 0%, #122030 44%, #071a2b 100%)",
		"100×100cm": "linear-gradient(146deg, #223a52 0%, #172d42 46%, #0a1f36 100%)",
		"120×120cm": "linear-gradient(146deg, #223a52 0%, #172d42 46%, #0a1f36 100%)",
		"60×120cm": "linear-gradient(146deg, #1e3348 0%, #14293c 44%, #091e32 100%)",
	},
};

export function getMaterialBackdrop(categoryId: string, tileSize: TileSize): string {
	const config = MATERIAL_BACKDROPS[categoryId] ?? MATERIAL_BACKDROPS.inspire;
	return config[tileSize] ?? config.default;
}
