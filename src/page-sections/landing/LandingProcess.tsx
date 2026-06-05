"use client";

import { useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { ProcessMobileStepper } from "@/page-sections/landing/process/ProcessMobileStepper";
import { ProcessScrollTimeline } from "@/page-sections/landing/process/ProcessScrollTimeline";

/**
 * LandingProcess — Scroll-driven timeline on large screens; compact stepper on mobile.
 */
export function LandingProcess() {
	const t = useTranslations("landing.process");
	const prefersReducedMotion = useReducedMotion() ?? false;
	const useCompactStepper = prefersReducedMotion;

	return (
		<section className="bg-[#0E2A42]" aria-label={t("heading")}>
			<div className={cn(useCompactStepper ? "block" : "lg:hidden")}>
				<ProcessMobileStepper />
			</div>
			<div className={cn(useCompactStepper ? "hidden" : "hidden lg:block")}>
				<ProcessScrollTimeline />
			</div>
		</section>
	);
}