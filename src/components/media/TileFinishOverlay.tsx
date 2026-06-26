import { cn } from "@/lib/cn";
import type { TileFinish } from "@/lib/products/inferTileFinish";
import type { ClassNameProp } from "@/types";

interface TileFinishOverlayProps extends ClassNameProp {
	finish: TileFinish;
}

/**
 * Hardware-accelerated CSS finish simulation (glossy / satin / matte).
 * Base layer is always visible; sweep layer pulses on a long idle cycle for contrast.
 */
export function TileFinishOverlay({ finish, className }: TileFinishOverlayProps) {
	const hasSweepLayer = finish !== "matte";
	const isGlossy = finish === "glossy";

	return (
		<div
			aria-hidden
			className={cn(
				"tile-finish-overlay pointer-events-none absolute inset-0 z-[1]",
				`tile-finish--${finish}`,
				className,
			)}
		>
			<div className="tile-finish-overlay__base" />
			{isGlossy && <div className="tile-finish-overlay__glaze" />}
			{hasSweepLayer && <div className="tile-finish-overlay__sweep" />}
		</div>
	);
}
