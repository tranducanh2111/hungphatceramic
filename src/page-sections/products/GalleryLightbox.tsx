"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, ZoomableImage } from "@/components/ui";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";

export interface GalleryLightboxProps {
	// Demo work lightbox props
	isDemoLightboxOpen: boolean;
	closeDemoLightbox: () => void;
	activeDemoImage: string | undefined;
	activeDemoIndex: number;
	demoWorkCount: number;
	hasMultipleDemoWork: boolean;
	productName: string;
	goToPreviousDemo: () => void;
	goToNextDemo: () => void;

	// Tile surface / Face switcher lightbox props
	isFaceLightboxOpen: boolean;
	closeFaceLightbox: () => void;
	activeFaceImage: string | undefined;
	activeFaceIndex: number;
	faceCount: number;
	hasMultipleFaces: boolean;
	activeFaceLabel: string;
	activeFaceAlt: string;
	goToPreviousFace: () => void;
	goToNextFace: () => void;
}

export function GalleryLightbox({
	isDemoLightboxOpen,
	closeDemoLightbox,
	activeDemoImage,
	activeDemoIndex,
	demoWorkCount,
	hasMultipleDemoWork,
	productName,
	goToPreviousDemo,
	goToNextDemo,
	isFaceLightboxOpen,
	closeFaceLightbox,
	activeFaceImage,
	activeFaceIndex,
	faceCount,
	hasMultipleFaces,
	activeFaceLabel,
	activeFaceAlt,
	goToPreviousFace,
	goToNextFace,
}: GalleryLightboxProps) {
	const tDetail = useTranslations("pages.productDetail");

	return (
		<AnimatePresence>
			{/* Demo Work Lightbox */}
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

			{/* Tile Face Lightbox */}
			{isFaceLightboxOpen && activeFaceImage && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={closeFaceLightbox}
					className="bg-sapphire-deep/95 fixed inset-0 z-50 flex cursor-default items-center justify-center p-4 backdrop-blur-md sm:p-6"
				>
					<button
						type="button"
						onClick={closeFaceLightbox}
						className="text-linen hover:text-champagne absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center text-2xl font-light transition-colors sm:top-6 sm:right-6 sm:text-3xl"
						aria-label={tDetail("lightboxClose")}
					>
						✕
					</button>

					{hasMultipleFaces && (
						<>
							<div className="absolute top-5 left-1/2 z-[60] -translate-x-1/2 text-center sm:top-6">
								<p className="text-footnote text-champagne font-sans font-medium tracking-[0.15em] uppercase">
									{activeFaceLabel}
								</p>
								<p className="text-linen/50 font-sans text-[11px] tracking-wider">
									{tDetail("faceLightboxCounter", {
										current: activeFaceIndex + 1,
										total: faceCount,
									})}
								</p>
							</div>

							<IconButton
								variant="galleryOverlay"
								onClick={(event) => {
									event.stopPropagation();
									goToPreviousFace();
								}}
								className="absolute top-1/2 left-2 z-[60] sm:left-4"
								aria-label={tDetail("faceLightboxPrevious")}
							>
								<ChevronLeft className="h-5 w-5" aria-hidden />
							</IconButton>
							<IconButton
								variant="galleryOverlay"
								onClick={(event) => {
									event.stopPropagation();
									goToNextFace();
								}}
								className="absolute top-1/2 right-2 z-[60] sm:right-4"
								aria-label={tDetail("faceLightboxNext")}
							>
								<ChevronRight className="h-5 w-5" aria-hidden />
							</IconButton>
						</>
					)}

					<motion.div
						key={activeFaceImage}
						initial={{ scale: 0.95, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.95, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="relative z-[55] flex h-[calc(100vh-6rem)] w-full items-center justify-center"
						onClick={(event) => event.stopPropagation()}
					>
						<ZoomableImage
							src={encodePublicAssetPath(
								resolveDetailGalleryImagePath(activeFaceImage),
							)}
							alt={activeFaceAlt}
							fill
							sizes="95vw"
							className="object-contain"
							containerClassName="h-full w-full"
						/>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
