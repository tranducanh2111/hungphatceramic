"use client";

import { useTranslations } from "next-intl";
import { ViewportDeferredImage } from "@/components/media";
import { Text } from "@/components/ui";
import { BlueprintLine, RevealOnView } from "@/components/common";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";
import { MEDIA_PATHS } from "@/constants/media";

/**
 * AboutOrigin — Founding story: Perla name meaning and Hung Phat background.
 */
export function AboutOrigin() {
	const t = useTranslations("pages.about.origin");

	return (
		<section
			id={ABOUT_SECTION_IDS.ourStory}
			className="bg-sapphire-ocean relative scroll-mt-28 overflow-hidden py-20 sm:py-28 lg:py-36"
		>
			<div
				className="to-sapphire-deep pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent sm:h-36"
				aria-hidden="true"
			/>

			<div className="relative mx-auto max-w-7xl px-6 lg:px-12">
				<RevealOnView className="max-w-4xl">
					<Text
						variant="display-xl"
						as="h2"
						className="text-linen font-serif leading-[1.08] font-light"
					>
						{t("heading")}
					</Text>
				</RevealOnView>

				<div className="mt-12 grid items-start gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16 xl:gap-20">
					<div className="order-2 flex flex-col lg:order-1">
						<span
							className="font-serif text-[72px] leading-none font-light text-transparent select-none sm:text-[88px] lg:text-[110px]"
							style={{ WebkitTextStroke: "1px rgba(212,184,134,0.2)" }}
							aria-hidden="true"
						>
							01
						</span>

						<RevealOnView className="relative mt-4 aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] lg:mt-6">
							<ViewportDeferredImage
								src={MEDIA_PATHS.images.about.origin}
								alt={t("imageAlt")}
								fill
								className="scale-[1.08] object-cover object-center grayscale"
								sizes="(max-width: 1024px) 100vw, 50vw"
							/>
							<div className="ring-champagne/10 pointer-events-none absolute inset-0 ring-1" />
						</RevealOnView>

						<RevealOnView
							as="blockquote"
							className="border-champagne mt-6 border-l-2 pl-5 lg:mt-8"
						>
							<Text
								variant="body-lg"
								as="p"
								className="text-champagne font-serif font-light italic"
							>
								&ldquo;{t("pullQuote")}&rdquo;
							</Text>
						</RevealOnView>
					</div>

					<div className="relative order-1 flex min-h-0 flex-col justify-between lg:order-2 lg:min-h-[320px] lg:pt-2">
						<div className="space-y-8 lg:ml-auto lg:max-w-md lg:text-right">
							<RevealOnView>
								<span className="text-label text-champagne font-sans tracking-[0.2em] uppercase">
									{t("nameLabel")}
								</span>
								<Text
									variant="h3"
									as="h3"
									className="text-linen mt-3 font-serif font-light italic"
								>
									{t("nameTitle")}
								</Text>
								<Text
									variant="body-lg"
									className="text-linen/70 mt-4 leading-relaxed"
								>
									{t("nameStory")}
								</Text>
							</RevealOnView>

							<RevealOnView delay={0.1}>
								<div
									className="bg-champagne/25 mx-auto my-2 h-px w-12 lg:ms-auto lg:me-0"
									aria-hidden="true"
								/>
								<Text
									variant="body-lg"
									className="text-linen/65 mt-6 leading-relaxed whitespace-pre-line"
								>
									{t("body")}
								</Text>
							</RevealOnView>
						</div>

						<BlueprintLine
							variant="foundation"
							className="mt-10 h-40 w-40 self-end opacity-90 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:h-48 lg:w-48"
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
