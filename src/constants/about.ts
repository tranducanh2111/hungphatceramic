/**
 * About page static data.
 * Locale-agnostic structure (IDs, images, coordinates).
 * All display text is sourced from locale message files under `pages.about.*`.
 */

import { MEDIA_PATHS } from "@/constants/media";

// ─── Craft Story ──────────────────────────────────────────────────────────────

export interface CraftBeat {
	id: string;
	imageUrl: string;
}

export const CRAFT_BEATS: CraftBeat[] = [
	{ id: "kiln", imageUrl: MEDIA_PATHS.images.about.craft.kiln },
	{ id: "polishing", imageUrl: MEDIA_PATHS.images.about.craft.polishing },
	{ id: "installation", imageUrl: MEDIA_PATHS.images.about.craft.installation },
];

// ─── Capability Cards ─────────────────────────────────────────────────────────

export interface CapabilityCard {
	id: string;
	/** Numeral displayed as the visual anchor (e.g. "01"). */
	numeral: string;
	imageUrl: string;
}

export const CAPABILITY_CARDS: CapabilityCard[] = [
	{
		id: "specification",
		numeral: "01",
		imageUrl: MEDIA_PATHS.images.about.capabilities.specification,
	},
	{
		id: "production",
		numeral: "02",
		imageUrl: MEDIA_PATHS.images.about.capabilities.production,
	},
	{
		id: "logistics",
		numeral: "03",
		imageUrl: MEDIA_PATHS.images.about.capabilities.logistics,
	},
	{
		id: "aftercare",
		numeral: "04",
		imageUrl: MEDIA_PATHS.images.about.capabilities.aftercare,
	},
];

// Keep the raw ID tuple for any code that still references it
export const CAPABILITY_IDS = ["specification", "production", "logistics", "aftercare"] as const;
export type CapabilityId = (typeof CAPABILITY_IDS)[number];

// ─── Client Roster ────────────────────────────────────────────────────────────

export interface ClientEntry {
	id: string;
	/** Proper name (not localised, brand name stays the same across locales). */
	name: string;
}

export const CLIENT_ROSTER: ClientEntry[] = [
	{ id: "ramada-ha-long-bay", name: "Ramada Ha Long Bay" },
	{ id: "hinode-city", name: "Hinode City" },
	{ id: "vinhomes-symphony", name: "Vinhomes Symphony" },
	{ id: "grand-world-phu-quoc", name: "Grand World Phu Quoc" },
	{ id: "empire-city", name: "Empire City" },
	{ id: "saigon-intela", name: "Saigon Intela" },
	{ id: "aria-boutique-hotel", name: "Aria Boutique Hotel" },
	{ id: "studio-lan", name: "Studio Lan" },
];

// ─── Partner Roster ────────────────────────────────────────────────────────────

export interface PartnerEntry {
	id: string;
	name: string;
}

export const PARTNER_ROSTER: PartnerEntry[] = [
	{ id: "sunpower", name: "Sunpower" },
	{ id: "taicera", name: "Taicera" },
	{ id: "guocera", name: "Guocera" },
];
