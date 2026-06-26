import type { ProductDetail } from "@/types";
import { resolveListingDemoWorkHoverPath } from "@/lib/products/media";
import { toCatalogListingRows, type ProductListingItem } from "@/lib/products/listing";

/** next-intl translator for the `products.items` namespace. */
export interface ProductItemsTranslator {
	has(key: string): boolean;
	(key: string): string;
}

/** Catalog detail row with copy resolved for the active locale. */
export interface LocalizedProductDetail extends ProductDetail {
	title: string;
	description?: string;
	material?: string;
}

function attachProductCopy(
	slug: string,
	skuCode: string,
	tItems: ProductItemsTranslator,
): Pick<LocalizedProductDetail, "title" | "description" | "material"> {
	return {
		title: tItems.has(`${slug}.name`) ? tItems(`${slug}.name`) : skuCode,
		description: tItems.has(`${slug}.description`) ? tItems(`${slug}.description`) : undefined,
		material: tItems.has(`${slug}.material`) ? tItems(`${slug}.material`) : undefined,
	};
}

/** Resolve messages once at the page boundary for a product detail view. */
export function localizeProductDetail(
	product: ProductDetail,
	tItems: ProductItemsTranslator,
): LocalizedProductDetail {
	return { ...product, ...attachProductCopy(product.slug, product.skuCode, tItems) };
}

/** Resolve messages once at the page boundary for catalog listing cards. */
export function localizeListingCatalog(
	products: ProductDetail[],
	tItems: ProductItemsTranslator,
): ProductListingItem[] {
	return toCatalogListingRows(products).map((item) => ({
		...item,
		...attachProductCopy(item.slug, item.skuCode, tItems),
	}));
}
