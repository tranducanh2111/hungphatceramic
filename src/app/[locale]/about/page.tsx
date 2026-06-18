import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AboutPageContent } from "@/page-sections/about/AboutPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";

interface AboutPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.about" });
	const alternates = buildAlternatesForLocale("/about", locale);

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
	};
}

export default async function AboutPage({ params }: AboutPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "pages.about.schema" });
	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });

	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: t("name"),
		url: SITE_URL,
		logo: `${SITE_URL}/logo/hungphat_ceramic_logo_big.png`,
		foundingDate: t("foundingDate"),
		address: {
			"@type": "PostalAddress",
			streetAddress: t("address.streetAddress"),
			addressLocality: t("address.addressLocality"),
			addressCountry: t("address.addressCountry"),
		},
		contactPoint: {
			"@type": "ContactPoint",
			telephone: t("contact.telephone"),
			email: t("contact.email"),
			contactType: t("contact.contactType"),
		},
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
				name: tNavbar("about"),
				item: `${SITE_URL}/${locale}/about`,
			},
		],
	};

	const schemas = [organizationSchema, breadcrumbSchema];

	return (
		<main>
			<PageMediaPreload imagePaths={[MEDIA_PATHS.images.landing.heroPoster]} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<AboutPageContent />
		</main>
	);
}
