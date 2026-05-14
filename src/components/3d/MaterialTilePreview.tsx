"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import type { SizePreview } from "@/constants/landing";

// Visual width/height (px) per tile size — preserves real-world aspect ratios.
const TILE_DIMS: Record<string, { w: number; h: number }> = {
	"60×120cm": { w: 68, h: 136 },
	"80×80cm": { w: 108, h: 108 },
};

const FALLBACK_DIMS = { w: 96, h: 96 };

const TILE_DEPTH_PX = 6;

interface MaterialTilePreviewProps {
	previews: SizePreview[];
}

interface InteractiveTileShardProps {
	image: string;
	width: number;
	height: number;
	reduceMotion: boolean | null;
}

/**
 * Draggable 3-D slab: Y = spin, X = tilt. Spring returns tilt to a soft rest pose.
 * Idle: barely perceptible sway until the guest begins dragging.
 */
function InteractiveTileShard({
	image,
	width,
	height,
	reduceMotion,
}: InteractiveTileShardProps) {
	const rotateY = useMotionValue(0);
	const rotateXTarget = useMotionValue(14);
	const rotateX = useSpring(rotateXTarget, {
		stiffness: 160,
		damping: 26,
		mass: 0.75,
	});

	const draggingRef = useRef(false);

	const encodedSrc = encodeURI(image);

	const handlePointerDown = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (reduceMotion) return;
			draggingRef.current = true;
			event.currentTarget.setPointerCapture(event.pointerId);
		},
		[reduceMotion],
	);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (!draggingRef.current || reduceMotion) return;
			rotateY.set(rotateY.get() + event.movementX * 0.52);
			rotateXTarget.set(
				Math.max(-24, Math.min(38, rotateXTarget.get() - event.movementY * 0.3)),
			);
		},
		[reduceMotion, rotateXTarget, rotateY],
	);

	const handlePointerUp = useCallback(
		(event: React.PointerEvent<HTMLDivElement>) => {
			if (!draggingRef.current) return;
			draggingRef.current = false;
			rotateXTarget.set(14);
			try {
				event.currentTarget.releasePointerCapture(event.pointerId);
			} catch {
				// Pointer may already be released.
			}
		},
		[rotateXTarget],
	);

	useEffect(() => {
		if (!reduceMotion) {
			rotateXTarget.set(14);
		}
	}, [reduceMotion, rotateXTarget]);

	return (
		<motion.div
			className="relative shrink-0 cursor-grab touch-none active:cursor-grabbing [transform-style:preserve-3d]"
			style={{
				width,
				height,
				rotateX,
				rotateY,
			}}
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={handlePointerUp}
			onPointerCancel={handlePointerUp}
			onLostPointerCapture={handlePointerUp}
			role="img"
			aria-label="Material sample — drag horizontally to rotate in 3D"
		>
			{/* Front — full texture */}
			<div
				className="absolute inset-0 overflow-hidden rounded-sm shadow-[0_18px_48px_rgba(0,0,0,0.55),0_0_0_1px_rgba(212,184,134,0.22)]"
				style={{
					transform: `translateZ(${TILE_DEPTH_PX}px)`,
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
				}}
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
					className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/18 via-transparent to-black/25"
					style={{ mixBlendMode: "overlay" }}
				/>
				<div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-[#D4B886]/25 ring-inset" />
			</div>

			{/* Back — darker echo so rotation reads as a solid object */}
			<div
				className="absolute inset-0 overflow-hidden rounded-sm bg-[#040F1A]"
				style={{
					transform: `rotateY(180deg) translateZ(${TILE_DEPTH_PX}px)`,
					backfaceVisibility: "hidden",
					WebkitBackfaceVisibility: "hidden",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-br from-[#0B1D30] via-[#09182A] to-[#040F1A]" />
			</div>

			{/* Thin edge slab */}
			<div
				className="absolute inset-0 rounded-sm bg-[#0A1624]"
				style={{ transform: `translateZ(-${TILE_DEPTH_PX}px)` }}
				aria-hidden
			/>
		</motion.div>
	);
}

/**
 * Product tile previews: real imagery, correct aspect ratio, luxury 3-D drag.
 */
export function MaterialTilePreview({ previews }: MaterialTilePreviewProps) {
	const reduceMotion = useReducedMotion();

	return (
		<div className="absolute top-4 right-6 z-20 flex items-start gap-4 opacity-[0.48] transition-opacity duration-700 [perspective:960px] group-hover:opacity-95">
			{previews.map(({ size, image }) => {
				const { w, h } = TILE_DIMS[size] ?? FALLBACK_DIMS;

				if (reduceMotion) {
					return (
						<div
							key={size}
							className="relative shrink-0 overflow-hidden rounded-sm shadow-[0_14px_36px_rgba(0,0,0,0.45),0_0_0_1px_rgba(212,184,134,0.2)]"
							style={{ width: w, height: h }}
						>
							<Image
								src={encodeURI(image)}
								alt=""
								fill
								className="object-cover"
								sizes={`${w}px`}
							/>
						</div>
					);
				}

				return (
					<InteractiveTileShard
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
