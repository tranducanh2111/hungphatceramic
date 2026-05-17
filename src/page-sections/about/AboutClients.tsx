"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { CLIENT_ROSTER } from "@/constants/about";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: "easeOut" as const, delay },
	}),
};

/**
 * AboutClients — Trusted-by client roster.
 *
 * Text-name fallback grid: client names in champagne uppercase tracking,
 * muted by default, lit up on hover. Grid uses hairline borders built from
 * gap-px + sapphire-mist background — same technique as AboutCapabilities.
 *
 * When logo assets are cleared, swap the name span for an <Image> with the
 * same hover opacity transition.
 */
export function AboutClients() {
	const t = useTranslations("pages.about.clients");

	return (
		<section
			className="relative bg-[#0E2A42] py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
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
						<Text
							variant="h2"
							as="h2"
							className="mx-auto mt-3 max-w-2xl font-serif font-light italic text-[#F4F4F6]"
						>
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				{/* Client name grid */}
				<div className="grid grid-cols-2 gap-px bg-[#1A3D5C] border border-[#1A3D5C] sm:grid-cols-3 lg:grid-cols-4">
					{CLIENT_ROSTER.map((client, index) => (
						<motion.div
							key={client.id}
							custom={0.05 + index * 0.06}
							variants={fadeUp}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.2 }}
							className="group flex items-center justify-center px-6 py-10 bg-[#0E2A42] transition-colors duration-300 hover:bg-[#071A2B]/50"
						>
							<span className="text-label text-center font-sans font-medium tracking-widest text-[#F4F4F6]/30 uppercase transition-colors duration-300 group-hover:text-[#D4B886]/80">
								{client.name}
							</span>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
