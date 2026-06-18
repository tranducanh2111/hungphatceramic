import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageMediaPreload } from "@/components/media";
import { MEDIA_PATHS } from "@/constants/media";
import { PROJECTS } from "@/constants/projects";
import { ProjectsPageContent } from "@/page-sections/projects/ProjectsPageContent";
import { buildAlternatesForLocale, buildOpenGraphForLocale, SITE_URL } from "@/constants/seo";

interface ProjectsPageProps {
	params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "meta.projects" });
	const alternates = buildAlternatesForLocale("/projects", locale);
	const ogImage = MEDIA_PATHS.images.featuredProjects.empireCity;

	return {
		title: t("title"),
		description: t("description"),
		alternates,
		openGraph: buildOpenGraphForLocale({
			title: t("ogTitle"),
			description: t("ogDescription"),
			url: alternates.canonical,
			ogLocale: t("ogLocale"),
			image: ogImage,
		}),
		twitter: {
			card: "summary_large_image",
			title: t("ogTitle"),
			description: t("ogDescription"),
			images: [`${SITE_URL}${ogImage}`],
		},
	};
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
	const { locale } = await params;
	setRequestLocale(locale);

	const t = await getTranslations({ locale, namespace: "meta.projects" });
	const tHeritage = await getTranslations({ locale, namespace: "pages.projects.heritage" });
	const tSchema = await getTranslations({ locale, namespace: "pages.projects.schema" });
	const tNavbar = await getTranslations({ locale, namespace: "navbar.links" });

	const alternates = buildAlternatesForLocale("/projects", locale);

	const collectionSchema = {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: tSchema("pageName"),
		description: t("description"),
		url: alternates.canonical,
		inLanguage: locale === "vi" ? "vi-VN" : "en-US",
		mainEntity: {
			"@type": "ItemList",
			name: tSchema("itemListName"),
			description: tSchema("itemListDescription"),
			numberOfItems: PROJECTS.length,
			itemListElement: PROJECTS.map((project, index) => ({
				"@type": "ListItem",
				position: index + 1,
				item: {
					"@type": "CreativeWork",
					name: tHeritage(`milestones.${project.id}.title`),
					description: tHeritage(`milestones.${project.id}.description`),
					url: `${alternates.canonical}#${project.id}`,
					image: `${SITE_URL}${project.imageUrl}`,
					locationCreated: {
						"@type": "Place",
						name: tHeritage(`milestones.${project.id}.location`),
					},
				},
			})),
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
				name: tNavbar("projects"),
				item: `${SITE_URL}/${locale}/projects`,
			},
		],
	};

	const schemas = [collectionSchema, breadcrumbSchema];

	return (
		<main>
			<PageMediaPreload
				imagePaths={[MEDIA_PATHS.images.featuredProjects.empireCity]}
				desktopOnly
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
			/>
			<ProjectsPageContent />
		</main>
	);
}
