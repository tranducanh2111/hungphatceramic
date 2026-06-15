import type { ProductCatalogEntry } from "@/types";

const SQUARE_SIZE = "100×100cm" as const;
const SQUARE_80_SIZE = "80×80cm" as const;
const RECT_SIZE = "60×120cm" as const;

type IndoProductFormat = "square" | "square80" | "rect";

interface IndoProductSeed {
	skuCode: string;
	format: IndoProductFormat;
	marketingName?: string;
	faceCount?: number;
	sceneCount?: number;
	/** Omit composite when Drive only provides PDF or individual faces. */
	hasFullFacesComposite: boolean;
	shortDescription: string;
}

const INDO_PRODUCT_SEEDS: IndoProductSeed[] = [
	{
		skuCode: "GS881042",
		format: "square80",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO square porcelain with balanced natural movement for premium interiors.",
	},
	{
		skuCode: "GS881045",
		format: "square80",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO square surface with refined tonal depth for contemporary living spaces.",
	},
	{
		skuCode: "GS883009",
		format: "square80",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO square tile with expressive veining and a calm, architectural finish.",
	},
	{
		skuCode: "SS886101",
		format: "square80",
		marketingName: "Olympus White",
		faceCount: 12,
		sceneCount: 1,
		hasFullFacesComposite: true,
		shortDescription:
			"INDO 80×80cm porcelain in Olympus White — twelve face variations for open residential and hospitality floors.",
	},
	{
		skuCode: "SS886106",
		format: "square80",
		marketingName: "Elbrus Gris",
		faceCount: 12,
		sceneCount: 2,
		hasFullFacesComposite: true,
		shortDescription:
			"INDO 80×80cm Elbrus Gris surface with polished character, soft luminosity, and twelve face variations.",
	},
	{
		skuCode: "SS1261307",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO large-format slab with vertical rhythm for feature walls and lobbies.",
	},
	{
		skuCode: "SS1261310",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO rectilinear surface with layered stone inspiration and modern clarity.",
	},
	{
		skuCode: "SS1261311",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO large slab with confident contrast for statement architectural zones.",
	},
	{
		skuCode: "SS1261315",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription:
			"INDO large-format tile with muted elegance for serene, high-end interiors.",
	},
];

function indoFolderLabel(skuCode: string): string {
	return `INDO ${skuCode}`;
}

function indoAssetBase(format: IndoProductFormat, skuCode: string): string {
	const sizeFolder = format === "square80" ? "80X80" : format === "square" ? "100X100" : "60X120";
	return `/assets/${sizeFolder}/${indoFolderLabel(skuCode)}`;
}

function buildFaceImages(assetBase: string, skuCode: string, faceCount = 0): string[] {
	const facePaths = [`${assetBase}/${skuCode}.jpg`];
	for (let faceIndex = 1; faceIndex <= faceCount; faceIndex += 1) {
		facePaths.push(`${assetBase}/${skuCode}_F${faceIndex}.jpg`);
	}
	return [...new Set(facePaths)];
}

function buildSceneImages(assetBase: string, skuCode: string, sceneCount = 1): string[] {
	const scenePaths = [`${assetBase}/${skuCode}_PhoiCanh.jpg`];
	for (let sceneIndex = 2; sceneIndex <= sceneCount; sceneIndex += 1) {
		scenePaths.push(`${assetBase}/${skuCode}_PhoiCanh_${sceneIndex}.jpg`);
	}
	return scenePaths;
}

function buildIndoProduct(seed: IndoProductSeed): ProductCatalogEntry {
	const assetBase = indoAssetBase(seed.format, seed.skuCode);
	const primarySize =
		seed.format === "square80"
			? SQUARE_80_SIZE
			: seed.format === "square"
				? SQUARE_SIZE
				: RECT_SIZE;
	const sizes =
		seed.format === "square80"
			? ([SQUARE_80_SIZE, SQUARE_SIZE, "120×120cm"] as const)
			: seed.format === "square"
				? ([SQUARE_SIZE, "120×120cm", RECT_SIZE] as const)
				: ([RECT_SIZE, SQUARE_SIZE, "120×120cm"] as const);

	const displayName = seed.marketingName
		? `INDO ${seed.skuCode} ${seed.marketingName}`
		: `INDO ${seed.skuCode}`;
	const compositeImage = `${assetBase}/${seed.skuCode}_FullFaces.jpg`;

	return {
		slug: `indo-${seed.skuCode.toLowerCase()}`,
		skuCode: seed.skuCode,
		name: displayName,
		collectionId: "indo",
		category: primarySize,
		sizes: [...sizes],
		thumbnailUrl: `${assetBase}/${seed.skuCode}.jpg`,
		shortDescription: seed.shortDescription,
		faceImages: buildFaceImages(assetBase, seed.skuCode, seed.faceCount ?? 0),
		sceneImages: buildSceneImages(assetBase, seed.skuCode, seed.sceneCount ?? 1),
		...(seed.hasFullFacesComposite ? { allFacesImage: compositeImage } : {}),
	};
}

/** MẪU GẠCH INDO — assets from client Drive folders (see public/assets/INDO-IMPORT.md). */
export const INDO_PRODUCTS: ProductCatalogEntry[] = INDO_PRODUCT_SEEDS.map(buildIndoProduct);
