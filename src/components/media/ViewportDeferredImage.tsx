"use client";

import Image, { type ImageProps } from "next/image";
import { useViewportMediaLifecycle } from "@/hooks/useViewportMediaLifecycle";
import { cn } from "@/lib/cn";

export interface ViewportDeferredImageProps extends ImageProps {
	wrapperClassName?: string;
	placeholderClassName?: string;
	/** Keep mounted immediately (LCP / hero). */
	eager?: boolean;
	/** Unmount when far from viewport; disable for sticky scroll scenes that reuse one frame. */
	unloadWhenFar?: boolean;
	loadRootMargin?: string;
	unloadRootMargin?: string;
}

/**
 * next/image gated by viewport — loads near the user, unloads when scrolled away.
 */
export function ViewportDeferredImage({
	wrapperClassName,
	placeholderClassName,
	eager = false,
	unloadWhenFar = true,
	loadRootMargin,
	unloadRootMargin,
	className,
	alt,
	fill,
	...imageProps
}: ViewportDeferredImageProps) {
	const { containerRef, isMediaMounted } = useViewportMediaLifecycle({
		isDeferred: !eager && unloadWhenFar,
		loadRootMargin,
		unloadRootMargin,
	});

	const shouldRenderImage = eager || isMediaMounted;

	return (
		<div
			ref={containerRef}
			className={cn(fill ? "absolute inset-0" : "relative h-full w-full", wrapperClassName)}
		>
			{shouldRenderImage ? (
				<Image alt={alt} fill={fill} className={className} {...imageProps} />
			) : (
				<div
					className={cn(
						fill ? "absolute inset-0" : "h-full w-full",
						placeholderClassName ?? "bg-sapphire-mist/15",
					)}
					aria-hidden
				/>
			)}
		</div>
	);
}
