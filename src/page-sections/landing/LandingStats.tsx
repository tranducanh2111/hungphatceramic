"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Text } from "@/components/ui";
import { STATS, type StatItem } from "@/constants/landing";
import { RoomSilhouette } from "@/components/landing/RoomSilhouette";

function useCountUp(target: number, isActive: boolean, duration = 1800) {
	const [displayValue, setDisplayValue] = useState(0);

	useEffect(() => {
		if (!isActive) return;

		const startTime = performance.now();
		const startValue = 0;

		function tick(currentTime: number) {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / duration, 1);
			// Ease out cubic
			const easedProgress = 1 - Math.pow(1 - progress, 3);
			setDisplayValue(Math.floor(startValue + easedProgress * target));
			if (progress < 1) requestAnimationFrame(tick);
		}

		requestAnimationFrame(tick);
	}, [target, isActive, duration]);

	return displayValue;
}

function StatCounter({ stat, label }: { stat: StatItem; label: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.5 });
	const count = useCountUp(stat.numericValue, isInView);

	const formattedValue =
		stat.numericValue >= 1000 ? `${Math.floor(count / 1000)}k` : count.toString();

	return (
		<div ref={ref} className="flex flex-col items-center text-center">
			<Text variant="display-xl" className="text-champagne font-serif font-light">
				{formattedValue}
				{stat.suffix}
			</Text>
			<Text variant="body-sm" className="text-linen/50 mt-2">
				{label}
			</Text>
		</div>
	);
}

/** LandingStats (credibility through scale, numbers animate on scroll entry). */
export function LandingStats() {
	const t = useTranslations("landing.stats");

	return (
		<section className="bg-sapphire-deep relative overflow-hidden py-28 lg:py-32">
			<RoomSilhouette />
			<div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
				{/* Decorative line */}
				<div className="mb-16 flex items-center gap-6">
					<div className="bg-sapphire-mist h-px flex-1" />
					<motion.span
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="text-label text-champagne font-sans tracking-widest uppercase"
					>
						{t("label")}
					</motion.span>
					<div className="bg-sapphire-mist h-px flex-1" />
				</div>

				{/* Stats grid */}
				<div className="grid grid-cols-2 gap-12 lg:grid-cols-4">
					{STATS.map((stat) => (
						<StatCounter
							key={stat.numericValue}
							stat={stat}
							label={t(`items.${stat.numericValue}`)}
						/>
					))}
				</div>

				{/* Supporting line */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
					viewport={{ once: true }}
					className="mt-16 text-center"
				>
					<Text variant="body-lg" className="text-linen/40 italic">
						{t("quote")}
					</Text>
				</motion.div>
			</div>
		</section>
	);
}
