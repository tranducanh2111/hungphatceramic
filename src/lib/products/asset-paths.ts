import type { ProductDetail } from "@/types";
import type { ProductListingItem } from "@/lib/products/listing";
import { getTileSizeDimension, isTileSizeSlug } from "@/lib/products/listing";

/** Catalogue dimension label → `public/assets` folder name. */
export const TILE_DIMENSION_TO_ASSET_FOLDER = {
	"60×120cm": "60X120",
	"80×80cm": "80X80",
	"100×100cm": "100X100",
	"120×120cm": "120X120",
} as const;

export type TileDimensionLabel = keyof typeof TILE_DIMENSION_TO_ASSET_FOLDER;

const ASSET_SIZE_FOLDER_PATTERN = /\/assets\/(60X120|80X80|100X100|120X120)\//;

/** Swap the size folder segment in a catalog asset path (targets must exist — see `pnpm sync:product-size-assets`). */
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
		...(product.demoWorkThumbnailUrl
			? {
					demoWorkThumbnailUrl: remapAssetPathForTileDimension(
						product.demoWorkThumbnailUrl,
						tileDimension,
					),
				}
			: {}),
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

/**
 * Resolves the PDF catalog asset path for a specific collection.
 * Future-proofed so that when collection-specific catalogs are added, this mapping can be updated.
 * For now, it returns the universal catalog path.
 */
export function getCollectionCatalogPath(collectionId: string): string {
	// Future:
	// const collectionCatalogs: Record<string, string> = {
	// 	"inspire": "/assets/catalogs/inspire.pdf",
	// 	"travertine": "/assets/catalogs/travertine.pdf",
	// };
	// return collectionCatalogs[collectionId] || "/assets/catalog.pdf";

	if (collectionId) {
		return "/assets/catalog.pdf";
	}
	return "/assets/catalog.pdf";
}

/**
 * Resolves the download filename for a specific collection's catalog.
 */
export function getCollectionCatalogDownloadName(collectionId: string): string {
	// Future:
	// return `HungPhat_Ceramic_Catalog_${collectionId}.pdf`;

	if (collectionId) {
		return "HungPhat_Ceramic_Catalog.pdf";
	}
	return "HungPhat_Ceramic_Catalog.pdf";
}
