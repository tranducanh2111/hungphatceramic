/**
 * Projects page static data.
 * Locale-agnostic structure (IDs, images, coordinates).
 * Display text lives under `pages.projects.*` in message files.
 */

import { MEDIA_PATHS } from "@/constants/media";

// ─── Heritage Timeline ────────────────────────────────────────────────────────

export interface HeritageMilestone {
	id: string;
	year: string;
	/** GPS-style label matching kaatdm.com aesthetic. */
	coordinates: string;
	location: string;
	imageUrl: string;
}

export const HERITAGE_MILESTONES: HeritageMilestone[] = [
	{
		id: "founding",
		year: "2012",
		coordinates: "21°02'N — 105°51'E",
		location: "Bat Trang, Hanoi",
		imageUrl: MEDIA_PATHS.images.about.milestones.founding,
	},
	{
		id: "firstHotel",
		year: "2014",
		coordinates: "20°51'N — 106°41'E",
		location: "Ha Long Bay, Quang Ninh",
		imageUrl: MEDIA_PATHS.images.about.milestones.firstHotel,
	},
	{
		id: "hospitalityExpansion",
		year: "2016",
		coordinates: "21°02'N — 105°51'E",
		location: "Hoang Mai, Hanoi",
		imageUrl: MEDIA_PATHS.images.about.milestones.hospitalityExpansion,
	},
	{
		id: "residentialGrowth",
		year: "2019",
		coordinates: "21°04'N — 105°53'E",
		location: "Vinhomes Riverside, Hanoi",
		imageUrl: MEDIA_PATHS.images.about.milestones.residentialGrowth,
	},
	{
		id: "brandsAsPartner",
		year: "2022",
		coordinates: "10°46'N — 106°42'E",
		location: "Thu Duc, Ho Chi Minh City",
		imageUrl: MEDIA_PATHS.images.about.milestones.brandsAsPartner,
	},
	{
		id: "present",
		year: "2025",
		coordinates: "10°46'N — 106°42'E",
		location: "Vietnam",
		imageUrl: MEDIA_PATHS.images.about.milestones.present,
	},
];
