"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Text } from "@/components/ui";
import { collectProductDemoWorkImages, encodePublicAssetPath } from "@/lib/products/media";
import { cn } from "@/lib/cn";
import { ProductDetail } from "@/types";

const DEMO_WORK_AUTO_ADVANCE_MS = 5000;

interface ProductDetailGalleryProps {
	product: ProductDetail;
}

/**
 * ProductDetailGallery — Composite face sheet (when available) plus PC-* install/demo carousel.
 */
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
	const showCompositeOverview = Boolean(product.allFacesImage) && isCompositeImageVisible;

	const activeDemoImage = demoWorkImages[activeDemoIndex];
	const carouselPauseRef = useRef({
		isAutoPlayPaused: isDemoAutoPlayPaused,
		isLightboxOpen: isDemoLightboxOpen,
	});

	carouselPauseRef.current = {
		isAutoPlayPaused: isDemoAutoPlayPaused,
		isLightboxOpen: isDemoLightboxOpen,
	};

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
		setActiveDemoIndex(0);
		setIsDemoAutoPlayPaused(false);
		setIsDemoLightboxOpen(false);
	}, [product.slug]);

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

	return (
		<section className="relative bg-sapphire-ocean px-6 py-24 text-linen lg:px-12">
			<div className="absolute right-0 bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-sapphire-mist/35 to-transparent" />

			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<Text
						variant="label"
						className="mb-4 font-sans font-medium tracking-[0.2em] text-champagne uppercase"
					>
						{tDetail("demoWork")}
					</Text>
					<h2 className="text-h2 font-serif font-light text-linen">{productName}</h2>
					<div className="mx-auto mt-4 h-px w-16 bg-champagne/30" />
				</div>

				{showCompositeOverview && product.allFacesImage && (
					<div className="shadow-luxury-md mb-16 overflow-hidden rounded-2xl border border-sapphire-mist/40 bg-sapphire-deep p-6">
						<Text
							variant="label-sm"
							className="mb-4 block text-center font-sans font-medium tracking-[0.1em] text-champagne/60 uppercase"
						>
							{tDetail("facesOverviewComposite")}
						</Text>
						<div
							className="relative min-h-[12rem] w-full cursor-zoom-in overflow-hidden rounded-xl bg-sapphire-deep sm:min-h-[16rem] lg:min-h-[20rem]"
							onClick={() => setIsCompositeLightboxOpen(true)}
						>
							<Image
								src={encodePublicAssetPath(product.allFacesImage)}
								alt={tDetail("facesOverviewCompositeAlt", { productName })}
								fill
								unoptimized
								sizes="100vw"
								className="ease-luxury object-contain object-center transition-transform duration-700 hover:scale-[1.01]"
								onError={() => setIsCompositeImageVisible(false)}
							/>
						</div>
					</div>
				)}

				{hasDemoWork && activeDemoImage && (
					<div
						className="shadow-luxury-md relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-sapphire-mist/40 bg-sapphire-deep"
						onMouseEnter={() => setIsDemoAutoPlayPaused(true)}
						onMouseLeave={resumeDemoAutoPlay}
						onFocusCapture={() => setIsDemoAutoPlayPaused(true)}
						onBlurCapture={(event) => {
							if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
								resumeDemoAutoPlay();
							}
						}}
					>
						<div className="relative aspect-[4/3] w-full bg-sapphire-deep">
							<AnimatePresence mode="wait" initial={false}>
								<motion.button
									type="button"
									key={activeDemoImage}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.45, ease: "easeInOut" }}
									className="group absolute inset-0 z-[1] cursor-zoom-in"
									onClick={openDemoLightbox}
									aria-label={tDetail("demoWorkZoom", {
										exampleNumber: activeDemoIndex + 1,
									})}
								>
									<Image
										src={encodePublicAssetPath(activeDemoImage)}
										alt={tDetail("demoWorkImageAlt", {
											productName,
											exampleNumber: activeDemoIndex + 1,
										})}
										fill
										unoptimized
										priority={activeDemoIndex === 0}
										sizes="(max-width: 896px) 100vw, 896px"
										className="ease-luxury object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
									/>
									<span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-sapphire-deep/0 transition-colors duration-300 group-hover:bg-sapphire-deep/25">
										<span className="rounded-full bg-champagne/90 p-2.5 text-sm font-semibold text-sapphire-deep opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
											🔎
										</span>
									</span>
								</motion.button>
							</AnimatePresence>

							{hasMultipleDemoWork && (
								<>
									<div
										className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-sapphire-deep/70 to-transparent"
										aria-hidden
									/>
									<div
										className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-sapphire-deep/80 to-transparent"
										aria-hidden
									/>

									<p className="text-footnote absolute top-4 left-1/2 z-20 -translate-x-1/2 font-sans tracking-[0.15em] text-linen uppercase">
										{tDetail("demoWorkLightboxCounter", {
											current: activeDemoIndex + 1,
											total: demoWorkCount,
										})}
									</p>

									<button
										type="button"
										onClick={goToPreviousDemo}
										className="absolute top-1/2 left-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-linen/20 bg-sapphire-deep/55 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne sm:left-4 sm:h-11 sm:w-11"
										aria-label={tDetail("demoWorkLightboxPrevious")}
									>
										<ChevronLeft className="h-5 w-5" aria-hidden />
									</button>

									<button
										type="button"
										onClick={goToNextDemo}
										className="absolute top-1/2 right-3 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-linen/20 bg-sapphire-deep/55 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne sm:right-4 sm:h-11 sm:w-11"
										aria-label={tDetail("demoWorkLightboxNext")}
									>
										<ChevronRight className="h-5 w-5" aria-hidden />
									</button>

									<div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
										{demoWorkImages.map((demoImage, index) => (
											<button
												key={demoImage}
												type="button"
												onClick={() => goToDemoByIndex(index)}
												aria-label={tDetail("demoWorkGoToExample", {
													exampleNumber: index + 1,
												})}
												aria-current={index === activeDemoIndex ? "true" : undefined}
												className={cn(
													"h-1.5 rounded-full transition-all duration-300",
													index === activeDemoIndex
														? "w-6 bg-champagne"
														: "w-1.5 bg-linen/40 hover:bg-champagne/60",
												)}
											/>
										))}
									</div>
								</>
							)}
						</div>
					</div>
				)}
			</div>

			<AnimatePresence>
				{isDemoLightboxOpen && activeDemoImage && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={closeDemoLightbox}
						className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-sapphire-deep/95 p-4 backdrop-blur-md sm:p-6"
					>
						<button
							type="button"
							onClick={closeDemoLightbox}
							className="absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center text-2xl font-light text-linen transition-colors hover:text-champagne sm:top-6 sm:right-6 sm:text-3xl"
							aria-label={tDetail("lightboxClose")}
						>
							✕
						</button>

						{hasMultipleDemoWork && (
							<>
								<p className="text-footnote absolute top-5 left-1/2 z-[60] -translate-x-1/2 font-sans tracking-[0.15em] text-linen uppercase sm:top-6">
									{tDetail("demoWorkLightboxCounter", {
										current: activeDemoIndex + 1,
										total: demoWorkCount,
									})}
								</p>
								<button
									type="button"
									onClick={(event) => {
										event.stopPropagation();
										goToPreviousDemo();
									}}
									className="absolute top-1/2 left-2 z-[60] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-linen/25 bg-sapphire-deep/90 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne sm:left-4"
									aria-label={tDetail("demoWorkLightboxPrevious")}
								>
									<ChevronLeft className="h-5 w-5" aria-hidden />
								</button>
								<button
									type="button"
									onClick={(event) => {
										event.stopPropagation();
										goToNextDemo();
									}}
									className="absolute top-1/2 right-2 z-[60] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-linen/25 bg-sapphire-deep/90 text-linen backdrop-blur-sm transition-colors hover:border-champagne/50 hover:text-champagne sm:right-4"
									aria-label={tDetail("demoWorkLightboxNext")}
								>
									<ChevronRight className="h-5 w-5" aria-hidden />
								</button>
							</>
						)}

						<motion.div
							key={activeDemoImage}
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							transition={{ duration: 0.25 }}
							className="relative z-[55] h-[85vh] w-full max-w-5xl px-12 sm:px-16"
							onClick={(event) => event.stopPropagation()}
						>
							<Image
								src={encodePublicAssetPath(activeDemoImage)}
								alt={tDetail("demoWorkImageAlt", {
									productName,
									exampleNumber: activeDemoIndex + 1,
								})}
								fill
								unoptimized
								sizes="95vw"
								className="object-contain"
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
						className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-sapphire-deep/95 p-6 backdrop-blur-md"
					>
						<button
							type="button"
							onClick={() => setIsCompositeLightboxOpen(false)}
							className="absolute top-6 right-6 z-10 text-3xl font-light text-linen transition-colors hover:text-champagne"
							aria-label={tDetail("lightboxClose")}
						>
							✕
						</button>

						<motion.div
							initial={{ scale: 0.95 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0.95 }}
							className="relative h-full max-h-[85vh] w-full max-w-4xl"
							onClick={(event) => event.stopPropagation()}
						>
							<Image
								src={encodePublicAssetPath(product.allFacesImage)}
								alt={tDetail("facesOverviewCompositeAlt", { productName })}
								fill
								unoptimized
								sizes="90vw"
								className="object-contain"
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</section>
	);
}