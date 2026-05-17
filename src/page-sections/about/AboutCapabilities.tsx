"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { ClipboardList, Layers, Truck, ShieldCheck, type LucideIcon } from "lucide-react";
import { Text } from "@/components/ui";
import { CAPABILITY_IDS, type CapabilityId } from "@/constants/about";

/** Maps each capability ID to its Lucide icon — kept local to avoid coupling constants to React. */
const CAPABILITY_ICONS: Record<CapabilityId, LucideIcon> = {
	specification: ClipboardList,
	production: Layers,
	logistics: Truck,
	aftercare: ShieldCheck,
} as const;

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: "easeOut" as const, delay },
	}),
};

/**
 * AboutCapabilities — B2B service grid.
 *
 * Four capability cards in a 2×2 grid with staggered fade-up entrance.
 * Consolidates the old AboutServices + AboutWhyChoose into one honest
 * "here's what we do" section.
 */
export function AboutCapabilities() {
	const t = useTranslations("pages.about.capabilities");

	return (
		<section className="relative bg-[#0E2A42] py-28 lg:py-36">
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				{/* Header */}
				<div className="mb-16 text-center">
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
						<Text variant="h2" as="h2" className="mt-3 text-[#F4F4F6]">
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				{/* 2×2 card grid — gap-px with sapphire-mist background creates hairline borders */}
				<div className="grid gap-px bg-[#1A3D5C] sm:grid-cols-2">
					{CAPABILITY_IDS.map((id, index) => {
						const Icon = CAPABILITY_ICONS[id];
						return (
							<motion.div
								key={id}
								custom={0.15 + index * 0.1}
								variants={fadeUp}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, amount: 0.2 }}
								className="flex flex-col gap-5 bg-[#0E2A42] p-10 lg:p-12"
							>
								{/* Icon badge */}
								<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#D4B886]/20 bg-[#D4B886]/8">
									<Icon className="h-5 w-5 text-[#D4B886]" />
								</div>

								<Text variant="h4" as="h3" className="text-[#F4F4F6]">
									{t(`cards.${id}.title`)}
								</Text>

								<Text variant="body" className="leading-relaxed text-[#F4F4F6]/55">
									{t(`cards.${id}.body`)}
								</Text>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
