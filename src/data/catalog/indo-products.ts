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
	sceneFiles?: string[];
	/** Omit composite when Drive only provides PDF or individual faces. */
	hasFullFacesComposite: boolean;
}

const INDO_PRODUCT_SEEDS: IndoProductSeed[] = [
	{
		skuCode: "GS881042",
		format: "square80",
		sceneCount: 2,
		hasFullFacesComposite: true,
	},
	{
		skuCode: "GS881045",
		format: "square80",
		sceneFiles: ["GS881045_PhoiCanh.png"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "GS883009",
		format: "square80",
		sceneFiles: ["GS883009_PhoiCanh.png"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS886101",
		format: "square80",
		marketingName: "Olympus White",
		faceCount: 12,
		sceneFiles: ["SS886101_PhoiCanh.png"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS886106",
		format: "square80",
		marketingName: "Elbrus Gris",
		faceCount: 12,
		sceneFiles: ["SS886106_PhoiCanh.png"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS1261307",
		format: "rect",
		sceneFiles: ["PC SS1261307.jpg"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS1261310",
		format: "rect",
		sceneFiles: ["PC SS1261310.jpg", "SS1261310_PhoiCanh.jpg"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS1261311",
		format: "rect",
		sceneFiles: ["PC SS1261311.jpg", "SS1261311_PhoiCanh.jpg"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "SS1261315",
		format: "rect",
		sceneFiles: ["PC SS1261315.jpg", "SS1261315_PhoiCanh.jpg"],
		hasFullFacesComposite: true,
	},
	{
		skuCode: "GP10C41",
		format: "square",
		marketingName: "Albino Crema",
		faceCount: 6,
		sceneCount: 1,
		hasFullFacesComposite: true,
	},
	{
		skuCode: "GP10C46",
		format: "square",
		marketingName: "Smiley Crema",
		faceCount: 6,
		sceneCount: 1,
		hasFullFacesComposite: true,
	},
	{
		skuCode: "GP10C49",
		format: "square",
		marketingName: "Honey Crema",
		faceCount: 6,
		sceneCount: 1,
		hasFullFacesComposite: true,
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
	if (faceCount > 0) {
		const facePaths: string[] = [];
		for (let faceIndex = 1; faceIndex <= faceCount; faceIndex += 1) {
			facePaths.push(`${assetBase}/${skuCode}_F${faceIndex}.jpg`);
		}
		return facePaths;
	}
	return [`${assetBase}/${skuCode}.jpg`];
}

function buildSceneImages(
	assetBase: string,
	skuCode: string,
	sceneCount = 1,
	sceneFiles?: string[],
): string[] {
	if (sceneFiles && sceneFiles.length > 0) {
		return sceneFiles.map((file) => `${assetBase}/${file}`);
	}
	if (sceneCount === 0) {
		return [];
	}
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
			? ([SQUARE_80_SIZE] as const)
			: seed.format === "square"
				? ([SQUARE_SIZE] as const)
				: ([RECT_SIZE] as const);

	const compositeImage = `${assetBase}/${seed.skuCode}_FullFaces.jpg`;

	return {
		slug: `indo-${seed.skuCode.toLowerCase()}`,
		skuCode: seed.skuCode,
		collectionId: "indo",
		category: primarySize,
		sizes: [...sizes],
		thumbnailUrl: `${assetBase}/${seed.skuCode}.jpg`,
		faceImages: buildFaceImages(assetBase, seed.skuCode, seed.faceCount),
		sceneImages: buildSceneImages(
			assetBase,
			seed.skuCode,
			seed.sceneCount ?? (seed.sceneFiles ? seed.sceneFiles.length : 1),
			seed.sceneFiles,
		),
		...(seed.hasFullFacesComposite ? { allFacesImage: compositeImage } : {}),
	};
}

/** MẪU GẠCH INDO (assets from client Drive folders, see public/assets/INDO-IMPORT.md). */
export const INDO_PRODUCTS: ProductCatalogEntry[] = INDO_PRODUCT_SEEDS.map(buildIndoProduct);
