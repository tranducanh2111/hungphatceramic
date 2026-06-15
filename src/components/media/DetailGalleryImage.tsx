"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { encodePublicAssetPath, resolveDetailGalleryImagePath } from "@/lib/products/media";

interface DetailGalleryImageProps extends Omit<ImageProps, "src" | "onError"> {
	/** Canonical registry path (`.jpg` / `.png`). */
	assetPath: string;
	onAssetError?: () => void;
}

/**
 * Detail gallery image — prefers `.detail.webp` sidecar, falls back to registry original.
 */
export function DetailGalleryImage({
	assetPath,
	onAssetError,
	...imageProps
}: DetailGalleryImageProps) {
	const [useCanonicalSource, setUseCanonicalSource] = useState(false);

	const resolvedSrc = encodePublicAssetPath(
		useCanonicalSource ? assetPath : resolveDetailGalleryImagePath(assetPath),
	);

	const handleImageError = () => {
		if (!useCanonicalSource) {
			setUseCanonicalSource(true);
			return;
		}

		onAssetError?.();
	};

	return <Image {...imageProps} src={resolvedSrc} onError={handleImageError} />;
}
