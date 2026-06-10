import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { ContactPageContent } from "@/page-sections/contact/ContactPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ContactPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.contact" });
	const alternates = buildAlternatesForLocale("/contact", locale);

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

export default async function ContactPage({ params }: ContactPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "pages.contact.schema" });

	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });
	const tFooter = await getTranslations({ locale, namespace: "footer.sections" });

	const contactPageSchema = {
		"@context": "https://schema.org",
		"@type": "ContactPage",
		url: `${SITE_URL}/${locale}/contact`,
		mainEntity: {
			"@type": "Organization",
			name: t("name"),
			description: t("description"),
			areaServed: t("areaServed"),
			contactPoint: {
				"@type": "ContactPoint",
				telephone: t("telephone"),
				email: t("email"),
				contactType: t("contactType"),
				availableLanguage: ["Vietnamese", "English"],
			},
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
				name: tFooter("contact"),
				item: `${SITE_URL}/${locale}/contact`,
			},
		],
	};

	const schemas = [contactPageSchema, breadcrumbSchema];

	return (
		<main>
			<PageMediaPreload
				imagePaths={[
					MEDIA_PATHS.images.landing.heroPoster,
					MEDIA_PATHS.images.contact.inquiryBackdrop,
				]}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ContactPageContent />
		</main>
	);
}
