"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Text } from "@/components/ui";
import { collectProductDemoWorkImages } from "@/lib/products/media";
import type { LocalizedProductDetail } from "@/lib/products/localizeCatalog";
import { cn } from "@/lib/cn";
import { TileSurfacePanel } from "@/page-sections/products/TileSurfacePanel";
import { DemoWorkCarouselPanel } from "@/page-sections/products/DemoWorkCarouselPanel";
import { GalleryLightbox } from "@/page-sections/products/GalleryLightbox";
import { useDemoWorkCarousel } from "@/page-sections/products/useDemoWorkCarousel";

interface ProductDetailGalleryProps {
	product: LocalizedProductDetail;
}

interface FaceGalleryItem {
	src: string;
	label: string;
	alt: string;
}

/** ProductDetailGallery: Tile Surface / Face Switcher panel + Demo work install showcase carousel. */
export function ProductDetailGallery({ product }: ProductDetailGalleryProps) {
	const tDetail = useTranslations("pages.productDetail");

	const [activeFaceIndex, setActiveFaceIndex] = useState(0);
	const [isFaceLightboxOpen, setIsFaceLightboxOpen] = useState(false);
	const [isSurfaceSectionVisible, setIsSurfaceSectionVisible] = useState(true);

	// Assemble all face gallery items (composite sheet first, then each individual face)
	const faceGalleryItems = useMemo<FaceGalleryItem[]>(() => {
		const list: FaceGalleryItem[] = [];
		if (product.allFacesImage) {
			list.push({
				src: product.allFacesImage,
				label: tDetail("faceSwitcherTabAll"),
				alt: tDetail("facesOverviewCompositeAlt", { productName: product.title }),
			});
		}

		product.faceImages?.forEach((facePath, index) => {
			list.push({
				src: facePath,
				label: tDetail("faceSwitcherTabNumber", { number: index + 1 }),
				alt: tDetail("faceImageAlt", {
					productName: product.title,
					faceNumber: index + 1,
				}),
			});
		});

		return list;
	}, [product.allFacesImage, product.faceImages, product.title, tDetail]);

	const faceCount = faceGalleryItems.length;
	const hasFaces = faceCount > 0 && isSurfaceSectionVisible;
	const hasMultipleFaces = faceCount > 1;

	const safeFaceIndex = Math.min(Math.max(0, activeFaceIndex), Math.max(0, faceCount - 1));
	const currentFaceItem = faceGalleryItems[safeFaceIndex];

	const goToPreviousFace = () => {
		setActiveFaceIndex((prev) => (prev > 0 ? prev - 1 : faceCount - 1));
	};

	const goToNextFace = () => {
		setActiveFaceIndex((prev) => (prev < faceCount - 1 ? prev + 1 : 0));
	};

	const openFaceLightbox = (index: number) => {
		setActiveFaceIndex(index);
		setIsFaceLightboxOpen(true);
	};

	const closeFaceLightbox = () => {
		setIsFaceLightboxOpen(false);
	};

	// Demo Work Carousel
	const demoWorkImages = collectProductDemoWorkImages(product);
	const demoWorkCount = demoWorkImages.length;
	const hasDemoWork = demoWorkCount > 0;
	const hasMultipleDemoWork = demoWorkCount > 1;

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

	if (!hasFaces && !hasDemoPanel) {
		return null;
	}

	const showSideBySide = hasFaces && hasDemoPanel;

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
					{hasFaces && (
						<TileSurfacePanel
							allFacesImage={product.allFacesImage}
							faceImages={product.faceImages}
							productName={product.title}
							activeFaceIndex={safeFaceIndex}
							onSelectFace={setActiveFaceIndex}
							onOpenLightbox={openFaceLightbox}
							onImageError={() => setIsSurfaceSectionVisible(false)}
							fillHeight={showSideBySide}
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
				isFaceLightboxOpen={isFaceLightboxOpen}
				closeFaceLightbox={closeFaceLightbox}
				activeFaceImage={currentFaceItem?.src}
				activeFaceIndex={safeFaceIndex}
				faceCount={faceCount}
				hasMultipleFaces={hasMultipleFaces}
				activeFaceLabel={currentFaceItem?.label ?? ""}
				activeFaceAlt={currentFaceItem?.alt ?? ""}
				goToPreviousFace={goToPreviousFace}
				goToNextFace={goToNextFace}
			/>
		</section>
	);
}
