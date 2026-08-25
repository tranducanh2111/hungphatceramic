"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Text } from "@/components/ui";
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
					{activeItem.label}
				</span>
			</div>

			{/* Main High-Resolution Preview Area */}
			<div
				className={cn(
					"bg-sapphire-ocean/30 border-sapphire-mist/30 relative w-full flex-1 cursor-zoom-in overflow-hidden rounded-xl border",
					fillHeight ? "min-h-[14rem] sm:min-h-[18rem]" : "min-h-[14rem] aspect-[4/3] sm:min-h-[18rem]",
				)}
				onClick={() => onOpenLightbox(safeActiveIndex)}
			>
				<AnimatePresence mode="wait" initial={false}>
					<motion.div
						key={activeItem.src}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="group absolute inset-0"
					>
						<Image
							src={encodePublicAssetPath(resolveDetailGalleryImagePath(activeItem.src))}
							alt={currentAlt}
							fill
							sizes="(max-width: 1024px) 100vw, 50vw"
							className="ease-luxury object-contain object-center p-2 transition-transform duration-500 group-hover:scale-[1.015]"
							onError={onImageError}
						/>

						{/* Hover Zoom Hint Overlay */}
						<div className="bg-sapphire-deep/0 group-hover:bg-sapphire-deep/20 pointer-events-none absolute inset-0 flex items-center justify-center transition-colors duration-300">
							<span className="bg-champagne/90 text-sapphire-deep rounded-full p-2.5 text-sm font-semibold opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
								🔎
							</span>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Thumbnail Strip Switcher */}
			{hasMultipleItems && (
				<div className="mt-4 pt-2">
					<div
						className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-sapphire-mist/50"
						role="tablist"
						aria-label={tDetail("faceSwitcherAriaLabel")}
					>
						{items.map((item, index) => {
							const isActive = index === safeActiveIndex;
							return (
								<button
									key={item.id}
									type="button"
									role="tab"
									aria-selected={isActive}
									aria-label={item.label}
									onClick={() => onSelectFace(index)}
									className={cn(
										"group relative flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne",
										isActive
											? "border-champagne bg-champagne/15 text-linen shadow-sm ring-1 ring-champagne/50"
											: "border-sapphire-mist/40 bg-sapphire-ocean/40 text-linen/50 hover:border-champagne/40 hover:bg-sapphire-ocean/70 hover:text-linen/80",
									)}
								>
									{/* Small thumbnail preview */}
									<div className="border-sapphire-mist/40 relative h-6 w-6 shrink-0 overflow-hidden rounded border bg-sapphire-deep">
										<Image
											src={encodePublicAssetPath(resolveDetailGalleryImagePath(item.src))}
											alt=""
											fill
											sizes="24px"
											className="object-cover object-center"
										/>
									</div>

									{/* Tab Label */}
									<span className="text-[12px] font-sans font-medium whitespace-nowrap">
										{item.label}
									</span>
								</button>
							);
						})}
					</div>
				</div>
			)}

			<p className="text-footnote text-linen/40 mt-3 text-center font-sans">
				{productName} — {activeItem.label}
			</p>
		</div>
	);
}
