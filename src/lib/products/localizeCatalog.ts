import type { ProductDetail } from "@/types";
import { toCatalogListingRows, type ProductListingItem } from "@/lib/products/listing";

/** next-intl translator for the `products.items` namespace. */
export interface ProductItemsTranslator {
	has(key: string): boolean;
	(key: string): string;
}

/** next-intl translator for `pages.productDetail` spec defaults. */
export interface ProductDetailSpecsTranslator {
	has(key: string): boolean;
	(key: string): string;
}

/** Catalog detail row with copy resolved for the active locale. */
export interface LocalizedProductDetail extends ProductDetail {
	title: string;
	description?: string;
	material: string;
}

function resolveProductMaterial(
	slug: string,
	tItems: ProductItemsTranslator,
	tDetail: ProductDetailSpecsTranslator,
): string {
	if (tItems.has(`${slug}.material`)) {
		return tItems(`${slug}.material`);
	}

	return tDetail("specs.materialValue");
}

function attachProductCopy(
	slug: string,
	skuCode: string,
	tItems: ProductItemsTranslator,
	tDetail: ProductDetailSpecsTranslator,
): Pick<LocalizedProductDetail, "title" | "description" | "material"> {
	return {
		title: tItems.has(`${slug}.name`) ? tItems(`${slug}.name`) : skuCode,
		description: tItems.has(`${slug}.description`) ? tItems(`${slug}.description`) : undefined,
		material: resolveProductMaterial(slug, tItems, tDetail),
	};
}

/** Resolve messages once at the page boundary for a product detail view. */
export function localizeProductDetail(
	product: ProductDetail,
	tItems: ProductItemsTranslator,
	tDetail: ProductDetailSpecsTranslator,
): LocalizedProductDetail {
	return {
		...product,
		...attachProductCopy(product.slug, product.skuCode, tItems, tDetail),
	};
}

function attachListingCopy(
	slug: string,
	skuCode: string,
	tItems: ProductItemsTranslator,
): Pick<ProductListingItem, "title" | "description"> {
	return {
		title: tItems.has(`${slug}.name`) ? tItems(`${slug}.name`) : skuCode,
		description: tItems.has(`${slug}.description`) ? tItems(`${slug}.description`) : undefined,
	};
}

/** Resolve messages once at the page boundary for catalog listing cards. */
export function localizeListingCatalog(
	products: ProductDetail[],
	tItems: ProductItemsTranslator,
): ProductListingItem[] {
	return toCatalogListingRows(products).map((item) => ({
		...item,
		...attachListingCopy(item.slug, item.skuCode, tItems),
	}));
}
