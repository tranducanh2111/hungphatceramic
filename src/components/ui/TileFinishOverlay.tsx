"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { inferTileFinish, type TileFinish } from "@/lib/products/tileFinish";

interface TileFinishOverlayProps {
	skuCode?: string;
	finish?: TileFinish;
	isHero?: boolean;
	className?: string;
}

/**
 * TileFinishOverlay component. Adds a responsive, high-end visual overlay
 * that represents glossy, matte, or satin surface finishes.
 */
export function TileFinishOverlay({
	skuCode,
	finish: directFinish,
	isHero = false,
	className,
}: TileFinishOverlayProps) {
	const finish = useMemo(() => {
		if (directFinish) return directFinish;
		if (skuCode) return inferTileFinish(skuCode);
		return "matte";
	}, [directFinish, skuCode]);

	return (
		<div
			className={cn(
				"pointer-events-none absolute inset-0 z-10 overflow-hidden select-none",
				className,
			)}
			aria-hidden
		>
			{/* Glossy Finish (GP / GS) */}
			{finish === "glossy" && (
				<>
					{/* Stationary Ambient Highlight */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-br from-white/12 via-white/2 to-transparent opacity-100 transition-opacity duration-500",
							isHero ? "from-white/16 via-white/3" : "",
						)}
					/>
					
					{/* Specular Shimmer Sweep */}
					<div
						className={cn(
							"absolute inset-[-100%] origin-center pointer-events-none",
							"bg-gradient-to-br from-transparent via-white/18 to-transparent",
							isHero
								? "via-white/24 animate-specular-sweep"
								: "via-white/20 translate-x-[-120%] translate-y-[-120%] rotate-[20deg] scale-150 group-hover:translate-x-[120%] group-hover:translate-y-[120%] transition-transform duration-[2400ms] ease-ease-out-expo",
						)}
					/>

					{/* Bottom Reflection Sheen */}
					<div
						className={cn(
							"absolute inset-x-0 bottom-0 h-[25%] bg-gradient-to-t from-white/8 to-transparent",
							isHero ? "from-white/12" : "",
						)}
					/>

					{/* High-contrast Vignette */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,transparent_60%,rgba(0,0,0,0.06)_100%)]" />
				</>
			)}

			{/* Satin Finish (SS) */}
			{finish === "satin" && (
				<>
					{/* Ambient Soft Glow */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-br from-white/8 via-white/1 to-transparent opacity-100 transition-opacity duration-500",
							isHero ? "from-white/10 via-white/2" : "",
						)}
					/>

					{/* Soft Shimmer Band */}
					<div
						className={cn(
							"absolute inset-[-100%] origin-center pointer-events-none",
							"bg-gradient-to-br from-transparent via-white/10 to-transparent",
							isHero
								? "via-white/14 animate-satin-sweep"
								: "via-white/12 translate-x-[-100%] translate-y-[-100%] rotate-[20deg] scale-150 group-hover:translate-x-[100%] group-hover:translate-y-[100%] transition-transform duration-[2800ms] ease-ease-out-expo",
						)}
					/>

					{/* Soft Bottom Sheen */}
					<div
						className={cn(
							"absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-white/5 to-transparent",
							isHero ? "from-white/8" : "",
						)}
					/>
				</>
			)}

			{/* Matte Finish (G or Default) */}
			{finish === "matte" && (
				<>
					{/* Diffuse Soft Veil */}
					<div
						className={cn(
							"absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-black/2 transition-opacity duration-700",
							isHero ? "from-white/6" : "",
						)}
					/>
					{/* Soft bottom warmth highlight for matte */}
					<div
						className={cn(
							"absolute inset-x-0 bottom-0 h-[15%] bg-gradient-to-t from-white/3 to-transparent",
							isHero ? "from-white/5" : "",
						)}
					/>
				</>
			)}
		</div>
	);
}
