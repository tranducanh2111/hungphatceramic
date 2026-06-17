"use client";

import { ViewportDeferredImage } from "@/components/media";
import { Badge, Text } from "@/components/ui";
import { RevealOnView } from "./RevealOnView";
import { cn } from "@/lib/cn";
import type { ClassNameProp } from "@/types";

export interface FeaturedProjectCardContent {
	imageSrc: string;
	imageAlt: string;
	title: string;
	year: string;
	area: string;
	location: string;
}

interface FeaturedProjectCardProps extends ClassNameProp {
	content: FeaturedProjectCardContent;
	index?: number;
	revealDelay?: number;
}

/** Featured project tile for landing grid — glass overlays and champagne year badge. */
export function FeaturedProjectCard({
	content,
	index = 0,
	revealDelay,
	className,
}: FeaturedProjectCardProps) {
	const delay = revealDelay ?? index * 0.08;

	return (
		<RevealOnView delay={delay}>
			<article
				className={cn(
					"group border-champagne/15 bg-sapphire-ocean relative transform-gpu overflow-hidden rounded-[1.75rem] border shadow-[0_12px_42px_rgba(4,15,26,0.36)]",
					className,
				)}
			>
				<div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]">
					<div className="relative aspect-[4/3] overflow-hidden">
						<ViewportDeferredImage
							src={content.imageSrc}
							alt={content.imageAlt}
							fill
							quality={55}
							eager={index < 2}
							className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
						<div className="from-sapphire-deep/72 via-sapphire-deep/28 to-sapphire-deep/8 absolute inset-0 bg-gradient-to-t" />
						<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,184,134,0.12),transparent_40%)]" />
						<div className="from-sapphire-deep/55 via-sapphire-deep/18 pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[42%] bg-gradient-to-t to-transparent" />
					</div>

					<div className="pointer-events-none absolute top-5 right-5 left-5 z-10 flex items-start justify-between gap-4">
						<div className="bg-sapphire-deep/28 max-w-[min(100%,calc(100%-5.5rem))] rounded-xl border border-white/10 px-4 py-3 backdrop-blur-md backdrop-saturate-150">
							<Text
								variant="h4"
								className="text-linen line-clamp-2 [text-shadow:0_1px_2px_rgba(7,26,43,0.95),0_2px_24px_rgba(7,26,43,0.7)]"
							>
								{content.title}
							</Text>
						</div>
						<Badge variant="outline">{content.year}</Badge>
					</div>

					<div className="absolute right-5 bottom-5 left-5 z-10">
						<div className="bg-sapphire-deep/22 group-hover:bg-sapphire-deep/30 rounded-2xl border border-white/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-md backdrop-saturate-150 transition-all duration-500 group-hover:border-white/18">
							<Text
								variant="body-sm"
								className="text-linen/78 [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_20px_rgba(7,26,43,0.65)]"
							>
								{content.area}
							</Text>
							<div className="mt-4 h-px bg-gradient-to-r from-white/22 via-white/10 to-transparent" />
							<Text
								variant="body-sm"
								className="text-linen/82 mt-4 font-sans [text-shadow:0_1px_2px_rgba(7,26,43,0.92),0_2px_18px_rgba(7,26,43,0.62)]"
							>
								{content.location}
							</Text>
						</div>
					</div>
				</div>
			</article>
		</RevealOnView>
	);
}
