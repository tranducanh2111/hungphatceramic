"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import { Compass, ShieldCheck, HeartHandshake, Sprout } from "lucide-react";
import { Text } from "@/components/ui";
import { BlueprintLine } from "@/components/common";

const fadeUp: Variants = {
	hidden: { opacity: 0, y: 24 },
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut" as const, delay },
	}),
};

const pillarVariants: Variants = {
	hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
	visible: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
	},
};

export function AboutValues() {
	const t = useTranslations("pages.about.values");

	const pillars = [
		{ id: "craftsmanship", icon: Compass },
		{ id: "reliability", icon: ShieldCheck },
		{ id: "customerCentricity", icon: HeartHandshake },
		{ id: "sustainableGrowth", icon: Sprout },
	] as const;

	return (
		<section className="relative overflow-hidden bg-[#071A2B] py-24 sm:py-28 lg:py-36">
			{/* Radial background decoration */}
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,#0e2a42_0%,transparent_60%)] opacity-40"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-6xl px-6 lg:px-12">
				{/* ─── CHAPTER 1: THE SCALE & FOOTPRINT ─── */}
				<div className="grid gap-12 lg:grid-cols-12 lg:items-center">
					{/* Left: Giant visual stat */}
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={fadeUp}
						custom={0}
						className="relative flex flex-col justify-center border-l-2 border-[#D4B886]/20 pl-8 lg:col-span-5"
					>
						<div className="font-serif text-[100px] leading-none font-light tracking-tight text-[#D4B886] sm:text-[130px] lg:text-[165px]">
							{t("network.stats")}
						</div>
						<Text
							variant="h4"
							className="mt-2 font-sans tracking-[0.15em] text-[#F4F4F6] uppercase"
						>
							{t("network.statsLabel")}
						</Text>
						{/* Absolute background label matching signature draft aesthetic */}
						<div
							className="pointer-events-none absolute top-0 -left-6 font-serif text-[140px] leading-none font-light opacity-[0.03] select-none"
							style={{ WebkitTextStroke: "1px #D4B886" }}
							aria-hidden="true"
						>
							SCALE
						</div>
					</motion.div>

					{/* Right: Scale story and context */}
					<motion.div
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, amount: 0.3 }}
						variants={fadeUp}
						custom={0.15}
						className="flex flex-col gap-4 lg:col-span-7"
					>
						<span className="text-label font-sans tracking-widest text-[#D4B886] uppercase">
							{t("network.title")}
						</span>
						<Text variant="h2" className="font-serif font-light text-[#F4F4F6]">
							{t("network.subtitle")}
						</Text>
						<Text variant="body" className="leading-relaxed text-[#F4F4F6]/60">
							{t("network.description")}
						</Text>
					</motion.div>
				</div>

				{/* Connecting blueprint line to guide eyes down to values */}
				<BlueprintLine
					variant="datum"
					className="my-16 h-5 w-full lg:my-24"
					scrollRange={[0.15, 0.6]}
				/>

				{/* ─── CHAPTER 2: THE FOUR PILLARS ─── */}
				<div className="mt-8 lg:mt-12">
					{/* Header */}
					<div className="mb-20 text-center">
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-label font-sans tracking-widest text-[#D4B886] uppercase"
						>
							{t("label")}
						</motion.span>
						<motion.h3
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.15 }}
							className="text-display-lg mt-3 font-serif font-light tracking-wide text-[#F4F4F6]"
						>
							{t("heading")}
						</motion.h3>
					</div>

					{/* Storytelling Timeline Columns */}
					<div className="relative mx-auto max-w-4xl">
						{/* Vertical Timeline Guide Line */}
						<div className="absolute top-0 bottom-0 left-[27px] w-px bg-gradient-to-b from-[#D4B886]/35 via-[#1A3D5C] to-transparent sm:left-1/2" />

						<div className="flex flex-col gap-16 lg:gap-20">
							{pillars.map((pillar, index) => {
								const Icon = pillar.icon;
								const isEven = index % 2 === 0;

								return (
									<motion.div
										key={pillar.id}
										initial="hidden"
										whileInView="visible"
										viewport={{ once: true, amount: 0.3 }}
										variants={pillarVariants}
										className={`relative flex flex-col sm:flex-row ${
											isEven ? "sm:flex-row-reverse" : ""
										}`}
									>
										{/* Icon node on the line */}
										<div className="absolute left-0 z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4B886]/30 bg-[#071A2B] shadow-[0_0_20px_rgba(7,26,43,0.8)] sm:left-1/2 sm:-ml-7">
											<Icon className="h-6 w-6 text-[#D4B886]" />
										</div>

										{/* Content Card (Left or Right depending on alignment) */}
										<div className="mt-2 ml-20 w-auto sm:mt-0 sm:ml-0 sm:w-1/2 sm:px-12">
											<div
												className={`flex flex-col ${
													isEven
														? "sm:items-end sm:text-right"
														: "sm:items-start sm:text-left"
												}`}
											>
												<span className="text-footnote font-sans tracking-[0.2em] text-[#D4B886] uppercase">
													{`0${index + 1}`}
												</span>
												<Text
													variant="h4"
													as="h4"
													className="mt-1 font-serif text-[#F4F4F6]"
												>
													{t(`list.${pillar.id}.title`)}
												</Text>
												<Text
													variant="body"
													className="mt-3 leading-relaxed text-[#F4F4F6]/55"
												>
													{t(`list.${pillar.id}.description`)}
												</Text>
											</div>
										</div>

										{/* Spacer for desktop alignment */}
										<div className="hidden sm:block sm:w-1/2" />
									</motion.div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
