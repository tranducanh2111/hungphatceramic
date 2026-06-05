import type { ProductDetail } from "@/types";
import type { ProductListingItem } from "@/lib/products/listing";
import { getTileSizeDimension, isTileSizeSlug, type TileSizeSlug } from "@/lib/products/listing";

/** Catalogue dimension label → `public/assets` folder name. */
export const TILE_DIMENSION_TO_ASSET_FOLDER = {
	"60×120cm": "60X120",
	"80×80cm": "80X80",
	"100×100cm": "100X100",
	"120×120cm": "120X120",
} as const;

export type TileDimensionLabel = keyof typeof TILE_DIMENSION_TO_ASSET_FOLDER;

const ASSET_SIZE_FOLDER_PATTERN = /\/assets\/(60X120|80X80|100X100|120X120)\//;

/** Swap the size folder segment in a catalog asset path. */
export function remapAssetPathForTileDimension(
	assetPath: string,
	tileDimension: TileDimensionLabel,
): string {
	const targetFolder = TILE_DIMENSION_TO_ASSET_FOLDER[tileDimension];
	return assetPath.replace(ASSET_SIZE_FOLDER_PATTERN, `/assets/${targetFolder}/`);
}

function resolveTileDimension(
	product: ProductListingItem | ProductDetail,
	sizeSlug: string | undefined,
): TileDimensionLabel | null {
	if (sizeSlug && sizeSlug !== "all" && isTileSizeSlug(sizeSlug)) {
		const dimension = getTileSizeDimension(sizeSlug);
		if (product.sizes.includes(dimension)) {
			return dimension as TileDimensionLabel;
		}
	}

	const primaryCategory = product.category as TileDimensionLabel;
	if (primaryCategory in TILE_DIMENSION_TO_ASSET_FOLDER) {
		return primaryCategory;
	}

	return null;
}

/** Listing card media for the active tile-size filter (or primary category). */
export function applyTileSizeToListingItem(
	product: ProductListingItem,
	sizeSlug: string | undefined,
): ProductListingItem {
	const tileDimension = resolveTileDimension(product, sizeSlug);
	if (!tileDimension) {
		return product;
	}

	return {
		...product,
		category: tileDimension,
		thumbnailUrl: remapAssetPathForTileDimension(product.thumbnailUrl, tileDimension),
	};
}

/** Detail page media for `?size=` filter or primary category. */
export function applyTileSizeToProductDetail(
	product: ProductDetail,
	sizeSlug: string | undefined,
): ProductDetail {
	const tileDimension = resolveTileDimension(product, sizeSlug);
	if (!tileDimension) {
		return product;
	}

	const remap = (path: string) => remapAssetPathForTileDimension(path, tileDimension);

	return {
		...product,
		category: tileDimension,
		thumbnailUrl: remap(product.thumbnailUrl),
		faceImages: product.faceImages.map(remap),
		demoWorkImages: product.demoWorkImages.map(remap),
		sceneImages: product.sceneImages.map(remap),
		...(product.allFacesImage ? { allFacesImage: remap(product.allFacesImage) } : {}),
	};
}

export function productDetailHref(slug: string, sizeSlug: string | undefined): string {
	if (sizeSlug && sizeSlug !== "all" && isTileSizeSlug(sizeSlug)) {
		return `/products/${slug}?size=${sizeSlug}`;
	}
	return `/products/${slug}`;
}
