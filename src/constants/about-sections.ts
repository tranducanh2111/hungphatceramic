import { ROUTES } from "@/constants/routes";

/** In-page anchors on `/about` (must match `id` on matching sections). */
export const ABOUT_SECTION_IDS = {
	ourStory: "our-story",
	partners: "our-partners",
	craft: "our-craft",
	capabilities: "our-capabilities",
	activeLocations: "active-locations",
	clients: "our-clients",
} as const;

export type AboutSectionId = (typeof ABOUT_SECTION_IDS)[keyof typeof ABOUT_SECTION_IDS];

export function aboutSectionHref(sectionId: AboutSectionId): string {
	return `${ROUTES.about}#${sectionId}`;
}
