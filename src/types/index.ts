/** Shared type definitions for the Perla powered by Hung Phat project. */

/** Allow consumers to pass additional className for style overrides. */
export interface ClassNameProp {
	className?: string;
}

/** Common props shared by interactive UI components. */
export interface InteractiveProps extends ClassNameProp {
	disabled?: boolean;
}

/** Represents a navigation link item. */
export interface NavItem {
	label: string;
	href: string;
}

/** Catalogue row: structural fields only. Title comes from `products.items.{slug}.name`. */
export interface ProductSummary {
	slug: string;
	thumbnailUrl: string;
	category: string;
	skuCode: string;
}

/** Catalogue row before demo/scene paths are split (see `normalizeProductMedia`). */
export interface ProductCatalogEntry extends ProductSummary {
	collectionId: string;
	sizes: string[];
	faceImages: string[];
	sceneImages: string[];
	allFacesImage?: string;
}

/** Full product data used on the detail page. */
export interface ProductDetail extends ProductCatalogEntry {
	/** PC-* install renders from the product asset folder (may be multiple per SKU). */
	demoWorkImages: string[];
}

/** Collection filter tab item for the products listing. */
export interface CollectionFilter {
	id: string;
	productCount: number;
}

/** Represents a completed project / portfolio item. */
export interface ProjectSummary {
	slug: string;
	title: string;
	coverImageUrl: string;
	location: string;
	year: number;
	shortDescription: string;
}
