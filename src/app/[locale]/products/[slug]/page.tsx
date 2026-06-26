import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PRODUCTS } from "@/constants/products";
import { routing } from "@/i18n/routing";
import { applyTileSizeToProductDetail } from "@/lib/products/asset-paths";
import { isTileSizeSlug } from "@/lib/products/listing";
import { encodePublicAssetPath } from "@/lib/products/media";
import { localizeProductDetail } from "@/lib/products/localizeCatalog";
import { ProductDetailPageContent } from "@/page-sections/products/ProductDetailPageContent";
import { ProductDetailHeroMedia } from "@/page-sections/products/ProductDetailHeroMedia";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

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
	const localizedProduct = localizeProductDetail(product, tItems);
	const alternates = buildAlternatesForLocale(`/products/${slug}`, locale);
	const ogImage = product.thumbnailUrl;

	return {
		title: t("title", { productName: localizedProduct.title }),
		description: t("description", { productName: localizedProduct.title }),
		alternates,
		openGraph: buildOpenGraphForLocale({
			title: t("title", { productName: localizedProduct.title }),
			description: t("description", { productName: localizedProduct.title }),
			url: alternates.canonical,
			ogLocale: locale === "vi" ? "vi_VN" : "en_US",
			image: ogImage,
		}),
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
	const tMetaProductDetail = await getTranslations({ locale, namespace: "meta.productDetail" });
	const tItems = await getTranslations({ locale, namespace: "products.items" });
	const localizedProduct = localizeProductDetail(product, tItems);
	const displayProduct = applyTileSizeToProductDetail(localizedProduct, activeSizeId);
	const heroThumbnailPath = encodePublicAssetPath(displayProduct.thumbnailUrl);

	const alternates = buildAlternatesForLocale(`/products/${slug}`, locale);
	const productSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: localizedProduct.title,
		image: `${SITE_URL}${heroThumbnailPath}`,
		description: localizedProduct.description || tMetaProductDetail("description", { productName: localizedProduct.title }),
		sku: product.skuCode,
		mpn: product.skuCode,
		material: localizedProduct.material || "Porcelain",
		brand: {
			"@type": "Brand",
			name: "Perla",
		},
		additionalProperty: [
			{
				"@type": "PropertyValue",
				name: "Sizes Available",
				value: product.sizes.join(", "),
			},
			{
				"@type": "PropertyValue",
				name: "Collection",
				value: product.collectionId,
			},
		],
	};

	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });
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
			{
				"@type": "ListItem",
				position: 3,
				name: localizedProduct.title,
				item: `${SITE_URL}/${locale}/products/${product.slug}`,
			},
		],
	};

	const schemas = [productSchema, breadcrumbSchema];

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ProductDetailPageContent
				product={localizedProduct}
				activeSizeId={activeSizeId}
				heroMedia={
					<ProductDetailHeroMedia
						src={displayProduct.thumbnailUrl}
						alt={localizedProduct.title}
						skuCode={product.skuCode}
					/>
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
