"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { PublicIcon } from "@/components/icons";
import { CONTACT_CHANNELS, GOOGLE_MAPS_URL, contactMailtoHref } from "@/constants/contact";
import { ICON_PATHS, LOGO_PATHS } from "@/constants/media";
import { ABOUT_SECTION_IDS, aboutSectionHref } from "@/constants/about-sections";
import { ROUTES, productsWithCollection } from "@/constants/routes";
import { Link } from "@/i18n/navigation";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOCIAL_LINKS = [
	{ id: "instagram", href: "https://instagram.com", iconSrc: ICON_PATHS.social.instagram },
	{ id: "facebook", href: "https://facebook.com", iconSrc: ICON_PATHS.social.facebook },
	{ id: "youtube", href: "https://youtube.com", iconSrc: ICON_PATHS.social.youtube },
] as const;

const MESSAGING_LINKS = [
	{
		id: "whatsapp" as const,
		href: CONTACT_CHANNELS.whatsapp.href,
		iconSrc: ICON_PATHS.contact.whatsapp,
	},
	{
		id: "zalo" as const,
		href: CONTACT_CHANNELS.zalo.href,
		iconSrc: ICON_PATHS.contact.zalo,
	},
] as const;

const CONTACT_ITEMS: {
	id: "address" | "phone" | "email";
	iconSrc: string;
	href: string;
	isExternal: boolean;
}[] = [
	{
		id: "address",
		iconSrc: ICON_PATHS.contact.mapPin,
		href: GOOGLE_MAPS_URL,
		isExternal: true,
	},
	{
		id: "phone",
		iconSrc: ICON_PATHS.contact.phone,
		href: CONTACT_CHANNELS.phone.href,
		isExternal: false,
	},
	{
		id: "email",
		iconSrc: ICON_PATHS.contact.mail,
		href: contactMailtoHref(),
		isExternal: false,
	},
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function FooterLinkGroup({
	heading,
	links,
}: {
	heading: string;
	links: { label: string; href: string }[];
}) {
	return (
		<div>
			<Text
				variant="label"
				className="mb-5 font-sans tracking-[0.2em] text-[#D4B886] uppercase"
			>
				{heading}
			</Text>
			<ul className="space-y-3" role="list">
				{links.map(({ label, href }) => (
					<li key={href}>
						<Link
							href={href}
							className="text-body-sm font-sans text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
						>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}

// ─── Footer ────────────────────────────────────────────────────────────────────

/**
 * Footer — Premium site footer with contact details, nav links, and socials.
 */
export function Footer() {
	const t = useTranslations("footer");
	const commonT = useTranslations("common");
	const currentYear = new Date().getFullYear();
	const companyLinks = [
		{ label: t("links.about"), href: ROUTES.about },
		{ label: t("links.projects"), href: ROUTES.projects },
		{ label: t("links.ourStory"), href: aboutSectionHref(ABOUT_SECTION_IDS.ourStory) },
		{ label: t("links.partners"), href: aboutSectionHref(ABOUT_SECTION_IDS.partners) },
		{ label: t("links.ourCraft"), href: aboutSectionHref(ABOUT_SECTION_IDS.craft) },
		{
			label: t("links.capabilities"),
			href: aboutSectionHref(ABOUT_SECTION_IDS.capabilities),
		},
		{
			label: t("links.activeLocations"),
			href: aboutSectionHref(ABOUT_SECTION_IDS.activeLocations),
		},
	];
	const collectionLinks = [
		{ label: t("collections.inspire"), collectionId: "inspire" },
		{ label: t("collections.travertine"), collectionId: "travertine" },
		{ label: t("collections.orientStar"), collectionId: "orient-star" },
		{ label: t("collections.sunshine"), collectionId: "sunshine" },
		{ label: t("collections.architectural"), collectionId: "architectural" },
		{ label: t("collections.peace"), collectionId: "peace" },
		{ label: t("collections.indo"), collectionId: "indo" },
	].map(({ label, collectionId }) => ({
		label,
		href: productsWithCollection(collectionId),
	}));

	return (
		<footer className="relative bg-[#040F1A] text-[#F4F4F6]" aria-label="Site footer">
			{/* Top champagne border */}
			<div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-[#D4B886]/30 to-transparent" />

			{/* ── Main content ── */}
			<div className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-12">
				<div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
					{/* ── Brand block ── */}
					<div>
						<Link
							href={ROUTES.home}
							className="inline-flex max-w-[min(100%,14rem)]"
							aria-label={commonT("logoAriaLabel")}
						>
							<Image
								src={LOGO_PATHS.small}
								alt={commonT("logoAlt")}
								width={220}
								height={62}
								sizes="(max-width: 1024px) 200px, 224px"
								className="h-auto max-h-11 w-auto object-contain object-left opacity-95 transition-opacity duration-300 hover:opacity-100"
							/>
						</Link>

						{/* Tagline */}
						<Text
							variant="body-sm"
							className="mt-5 max-w-xs leading-relaxed text-[#F4F4F6]/45"
						>
							{t("tagline")}
						</Text>

						{/* Social + chat */}
						<div className="mt-8 flex flex-wrap gap-3">
							{SOCIAL_LINKS.map(({ id, href, iconSrc }) => (
								<a
									key={id}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={t(`social.${id}`)}
									className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#1A3D5C] transition-all duration-300 hover:border-[#D4B886]/50"
								>
									<PublicIcon
										src={iconSrc}
										alt=""
										size={18}
										className="opacity-55 transition-opacity group-hover:opacity-100"
									/>
								</a>
							))}
							{MESSAGING_LINKS.map(({ id, href, iconSrc }) => (
								<a
									key={id}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={t(`messaging.${id}`, {
										number: CONTACT_CHANNELS[id].display,
									})}
									className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#1A3D5C] transition-all duration-300 hover:border-[#D4B886]/50"
								>
									<PublicIcon
										src={iconSrc}
										alt=""
										size={18}
										className="opacity-55 transition-opacity group-hover:opacity-100"
									/>
								</a>
							))}
						</div>
					</div>

					{/* ── Navigation ── */}
					<FooterLinkGroup heading={t("sections.navigate")} links={companyLinks} />
					<FooterLinkGroup heading={t("sections.collections")} links={collectionLinks} />

					{/* ── Contact ── */}
					<div>
						<Text
							variant="label"
							className="mb-5 font-sans tracking-[0.2em] text-[#D4B886] uppercase"
						>
							{t("sections.contact")}
						</Text>
						<ul className="space-y-4" role="list">
							{CONTACT_ITEMS.map(({ id, iconSrc, href, isExternal }) => (
								<li key={href}>
									<a
										href={href}
										{...(isExternal
											? { target: "_blank", rel: "noopener noreferrer" }
											: {})}
										className="group flex items-start gap-3 text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
									>
										<PublicIcon
											src={iconSrc}
											alt=""
											size={18}
											className="mt-0.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
										/>
										<Text variant="body-sm" className="leading-relaxed">
											{t(`contact.${id}`)}
										</Text>
									</a>
								</li>
							))}
						</ul>

						{/* CTA */}
						<Link
							href={ROUTES.contact}
							className="text-body-sm mt-8 inline-flex items-center justify-center rounded-full border border-[#D4B886]/30 bg-[#D4B886]/5 px-6 py-2.5 font-sans tracking-[0.1em] text-[#D4B886] uppercase transition-all duration-300 hover:border-[#D4B886] hover:bg-[#D4B886] hover:text-[#071A2B]"
						>
							{t("links.bookConsultation")}
						</Link>
					</div>
				</div>

				{/* ── Divider ── */}
				<div className="my-10 h-px bg-gradient-to-r from-transparent via-[#1A3D5C] to-transparent" />

				{/* ── Bottom bar ── */}
				<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
					<Text variant="footnote" className="text-[#F4F4F6]/25" suppressHydrationWarning>
						{t("rights", { year: currentYear, companyName: commonT("companyName") })}
					</Text>
				</div>
			</div>
		</footer>
	);
}
