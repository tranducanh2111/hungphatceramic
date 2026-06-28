import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PRODUCTS } from "@/constants/products";
import { encodePublicAssetPath } from "@/lib/products/media";
import { localizeListingCatalog } from "@/lib/products/localizeCatalog";
import {
	getCollectionListingMeta,
	getTileSizeListingMeta,
	getSurfaceListingMeta,
	resolveCatalogFilterState,
} from "@/lib/products/listing";
import { ProductsPageContent } from "@/page-sections/products/ProductsPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ProductsPageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ collection?: string; size?: string; surface?: string }>;
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
			title: t("ogTitle"),
			description: t("ogDescription"),
			url: alternates.canonical,
			ogLocale: t("ogLocale"),
		}),
		twitter: {
			card: "summary_large_image",
			title: t("ogTitle"),
			description: t("ogDescription"),
		},
	};
}

export default async function ProductsPage({ params, searchParams }: ProductsPageProps) {
	const { locale } = await params;
	const { collection: collectionParam, size: sizeParam, surface: surfaceParam } = await searchParams;
	setRequestLocale(locale);

	const tProducts = await getTranslations({ locale, namespace: "products.items" });
	const products = localizeListingCatalog(PRODUCTS, tProducts);

	const collections = getCollectionListingMeta(PRODUCTS);
	const tileSizes = getTileSizeListingMeta(PRODUCTS);
	const surfaces = getSurfaceListingMeta(PRODUCTS);
	const initialFilter = resolveCatalogFilterState(collectionParam, sizeParam, surfaceParam, collections);

	const alternates = buildAlternatesForLocale("/products", locale);
	const tSchema = await getTranslations({ locale, namespace: "pages.products.schema" });
	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });
	const tCollections = await getTranslations({ locale, namespace: "collections" });

	const itemListSchema = {
		"@context": "https://schema.org",
		"@type": "ItemList",
		name: tSchema("itemListName"),
		description: tSchema("itemListDescription"),
		url: alternates.canonical,
		numberOfItems: products.length,
		itemListElement: products.map((product, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: product.title,
			item: `${SITE_URL}/${locale}/products/${product.slug}`,
		})),
	};

	const collectionPageSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		"@id": `${SITE_URL}/${locale}/products#webpage`,
		url: `${SITE_URL}/${locale}/products`,
		name: tNavbar("products"),
		description: tSchema("itemListDescription"),
		publisher: {
			"@id": `${SITE_URL}#organization`,
		},
		about: collections.map((col) => ({
			"@type": "Thing",
			name: tCollections.has(`${col.id}.name`) ? tCollections(`${col.id}.name`) : col.id,
			url: `${SITE_URL}/${locale}/products?collection=${col.id}`,
		})),
	};

	const breadcrumbSchema = {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: tNavbar("home"),
				item: `${SITE_URL}/${locale}`,
			},
			{
				"@type": "ListItem",
				position: 2,
				name: tNavbar("products"),
				item: `${SITE_URL}/${locale}/products`,
			},
		],
	};

	const schemas = [itemListSchema, collectionPageSchema, breadcrumbSchema];

	return (
		<main>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ProductsPageContent
				products={products}
				collections={collections}
				tileSizes={tileSizes}
				surfaces={surfaces}
				initialFilter={initialFilter}
			/>
		</main>
	);
}
