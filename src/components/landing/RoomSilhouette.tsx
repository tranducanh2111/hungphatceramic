"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Path data ────────────────────────────────────────────────────────────────
//
// ViewBox: 1600 × 700
// 1-point perspective. Vanishing point: VP = (800, 295)
// Back wall rect: (440, 110) – (1160, 530)
//
// Coordinate notes
//  · Floor trapezoid: 0,700 — 440,530 — 1160,530 — 1600,700
//  · All furnishings sit on the floor plane
//  · Crown molding runs parallel & slightly inside each wall/ceiling edge
//  · Tile grid lines: horizontals foreshortened by perspective; verticals converge to VP

// ── Stage 1 — Empty shell ─────────────────────────────────────────────────────
//    Draws as the section enters the viewport from below.
const SHELL_PATHS = [
	// Back wall
	"M 440 110 L 1160 110 L 1160 530 L 440 530 Z",
	// Floor plane
	"M 0 700 L 440 530 L 1160 530 L 1600 700 Z",
	// Left wall
	"M 0 0 L 440 110 L 440 530 L 0 700 Z",
	// Right wall
	"M 1600 0 L 1160 110 L 1160 530 L 1600 700 Z",
	// Ceiling plane
	"M 0 0 L 440 110 L 1160 110 L 1600 0 Z",
	// Crown molding — back wall top + left/right ceiling joins
	"M 440 119 L 1160 119  M 0 7 L 440 119  M 1160 119 L 1600 7",
	// Baseboard — back wall base + left/right floor joins
	"M 440 521 L 1160 521  M 0 693 L 440 521  M 1160 521 L 1600 693",
	// Right-wall subtle vertical grain lines (hint of surface texture)
	"M 1180 125 L 1600 10  M 1240 140 L 1600 35  M 1310 158 L 1600 70  M 1380 178 L 1600 110",
];

// ── Stage 2 — Architectural surfaces ─────────────────────────────────────────
//    Draws as the section approaches the viewport centre.
const SURFACE_PATHS = [
	// Window — outer frame (right side of back wall)
	"M 830 160 L 1120 160 L 1120 452 L 830 452 Z",
	// Window — inner frame reveal + mullions
	"M 842 172 L 1108 172 L 1108 440 L 842 440 Z  M 842 306 L 1108 306  M 975 172 L 975 440",
	// Window — sill with depth
	"M 820 452 L 1130 452 L 1130 466 L 820 466",
	// Door — arched frame (left side of back wall)
	"M 502 291 L 502 530 L 668 530 L 668 291  M 502 291 Q 585 232 668 291",
	// Door — stile/rail panels + handle
	"M 513 298 L 657 298 L 657 526 L 513 526 Z  M 524 309 L 646 309 L 646 390 L 524 390 Z  M 524 402 L 646 402 L 646 518 L 524 518 Z  M 638 457 L 638 446 Q 645 440 652 446 L 652 457",
	// Chair rail across non-door/window back wall
	"M 670 374 L 1160 374",
	// Wainscoting panel verticals + mid-rails (between door and window)
	"M 702 376 L 702 521  M 762 376 L 762 521  M 822 376 L 822 521  M 702 448 L 760 448  M 764 448 L 820 448",
	// Recessed ceiling lights — 3 foreshortened ellipses
	"M 680 113 Q 700 107 720 113 Q 700 119 680 113 Z  M 782 110 Q 800 104 818 110 Q 800 116 782 110 Z  M 884 113 Q 904 107 924 113 Q 904 119 884 113 Z",
	// Floor tile grid — perspective-foreshortened horizontal lines
	// x-bounds computed: x_left = 440*(1-t), x_right = 1160 + t*440, t=(y-530)/170
	"M 401 545 L 1199 545  M 360 560 L 1240 560  M 310 578 L 1290 578  M 255 598 L 1345 598  M 178 626 L 1422 626  M 90 659 L 1510 659",
	// Floor tile grid — vertical lines converging to VP(800,295)
	// each M x_near 700 L x_wall 530 where x_wall = x_near + 0.42*(800-x_near)
	"M 200 700 L 452 530  M 310 700 L 511 530  M 450 700 L 597 530  M 605 700 L 685 530  M 995 700 L 915 530  M 1150 700 L 1003 530  M 1295 700 L 1090 530  M 1400 700 L 1148 530",
];

// ── Stage 3 — Furnishings ─────────────────────────────────────────────────────
//    Completes as the section reaches the viewport centre, synced with count-up.
const FURNISHING_PATHS = [
	// Sofa — seat body (left side, perspective-adjusted)
	"M 50 492 L 308 444 L 308 534 L 50 584 Z",
	// Sofa — backrest
	"M 50 492 L 50 416 L 308 368 L 308 444",
	// Sofa — left arm box
	"M 30 424 L 30 594 L 50 584  M 30 424 L 50 416",
	// Sofa — right arm box
	"M 328 376 L 328 544 L 308 534  M 328 376 L 308 368",
	// Sofa — cushion seam lines + back cushion line + legs
	"M 128 471 L 128 554  M 202 458 L 202 539  M 260 448 L 260 527  M 58 430 L 300 383  M 72 584 L 72 602  M 164 558 L 164 578  M 246 536 L 246 556  M 296 526 L 296 546",
	// Pendant light — twin cords + shade
	"M 760 110 L 760 254  M 840 110 L 840 254  M 736 254 Q 800 238 864 254 L 854 296 Q 800 304 746 296 Z  M 741 257 Q 800 246 859 257",
	// Console / credenza body against back wall
	"M 590 434 L 970 434 L 970 438 L 590 438 Z  M 590 438 L 590 526 L 970 526 L 970 438",
	// Console — cabinet doors + handles + legs
	"M 620 445 L 780 445 L 780 519 L 620 519 Z  M 784 445 L 940 445 L 940 519 L 784 519 Z  M 692 483 L 706 483  M 854 483 L 868 483  M 604 526 L 604 536  M 644 526 L 644 536  M 894 526 L 894 536  M 934 526 L 934 536",
	// Console — decorative vase + stacked books on top
	"M 768 408 Q 757 389 762 370 Q 778 357 796 370 Q 802 389 791 408 Z  M 756 409 L 803 409  M 820 434 L 820 406 L 843 405 L 843 433  M 845 433 L 845 404 L 868 403 L 868 432",
	// Floor lamp — base, pole, arc-shade
	"M 1036 529 L 1065 529  M 1050 529 L 1050 352  M 1016 352 Q 1050 327 1084 352 L 1073 388 Q 1050 398 1027 388 Z  M 1021 355 Q 1050 367 1079 355",
	// Area rug — outer + inner border
	"M 246 618 Q 600 556 1054 618 Q 600 680 246 618 Z  M 306 614 Q 600 564 994 614 Q 600 664 306 614 Z",
	// Occasional side table (beside sofa) + vase on it
	"M 316 490 L 374 476 L 374 544 L 316 558 Z  M 330 474 Q 325 461 328 450 Q 340 443 352 450 Q 356 461 351 474",
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * RoomSilhouette — scroll-driven SVG room sketch.
 *
 * `scrollYProgress` (via `useScroll` on its own bounding box) drives three
 * `useTransform` motion values — one per stage — each mapped to `pathLength`.
 * No `animate`/`variants` are used; the drawing position at any frame is a
 * pure function of the user's scroll position, so it works at any refresh rate.
 */
export function RoomSilhouette() {
	const ref = useRef<HTMLDivElement>(null);

	// offset ["start end","end start"]: 0 when element top hits viewport bottom,
	// 1 when element bottom hits viewport top — full entry-to-exit range.
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start end", "end start"],
	});

	// Stage 1 — shell starts drawing the moment the section enters from below
	const shellPath = useTransform(scrollYProgress, [0.05, 0.42], [0, 1]);
	const shellOpacity = useTransform(scrollYProgress, [0.05, 0.22], [0, 0.18]);

	// Stage 2 — surfaces draw as section approaches centre of viewport
	const surfacePath = useTransform(scrollYProgress, [0.22, 0.57], [0, 1]);
	const surfaceOpacity = useTransform(scrollYProgress, [0.22, 0.4], [0, 0.11]);

	// Stage 3 — furnishings complete around viewport centre, synced with count-up
	const furnishPath = useTransform(scrollYProgress, [0.4, 0.74], [0, 1]);
	const furnishOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 0.55]);

	return (
		<div ref={ref} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
			<svg
				viewBox="0 0 1600 700"
				preserveAspectRatio="xMidYMid slice"
				className="h-full w-full"
				fill="none"
				stroke="#D4B886"
				strokeLinecap="round"
				strokeLinejoin="round"
			>
				{/* ── Stage 1: Room shell ────────────────────────────────── */}
				{SHELL_PATHS.map((d, i) => (
					<motion.path
						key={`shell-${i}`}
						d={d}
						strokeWidth={0.8}
						style={{ pathLength: shellPath, opacity: shellOpacity }}
					/>
				))}

				{/* ── Stage 2: Architectural surfaces ───────────────────── */}
				{SURFACE_PATHS.map((d, i) => (
					<motion.path
						key={`surface-${i}`}
						d={d}
						strokeWidth={0.5}
						style={{ pathLength: surfacePath, opacity: surfaceOpacity }}
					/>
				))}

				{/* ── Stage 3: Furnishings ───────────────────────────────── */}
				{FURNISHING_PATHS.map((d, i) => (
					<motion.path
						key={`furnish-${i}`}
						d={d}
						strokeWidth={0.65}
						style={{ pathLength: furnishPath, opacity: furnishOpacity }}
					/>
				))}
			</svg>
		</div>
	);
}
