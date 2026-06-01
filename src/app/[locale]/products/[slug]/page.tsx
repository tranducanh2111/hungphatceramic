import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

interface ProductDetailPageProps {
	params: Promise<{ locale: string; slug: string }>;
}

function toProductName(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
	const { locale, slug } = await params;
	const productName = toProductName(slug);
	const t = await getTranslations({ locale, namespace: "meta.productDetail" });

	return {
		title: t("title", { productName }),
		description: t("description", { productName }),
	};
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { locale, slug } = await params;
	setRequestLocale(locale);
	const t = await getTranslations({ locale, namespace: "pages.productDetail" });

	return (
		<main>
			<section className="bg-sapphire-deep flex min-h-screen items-center justify-center px-6">
				<h1 className="text-display-lg text-linen font-serif">{t("heading", { slug })}</h1>
			</section>
		</main>
	);
}
