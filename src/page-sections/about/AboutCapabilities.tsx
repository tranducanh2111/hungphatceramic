"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { ClipboardList, Layers, Truck, ShieldCheck, type LucideIcon } from "lucide-react";
import { Text } from "@/components/ui";
import { BlueprintLine } from "@/components/common";
import { CAPABILITY_CARDS, type CapabilityId } from "@/constants/about";

/** Small footer icon per capability card. */
const CAPABILITY_ICONS: Record<CapabilityId, LucideIcon> = {
	specification: ClipboardList,
	production: Layers,
	logistics: Truck,
	aftercare: ShieldCheck,
} as const;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 28 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.75, ease: "easeOut" as const, delay },
	}),
};


/**
 * AboutCapabilities — 4 numbered image cards (flyward value-card pattern).
 *
 * Layout: 2 columns on desktop (2×2 grid), single column on mobile.
 * Each card: image at top with a numbered badge (01–04) on the upper-right,
 * serif uppercase title, sans body copy, and a small icon footer.
 * A decorative vein curve separates the two rows.
 */
export function AboutCapabilities() {
	const t = useTranslations("pages.about.capabilities");

	const topRow = CAPABILITY_CARDS.slice(0, 2);
	const bottomRow = CAPABILITY_CARDS.slice(2);

	return (
		<section className="relative bg-[#0E2A42] py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* Header */}
				<div className="mb-16">
					<motion.span
						custom={0}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
					>
						{t("label")}
					</motion.span>
					<motion.div
						custom={0.1}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
					>
						<Text variant="h2" as="h2" className="mt-3 max-w-xl text-[#F4F4F6]">
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				{/* Top row */}
				<div className="grid gap-6 sm:grid-cols-2">
					{topRow.map((card, index) => {
						const Icon = CAPABILITY_ICONS[card.id as CapabilityId];
						return (
							<CapabilityCard
								key={card.id}
								card={card}
								Icon={Icon}
								animationDelay={0.15 + index * 0.1}
								t={t}
							/>
						);
					})}
				</div>

			{/* Section-cut datum — marks the boundary between capability rows */}
			<BlueprintLine
				variant="datum"
				className="my-8 h-5 w-full"
				scrollRange={[0.1, 0.6]}
			/>

				{/* Bottom row */}
				<div className="grid gap-6 sm:grid-cols-2">
					{bottomRow.map((card, index) => {
						const Icon = CAPABILITY_ICONS[card.id as CapabilityId];
						return (
							<CapabilityCard
								key={card.id}
								card={card}
								Icon={Icon}
								animationDelay={0.25 + index * 0.1}
								t={t}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
}

/* ─── Card sub-component ─────────────────────────────────────────────────────── */

interface CapabilityCardProps {
	card: (typeof CAPABILITY_CARDS)[number];
	Icon: LucideIcon;
	animationDelay: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	t: (key: string) => any;
}

function CapabilityCard({ card, Icon, animationDelay, t }: CapabilityCardProps) {
	return (
		<motion.article
			custom={animationDelay}
			variants={{
				hidden: { opacity: 0, y: 28 },
				visible: (delay: number) => ({
					opacity: 1,
					y: 0,
					transition: { duration: 0.75, ease: "easeOut" as const, delay },
				}),
			}}
			initial="hidden"
			whileInView="visible"
			viewport={{ once: true, amount: 0.15 }}
			className="group relative flex flex-col overflow-hidden bg-[#071A2B]"
		>
			{/* Image with numbered badge */}
			<div className="relative h-56 overflow-hidden lg:h-64">
				<Image
					src={card.imageUrl}
					alt={t(`cards.${card.id}.title`)}
					fill
					className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
					sizes="(max-width: 640px) 100vw, 50vw"
				/>
				{/* Dark gradient for legibility */}
				<div
					className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/60 via-transparent to-transparent"
					aria-hidden="true"
				/>

				{/* Numbered badge — upper right */}
				<div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center border border-[#D4B886]/40 bg-[#071A2B]/70 backdrop-blur-sm">
					<span className="text-footnote font-serif font-light text-[#D4B886]">
						{card.numeral}
					</span>
				</div>
			</div>

			{/* Card body */}
			<div className="flex flex-1 flex-col gap-3 px-7 py-7">
				<Text
					variant="h4"
					as="h3"
					className="font-serif uppercase tracking-wide text-[#F4F4F6]"
				>
					{t(`cards.${card.id}.title`)}
				</Text>
				<Text variant="body" className="leading-relaxed text-[#F4F4F6]/55">
					{t(`cards.${card.id}.body`)}
				</Text>

				{/* Icon footer */}
				<div className="mt-auto pt-4 border-t border-[#D4B886]/10">
					<Icon className="h-4 w-4 text-[#D4B886]/50" />
				</div>
			</div>

			{/* Champagne bottom hairline — reveals on hover */}
			<div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#D4B886] transition-transform duration-500 ease-out group-hover:scale-x-100" />
		</motion.article>
	);
}
