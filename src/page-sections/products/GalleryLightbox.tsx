"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, ZoomableImage } from "@/components/ui";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";

export interface GalleryLightboxProps {
	isDemoLightboxOpen: boolean;
	closeDemoLightbox: () => void;
	activeDemoImage: string | undefined;
	activeDemoIndex: number;
	demoWorkCount: number;
	hasMultipleDemoWork: boolean;
	productName: string;
	goToPreviousDemo: () => void;
	goToNextDemo: () => void;
	isCompositeLightboxOpen: boolean;
	onCloseCompositeLightbox: () => void;
	allFacesImage: string | undefined;
	compositeAlt: string;
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
	isCompositeLightboxOpen,
	onCloseCompositeLightbox,
	allFacesImage,
	compositeAlt,
}: GalleryLightboxProps) {
	const tDetail = useTranslations("pages.productDetail");

	return (
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

			{isCompositeLightboxOpen && allFacesImage && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onCloseCompositeLightbox}
					className="bg-sapphire-deep/95 fixed inset-0 z-50 flex cursor-default items-center justify-center p-6 backdrop-blur-md"
				>
					<button
						type="button"
						onClick={onCloseCompositeLightbox}
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
								resolveDetailGalleryImagePath(allFacesImage),
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
	);
}
