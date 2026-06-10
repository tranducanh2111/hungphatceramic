/**
 * Landing page static data.
 * Text content is sourced from locale message files.
 * This file keeps only locale-agnostic structure and media references.
 */

import { productsWithCollection } from "@/constants/routes";
import { MEDIA_PATHS } from "@/constants/media";
import {
	remapAssetPathForTileDimension,
	type TileDimensionLabel,
} from "@/lib/products/asset-paths";

export { FEATURED_PROJECTS, type FeaturedProject } from "@/constants/projects";

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

const SQUARE_FORMAT_SIZES = ["80×80cm", "100×100cm", "120×120cm"] as const;
const LARGE_FORMAT_SIZES = ["60×120cm", "100×100cm", "120×120cm"] as const;

function sizePreviews(
	baseDimension: TileDimensionLabel,
	imagePath: string,
	extraDimensions: readonly TileDimensionLabel[] = [],
): SizePreview[] {
	const dimensions = new Set<TileDimensionLabel>([baseDimension, ...extraDimensions]);
	return [...dimensions].map((dimension) => ({
		size: dimension,
		image: remapAssetPathForTileDimension(imagePath, dimension),
	}));
}

const MATERIAL_CATEGORY_DEFS: MaterialCategoryDef[] = [
	{
		id: "inspire",
		sizes: [...LARGE_FORMAT_SIZES],
		previews: sizePreviews("60×120cm", "/assets/60X120/Inspire G12962J/G12962J (1).jpg", [
			"100×100cm",
			"120×120cm",
		]),
	},
	{
		id: "travertine",
		sizes: ["60×120cm", "80×80cm", "100×100cm", "120×120cm"],
		previews: [
			...sizePreviews("60×120cm", "/assets/60X120/Travertine T01 T06/G12T01.jpg", [
				"100×100cm",
				"120×120cm",
			]),
			...sizePreviews("80×80cm", "/assets/80X80/G88T01J/G88T01J (1).jpg", [
				"100×100cm",
				"120×120cm",
			]),
		],
	},
	{
		id: "orient-star",
		sizes: [...LARGE_FORMAT_SIZES],
		previews: sizePreviews("60×120cm", "/assets/60X120/Orient Star G12W05J/G12W05J-1.jpg", [
			"100×100cm",
			"120×120cm",
		]),
	},
	{
		id: "sunshine",
		sizes: ["60×120cm", "80×80cm", "100×100cm", "120×120cm"],
		previews: [
			...sizePreviews("60×120cm", "/assets/60X120/Sunshine G12032J/G12032J_01.jpg", [
				"100×100cm",
				"120×120cm",
			]),
			...sizePreviews("80×80cm", "/assets/80X80/G88032J/G88032 (1).jpg", [
				"100×100cm",
				"120×120cm",
			]),
		],
	},
	{
		id: "architectural",
		sizes: [...LARGE_FORMAT_SIZES],
		previews: sizePreviews(
			"60×120cm",
			"/assets/60X120/Thickness 20mm/G12537-DD 20mm Grey.jpg",
			["100×100cm", "120×120cm"],
		),
	},
	{
		id: "peace",
		sizes: ["60×120cm", "80×80cm", "100×100cm", "120×120cm"],
		previews: [
			...sizePreviews("60×120cm", "/assets/60X120/Peace GP12H03J (Flow)/GP12H03J_1_1.jpg", [
				"100×100cm",
				"120×120cm",
			]),
			...sizePreviews("80×80cm", "/assets/80X80/GP88736J/GP88736j_01.jpg", [
				"100×100cm",
				"120×120cm",
			]),
		],
	},
	{
		id: "indo",
		sizes: ["60×120cm", "80×80cm", "100×100cm", "120×120cm"],
		previews: [
			...sizePreviews("60×120cm", "/assets/60X120/INDO SS1261307/SS1261307.jpg", [
				"100×100cm",
				"120×120cm",
			]),
			...sizePreviews("80×80cm", "/assets/80X80/INDO SS886101/SS886101.jpg", [
				"100×100cm",
				"120×120cm",
			]),
			...sizePreviews("100×100cm", "/assets/100X100/INDO GS881042/GS881042.jpg", [
				"120×120cm",
			]),
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

/** Shared process step card shell — mobile stepper and scroll timeline. */
export const PROCESS_STEP_CARD_CLASS =
	"rounded-2xl border border-sapphire-mist bg-sapphire-deep/50 backdrop-blur-sm";

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
