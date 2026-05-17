"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { LEADERSHIP_MEMBERS } from "@/constants/about";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

/**
 * AboutLeadership — Editorial portrait grid.
 *
 * Three-column layout with large portraits. Each card has:
 *   - Portrait with scale-in hover and a champagne hairline that reveals on hover.
 *   - Name, role, and a one-line credential beneath.
 */
export function AboutLeadership() {
	const t = useTranslations("pages.about.leadership");

	return (
		<section className="relative bg-[#071A2B] py-28 lg:py-36">
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
						<Text variant="h2" as="h2" className="mt-3 text-[#F4F4F6]">
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				{/* Members grid */}
				<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{LEADERSHIP_MEMBERS.map((member, index) => (
						<motion.article
							key={member.id}
							custom={0.1 + index * 0.12}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="group"
						>
							{/* Portrait with hover interaction */}
							<div className="relative h-[360px] overflow-hidden rounded-xl lg:h-[420px]">
								<Image
									src={member.imageUrl}
									alt={t(`members.${member.id}.imageAlt`)}
									fill
									className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
								/>

								{/* Gradient for name legibility */}
								<div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/50 to-transparent" />

								{/* Champagne hairline reveal on hover */}
								<div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[#D4B886] transition-transform duration-500 ease-out group-hover:scale-x-100" />
							</div>

							{/* Info */}
							<div className="mt-5 pl-1">
								<Text variant="h5" as="h3" className="text-[#F4F4F6]">
									{t(`members.${member.id}.name`)}
								</Text>
								<p className="text-body-sm mt-1 font-sans text-[#D4B886]">
									{t(`members.${member.id}.role`)}
								</p>
								<p className="text-footnote mt-2 font-sans text-[#F4F4F6]/40">
									{t(`members.${member.id}.credit`)}
								</p>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</section>
	);
}
