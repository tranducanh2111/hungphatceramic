import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { PRODUCTS } from "@/constants/products";
import { routing } from "@/i18n/routing";
import { applyTileSizeToProductDetail } from "@/lib/products/asset-paths";
import { isTileSizeSlug } from "@/lib/products/listing";
import { encodePublicAssetPath } from "@/lib/products/media";
import { ProductDetailPageContent } from "@/page-sections/products/ProductDetailPageContent";
import { ProductDetailHeroMedia } from "@/page-sections/products/ProductDetailHeroMedia";

interface ProductDetailPageProps {
	params: Promise<{ locale: string; slug: string }>;
	searchParams: Promise<{ size?: string }>;
}

function resolveActiveSizeId(size: string | undefined): string | undefined {
	if (size && isTileSizeSlug(size)) {
		return size;
	}
	return undefined;
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

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
	const { locale, slug } = await params;
	const { size } = await searchParams;
	setRequestLocale(locale);

	const product = PRODUCTS.find((p) => p.slug === slug);
	if (!product) {
		notFound();
	}

	const activeSizeId = resolveActiveSizeId(size);
	const displayProduct = applyTileSizeToProductDetail(product, activeSizeId);
	const heroThumbnailPath = encodePublicAssetPath(displayProduct.thumbnailUrl);

	const tItems = await getTranslations({ locale, namespace: "products.items" });
	const productName = tItems.has(`${slug}.name`) ? tItems(`${slug}.name`) : product.name;

	return (
		<>
			<PageMediaPreload imagePaths={[heroThumbnailPath]} />
			<ProductDetailPageContent
				product={product}
				activeSizeId={activeSizeId}
				heroMedia={
					<ProductDetailHeroMedia src={displayProduct.thumbnailUrl} alt={productName} />
				}
			/>
		</>
	);
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
