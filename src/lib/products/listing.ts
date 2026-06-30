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
	surfaceId: string;
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

export interface SurfaceListingMeta {
	id: string;
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

export function getTileSizeSlugFromDimension(dimension: string): TileSizeSlug | undefined {
	for (const slug of TILE_SIZE_SLUGS) {
		if (TILE_SIZE_SLUG_TO_DIMENSION[slug] === dimension) {
			return slug;
		}
	}
	return undefined;
}

export const SURFACE_SLUGS = ["matte", "polished"] as const;
export type SurfaceSlug = (typeof SURFACE_SLUGS)[number];

export function isSurfaceSlug(value: string): value is SurfaceSlug {
	return SURFACE_SLUGS.includes(value as SurfaceSlug);
}

export function getSurfaceIdFromSkuAndSlug(skuCode: string, slug: string): SurfaceSlug {
	if (skuCode.startsWith("GS")) return "polished";
	const isPolished = slug.includes("-gp") || skuCode.startsWith("GP");
	return isPolished ? "polished" : "matte";
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
			surfaceId: getSurfaceIdFromSkuAndSlug(skuCode, slug),
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

export function getSurfaceListingMeta(products: ProductDetail[]): SurfaceListingMeta[] {
	return SURFACE_SLUGS.map((id) => ({
		id,
		count: products.filter((product) => getSurfaceIdFromSkuAndSlug(product.skuCode, product.slug) === id).length,
	}));
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
	surfaceId: string;
}

export function resolveCatalogFilterState(
	collectionParam: string | undefined,
	sizeParam: string | undefined,
	surfaceParam: string | undefined,
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

	const rawSurfaceId = surfaceParam ?? "all";
	const surfaceId = isSurfaceSlug(rawSurfaceId) ? rawSurfaceId : "all";

	return { collectionId, sizeId, surfaceId };
}

export function filterProductListingByCatalog(
	products: readonly ProductListingItem[],
	{ collectionId, sizeId, surfaceId }: CatalogFilterState,
): ProductListingItem[] {
	let result = [...products];

	if (collectionId !== "all") {
		result = result.filter((product) => product.collectionId === collectionId);
	}

	if (sizeId !== "all") {
		result = result.filter((product) => productMatchesTileSize(product, sizeId));
	}

	if (surfaceId !== "all") {
		result = result.filter((product) => product.surfaceId === surfaceId);
	}

	return result;
}
