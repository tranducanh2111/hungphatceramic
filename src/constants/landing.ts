/**
 * Landing page static data.
 * Text content is sourced from locale message files.
 * This file keeps only locale-agnostic structure and media references.
 */

import { productsWithCollection } from "@/constants/routes";
import { MEDIA_PATHS } from "@/constants/media";

// ─── Featured Projects ────────────────────────────────────────────────────────

export interface FeaturedProject {
	id: string;
	year: number;
	imageUrl: string;
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
	{
		id: "ramada-ha-long-bay",
		year: 2026,
		imageUrl: MEDIA_PATHS.images.featuredProjects.ramadaHaLongBay,
	},
	{
		id: "hinode-city",
		year: 2022,
		imageUrl: MEDIA_PATHS.images.featuredProjects.hinode,
	},
	{
		id: "vinhomes-symphony",
		year: 2026,
		imageUrl: MEDIA_PATHS.images.featuredProjects.vinhomesSymphony,
	},
	{
		id: "grand-world-phu-quocquoc",
		year: 2026,
		imageUrl: MEDIA_PATHS.images.featuredProjects.grandPhuQuoc,
	},
	{
		id: "saigon-intela",
		year: 2026,
		imageUrl: MEDIA_PATHS.images.featuredProjects.saigonIntela,
	},
	{
		id: "empire-city",
		year: 2026,
		imageUrl: MEDIA_PATHS.images.featuredProjects.empireCity,
	},
];

// ─── Material Categories ──────────────────────────────────────────────────────

/** One spinning tile shown per available size on the landing card. */
export interface SizePreview {
	/** Must match a key in TILE_DIMS inside MaterialTilePreview. */
	size: string;
	/** Path under `public/` — spaces are encoded by the image component. */
	image: string;
}

export interface MaterialCategory {
	id: string;
	sizes: string[];
	href: string;
	previews: SizePreview[];
}

type MaterialCategoryDef = Omit<MaterialCategory, "href">;

const MATERIAL_CATEGORY_DEFS: MaterialCategoryDef[] = [
	{
		id: "inspire",
		sizes: ["60×120cm"],
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Inspire G12962J/G12962J (1).jpg" },
		],
	},
	{
		id: "travertine",
		sizes: ["60×120cm", "80×80cm"],
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Travertine T01 T06/G12T01.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/G88T01J/G88T01J (1).jpg" },
		],
	},
	{
		id: "orient-star",
		sizes: ["60×120cm"],
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Orient Star GP12W05J/GP12W05J (1).jpg" },
		],
	},
	{
		id: "sunshine",
		sizes: ["60×120cm", "80×80cm"],
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Sunshine G12032J/G12032J_01.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/G88032J/G88032 (1).jpg" },
		],
	},
	{
		id: "architectural",
		sizes: ["60×120cm"],
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Thickness 20mm/G12537-DD 20mm Grey.jpg" },
		],
	},
];

export const MATERIAL_CATEGORIES: MaterialCategory[] = MATERIAL_CATEGORY_DEFS.map((entry) => ({
	...entry,
	href: productsWithCollection(entry.id),
}));

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface StatItem {
	numericValue: number;
	suffix: string;
}

export const STATS: StatItem[] = [
	{ numericValue: 12, suffix: "+" },
	{ numericValue: 200, suffix: "+" },
	{ numericValue: 50000, suffix: "+" },
	{ numericValue: 35, suffix: "+" },
];

// ─── Process Steps ────────────────────────────────────────────────────────────

export interface ProcessStep {
	id: string;
	number: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
	{
		id: "consultation",
		number: "01",
	},
	{
		id: "curation",
		number: "02",
	},
	{
		id: "fulfillment",
		number: "03",
	},
	{
		id: "aftercare",
		number: "04",
	},
];

// ─── Testimonials ─────────────────────────────────────────────────────────────

export interface Testimonial {
	id: string;
}

export const TESTIMONIALS: Testimonial[] = [
	{
		id: "minh-chau",
	},
	{
		id: "tran-quoc-hung",
	},
	{
		id: "nguyen-lan-anh",
	},
];
