"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { BlueprintLine, RevealOnView } from "@/components/common";
import { MEDIA_PATHS } from "@/constants/media";

/**
 * AboutOrigin — Founding moment (flyward mission pattern, balanced layout).
 */
export function AboutOrigin() {
	const t = useTranslations("pages.about.origin");

	return (
		<section
			id="our-story"
			className="bg-sapphire-ocean relative overflow-hidden py-20 sm:py-28 lg:py-36"
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
							<Image
								src={MEDIA_PATHS.images.about.origin}
								alt={t("imageAlt")}
								fill
								className="scale-[1.08] object-cover object-center grayscale"
								sizes="(max-width: 1024px) 100vw, 50vw"
								priority
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

					<RevealOnView className="relative order-1 flex min-h-0 flex-col justify-between lg:order-2 lg:min-h-[320px] lg:pt-2">
						<Text
							variant="body-lg"
							className="text-linen/65 leading-relaxed whitespace-pre-line lg:ml-auto lg:max-w-md lg:text-right"
						>
							{t("body")}
						</Text>

						<BlueprintLine
							variant="foundation"
							className="mt-10 h-40 w-40 self-end opacity-90 lg:absolute lg:right-0 lg:bottom-0 lg:mt-0 lg:h-48 lg:w-48"
						/>
					</RevealOnView>
				</div>
			</div>
		</section>
	);
}
