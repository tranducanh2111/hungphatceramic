import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { AboutPageContent } from "@/page-sections/about/AboutPageContent";

const SITE_URL = "https://hungphatceramic.vn";

interface AboutPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.about" });
	const aboutUrl = `${SITE_URL}/${locale}/about`;

	return {
		title: t("title"),
		description: t("description"),
		alternates: {
			canonical: aboutUrl,
		},
		openGraph: {
			title: t("ogTitle"),
			description: t("ogDescription"),
			url: aboutUrl,
			siteName: t("siteName"),
			locale: t("ogLocale"),
			type: "website",
		},
	};
}

export default async function AboutPage({ params }: AboutPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "pages.about.schema" });

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

	return (
		<main>
			<PageMediaPreload imagePaths={[MEDIA_PATHS.images.landing.heroPoster]} />
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<AboutPageContent />
		</main>
	);
}
