"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { LEADERSHIP_PRINCIPAL, LEADERSHIP_MEMBERS } from "@/constants/about";
import { BlueprintLine } from "@/components/common";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

/** Decorative 4-point star — used to badge the principal's identity. */
function StarIcon({ className }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			className={className}
		>
			<path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
		</svg>
	);
}

/**
 * AboutLeadership — Direct port of flyward's `section_leadership`.
 *
 * Layout:
 *   - Full-bleed environmental portrait of the principal as section background.
 *   - Top-left: serif section heading + subheading.
 *   - Centre (vertical mid): principal identity badge (star, name, role).
 *   - Bottom glass strip: translucent band with horizontal member card row.
 *     Each member card has name + role text stacked above a square portrait.
 *     Hover: portrait rises 4px + champagne hairline reveals beneath it.
 */
export function AboutLeadership() {
	const t = useTranslations("pages.about.leadership");

	return (
		<section className="relative min-h-screen w-full overflow-hidden bg-[#071A2B]">
			{/* ── Full-bleed environmental background ────────────────────────────── */}
			<div className="absolute inset-0">
				<Image
					src={LEADERSHIP_PRINCIPAL.environmentalImageUrl}
					alt={t("principal.environmentalImageAlt")}
					fill
					className="object-cover object-center"
					sizes="100vw"
					priority
				/>
				{/* Multi-layer gradient for legibility */}
				<div
					className="absolute inset-0 bg-gradient-to-b from-[#071A2B]/80 via-[#071A2B]/30 to-[#071A2B]/70"
					aria-hidden="true"
				/>
				<div
					className="absolute inset-0 bg-gradient-to-r from-[#071A2B]/60 via-transparent to-transparent"
					aria-hidden="true"
				/>
			</div>

			{/* ── Section content ─────────────────────────────────────────────────── */}
			<div className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-16 lg:px-16 lg:py-20">

				{/* Section heading — top-left */}
				<div className="max-w-lg">
					<motion.h2
						custom={0}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="text-display-lg font-serif font-light uppercase tracking-[0.12em] text-[#F4F4F6]"
					>
						{t("heading")}
					</motion.h2>
					<motion.p
						custom={0.15}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.2 }}
						className="text-body-lg mt-4 leading-relaxed text-[#F4F4F6]/55"
					>
						{t("subheading")}
					</motion.p>
				</div>

				{/* Principal identity badge — vertical centre */}
				<motion.div
					custom={0.3}
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					className="self-center text-center"
				>
					<StarIcon className="mx-auto mb-3 h-6 w-6 text-[#D4B886]" />
					<p className="text-h3 font-serif font-light uppercase tracking-[0.1em] text-[#F4F4F6]">
						{t("principal.name")}
					</p>
					<p className="text-label mt-2 font-sans uppercase tracking-[0.2em] text-[#D4B886]">
						{t("principal.role")}
					</p>
				</motion.div>

			{/* ── Glass strip — bottom band ─────────────────────────────────────── */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
				viewport={{ once: true, amount: 0.1 }}
				className="relative bg-[#071A2B]/55 backdrop-blur-md"
			>
				{/* Keystone blueprint arc — "crowns" the strip border */}
				<BlueprintLine
					variant="keystone"
					className="absolute inset-x-0 -top-8 h-8 w-full"
					scrollRange={[0.3, 0.8]}
				/>
				{/* Champagne hairline rule */}
				<div className="h-px w-full bg-[#D4B886]/25" />

				{/* Member cards — fixed-width so every portrait is identical */}
				<div
					className="flex items-start justify-center gap-0 overflow-x-auto"
					role="list"
					aria-label="Leadership team members"
				>
					{LEADERSHIP_MEMBERS.map((member, index) => (
						<motion.article
							key={member.id}
							custom={0.5 + index * 0.08}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.1 }}
							role="listitem"
							/**
							 * Fixed w-[180px] + flex-shrink-0 ensures every card occupies exactly
							 * the same width. The portrait uses aspect-[3/4] so its height is
							 * always 240px regardless of text length above.
							 */
							className="group flex w-[180px] flex-shrink-0 flex-col border-r border-[#D4B886]/15 px-5 py-5 last:border-r-0"
						>
							{/* Name + role — min-h ensures consistent top-block height */}
							<div className="mb-3 min-h-[3.5rem]">
								<p className="text-body-sm font-serif font-light text-[#F4F4F6]">
									{t(`members.${member.id}.name`)}
								</p>
								<p className="text-footnote mt-0.5 font-sans uppercase tracking-widest text-[#D4B886]/70">
									{t(`members.${member.id}.role`)}
								</p>
							</div>

							{/* Portrait — fixed aspect ratio, consistent across all cards */}
							<div className="relative overflow-hidden">
								<div className="relative aspect-[3/4] w-full overflow-hidden">
									<Image
										src={member.imageUrl}
										alt={t(`members.${member.id}.imageAlt`)}
										fill
										className="object-cover object-center transition-transform duration-500 ease-out group-hover:-translate-y-1"
										sizes="180px"
									/>
								</div>
								{/* Champagne hairline reveal on hover */}
								<div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#D4B886] transition-transform duration-500 ease-out group-hover:scale-x-100" />
							</div>
						</motion.article>
					))}
				</div>
		</motion.div>

		{/* Datum — phase boundary: Leadership complete, Clients begins */}
		<BlueprintLine
			variant="datum"
			className="absolute inset-x-0 bottom-0 h-5"
			scrollRange={[0.7, 0.98]}
		/>
		</div>
	</section>
	);
}
