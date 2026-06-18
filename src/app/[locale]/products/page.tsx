import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageMediaPreload } from "@/components/media";
import { PRODUCTS } from "@/constants/products";
import { encodePublicAssetPath } from "@/lib/products/media";
import {
	filterProductListingByCatalog,
	getCollectionListingMeta,
	getTileSizeListingMeta,
	resolveCatalogFilterState,
	toProductListingItems,
} from "@/lib/products/listing";
import { applyTileSizeToListingItem } from "@/lib/products/asset-paths";
import { ProductsPageContent } from "@/page-sections/products/ProductsPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ProductsPageProps {
	params: Promise<{ locale: string }>;
	searchParams: Promise<{ collection?: string; size?: string }>;
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
	const { collection: collectionParam, size: sizeParam } = await searchParams;
	setRequestLocale(locale);

	const tProducts = await getTranslations({ locale, namespace: "products.items" });
	const products = toProductListingItems(PRODUCTS).map((product) => ({
		...product,
		name: tProducts.has(`${product.slug}.name`)
			? tProducts(`${product.slug}.name`)
			: product.name,
	}));

	const collections = getCollectionListingMeta(PRODUCTS);
	const tileSizes = getTileSizeListingMeta(PRODUCTS);
	const initialFilter = resolveCatalogFilterState(collectionParam, sizeParam, collections);

	const alternates = buildAlternatesForLocale("/products", locale);
	const tSchema = await getTranslations({ locale, namespace: "pages.products.schema" });
	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });

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
			item: {
				"@type": "Product",
				name: product.name,
				url: `${SITE_URL}/${locale}/products/${product.slug}`,
				image: `${SITE_URL}${encodePublicAssetPath(product.thumbnailUrl)}`,
				sku: product.skuCode,
				brand: {
					"@type": "Brand",
					name: tSchema("productBrand"),
				},
			},
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

	const schemas = [itemListSchema, breadcrumbSchema];

	const filteredForPreload = filterProductListingByCatalog(products, initialFilter).map(
		(product) => applyTileSizeToListingItem(product, initialFilter.sizeId),
	);
	const mobileLcpThumbnail = filteredForPreload[0]?.thumbnailUrl;
	const desktopLcpThumbnails = filteredForPreload
		.slice(0, 3)
		.map((product) => encodePublicAssetPath(product.thumbnailUrl));

	return (
		<main>
			<PageMediaPreload
				imagePaths={desktopLcpThumbnails}
				mobileImagePaths={
					mobileLcpThumbnail
						? [encodePublicAssetPath(mobileLcpThumbnail)]
						: undefined
				}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ProductsPageContent
				products={products}
				collections={collections}
				tileSizes={tileSizes}
				initialFilter={initialFilter}
			/>
		</main>
	);
}
