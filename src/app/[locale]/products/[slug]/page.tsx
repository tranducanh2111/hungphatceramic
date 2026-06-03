import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PRODUCTS } from "@/constants/products";
import { routing } from "@/i18n/routing";
import { ProductDetailPageContent } from "@/page-sections/products/ProductDetailPageContent";

interface ProductDetailPageProps {
	params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
	const { locale, slug } = await params;
	const product = PRODUCTS.find((p) => p.slug === slug);
	if (!product) return {};

	const t = await getTranslations({ locale, namespace: "meta.productDetail" });
	const tItems = await getTranslations({ locale, namespace: "products.items" });
	const productName = tItems.has(`${slug}.name`) ? tItems(`${slug}.name`) : product.name;

	return {
		title: t("title", { productName }),
		description: t("description", { productName }),
	};
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);

	const product = PRODUCTS.find((p) => p.slug === slug);
	if (!product) {
		notFound();
	}

	return <ProductDetailPageContent product={product} />;
}

export function generateStaticParams() {
	const params: { locale: string; slug: string }[] = [];
	routing.locales.forEach((locale) => {
		PRODUCTS.forEach((product) => {
			params.push({ locale, slug: product.slug });
		});
	});
	return params;
}

