import type { ProductDetail } from "@/types";

const SQUARE_SIZE = "100×100cm" as const;
const RECT_SIZE = "60×120cm" as const;

interface IndoProductSeed {
	skuCode: string;
	format: "square" | "rect";
	/** Omit composite when Drive only provides PDF. */
	hasFullFacesComposite: boolean;
	shortDescription: string;
}

const INDO_PRODUCT_SEEDS: IndoProductSeed[] = [
	{
		skuCode: "GS881042",
		format: "square",
		hasFullFacesComposite: true,
		shortDescription: "INDO square porcelain with balanced natural movement for premium interiors.",
	},
	{
		skuCode: "GS881045",
		format: "square",
		hasFullFacesComposite: true,
		shortDescription: "INDO square surface with refined tonal depth for contemporary living spaces.",
	},
	{
		skuCode: "GS883009",
		format: "square",
		hasFullFacesComposite: true,
		shortDescription: "INDO square tile with expressive veining and a calm, architectural finish.",
	},
	{
		skuCode: "SS886101",
		format: "square",
		hasFullFacesComposite: true,
		shortDescription: "INDO square format suited to open-plan residential and hospitality floors.",
	},
	{
		skuCode: "SS886106",
		format: "square",
		hasFullFacesComposite: false,
		shortDescription: "INDO square porcelain with polished character and soft luminosity.",
	},
	{
		skuCode: "SS1261307",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription: "INDO large-format slab with vertical rhythm for feature walls and lobbies.",
	},
	{
		skuCode: "SS1261310",
		format: "rect",
		hasFullFacesComposite: false,
		shortDescription: "INDO rectilinear surface with layered stone inspiration and modern clarity.",
	},
	{
		skuCode: "SS1261311",
		format: "rect",
		hasFullFacesComposite: true,
		shortDescription: "INDO large slab with confident contrast for statement architectural zones.",
	},
	{
		skuCode: "SS1261315",
		format: "rect",
		hasFullFacesComposite: false,
		shortDescription: "INDO large-format tile with muted elegance for serene, high-end interiors.",
	},
];

function indoFolderLabel(skuCode: string): string {
	return `INDO ${skuCode}`;
}

function indoAssetBase(format: IndoProductSeed["format"], skuCode: string): string {
	const sizeFolder = format === "square" ? "100X100" : "60X120";
	return `/assets/${sizeFolder}/${indoFolderLabel(skuCode)}`;
}

function buildIndoProduct(seed: IndoProductSeed): ProductDetail {
	const assetBase = indoAssetBase(seed.format, seed.skuCode);
	const primarySize = seed.format === "square" ? SQUARE_SIZE : RECT_SIZE;
	const sizes =
		seed.format === "square"
			? ([SQUARE_SIZE, "120×120cm", RECT_SIZE] as const)
			: ([RECT_SIZE, SQUARE_SIZE, "120×120cm"] as const);

	const faceImage = `${assetBase}/${seed.skuCode}.jpg`;
	const sceneImage = `${assetBase}/${seed.skuCode}_PhoiCanh.jpg`;
	const compositeImage = `${assetBase}/${seed.skuCode}_FullFaces.jpg`;

	return {
		slug: `indo-${seed.skuCode.toLowerCase()}`,
		skuCode: seed.skuCode,
		name: `INDO ${seed.skuCode}`,
		collectionId: "indo",
		category: primarySize,
		sizes: [...sizes],
		thumbnailUrl: faceImage,
		shortDescription: seed.shortDescription,
		faceImages: [faceImage],
		sceneImages: [sceneImage],
		...(seed.hasFullFacesComposite ? { allFacesImage: compositeImage } : {}),
	};
}

/** MẪU GẠCH INDO — assets from client Drive folder (see public/assets/INDO-IMPORT.md). */
export const INDO_PRODUCTS: ProductDetail[] = INDO_PRODUCT_SEEDS.map(buildIndoProduct);
