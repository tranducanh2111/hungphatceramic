"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IconButton, PaginationDots, Text } from "@/components/ui";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";
import { cn } from "@/lib/cn";

export interface TileSurfaceItem {
	id: string;
	type: "composite" | "face";
	src: string;
	label: string;
	faceNumber?: number;
}

export interface TileSurfacePanelProps {
	allFacesImage?: string;
	faceImages?: string[];
	productName: string;
	activeFaceIndex: number;
	onSelectFace: (index: number) => void;
	onPreviousFace?: () => void;
	onNextFace?: () => void;
	onOpenLightbox: (index: number) => void;
	onImageError?: () => void;
	fillHeight?: boolean;
	className?: string;
}

export function TileSurfacePanel({
	allFacesImage,
	faceImages = [],
	productName,
	activeFaceIndex,
	onSelectFace,
	onPreviousFace,
	onNextFace,
	onOpenLightbox,
	onImageError,
	fillHeight = false,
	className,
}: TileSurfacePanelProps) {
	const tDetail = useTranslations("pages.productDetail");

	// Build selectable items list: Composite first (if available), followed by individual faces
	const items: TileSurfaceItem[] = [];
	if (allFacesImage) {
		items.push({
			id: "composite",
			type: "composite",
			src: allFacesImage,
			label: tDetail("faceSwitcherTabAll"),
		});
	}

	faceImages.forEach((facePath, index) => {
		items.push({
			id: `face-${index + 1}`,
			type: "face",
			src: facePath,
			label: tDetail("faceSwitcherTabNumber", { number: index + 1 }),
			faceNumber: index + 1,
		});
	});

	if (items.length === 0) {
		return null;
	}

	const safeActiveIndex = Math.min(Math.max(0, activeFaceIndex), items.length - 1);
	const activeItem = items[safeActiveIndex];
	const hasMultipleItems = items.length > 1;

	const handlePrevious = () => {
		if (onPreviousFace) {
			onPreviousFace();
		} else {
			onSelectFace(safeActiveIndex > 0 ? safeActiveIndex - 1 : items.length - 1);
		}
	};

	const handleNext = () => {
		if (onNextFace) {
			onNextFace();
		} else {
			onSelectFace(safeActiveIndex < items.length - 1 ? safeActiveIndex + 1 : 0);
		}
	};

	const currentAlt =
		activeItem.type === "composite"
			? tDetail("facesOverviewCompositeAlt", { productName })
			: tDetail("faceImageAlt", {
					productName,
					faceNumber: activeItem.faceNumber ?? safeActiveIndex + 1,
				});

	return (
		<div
			className={cn(
				"shadow-luxury-md border-sapphire-mist/40 bg-sapphire-deep flex w-full flex-col overflow-hidden rounded-2xl border p-5 sm:p-6",
				fillHeight && "h-full",
				className,
			)}
		>
			{/* Top Header Label */}
			<div className="mb-4 flex items-center justify-between">
				<Text
					variant="label-sm"
					className="text-champagne/70 font-sans font-medium tracking-[0.12em] uppercase"
				>
					{activeItem.type === "composite"
						? tDetail("facesOverviewComposite")
						: tDetail("individualFaces", { count: faceImages.length })}
				</Text>
				<span className="border-sapphire-mist/60 bg-sapphire-ocean/80 text-linen/60 rounded-full border px-2.5 py-0.5 text-[11px] font-sans font-medium tracking-wider uppercase">
					{safeActiveIndex + 1} / {items.length} — {activeItem.label}
				</span>
			</div>

			{/* Main Interactive Carousel & High-Resolution Preview Area */}
			<div
				className={cn(
					"bg-sapphire-ocean/30 border-sapphire-mist/30 relative w-full flex-1 overflow-hidden rounded-xl border",
					fillHeight ? "min-h-[14rem] sm:min-h-[18rem]" : "min-h-[14rem] aspect-[4/3] sm:min-h-[18rem]",
				)}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.button
						type="button"
						key={activeItem.src}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.35, ease: "easeInOut" }}
						className="group absolute inset-0 z-[1] cursor-zoom-in text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
						onClick={() => onOpenLightbox(safeActiveIndex)}
						aria-label={tDetail("faceImageAlt", {
							productName,
							faceNumber: safeActiveIndex + 1,
						})}
					>
						<Image
							src={encodePublicAssetPath(resolveDetailGalleryImagePath(activeItem.src))}
							alt={currentAlt}
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="ease-luxury object-contain object-center p-3 transition-transform duration-500 group-hover:scale-[1.02]"
							onError={onImageError}
						/>

						{/* Hover Zoom Hint Overlay */}
						<div className="bg-sapphire-deep/0 group-hover:bg-sapphire-deep/20 pointer-events-none absolute inset-0 flex items-center justify-center transition-colors duration-300">
							<span className="bg-champagne/90 text-sapphire-deep rounded-full p-2.5 text-sm font-semibold opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
								🔎
							</span>
						</div>
					</motion.button>
				</AnimatePresence>

				{/* Carousel Navigation Buttons */}
				{hasMultipleItems && (
					<>
						<IconButton
							variant="gallery"
							onClick={(e) => {
								e.stopPropagation();
								handlePrevious();
							}}
							className="absolute top-1/2 left-3 z-20 -translate-y-1/2 sm:left-4"
							aria-label={tDetail("faceLightboxPrevious")}
						>
							<ChevronLeft className="h-5 w-5" aria-hidden />
						</IconButton>

						<IconButton
							variant="gallery"
							onClick={(e) => {
								e.stopPropagation();
								handleNext();
							}}
							className="absolute top-1/2 right-3 z-20 -translate-y-1/2 sm:right-4"
							aria-label={tDetail("faceLightboxNext")}
						>
							<ChevronRight className="h-5 w-5" aria-hidden />
						</IconButton>

						<PaginationDots
							tone="light"
							className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2"
							count={items.length}
							activeIndex={safeActiveIndex}
							onSelect={onSelectFace}
							getAriaLabel={(index) => items[index]?.label ?? `Item ${index + 1}`}
						/>
					</>
				)}
			</div>

			<p className="text-footnote text-linen/40 mt-3 text-center font-sans">
				{productName} — {activeItem.label}
			</p>
		</div>
	);
}
