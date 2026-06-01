"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform, useSpring, type Variants } from "framer-motion";
import { Text } from "@/components/ui";
import { BlueprintLine } from "@/components/common";
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
 * Changes from v2:
 *   - tile-texture replaced with BlueprintLine grid (foundation motif).
 *   - Grid wrapped in a champagne hairline outline border.
 */
export function AboutClients() {
	const t = useTranslations("pages.about.clients");
	const sectionRef = useRef<HTMLElement>(null);

	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start end", "end start"],
	});

	const rawGridY = useTransform(scrollYProgress, [0, 1], [-45, 45]);
	const gridY = useSpring(rawGridY, { stiffness: 100, damping: 30, mass: 0.2 });

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden bg-[#0E2A42] py-24 lg:py-32"
			aria-label={t("ariaLabel")}
		>
			{/* Blueprint grid-paper background — foundation laid motif */}
			<motion.div style={{ y: gridY }} className="absolute inset-0">
				<BlueprintLine
					variant="grid"
					className="h-full w-full opacity-[0.07]"
					scrollRange={[0.0, 0.5]}
				/>
			</motion.div>

			<div className="relative mx-auto max-w-7xl px-6 lg:px-12">
				{/* Header */}
				<div className="mb-12 text-center">
					<motion.span
						custom={0}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: false, amount: 0.1 }}
						className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
					>
						{t("label")}
					</motion.span>
					<motion.div
						custom={0.1}
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: false, amount: 0.1 }}
					>
						<Text
							variant="h2"
							as="h2"
							className="mx-auto mt-3 max-w-2xl font-serif font-light text-[#F4F4F6] italic"
						>
							{t("heading")}
						</Text>
					</motion.div>
				</div>

				{/* Client name grid — champagne hairline outline wrapping the whole grid */}
				<div className="border border-[#D4B886]/20">
					<div className="grid grid-cols-2 gap-px bg-[#D4B886]/10 sm:grid-cols-3 lg:grid-cols-4">
						{CLIENT_ROSTER.map((client, index) => (
							<motion.div
								key={client.id}
								custom={0.05 + index * 0.06}
								variants={fadeUp}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: false, amount: 0.1 }}
								className="group flex items-center justify-center bg-[#0E2A42] px-6 py-10 transition-colors duration-300 hover:bg-[#071A2B]/60"
							>
								<span className="text-label text-center font-sans font-medium tracking-widest text-[#F4F4F6]/30 uppercase transition-colors duration-300 group-hover:text-[#D4B886]/80">
									{client.name}
								</span>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
