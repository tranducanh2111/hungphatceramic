import { PRODUCTS } from "@/data/catalog/products";
import { productsWithCollection } from "@/constants/routes";

/** One spinning tile shown per available size on the landing card. */
export interface SizePreview {
	/** Must match a key in TILE_DIMS inside MaterialTilePreview. */
	size: string;
	/** Path under `public/` (spaces are encoded by the image component). */
	image: string;
}

export interface MaterialCategory {
	id: string;
	sizes: string[];
	href: string;
	previews: SizePreview[];
}

type MaterialCategoryDef = Omit<MaterialCategory, "sizes" | "href">;

function getCategorySizes(collectionId: string): string[] {
	const products = PRODUCTS.filter((p) => p.collectionId === collectionId);
	const sizesSet = new Set<string>();
	products.forEach((p) => {
		p.sizes.forEach((s) => sizesSet.add(s));
	});
	const order = ["60×120cm", "80×80cm", "100×100cm", "120×120cm"];
	return Array.from(sizesSet).sort((a, b) => order.indexOf(a) - order.indexOf(b));
}

const MATERIAL_CATEGORY_DEFS: MaterialCategoryDef[] = [
	{
		id: "inspire",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Inspire G12962J/G12962J (1).jpg" },
			{ size: "80×80cm", image: "/assets/80X80/G88962J/G88962 (1).jpg" }
		],
	},
	{
		id: "travertine",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Travertine T01 T06/G12T01.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/G88T01J/G88T01J (1).jpg" }
		],
	},
	{
		id: "orient-star",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Orient Star G12W05J/G12W05J-1.jpg" }
		],
	},
	{
		id: "sunshine",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Sunshine G12032J/G12032J_01.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/G88032J/G88032 (1).jpg" }
		],
	},
	{
		id: "architectural",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Thickness 20mm/G12537-DD 20mm Grey.jpg" }
		],
	},
	{
		id: "peace",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/Peace GP12H03J (Flow)/GP12H03J_1_1.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/GP88736J/GP88736j_01.jpg" }
		],
	},
	{
		id: "indo",
		previews: [
			{ size: "60×120cm", image: "/assets/60X120/INDO SS1261307/SS1261307.jpg" },
			{ size: "80×80cm", image: "/assets/80X80/INDO SS886101/SS886101.jpg" }
		],
	},
];

export const MATERIAL_CATEGORIES: MaterialCategory[] = MATERIAL_CATEGORY_DEFS.map((entry) => {
	const sizes = getCategorySizes(entry.id);
	const previews = entry.previews.filter((p) => sizes.includes(p.size));
	// Fallback to first preview if no matching sizes (e.g. Architectural size is [])
	const finalPreviews = previews.length > 0 ? previews : [entry.previews[0]];
	return {
		...entry,
		sizes,
		previews: finalPreviews,
		href: productsWithCollection(entry.id),
	};
});
