"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ClipboardList, Layers, Truck, ShieldCheck, type LucideIcon } from "lucide-react";
import { Text } from "@/components/ui";
import { ParallaxElement, RevealOnView } from "@/components/common";
import { CAPABILITY_CARDS, type CapabilityId } from "@/constants/about";
import { ABOUT_SECTION_IDS } from "@/constants/about-sections";

/** Small footer icon per capability card. */
const CAPABILITY_ICONS: Record<CapabilityId, LucideIcon> = {
	specification: ClipboardList,
	production: Layers,
	logistics: Truck,
	aftercare: ShieldCheck,
} as const;

/**
 * AboutCapabilities — 4 numbered image cards (flyward value-card pattern).
 */
export function AboutCapabilities() {
	const t = useTranslations("pages.about.capabilities");

	const topRow = CAPABILITY_CARDS.slice(0, 2);
	const bottomRow = CAPABILITY_CARDS.slice(2);

	return (
		<section
			id={ABOUT_SECTION_IDS.capabilities}
			className="bg-sapphire-ocean relative scroll-mt-28 overflow-hidden py-28 lg:py-36"
		>
			<div className="mx-auto max-w-7xl px-6 lg:px-12">
				<div className="mb-16">
					<RevealOnView>
						<span className="text-label text-champagne font-sans tracking-widest uppercase">
							{t("label")}
						</span>
					</RevealOnView>
					<RevealOnView className="mt-3 max-w-xl" delay={0.1}>
						<Text variant="h2" as="h2" className="text-linen">
							{t("heading")}
						</Text>
					</RevealOnView>
				</div>

				<div className="grid gap-6 sm:grid-cols-2">
					{topRow.map((card, index) => {
						const Icon = CAPABILITY_ICONS[card.id as CapabilityId];
						return (
							<CapabilityCard
								key={card.id}
								card={card}
								Icon={Icon}
								animationDelay={0.15 + index * 0.1}
								t={t}
							/>
						);
					})}
				</div>

				<div className="mt-8 grid gap-6 sm:grid-cols-2">
					{bottomRow.map((card, index) => {
						const Icon = CAPABILITY_ICONS[card.id as CapabilityId];
						return (
							<CapabilityCard
								key={card.id}
								card={card}
								Icon={Icon}
								animationDelay={0.25 + index * 0.1}
								t={t}
							/>
						);
					})}
				</div>
			</div>

			<div
				className="to-sapphire-deep from-sapphire-ocean pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 translate-y-px bg-gradient-to-b via-[#0a1f32] sm:h-48"
				aria-hidden="true"
			/>
		</section>
	);
}

interface CapabilityCardProps {
	card: (typeof CAPABILITY_CARDS)[number];
	Icon: LucideIcon;
	animationDelay: number;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	t: (key: string) => any;
}

function CapabilityCard({ card, Icon, animationDelay, t }: CapabilityCardProps) {
	return (
		<RevealOnView
			as="article"
			delay={animationDelay}
			className="group bg-sapphire-deep relative flex flex-col overflow-hidden"
		>
			<div className="relative h-56 overflow-hidden lg:h-64">
				<ParallaxElement rangePx={20} className="absolute inset-0 scale-[1.08]">
					<Image
						src={card.imageUrl}
						alt={t(`cards.${card.id}.title`)}
						fill
						className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
						sizes="(max-width: 640px) 100vw, 50vw"
					/>
				</ParallaxElement>
				<div
					className="from-sapphire-deep/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
					aria-hidden="true"
				/>

				<div className="border-champagne/40 bg-sapphire-deep/85 absolute top-4 right-4 flex h-9 w-9 items-center justify-center border">
					<span className="text-footnote text-champagne font-serif font-light">
						{card.numeral}
					</span>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-3 px-7 py-7">
				<Text
					variant="h4"
					as="h3"
					className="text-linen font-serif tracking-wide uppercase"
				>
					{t(`cards.${card.id}.title`)}
				</Text>
				<Text variant="body" className="text-linen/55 leading-relaxed">
					{t(`cards.${card.id}.body`)}
				</Text>

				<div className="border-champagne/10 mt-auto border-t pt-4">
					<Icon className="text-champagne/50 h-4 w-4" />
				</div>
			</div>

			<div className="bg-champagne absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
		</RevealOnView>
	);
}
