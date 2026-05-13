/**
 * Shared type definitions for the Hùng Phát Ceramic project.
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
