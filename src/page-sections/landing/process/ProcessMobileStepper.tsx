"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { PROCESS_STEPS, type ProcessStep } from "@/constants/landing";

interface ProcessStepCardProps {
	step: ProcessStep;
	index: number;
}

function ProcessStepCard({ step, index }: ProcessStepCardProps) {
	const t = useTranslations("landing.process");

	return (
		<motion.li
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.06 }}
			viewport={{ once: true, amount: 0.2 }}
		>
			<article className="rounded-2xl border border-[#1A3D5C] bg-[#071A2B]/50 p-7 backdrop-blur-sm">
				<Text
					variant="display-lg"
					className="font-serif font-light text-[#D4B886]/20 select-none"
					aria-hidden
				>
					{step.number}
				</Text>
				<Text variant="h4" className="mt-1 text-[#F4F4F6]">
					{t(`steps.${step.id}.title`)}
				</Text>
				<div className="my-4 h-px w-12 bg-[#D4B886]" aria-hidden />
				<Text variant="body" className="leading-relaxed text-[#F4F4F6]/65">
					{t(`steps.${step.id}.description`)}
				</Text>
			</article>
		</motion.li>
	);
}

/** Mobile / reduced-motion: stacked step cards without pinned scroll or SVG path. */
export function ProcessMobileStepper() {
	const t = useTranslations("landing.process");

	return (
		<div className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
			<header className="text-center">
				<span className="text-label font-sans tracking-widest text-[#D4B886] uppercase">
					{t("label")}
				</span>
				<Text variant="h2" className="mt-3 text-[#F4F4F6]">
					{t("heading")}
				</Text>
			</header>

			<ol className="mt-10 flex list-none flex-col gap-4">
				{PROCESS_STEPS.map((step, index) => (
					<ProcessStepCard key={step.id} step={step} index={index} />
				))}
			</ol>
		</div>
	);
}
