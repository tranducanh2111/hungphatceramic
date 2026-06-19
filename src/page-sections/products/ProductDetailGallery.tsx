"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Text, IconButton, PaginationDots, ZoomableImage } from "@/components/ui";
import {
	collectProductDemoWorkImages,
	encodePublicAssetPath,
	resolveDetailGalleryImagePath,
} from "@/lib/products/media";
import { cn } from "@/lib/cn";
import { ProductDetail } from "@/types";

const DEMO_WORK_AUTO_ADVANCE_MS = 5000;

interface ProductDetailGalleryProps {
	product: ProductDetail;
}

interface CompositeOverviewPanelProps {
	allFacesImage: string;
	productName: string;
	compositeAlt: string;
	onOpenLightbox: () => void;
	onImageError: () => void;
	className?: string;
}

function CompositeOverviewPanel({
	allFacesImage,
	productName,
	compositeAlt,
	onOpenLightbox,
	onImageError,
	className,
}: CompositeOverviewPanelProps) {
	const tDetail = useTranslations("pages.productDetail");

	return (
		<div
			className={cn(
				"shadow-luxury-md border-sapphire-mist/40 bg-sapphire-deep w-full overflow-hidden rounded-none border p-6",
				className,
			)}
		>
			<Text
				variant="label-sm"
				className="text-champagne/60 mb-4 block text-center font-sans font-medium tracking-[0.1em] uppercase"
			>
				{tDetail("facesOverviewComposite")}
			</Text>
			<div
				className="bg-sapphire-deep relative min-h-[12rem] w-full cursor-zoom-in overflow-hidden rounded-none sm:min-h-[16rem] lg:min-h-[20rem]"
				onClick={onOpenLightbox}
			>
				<Image
					src={encodePublicAssetPath(resolveDetailGalleryImagePath(allFacesImage))}
					alt={compositeAlt}
					fill
					sizes="(max-width: 1024px) 100vw, 50vw"
					className="ease-luxury object-contain object-center transition-transform duration-700 hover:scale-[1.01]"
					onError={onImageError}
				/>
			</div>
			<p className="text-footnote text-linen/45 mt-3 text-center font-sans">{productName}</p>
		</div>
	);
}

interface DemoWorkCarouselPanelProps {
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

function DemoWorkCarouselPanel({
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
				"shadow-luxury-md border-sapphire-mist/40 bg-sapphire-deep relative w-full overflow-hidden rounded-none border",
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

/** ProductDetailGallery (composite face sheet (when available) plus PC-* install/demo carousel). */
export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
	const tDetail = useTranslations("pages.productDetail");
	const tItems = useTranslations("products.items");

	const [activeDemoIndex, setActiveDemoIndex] = useState(0);
	const [isDemoAutoPlayPaused, setIsDemoAutoPlayPaused] = useState(false);
	const [isDemoLightboxOpen, setIsDemoLightboxOpen] = useState(false);
	const [isCompositeLightboxOpen, setIsCompositeLightboxOpen] = useState(false);
	const [isCompositeImageVisible, setIsCompositeImageVisible] = useState(true);

	const productName = tItems.has(`${product.slug}.name`)
		? tItems(`${product.slug}.name`)
		: product.name;

	const demoWorkImages = collectProductDemoWorkImages(product);
	const demoWorkCount = demoWorkImages.length;
	const hasDemoWork = demoWorkCount > 0;
	const hasMultipleDemoWork = demoWorkCount > 1;
	const hasComposite = Boolean(product.allFacesImage) && isCompositeImageVisible;
	const activeDemoImage = demoWorkImages[activeDemoIndex];
	const hasDemoPanel = hasDemoWork && Boolean(activeDemoImage);

	const carouselPauseRef = useRef({
		isAutoPlayPaused: isDemoAutoPlayPaused,
		isLightboxOpen: isDemoLightboxOpen,
	});

	useEffect(() => {
		carouselPauseRef.current = {
			isAutoPlayPaused: isDemoAutoPlayPaused,
			isLightboxOpen: isDemoLightboxOpen,
		};
	}, [isDemoAutoPlayPaused, isDemoLightboxOpen]);

	const goToPreviousDemo = useCallback(() => {
		setActiveDemoIndex((previousIndex) => (previousIndex - 1 + demoWorkCount) % demoWorkCount);
	}, [demoWorkCount]);

	const goToNextDemo = useCallback(() => {
		setActiveDemoIndex((previousIndex) => (previousIndex + 1) % demoWorkCount);
	}, [demoWorkCount]);

	const goToDemoByIndex = useCallback((index: number) => {
		setActiveDemoIndex(index);
	}, []);

	const resumeDemoAutoPlay = useCallback(() => {
		setIsDemoAutoPlayPaused(false);
	}, []);

	const openDemoLightbox = useCallback(() => {
		setIsDemoLightboxOpen(true);
		setIsDemoAutoPlayPaused(true);
	}, []);

	const closeDemoLightbox = useCallback(() => {
		setIsDemoLightboxOpen(false);
		setIsDemoAutoPlayPaused(false);
	}, []);

	useEffect(() => {
		if (!hasMultipleDemoWork) {
			return;
		}

		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (prefersReducedMotion.matches) {
			return;
		}

		const intervalId = window.setInterval(() => {
			const { isAutoPlayPaused, isLightboxOpen } = carouselPauseRef.current;
			if (isAutoPlayPaused || isLightboxOpen) {
				return;
			}

			setActiveDemoIndex((previousIndex) => (previousIndex + 1) % demoWorkCount);
		}, DEMO_WORK_AUTO_ADVANCE_MS);

		return () => window.clearInterval(intervalId);
	}, [activeDemoIndex, demoWorkCount, hasMultipleDemoWork]);

	if (!hasComposite && !hasDemoPanel) {
		return null;
	}

	const showSideBySide = hasComposite && hasDemoPanel;
	const compositeAlt = tDetail("facesOverviewCompositeAlt", { productName });

	return (
		<section className="bg-sapphire-ocean text-linen relative px-6 py-24 lg:px-12">
			<div className="via-sapphire-mist/35 absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent to-transparent" />

			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<Text
						variant="label"
						className="text-champagne mb-4 font-sans font-medium tracking-[0.2em] uppercase"
					>
						{tDetail("demoWork")}
					</Text>
					<h2 className="text-h2 text-linen font-serif font-light lining-nums">
						{productName}
					</h2>
					<div className="bg-champagne/30 mx-auto mt-4 h-px w-16" />
				</div>

				<div
					className={cn(
						"grid gap-6 lg:gap-8",
						showSideBySide
							? "grid-cols-1 justify-items-center lg:grid-cols-2 lg:items-stretch lg:justify-items-stretch"
							: "grid-cols-1 justify-items-center",
					)}
				>
					{hasComposite && product.allFacesImage && (
						<CompositeOverviewPanel
							allFacesImage={product.allFacesImage}
							productName={productName}
							compositeAlt={compositeAlt}
							onOpenLightbox={() => setIsCompositeLightboxOpen(true)}
							onImageError={() => setIsCompositeImageVisible(false)}
							className={cn("w-full max-w-4xl", showSideBySide && "lg:max-w-none")}
						/>
					)}

					{hasDemoPanel && (
						<DemoWorkCarouselPanel
							demoWorkImages={demoWorkImages}
							productName={productName}
							activeDemoIndex={activeDemoIndex}
							onSelectDemo={goToDemoByIndex}
							onPreviousDemo={goToPreviousDemo}
							onNextDemo={goToNextDemo}
							onOpenLightbox={openDemoLightbox}
							onPauseAutoPlay={() => setIsDemoAutoPlayPaused(true)}
							onResumeAutoPlay={resumeDemoAutoPlay}
							fillHeight={showSideBySide}
							className={cn("w-full max-w-4xl", showSideBySide && "lg:max-w-none")}
						/>
					)}
				</div>
			</div>

			<AnimatePresence>
				{isDemoLightboxOpen && activeDemoImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeDemoLightbox}
						className="bg-sapphire-deep/95 fixed inset-0 z-50 flex cursor-default items-center justify-center p-4 backdrop-blur-md sm:p-6"
					>
						<button
							type="button"
							onClick={closeDemoLightbox}
							className="text-linen hover:text-champagne absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center text-2xl font-light transition-colors sm:top-6 sm:right-6 sm:text-3xl"
							aria-label={tDetail("lightboxClose")}
						>
							✕
						</button>

						{hasMultipleDemoWork && (
							<>
								<p className="text-footnote text-linen absolute top-5 left-1/2 z-[60] -translate-x-1/2 font-sans tracking-[0.15em] uppercase sm:top-6">
									{tDetail("demoWorkLightboxCounter", {
										current: activeDemoIndex + 1,
										total: demoWorkCount,
									})}
								</p>
								<IconButton
									variant="galleryOverlay"
									onClick={(event) => {
										event.stopPropagation();
										goToPreviousDemo();
									}}
									className="absolute top-1/2 left-2 z-[60] sm:left-4"
									aria-label={tDetail("demoWorkLightboxPrevious")}
								>
									<ChevronLeft className="h-5 w-5" aria-hidden />
								</IconButton>
								<IconButton
									variant="galleryOverlay"
									onClick={(event) => {
										event.stopPropagation();
										goToNextDemo();
									}}
									className="absolute top-1/2 right-2 z-[60] sm:right-4"
									aria-label={tDetail("demoWorkLightboxNext")}
								>
									<ChevronRight className="h-5 w-5" aria-hidden />
								</IconButton>
							</>
						)}

						<motion.div
							key={activeDemoImage}
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							transition={{ duration: 0.25 }}
							className="relative z-[55] flex h-[calc(100vh-6rem)] w-full items-center justify-center"
							onClick={(event) => event.stopPropagation()}
						>
							<ZoomableImage
								src={encodePublicAssetPath(
									resolveDetailGalleryImagePath(activeDemoImage),
								)}
								alt={tDetail("demoWorkImageAlt", {
									productName,
									exampleNumber: activeDemoIndex + 1,
								})}
								fill
								sizes="95vw"
								className="object-contain"
								containerClassName="h-full w-full"
							/>
						</motion.div>
					</motion.div>
				)}

				{isCompositeLightboxOpen && product.allFacesImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsCompositeLightboxOpen(false)}
						className="bg-sapphire-deep/95 fixed inset-0 z-50 flex cursor-default items-center justify-center p-6 backdrop-blur-md"
					>
						<button
							type="button"
							onClick={() => setIsCompositeLightboxOpen(false)}
							className="text-linen hover:text-champagne absolute top-6 right-6 z-10 text-3xl font-light transition-colors"
							aria-label={tDetail("lightboxClose")}
						>
							✕
						</button>

						<motion.div
							initial={{ scale: 0.95 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.95 }}
							className="relative z-[55] flex h-[calc(100vh-6rem)] w-full items-center justify-center"
							onClick={(event) => event.stopPropagation()}
						>
							<ZoomableImage
								src={encodePublicAssetPath(
									resolveDetailGalleryImagePath(product.allFacesImage),
								)}
								alt={compositeAlt}
								fill
								sizes="90vw"
								className="object-contain"
								containerClassName="h-full w-full"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}
