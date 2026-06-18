"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/cn";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DRAG_THRESHOLD_PX = 6; // px before a press is treated as a drag, not a click

// ─── Types ────────────────────────────────────────────────────────────────────

interface Point {
	x: number;
	y: number;
}

type BaseImageProps = Omit<ImageProps, "draggable">;

interface ZoomableImageProps extends BaseImageProps {
	/** Extra Tailwind classes applied to the outer wrapper `<div>`. */
	containerClassName?: string;
	/**
	 * Show a "Scroll to zoom · Click to zoom in" hint pill that fades after
	 * the first interaction.
	 */
	showHint?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

function computeMaxPan(rect: DOMRect, scale: number): Point {
	return {
		x: (rect.width * (scale - 1)) / 2,
		y: (rect.height * (scale - 1)) / 2,
	};
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * ZoomableImage — wraps `next/image` with scroll-wheel zoom and drag-to-pan.
 *
 * Interaction model:
 *  - **Scroll / trackpad pinch**: zooms in/out around the cursor.
 *  - **Click** (at 1×): zoom to 2.5× centred on the click point.
 *  - **Drag** (when zoomed): pans the image, clamped to bounds.
 *  - **Double-click** or **Escape**: resets to 1×.
 */
export function ZoomableImage({
	containerClassName,
	className,
	showHint = true,
	alt,
	...imageProps
}: ZoomableImageProps) {
	const containerRef = useRef<HTMLDivElement>(null);

	// Canonical source of truth — lives in a ref so native event callbacks
	// always read the latest value without re-subscribing.
	const transformRef = useRef({ scale: 1, x: 0, y: 0 });

	// React state drives re-renders (cursor class, hint, image style).
	const [displayTransform, setDisplayTransform] = useState({ scale: 1, x: 0, y: 0 });
	const [isHintVisible, setIsHintVisible] = useState(showHint);
	const [isDragging, setIsDragging] = useState(false);

	// ── Drag state (all refs — no re-render needed) ───────────────────────────
	const [isDragging, setIsDragging] = useState(false);
	const isDraggingRef = useRef(false);
	/** Pan-offset anchor: clientXY at mousedown minus the current translate. */
	const panAnchorRef = useRef<Point>({ x: 0, y: 0 });
	/** Raw clientXY at mousedown — for measuring drag distance only. */
	const pointerOriginRef = useRef<Point>({ x: 0, y: 0 });
	/**
	 * Set to true during mousemove when drag exceeds DRAG_THRESHOLD_PX.
	 * Cleared inside onClick (AFTER stopDragging runs) so we don't lose
	 * the flag due to event ordering: mouseup → stopDragging → click.
	 */
	const wasDraggingRef = useRef(false);

	// ── Helpers ───────────────────────────────────────────────────────────────

	const applyTransform = useCallback((scale: number, x: number, y: number) => {
		transformRef.current = { scale, x, y };
		setDisplayTransform({ scale, x, y });
	}, []);

	const resetTransform = useCallback(() => {
		applyTransform(1, 0, 0);
	}, [applyTransform]);

	const dismissHint = useCallback(() => {
		setIsHintVisible(false);
	}, []);

	// ── Scroll-wheel / trackpad zoom (native listener — passive:false) ─────────
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		function onWheel(event: WheelEvent) {
			event.preventDefault();
			event.stopPropagation();
			setIsHintVisible(false);

			const rect = container!.getBoundingClientRect();
			const { scale, x, y } = transformRef.current;

			const delta = event.deltaY * (event.deltaMode === 1 ? 30 : 1);
			const factor = 1 - delta / 300;
			const nextScale = clamp(scale * factor, MIN_SCALE, MAX_SCALE);
			if (nextScale === scale) return;

			const cursorX = event.clientX - rect.left;
			const cursorY = event.clientY - rect.top;
			const ratio = nextScale / scale;
			const rawX = cursorX - ratio * (cursorX - x);
			const rawY = cursorY - ratio * (cursorY - y);

			const maxPan = computeMaxPan(rect, nextScale);
			applyTransform(
				nextScale,
				clamp(rawX, -maxPan.x, maxPan.x),
				clamp(rawY, -maxPan.y, maxPan.y),
			);
		}

		container.addEventListener("wheel", onWheel, { passive: false });
		return () => container.removeEventListener("wheel", onWheel);
	}, [applyTransform]);

	// ── Escape key resets zoom ─────────────────────────────────────────────────
	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape" && transformRef.current.scale > 1) {
				resetTransform();
			}
		}
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [resetTransform]);

	// ── mousedown: begin tracking a potential drag ─────────────────────────────
	const handleMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		if (transformRef.current.scale <= 1) return;
		event.preventDefault();
		isDraggingRef.current = true;
		setIsDragging(true);
		wasDraggingRef.current = false; // reset for this press session
		panAnchorRef.current = {
			x: event.clientX - transformRef.current.x,
			y: event.clientY - transformRef.current.y,
		};
		pointerOriginRef.current = { x: event.clientX, y: event.clientY };
	}, []);

	// ── mousemove: pan + flag as drag when threshold exceeded ─────────────────
	const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (!isDraggingRef.current) return;
			event.preventDefault();

			const dist = Math.hypot(
				event.clientX - pointerOriginRef.current.x,
				event.clientY - pointerOriginRef.current.y,
			);

			if (dist > DRAG_THRESHOLD_PX) {
				// Once we cross the threshold, lock this press as a drag.
				wasDraggingRef.current = true;
			}

			const { scale } = transformRef.current;
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;

			const rawX = event.clientX - panAnchorRef.current.x;
			const rawY = event.clientY - panAnchorRef.current.y;
			const maxPan = computeMaxPan(rect, scale);
			applyTransform(
				scale,
				clamp(rawX, -maxPan.x, maxPan.x),
				clamp(rawY, -maxPan.y, maxPan.y),
			);
		},
		[applyTransform],
	);

	// ── mouseup / mouseleave: stop dragging (do NOT clear wasDraggingRef here)─
	const stopDragging = useCallback(() => {
		// Only stop the active drag — wasDraggingRef stays true until onClick
		// consumes it so the click event (which fires after mouseup) can read it.
		isDraggingRef.current = false;
		setIsDragging(false);
	}, []);

	// ── click: zoom in, or reset — but skip if this was a drag ────────────────
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();

			// Read and immediately clear the drag flag.
			const wasDrag = wasDraggingRef.current;
			wasDraggingRef.current = false;

			if (wasDrag) return; // suppress — user was panning, not clicking

			const { scale } = transformRef.current;

			if (scale > 1) {
				resetTransform();
				return;
			}

			dismissHint();
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;

			const cursorX = event.clientX - rect.left - rect.width / 2;
			const cursorY = event.clientY - rect.top - rect.height / 2;
			const nextScale = 2.5;
			const maxPan = computeMaxPan(rect, nextScale);

			applyTransform(
				nextScale,
				clamp(-cursorX * (nextScale - 1), -maxPan.x, maxPan.x),
				clamp(-cursorY * (nextScale - 1), -maxPan.y, maxPan.y),
			);
		},
		[applyTransform, resetTransform, dismissHint],
	);

	// ── double-click: always reset ─────────────────────────────────────────────
	const handleDoubleClick = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			event.stopPropagation();
			wasDraggingRef.current = false;
			resetTransform();
		},
		[resetTransform],
	);

	const isZoomed = displayTransform.scale > 1;
	// isDraggingRef.current is a ref, reading it in render is stale — derive
	// cursor class from wasDraggingRef isn't right either; use a state flag.
	// Since we only need grab vs zoom-in, isZoomed is enough for the cursor.

	return (
		<div
			ref={containerRef}
			tabIndex={0}
			aria-label={
				isZoomed
					? "Zoom active — drag to pan, double-click to reset"
					: "Click or scroll to zoom"
			}
			className={cn(
				"relative overflow-hidden outline-none select-none",
				isZoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
				containerClassName,
			)}
			onClick={handleClick}
			onDoubleClick={handleDoubleClick}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={stopDragging}
			onMouseLeave={stopDragging}
		>
			<Image
				{...imageProps}
				alt={alt}
				draggable={false}
				className={cn("origin-center will-change-transform", className)}
				style={{
					transform: `translate(${displayTransform.x}px, ${displayTransform.y}px) scale(${displayTransform.scale})`,
					transition: isDragging ? "none" : "transform 0.2s ease-out",
				}}
			/>

			{isHintVisible && !isZoomed && (
				<span className="text-footnote text-linen/60 pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1 font-sans backdrop-blur-sm">
					Scroll to zoom · Click to zoom in
				</span>
			)}
		</div>
	);
}
