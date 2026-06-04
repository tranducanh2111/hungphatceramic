// Internal app URLs — must match `src/app/**` route segments (Next.js file-system routing).

export const ROUTES = {
	home: "/",
	about: "/about",
	products: "/products",
	projects: "/projects",
	contact: "/contact",
} as const;

/** Portfolio / project detail segment under `src/app/projects/`. */
export function projectDetailPath(projectId: string): string {
	return `${ROUTES.projects}/${encodeURIComponent(projectId)}`;
}

/** Product detail under `src/app/products/[slug]/`. */
export function productDetailPath(slug: string): string {
	return `${ROUTES.products}/${encodeURIComponent(slug)}`;
}

import { isTileSizeSlug, type TileSizeSlug } from "@/lib/products/listing";

/** Product listing filtered by collection and optional tile-size query. */
export function productsWithCollection(
	collectionId: string,
	sizeSlug?: TileSizeSlug | string,
): string {
	const searchParams = new URLSearchParams();
	searchParams.set("collection", collectionId);
	if (sizeSlug && isTileSizeSlug(sizeSlug)) {
		searchParams.set("size", sizeSlug);
	}
	return `${ROUTES.products}?${searchParams.toString()}`;
}
