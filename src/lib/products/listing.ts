import type { ProductDetail } from "@/types";

/** Minimal product fields for the catalog grid — keeps client bundles small. */
export interface ProductListingItem {
	slug: string;
	skuCode: string;
	name: string;
	thumbnailUrl: string;
	category: string;
	collectionId: string;
}

export interface CollectionListingMeta {
	id: string;
	count: number;
}

const LISTING_COLLECTION_IDS = [
	"inspire",
	"travertine",
	"orient-star",
	"sunshine",
	"architectural",
	"peace",
] as const;

export function toProductListingItems(products: ProductDetail[]): ProductListingItem[] {
	return products.map(
		({ slug, skuCode, name, thumbnailUrl, category, collectionId }) => ({
			slug,
			skuCode,
			name,
			thumbnailUrl,
			category,
			collectionId,
		}),
	);
}

export function getCollectionListingMeta(products: ProductDetail[]): CollectionListingMeta[] {
	return LISTING_COLLECTION_IDS.map((id) => ({
		id,
		count: products.filter((product) => product.collectionId === id).length,
	}));
}