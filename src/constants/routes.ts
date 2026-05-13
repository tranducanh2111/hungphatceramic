// Internal app URLs — must match `src/app/**` route segments (Next.js file-system routing).

export const ROUTES = {
  home: "/",
  about: "/about",
  /** In-page anchor on the About page */
  aboutProcess: "/about#process",
  products: "/products",
  projects: "/projects",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
} as const;

/** Portfolio / project detail segment under `src/app/projects/`. */
export function projectDetailPath(projectId: string): string {
  return `${ROUTES.projects}/${encodeURIComponent(projectId)}`;
}

/** Product detail under `src/app/products/[slug]/`. */
export function productDetailPath(slug: string): string {
  return `${ROUTES.products}/${encodeURIComponent(slug)}`;
}

/** Product listing filtered by collection query (see products page). */
export function productsWithCollection(collectionId: string): string {
  const searchParams = new URLSearchParams();
  searchParams.set("collection", collectionId);
  return `${ROUTES.products}?${searchParams.toString()}`;
}