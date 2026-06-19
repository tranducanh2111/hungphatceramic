"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, PaginationDots } from "@/components/ui";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";
import { cn } from "@/lib/cn";

export interface DemoWorkCarouselPanelProps {
	demoWorkImages: string[];
	productName: string;
	activeDemoIndex: number;
	onSelectDemo: (index: number) => void;
	onPreviousDemo: () => void;
	onNextDemo: () => void;
	onOpenLightbox: () => void;
	onPauseAutoPlay: () => void;
	onResumeAutoPlay: () => void;
	/** Stretch image area to match the adjacent composite panel in lg side-by-side layout. */
	fillHeight?: boolean;
	className?: string;
}

export function DemoWorkCarouselPanel({
	demoWorkImages,
	productName,
	activeDemoIndex,
	onSelectDemo,
	onPreviousDemo,
	onNextDemo,
	onOpenLightbox,
	onPauseAutoPlay,
	onResumeAutoPlay,
	fillHeight = false,
	className,
}: DemoWorkCarouselPanelProps) {
	const tDetail = useTranslations("pages.productDetail");
	const demoWorkCount = demoWorkImages.length;
	const hasMultipleDemoWork = demoWorkCount > 1;
	const activeDemoImage = demoWorkImages[activeDemoIndex];

	if (!activeDemoImage) {
		return null;
	}

	return (
		<div
			className={cn(
				"shadow-luxury-md border-sapphire-mist/40 bg-sapphire-deep relative w-full overflow-hidden rounded-2xl border",
				fillHeight && "flex h-full flex-col",
				className,
			)}
			onMouseEnter={onPauseAutoPlay}
			onMouseLeave={onResumeAutoPlay}
			onFocusCapture={onPauseAutoPlay}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					onResumeAutoPlay();
				}
			}}
		>
			<div
				className={cn(
					"bg-sapphire-deep relative w-full",
					fillHeight ? "min-h-[12rem] flex-1 sm:min-h-[16rem]" : "aspect-[4/3]",
				)}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.button
						type="button"
						key={activeDemoImage}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.45, ease: "easeInOut" }}
						className="group absolute inset-0 z-[1] cursor-zoom-in"
						onClick={onOpenLightbox}
						aria-label={tDetail("demoWorkZoom", {
							exampleNumber: activeDemoIndex + 1,
						})}
					>
						<Image
							src={encodePublicAssetPath(
								resolveDetailGalleryImagePath(activeDemoImage),
							)}
							alt={tDetail("demoWorkImageAlt", {
								productName,
								exampleNumber: activeDemoIndex + 1,
							})}
							fill
							priority={activeDemoIndex === 0}
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="ease-luxury object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
						/>
						<span className="bg-sapphire-deep/0 group-hover:bg-sapphire-deep/25 pointer-events-none absolute inset-0 flex items-center justify-center transition-colors duration-300">
							<span className="bg-champagne/90 text-sapphire-deep rounded-full p-2.5 text-sm font-semibold opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
								🔎
							</span>
						</span>
					</motion.button>
				</AnimatePresence>

				{hasMultipleDemoWork && (
					<>
						<div
							className="from-sapphire-deep/70 pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b to-transparent"
							aria-hidden
						/>
						<div
							className="from-sapphire-deep/80 pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t to-transparent"
							aria-hidden
						/>

						<p className="text-footnote text-linen absolute top-4 left-1/2 z-20 -translate-x-1/2 font-sans tracking-[0.15em] uppercase">
							{tDetail("demoWorkLightboxCounter", {
								current: activeDemoIndex + 1,
								total: demoWorkCount,
							})}
						</p>

						<IconButton
							variant="gallery"
							onClick={onPreviousDemo}
							className="absolute top-1/2 left-3 z-20 sm:left-4"
							aria-label={tDetail("demoWorkLightboxPrevious")}
						>
							<ChevronLeft className="h-5 w-5" aria-hidden />
						</IconButton>

						<IconButton
							variant="gallery"
							onClick={onNextDemo}
							className="absolute top-1/2 right-3 z-20 sm:right-4"
							aria-label={tDetail("demoWorkLightboxNext")}
						>
							<ChevronRight className="h-5 w-5" aria-hidden />
						</IconButton>

						<PaginationDots
							tone="light"
							className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2"
							count={demoWorkImages.length}
							activeIndex={activeDemoIndex}
							onSelect={onSelectDemo}
							getAriaLabel={(index) =>
								tDetail("demoWorkGoToExample", { exampleNumber: index + 1 })
							}
						/>
					</>
				)}
			</div>
		</div>
	);
}
