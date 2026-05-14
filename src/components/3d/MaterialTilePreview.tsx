"use client";

import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { SizePreview } from "@/constants/landing";

// Visual width/height (px) per tile size — preserves real-world aspect ratios.
const TILE_DIMS: Record<string, { w: number; h: number }> = {
	"60×120cm": { w: 68, h: 136 },
	"80×80cm": { w: 108, h: 108 },
};

const FALLBACK_DIMS = { w: 96, h: 96 };
const TILE_HOVER_TRANSITION_CLASS =
	"duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

interface MaterialTilePreviewProps {
	previews: SizePreview[];
}

interface SpecimenTileProps {
	image: string;
	width: number;
	height: number;
	reduceMotion: boolean | null;
}

/**
 * 2D “specimen” slab — CSS-only tilt + hover lift. No 3D scene, no pointer tracking.
 * Attention comes from framing, shadow, and a subtle sheen (cheap compositor work).
 */
function SpecimenTile({ image, width, height, reduceMotion }: SpecimenTileProps) {
	const encodedSrc = encodeURI(image);

	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden rounded-sm shadow-[0_14px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,184,134,0.22)]",
				!reduceMotion &&
					cn(
						"-rotate-6 transform-gpu transition-[transform,box-shadow] group-hover:-rotate-3 group-hover:scale-[1.05] group-hover:shadow-[0_22px_56px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,184,134,0.32)] motion-reduce:rotate-0 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:shadow-[0_14px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,184,134,0.22)]",
						TILE_HOVER_TRANSITION_CLASS,
					),
			)}
			style={{ width, height }}
			aria-hidden
		>
			<Image
				src={encodedSrc}
				alt=""
				fill
				className="object-cover"
				sizes={`${width}px`}
				draggable={false}
			/>
			<div
				className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/16 via-transparent to-black/28"
				style={{ mixBlendMode: "overlay" }}
			/>
			<div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-champagne/28 ring-inset" />
		</div>
	);
}

/**
 * Product tile previews on material cards — real imagery, correct aspect ratio,
 * premium 2D presentation (performance-first; no 3D / drag).
 */
export function MaterialTilePreview({ previews }: MaterialTilePreviewProps) {
	const reduceMotion = useReducedMotion();

	return (
		<div className="pointer-events-none absolute top-4 right-6 z-20 flex items-start gap-4 opacity-[0.48] transition-opacity duration-700 group-hover:opacity-95">
			{previews.map(({ size, image }) => {
				const { w, h } = TILE_DIMS[size] ?? FALLBACK_DIMS;

				return (
					<SpecimenTile
						key={size}
						image={image}
						width={w}
						height={h}
						reduceMotion={reduceMotion}
					/>
				);
			})}
		</div>
	);
}
