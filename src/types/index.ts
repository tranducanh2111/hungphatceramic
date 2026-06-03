/**
 * Shared type definitions for the Perla powered by Hung Phat project.
 */

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

/** Represents a product summary used in listing cards. */
export interface ProductSummary {
	slug: string;
	name: string;
	thumbnailUrl: string;
	category: string;
	shortDescription: string;
	skuCode: string;
}

/** Full product data used on the detail page. */
export interface ProductDetail extends ProductSummary {
	collectionId: string;
	sizes: string[];
	faceImages: string[];
	sceneImages: string[];
	allFacesImage?: string;
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
