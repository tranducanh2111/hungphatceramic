"use client";

import { useTranslations } from "next-intl";
import { Compass, ShieldCheck, HeartHandshake, Sprout } from "lucide-react";
import { Text } from "@/components/ui";
import { BlueprintLine, ParallaxElement } from "@/components/common";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";
import { ValuesPrinciplesTimeline } from "@/page-sections/about/ValuesPrinciplesTimeline";

export function AboutValues() {
	const t = useTranslations("pages.about.values");

	const pillars = [
		{ id: "craftsmanship", icon: Compass },
		{ id: "reliability", icon: ShieldCheck },
		{ id: "customerCentricity", icon: HeartHandshake },
		{ id: "sustainableGrowth", icon: Sprout },
	] as const;

	return (
		<section
			id={ABOUT_SECTION_IDS.activeLocations}
			className="bg-sapphire-deep relative -mt-px scroll-mt-28 overflow-hidden py-24 sm:py-28 lg:py-36"
		>
			<div
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_70%_58%,#0E2A42_0%,transparent_65%)] opacity-40"
				aria-hidden="true"
			/>
			<div
				className="from-sapphire-deep via-sapphire-deep/85 pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b to-transparent sm:h-36"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-6xl px-6 lg:px-12">
				<div className="grid gap-12 lg:grid-cols-12 lg:items-center">
					<div className="border-champagne/20 relative flex flex-col justify-center border-l-2 pl-8 lg:col-span-5">
						<ParallaxElement
							rangePx={30}
							fadeIn
							className="relative flex flex-col justify-center"
						>
							<div className="text-champagne font-serif text-[100px] leading-none font-light tracking-tight sm:text-[130px] lg:text-[165px]">
								{t("network.stats")}
							</div>
							<Text
								variant="h4"
								className="text-linen mt-2 font-sans tracking-[0.15em] uppercase"
							>
								{t("network.statsLabel")}
							</Text>
						</ParallaxElement>
						<ParallaxElement
							rangePx={65}
							invert
							className="pointer-events-none absolute top-0 -left-6 font-serif text-[140px] leading-none font-light opacity-[0.03] select-none"
							aria-hidden="true"
						>
							<span style={{ WebkitTextStroke: "1px #D4B886" }}>SCALE</span>
						</ParallaxElement>
					</div>

					<ParallaxElement rangePx={24} invert fadeIn className="lg:col-span-7">
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
							{t("network.title")}
						</span>
						<Text variant="h2" className="text-linen mt-4 font-serif font-light">
							{t("network.subtitle")}
						</Text>
						<Text variant="body" className="text-linen/60 mt-4 leading-relaxed">
							{t("network.description")}
						</Text>
					</ParallaxElement>
				</div>

				<BlueprintLine variant="datum" className="my-16 h-5 w-full lg:my-24" />

				<div className="mt-8 lg:mt-12">
					<ParallaxElement rangePx={18} fadeIn className="mb-20 text-center">
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
							{t("label")}
						</span>
						<h3 className="text-display-lg text-linen mt-3 font-serif font-light tracking-wide">
							{t("heading")}
						</h3>
					</ParallaxElement>

					<ValuesPrinciplesTimeline pillars={pillars} />
				</div>
			</div>

			<div
				className="to-sapphire-ocean pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>
		</section>
	);
}
