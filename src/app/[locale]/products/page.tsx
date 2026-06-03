import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PRODUCTS } from "@/constants/products";
import {
	getCollectionListingMeta,
	toProductListingItems,
} from "@/lib/products/listing";
import { ProductsPageContent } from "@/page-sections/products/ProductsPageContent";

interface ProductsPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.products" });

	return {
		title: t("title"),
		description: t("description"),
	};
}

export default async function ProductsPage({ params }: ProductsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const products = toProductListingItems(PRODUCTS);
	const collections = getCollectionListingMeta(PRODUCTS);

	return <ProductsPageContent products={products} collections={collections} />;
}
