import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/constants/products";
import { SITE_URL } from "@/constants/seo";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
	const locales = routing.locales;
	const currentDate = new Date();

	// Static routes mapping
	const staticPaths = ["", "/about", "/products", "/projects", "/contact"];

	const sitemapEntries: MetadataRoute.Sitemap = [];

	// Helper to build hreflang alternates object (including x-default for default locale)
	const getAlternates = (path: string) => {
		const alternates: Record<string, string> = {};
		locales.forEach((loc) => {
			alternates[loc] = `${SITE_URL}/${loc}${path}`;
		});
		alternates["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;
		return alternates;
	};

	// 1. Generate entries for static pages
	for (const path of staticPaths) {
		for (const locale of locales) {
			sitemapEntries.push({
				url: `${SITE_URL}/${locale}${path}`,
				lastModified: currentDate,
				changeFrequency: path === "" ? "daily" : "weekly",
				priority: path === "" ? 1.0 : 0.8,
				alternates: {
					languages: getAlternates(path),
				},
			});
		}
	}

	// 2. Generate entries for dynamic product pages
	for (const product of PRODUCTS) {
		const productPath = `/products/${product.slug}`;
		for (const locale of locales) {
			sitemapEntries.push({
				url: `${SITE_URL}/${locale}${productPath}`,
				lastModified: currentDate,
				changeFrequency: "weekly",
				priority: 0.7,
				alternates: {
					languages: getAlternates(productPath),
				},
			});
		}
	}

	return sitemapEntries;
}
