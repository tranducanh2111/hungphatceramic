/**
 * Multi-stop section blends — smoother than single `via` for large contrast jumps.
 * Hex values match tailwind.config.ts brand tokens.
 */
export const SECTION_BLEND_GRADIENTS = {
	/** Hero / deep section into sapphire-ocean (prologue top). */
	sapphireDeepToSapphireOcean:
		"linear-gradient(180deg, #071A2B 0%, #081f33 14%, #0a2439 28%, #0c2840 42%, #0E2A42 62%, rgba(14,42,66,0.45) 82%, rgba(14,42,66,0) 100%)",
	/** Ocean section into deep (prologue → heritage), mirrors AboutCapabilities. */
	sapphireOceanToSapphireDeep:
		"linear-gradient(180deg, #0E2A42 0%, #0c2640 18%, #0a1f32 38%, #091f31 58%, #081e30 76%, #071A2B 100%)",
	/** Deep section top feather (same-tone seam after ocean→deep handoff). */
	sapphireDeepFeatherTop:
		"linear-gradient(180deg, #071A2B 0%, #071A2B 10%, rgba(7,26,43,0.94) 24%, rgba(7,26,43,0.72) 44%, rgba(7,26,43,0.38) 64%, rgba(7,26,43,0) 100%)",
	/**
	 * Sapphire-deep → linen-warm (heritage → regions).
	 * Cool blue-grey bridge only — no warm sand stops (#B8B5AD / #D6D3CC).
	 */
	sapphireDeepToLinenWarm:
		"linear-gradient(180deg, #071A2B 0%, #071A2B 10%, #0E2A42 20%, #1A3D5C 30%, #355A70 40%, #5E7A94 48%, #7A92A6 56%, #9AADBC 66%, #C8D0D8 78%, #E8EAEC 90%, #EEEAE4 100%)",
	/**
	 * Linen-warm → sapphire-deep (regions → client strip).
	 * Mirrors deep→linen: cool lights, then sapphire family (no warm sand band).
	 */
	linenWarmToSapphireDeep:
		"linear-gradient(180deg, #EEEAE4 0%, #EEEAE4 10%, #E8EAEC 20%, #C8D0D8 32%, #9AADBC 44%, #5E7A94 54%, #3D5A75 64%, #1A3D5C 74%, #0E2A42 84%, #081f33 94%, #071A2B 100%)",
} as const;

/** Same-family transitions (ocean↔deep, deep feather). */
export const SECTION_BLEND_HEIGHT_STANDARD = "h-32 sm:h-44 lg:h-52" as const;

/** High-contrast pairs on projects — same band as legacy h-40 / h-28 overlays. */
export const SECTION_BLEND_HEIGHT_COMPACT_MAJOR = "h-40 translate-y-px sm:h-48" as const;
export const SECTION_BLEND_HEIGHT_COMPACT_MINOR = "h-28 sm:h-36" as const;

/** Reserve below in-flow content so it clears compact bottom blend overlays. */
export const SECTION_BLEND_CONTENT_PAD_MINOR = "pb-36 sm:pb-44" as const;

/** Top spacing after heritage → regions blend overlap (keeps heading off the fade band). */
export const SECTION_BLEND_CONTENT_PAD_AFTER_MAJOR = "pt-20 sm:pt-24 lg:pt-28" as const;

/** Pull client strip slightly into regions bottom blend. */
export const SECTION_BLEND_OVERLAP_AFTER_MINOR = "-mt-8 sm:-mt-12" as const;

/** Top pad on Partners after linen → deep — modest trim, not tight. */
export const SECTION_BLEND_CONTENT_PAD_AFTER_MINOR = "pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28" as const;

/** High-contrast section pairs (deep↔linen) — tall storytelling band when needed. */
export const SECTION_BLEND_HEIGHT_MAJOR = "h-72 sm:h-[26rem] lg:h-[30rem] xl:h-[34rem]" as const;

/** Longest cross-family blends on the page. */
export const SECTION_BLEND_HEIGHT_EXTENDED = "h-80 sm:h-[28rem] lg:h-[32rem] xl:h-[38rem]" as const;
