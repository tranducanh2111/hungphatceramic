/** Canonical collection IDs used across catalog, footer, and landing materials. */
export const COLLECTION_IDS = [
	"inspire",
	"travertine",
	"orient-star",
	"sunshine",
	"architectural",
	"peace",
	"standard",
	"indo",
] as const;

export type CollectionId = (typeof COLLECTION_IDS)[number];
