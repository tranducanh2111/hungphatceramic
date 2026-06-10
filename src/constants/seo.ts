import { type AppLocale } from "@/i18n/routing";

export const SITE_URL = "https://perla.com.vn";
export const SITE_NAME = "Perla powered by Hung Phat";
export const DEFAULT_OG_IMAGE = "/logo/hungphat_ceramic_logo_big.png";

interface AlternatesInput {
	canonical: string;
	languages: Record<string, string>;
}

/**
 * Builds the canonical and hreflang alternate links for a given path and current locale.
 * @param path The path of the page (e.g. "/", "/about", "/products")
 * @param currentLocale The current active locale ("vi" | "en")
 */
export function buildAlternatesForLocale(
	path: string,
	currentLocale: AppLocale | string,
): AlternatesInput {
	// Normalize path: handle root specifically, otherwise ensure a leading slash
	const normalizedPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

	return {
		canonical: `${SITE_URL}/${currentLocale}${normalizedPath}`,
		languages: {
			vi: `${SITE_URL}/vi${normalizedPath}`,
			en: `${SITE_URL}/en${normalizedPath}`,
			"x-default": `${SITE_URL}/vi${normalizedPath}`, // default to Vietnamese
		},
	};
}

interface OpenGraphInput {
	title: string;
	description: string;
	url: string;
	ogLocale: string;
	image?: string;
}

/**
 * Builds the OpenGraph metadata object for a page.
 */
export function buildOpenGraphForLocale({
	title,
	description,
	url,
	ogLocale,
	image = DEFAULT_OG_IMAGE,
}: OpenGraphInput) {
	return {
		title,
		description,
		url,
		siteName: SITE_NAME,
		locale: ogLocale,
		type: "website" as const,
		images: [
			{
				url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
				width: 1200,
				height: 630,
				alt: title,
			},
		],
	};
}
