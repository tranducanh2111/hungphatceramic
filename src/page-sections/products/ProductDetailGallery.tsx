"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { collectProductDemoWorkImages } from "@/lib/products/media";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";
import { cn } from "@/lib/cn";
import { CompositeOverviewPanel } from "@/page-sections/products/CompositeOverviewPanel";
import { DemoWorkCarouselPanel } from "@/page-sections/products/DemoWorkCarouselPanel";
import { GalleryLightbox } from "@/page-sections/products/GalleryLightbox";
import { useDemoWorkCarousel } from "@/page-sections/products/useDemoWorkCarousel";

interface ProductDetailGalleryProps {
	product: LocalizedProductDetail;
}

/** ProductDetailGallery (composite face sheet (when available) plus PC-* install/demo carousel). */
export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
	const tDetail = useTranslations("pages.productDetail");

	const [isCompositeLightboxOpen, setIsCompositeLightboxOpen] = useState(false);
	const [isCompositeImageVisible, setIsCompositeImageVisible] = useState(true);

	const demoWorkImages = collectProductDemoWorkImages(product);
	const demoWorkCount = demoWorkImages.length;
	const hasDemoWork = demoWorkCount > 0;
	const hasMultipleDemoWork = demoWorkCount > 1;
	const hasComposite = Boolean(product.allFacesImage) && isCompositeImageVisible;

	const {
		activeDemoIndex,
		isDemoLightboxOpen,
		goToPreviousDemo,
		goToNextDemo,
		goToDemoByIndex,
		openDemoLightbox,
		closeDemoLightbox,
		pauseDemoAutoPlay,
		resumeDemoAutoPlay,
	} = useDemoWorkCarousel({ demoWorkCount, hasMultipleDemoWork });

	const activeDemoImage = demoWorkImages[activeDemoIndex];
	const hasDemoPanel = hasDemoWork && Boolean(activeDemoImage);

	if (!hasComposite && !hasDemoPanel) {
		return null;
	}

	const showSideBySide = hasComposite && hasDemoPanel;
	const compositeAlt = tDetail("facesOverviewCompositeAlt", { productName: product.title });

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
						{product.title}
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
							productName={product.title}
							compositeAlt={compositeAlt}
							onOpenLightbox={() => setIsCompositeLightboxOpen(true)}
							onImageError={() => setIsCompositeImageVisible(false)}
							className={cn("w-full max-w-4xl", showSideBySide && "lg:max-w-none")}
						/>
					)}

					{hasDemoPanel && (
						<DemoWorkCarouselPanel
							demoWorkImages={demoWorkImages}
							productName={product.title}
							activeDemoIndex={activeDemoIndex}
							onSelectDemo={goToDemoByIndex}
							onPreviousDemo={goToPreviousDemo}
							onNextDemo={goToNextDemo}
							onOpenLightbox={openDemoLightbox}
							onPauseAutoPlay={pauseDemoAutoPlay}
							onResumeAutoPlay={resumeDemoAutoPlay}
							fillHeight={showSideBySide}
							className={cn("w-full max-w-4xl", showSideBySide && "lg:max-w-none")}
						/>
					)}
				</div>
			</div>

			<GalleryLightbox
				isDemoLightboxOpen={isDemoLightboxOpen}
				closeDemoLightbox={closeDemoLightbox}
				activeDemoImage={activeDemoImage}
				activeDemoIndex={activeDemoIndex}
				demoWorkCount={demoWorkCount}
				hasMultipleDemoWork={hasMultipleDemoWork}
				productName={product.title}
				goToPreviousDemo={goToPreviousDemo}
				goToNextDemo={goToNextDemo}
				isCompositeLightboxOpen={isCompositeLightboxOpen}
				onCloseCompositeLightbox={() => setIsCompositeLightboxOpen(false)}
				allFacesImage={product.allFacesImage}
				compositeAlt={compositeAlt}
			/>
		</section>
	);
}
