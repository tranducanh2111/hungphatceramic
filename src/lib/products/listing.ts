import type { ProductDetail } from "@/types";

/** Minimal product fields for the catalog grid — keeps client bundles small. */
export interface ProductListingItem {
	slug: string;
	skuCode: string;
	name: string;
	thumbnailUrl: string;
	category: string;
	collectionId: string;
	sizes: string[];
}

export interface CollectionListingMeta {
	id: string;
	count: number;
}

export interface TileSizeListingMeta {
	id: string;
	dimension: string;
	count: number;
}

const LISTING_COLLECTION_IDS = [
	"inspire",
	"travertine",
	"orient-star",
	"sunshine",
	"architectural",
	"peace",
	"indo",
] as const;

/** URL slug → catalogue dimension label (must match `products.ts` / `ProductDetail.sizes`). */
export const TILE_SIZE_SLUG_TO_DIMENSION = {
	"60x120": "60×120cm",
	"80x80": "80×80cm",
	"100x100": "100×100cm",
	"120x120": "120×120cm",
} as const;

export type TileSizeSlug = keyof typeof TILE_SIZE_SLUG_TO_DIMENSION;

export const TILE_SIZE_SLUGS = Object.keys(TILE_SIZE_SLUG_TO_DIMENSION) as TileSizeSlug[];

export function isTileSizeSlug(value: string): value is TileSizeSlug {
	return value in TILE_SIZE_SLUG_TO_DIMENSION;
}

export function getTileSizeDimension(slug: TileSizeSlug): string {
	return TILE_SIZE_SLUG_TO_DIMENSION[slug];
}

export function toProductListingItems(products: ProductDetail[]): ProductListingItem[] {
	return products.map(
		({ slug, skuCode, name, thumbnailUrl, category, collectionId, sizes }) => ({
			slug,
			skuCode,
			name,
			thumbnailUrl,
			category,
			collectionId,
			sizes,
		}),
	);
}

export function getCollectionListingMeta(products: ProductDetail[]): CollectionListingMeta[] {
	return LISTING_COLLECTION_IDS.map((id) => ({
		id,
		count: products.filter((product) => product.collectionId === id).length,
	}));
}

export function getTileSizeListingMeta(products: ProductDetail[]): TileSizeListingMeta[] {
	return TILE_SIZE_SLUGS.map((id) => {
		const dimension = TILE_SIZE_SLUG_TO_DIMENSION[id];
		return {
			id,
			dimension,
			count: products.filter((product) => product.sizes.includes(dimension)).length,
		};
	});
}

export function productMatchesTileSize(product: ProductListingItem, sizeSlug: string): boolean {
	if (sizeSlug === "all" || !isTileSizeSlug(sizeSlug)) {
		return true;
	}
	return product.sizes.includes(getTileSizeDimension(sizeSlug));
}
