"use client";

import { ViewportDeferredImage } from "@/components/media";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import {
	ParallaxElement,
	ParallaxSection,
	SectionBlendOverlay,
	SectionHeader,
} from "@/components/common";
import {
	SECTION_BLEND_GRADIENTS,
	SECTION_BLEND_HEIGHT_COMPACT_MAJOR,
} from "@/lib/section-blend-gradients";
import { PROJECT_MILESTONES } from "@/constants/projects";
import { cn } from "@/lib/cn";
import { MilestoneConnector } from "@/page-sections/projects/MilestoneConnector";

interface MilestoneImageProps {
	src: string;
	alt: string;
	rangePx: number;
	invert: boolean;
}

function MilestoneImage({ src, alt, rangePx, invert }: MilestoneImageProps) {
	return (
		<div className="relative h-full w-full overflow-hidden">
			<ParallaxElement
				rangePx={rangePx}
				invert={invert}
				fadeIn
				className="absolute inset-0 scale-[1.08]"
			>
				<ViewportDeferredImage
					src={src}
					alt={alt}
					fill
					className="object-cover object-center"
					sizes="(max-width: 1024px) 100vw, 50vw"
				/>
			</ParallaxElement>
		</div>
	);
}

const HERITAGE_IMAGE_PARALLAX = [36, 42, 38] as const;
const HERITAGE_TEXT_PARALLAX = [22, 28, 24] as const;

/** ProjectsHeritage (scroll-linked timeline of signature Vietnam project partners). */
export function ProjectsHeritage() {
	const t = useTranslations("pages.projects.heritage");
	const milestoneCount = PROJECT_MILESTONES.length;

	return (
		<ParallaxSection
			className="bg-sapphire-deep relative -mt-px overflow-hidden pt-24 pb-28 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-36"
			aria-label={t("ariaLabel")}
		>
			<div
				className="from-sapphire-deep via-sapphire-deep/85 pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b to-transparent sm:h-36"
				aria-hidden="true"
			/>
			<SectionBlendOverlay
				edge="bottom"
				gradient={SECTION_BLEND_GRADIENTS.sapphireDeepToLinenWarm}
				heightClassName={SECTION_BLEND_HEIGHT_COMPACT_MAJOR}
			/>

			<div className="relative mx-auto max-w-6xl px-6 lg:px-12">
				<SectionHeader
					label={t("label")}
					heading={t("heading")}
					className="mb-24 pt-4 lg:mb-32 lg:pt-8"
				/>

				<div className="flex flex-col gap-20 sm:gap-28 lg:gap-0">
					{PROJECT_MILESTONES.map((milestone, index) => {
						const isEven = index % 2 === 0;
						const isLast = index === milestoneCount - 1;
						const imageParallax = HERITAGE_IMAGE_PARALLAX[index] ?? 36;
						const textParallax = HERITAGE_TEXT_PARALLAX[index] ?? 24;

						return (
							<div
								key={milestone.id}
								id={milestone.id}
								className="scroll-mt-28 [contain-intrinsic-size:auto_28rem] [content-visibility:auto] lg:grid lg:grid-cols-2 lg:gap-x-20"
							>
								<article className="relative z-10 col-span-2 grid items-center gap-x-20 gap-y-10 lg:grid-cols-2">
									<div
										className={cn(
											"relative h-[280px] overflow-hidden rounded-2xl sm:h-[340px] lg:h-[400px]",
											!isEven && "lg:order-2",
										)}
									>
										<MilestoneImage
											src={milestone.imageUrl}
											alt={t(`milestones.${milestone.id}.imageAlt`)}
											rangePx={imageParallax}
											invert={!isEven}
										/>
										<div className="ring-champagne/8 pointer-events-none absolute inset-0 rounded-2xl ring-1" />
									</div>

									<ParallaxElement
										rangePx={textParallax}
										invert={isEven}
										fadeIn
										className={cn(
											"flex flex-col",
											isEven ? "lg:order-2" : "lg:order-1",
										)}
									>
										<p className="text-h2 text-champagne/55 font-sans leading-tight font-light tracking-wide">
											{milestone.coordinates}
										</p>
										<p className="text-body-sm text-linen/40 mt-2 font-sans">
											{t(`milestones.${milestone.id}.location`)}
										</p>
										<p className="text-label text-champagne/30 mt-1 font-sans tracking-widest uppercase">
											{milestone.year}
										</p>

										<div className="bg-champagne/25 my-7 h-px w-10" />

										<Text variant="h4" as="h3" className="text-linen">
											{t(`milestones.${milestone.id}.title`)}
										</Text>
										<Text
											variant="body"
											className="text-linen/55 mt-3 max-w-sm leading-relaxed"
										>
											{t(`milestones.${milestone.id}.description`)}
										</Text>
									</ParallaxElement>
								</article>

								{!isLast && <MilestoneConnector connectorIndex={index} />}
							</div>
						);
					})}
				</div>
			</div>
		</ParallaxSection>
	);
}
