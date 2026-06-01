import Image from "next/image";
import { cn } from "@/lib/cn";
import type { SizePreview } from "@/constants/landing";

// Visual width/height (px) per tile size — preserves real-world aspect ratios.
const TILE_DIMS: Record<string, { w: number; h: number }> = {
	"60×120cm": { w: 68, h: 136 },
	"80×80cm": { w: 108, h: 108 },
};

const FALLBACK_DIMS = { w: 96, h: 96 };

/** Transform-only hover — avoids animating box-shadow (main-thread heavy). */
const TILE_HOVER_TRANSITION_CLASS =
	"duration-[550ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none";

interface MaterialTilePreviewProps {
	previews: SizePreview[];
}

interface SpecimenTileProps {
	image: string;
	width: number;
	height: number;
}

/**
 * 2D specimen slab — GPU-friendly hover (transform only). No blend modes.
 */
function SpecimenTile({ image, width, height }: SpecimenTileProps) {
	const encodedSrc = encodeURI(image);

	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden rounded-sm shadow-[0_14px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(212,184,134,0.22)]",
				// Stronger shadow on hover/active without interpolating shadow (cheap snap).
				"group-hover:shadow-[0_22px_56px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,184,134,0.32)] group-active:shadow-[0_22px_56px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,184,134,0.32)]",
				"-rotate-6 transform-gpu transition-transform group-hover:scale-[1.05] group-hover:-rotate-3 group-active:scale-[1.05] group-active:-rotate-3",
				"motion-reduce:rotate-0 motion-reduce:group-hover:scale-100 motion-reduce:group-active:scale-100",
				TILE_HOVER_TRANSITION_CLASS,
			)}
			style={{ width, height }}
			aria-hidden="true"
		>
			<Image
				src={encodedSrc}
				alt=""
				fill
				className="object-cover"
				sizes="120px"
				quality={55}
				draggable={false}
			/>
			<div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-black/22" />
			<div className="ring-champagne/28 pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset" />
		</div>
	);
}

/**
 * Product tile previews — correct aspect ratio, light paint cost for scroll/hover.
 */
export function MaterialTilePreview({ previews }: MaterialTilePreviewProps) {
	return (
		<div className="pointer-events-none absolute top-4 right-6 z-20 flex items-start gap-4 opacity-[0.48] transition-opacity duration-500 group-hover:opacity-95 group-active:opacity-95">
			{previews.map(({ size, image }) => {
				const { w, h } = TILE_DIMS[size] ?? FALLBACK_DIMS;

				return <SpecimenTile key={size} image={image} width={w} height={h} />;
			})}
		</div>
	);
}
