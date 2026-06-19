import { resolveListingDemoWorkHoverPath } from "@/lib/products/media";
import { COLLECTION_IDS } from "@/data/shared/collection-ids";
import type { ProductDetail } from "@/types";

/** Structural grid row before locale copy is attached. */
interface CatalogListingRow {
	slug: string;
	skuCode: string;
	thumbnailUrl: string;
	demoWorkThumbnailUrl?: string;
	category: string;
	collectionId: string;
	sizes: string[];
}

/** Grid row for the products catalog. Built only via `localizeListingCatalog`. */
export interface ProductListingItem extends CatalogListingRow {
	title: string;
	description?: string;
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

const LISTING_COLLECTION_IDS = COLLECTION_IDS;

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

/** Catalogue dimension label → URL slug for `?size=` (undefined when unknown). */
export function getTileSizeSlugFromDimension(dimension: string): TileSizeSlug | undefined {
	for (const slug of TILE_SIZE_SLUGS) {
		if (TILE_SIZE_SLUG_TO_DIMENSION[slug] === dimension) {
			return slug;
		}
	}
	return undefined;
}

export function toCatalogListingRows(products: ProductDetail[]): CatalogListingRow[] {
	return products.map(
		({ slug, skuCode, thumbnailUrl, demoWorkImages, category, collectionId, sizes }) => ({
			slug,
			skuCode,
			thumbnailUrl,
			demoWorkThumbnailUrl: resolveListingDemoWorkHoverPath(demoWorkImages[0]),
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

export interface CatalogFilterState {
	collectionId: string;
	sizeId: string;
}

/** Validates URL filter params against catalogue metadata. */
export function resolveCatalogFilterState(
	collectionParam: string | undefined,
	sizeParam: string | undefined,
	collections: readonly CollectionListingMeta[],
): CatalogFilterState {
	const rawCollectionId = collectionParam ?? "all";
	const collectionId =
		rawCollectionId === "all" ||
		collections.some((collection) => collection.id === rawCollectionId)
			? rawCollectionId
			: "all";

	const rawSizeId = sizeParam ?? "all";
	const sizeId = isTileSizeSlug(rawSizeId) ? rawSizeId : "all";

	return { collectionId, sizeId };
}

/** Server/client shared catalogue filter (excludes client-only search) */
export function filterProductListingByCatalog(
	products: readonly ProductListingItem[],
	{ collectionId, sizeId }: CatalogFilterState,
): ProductListingItem[] {
	let result = [...products];

	if (collectionId !== "all") {
		result = result.filter((product) => product.collectionId === collectionId);
	}

	if (sizeId !== "all") {
		result = result.filter((product) => productMatchesTileSize(product, sizeId));
	}

	return result;
}
