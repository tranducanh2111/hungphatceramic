"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { ParallaxLayer } from "@/components/common";
import { CRAFT_BEATS } from "@/constants/about";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";

export function CraftReducedMotion() {
	const t = useTranslations("pages.about.craft");
	const beat = CRAFT_BEATS[0];

	return (
		<section
			id={ABOUT_SECTION_IDS.craft}
			className="bg-sapphire-deep relative scroll-mt-28"
			aria-label={t("ariaLabel")}
		>
			<div className="flex min-h-[100dvh] flex-col lg:flex-row">
				<div className="relative h-[42vh] min-h-[220px] shrink-0 overflow-hidden lg:h-auto lg:min-h-[600px] lg:w-1/2">
					<ParallaxLayer rangePx={40} className="absolute inset-0">
						<Image
							src={beat.imageUrl}
							alt={t(`beats.${beat.id}.imageAlt`)}
							fill
							className="object-cover object-center"
							sizes="(max-width: 1024px) 100vw, 50vw"
							priority
						/>
					</ParallaxLayer>
				</div>
				<div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-8 lg:px-14">
					<span className="text-label text-champagne/65 font-sans tracking-widest uppercase">
						{t(`beats.${beat.id}.label`)}
					</span>
					<Text
						variant="h2"
						as="h2"
						className="text-linen mt-3 font-serif text-3xl font-light italic"
					>
						{t(`beats.${beat.id}.title`)}
					</Text>
					<Text variant="body" className="text-linen/60 mt-4 leading-relaxed">
						{t(`beats.${beat.id}.body`)}
					</Text>
				</div>
			</div>
			{/* Bottom blend: sapphire-deep → sapphire-ocean into AboutCapabilities */}
			<div
				className="from-sapphire-deep via-sapphire-deep/80 to-sapphire-ocean pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b sm:h-36"
				aria-hidden="true"
			/>
		</section>
	);
}
