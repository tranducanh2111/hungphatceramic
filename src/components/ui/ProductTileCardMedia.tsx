"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

interface ProductTileCardMediaProps {
	imageSrc: string;
	hoverImageSrc?: string;
	imageAlt: string;
	isMediaMounted?: boolean;
	priority?: boolean;
	imageSizes?: string;
}

/** Catalog tile media (thumbnail always, install preview mounts only on hover-capable pointers). */
export function ProductTileCardMedia({
	imageSrc,
	hoverImageSrc,
	imageAlt,
	isMediaMounted = true,
	priority = false,
	imageSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: ProductTileCardMediaProps) {
	const [isHoverPreviewActive, setIsHoverPreviewActive] = useState(false);
	const [isHoverPreviewUnavailable, setIsHoverPreviewUnavailable] = useState(false);
	const hasHoverPreview = Boolean(hoverImageSrc) && !isHoverPreviewUnavailable;

	const handlePointerEnter = useCallback(() => {
		if (!isMediaMounted || !hasHoverPreview || !window.matchMedia("(hover: hover)").matches) {
			return;
		}

		setIsHoverPreviewActive(true);
	}, [hasHoverPreview, isMediaMounted]);

	const handleHoverPreviewError = useCallback(() => {
		setIsHoverPreviewUnavailable(true);
		setIsHoverPreviewActive(false);
	}, []);

	const handlePointerLeave = useCallback(() => {
		setIsHoverPreviewActive(false);
	}, []);

	const isHoverPreviewVisible = isHoverPreviewActive && isMediaMounted;

	if (!isMediaMounted) {
		return <div className="bg-sapphire-mist/15 absolute inset-0" aria-hidden />;
	}

	return (
		<div
			className="ease-luxury absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
			onPointerEnter={handlePointerEnter}
			onPointerLeave={handlePointerLeave}
		>
			<Image
				src={imageSrc}
				alt={imageAlt}
				fill
				sizes={imageSizes}
				quality={55}
				loading={priority ? undefined : "lazy"}
				className={cn(
					"object-cover object-center transition-opacity duration-500",
					isHoverPreviewVisible && "opacity-0",
				)}
				priority={priority}
			/>
			{hasHoverPreview && hoverImageSrc && isHoverPreviewVisible && (
				<Image
					src={hoverImageSrc}
					alt=""
					aria-hidden
					fill
					sizes={imageSizes}
					quality={55}
					className="object-cover object-center opacity-100 transition-opacity duration-500"
					onError={handleHoverPreviewError}
				/>
			)}
		</div>
	);
}
