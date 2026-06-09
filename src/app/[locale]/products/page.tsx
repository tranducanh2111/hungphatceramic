import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PRODUCTS } from "@/constants/products";
import {
	getCollectionListingMeta,
	getTileSizeListingMeta,
	toProductListingItems,
} from "@/lib/products/listing";
import { ProductsPageContent } from "@/page-sections/products/ProductsPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ProductsPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.products" });
	const alternates = buildAlternatesForLocale("/products", locale);

	return {
		title: t("title"),
		description: t("description"),
		alternates,
		openGraph: buildOpenGraphForLocale({
			title: t("title"),
			description: t("description"),
			url: alternates.canonical,
			ogLocale: locale === "vi" ? "vi_VN" : "en_US",
		}),
	};
}

export default async function ProductsPage({ params }: ProductsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const products = toProductListingItems(PRODUCTS);
	const collections = getCollectionListingMeta(PRODUCTS);
	const tileSizes = getTileSizeListingMeta(PRODUCTS);

	const alternates = buildAlternatesForLocale("/products", locale);
	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: products.length > 0 ? "Product Collections" : "Products",
		description: "Browse our collections of luxury porcelain tiles and custom ceramics.",
		url: alternates.canonical,
		itemListElement: PRODUCTS.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			url: `${SITE_URL}/${locale}/products/${product.slug}`,
			name: product.name,
		})),
	};

	return (
		<main>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
			/>
			<ProductsPageContent
				products={products}
				collections={collections}
				tileSizes={tileSizes}
			/>
		</main>
	);
}
