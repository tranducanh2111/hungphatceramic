/** Blueprint vocabulary constants (pure SVG path data + metadata for the "Blueprint to Built" design motif, all rendering lives in BlueprintLine.tsx, this file is data-only). */

export type BlueprintVariant =
	| "survey" // Hero: survey horizon + tick marks (site selected)
	| "foundation" // Origin: L-shaped corner brackets — groundbreaking
	| "joint" // (legacy) structural rivet (still usable, but datum preferred)
	| "keystone" // Leadership: shallow arc with center mark (crown set)
	| "grid" // Clients: orthogonal grid paper (foundation laid)
	| "signature" // CTA: flowing approval line + cross-mark — drawing complete
	| "datum"; // Section boundary: full-width cut line with diamond ends + station ticks

/**
 * Determines how the reveal animation is driven.
 * - "pathLength": single continuous path reveals stroke-by-stroke (dramatic)
 * - "opacity": whole element fades in (compound shapes / background textures)
 */
export type BlueprintAnimation = "pathLength" | "opacity";

export interface BlueprintMeta {
	viewBox: string;
	animation: BlueprintAnimation;
}

export const BLUEPRINT_META: Record<BlueprintVariant, BlueprintMeta> = {
	survey: { viewBox: "0 0 900 50", animation: "pathLength" },
	foundation: { viewBox: "0 0 240 240", animation: "opacity" },
	joint: { viewBox: "0 0 500 80", animation: "opacity" },
	keystone: { viewBox: "0 0 900 70", animation: "pathLength" },
	grid: { viewBox: "0 0 400 300", animation: "opacity" },
	signature: { viewBox: "0 0 800 100", animation: "pathLength" },
	datum: { viewBox: "0 0 1000 20", animation: "pathLength" },
} as const;

/**
 * Shared stroke design tokens.
 * Used as constants in BlueprintLine.tsx (never inlined elsewhere).
 */
export const BLUEPRINT_TOKENS = {
	color: "#D4B886",
	opacitySketch: 0.25,
	opacityAnnotation: 0.45,
	strokeHairline: 0.6,
	strokeRegular: 1,
	strokeEmphasis: 1.4,
	dashSketch: "2 4",
	dashDimension: "5 10",
} as const;

// ─── Paths for pathLength-animated variants ───────────────────────────────────
// Each value is a single continuous SVG path `d` string so that pathLength reveals the stroke from start to finish in one pass.

/**
 * Horizontal survey line with 5 small triangular tick bumps (site markers).
 * Reads as: the land surveyor's first measurement across the site.
 */
export const SURVEY_PATH =
	"M 20 25 L 170 25 L 175 15 L 180 25 L 325 25 L 330 15 L 335 25 L 445 25 L 450 15 L 455 25 L 565 25 L 570 15 L 575 25 L 720 25 L 725 15 L 730 25 L 880 25";

/**
 * Shallow parabolic arc (vault spring) with a center-peak tick.
 * Reads as: the architectural keystone (the final stone that locks the arch).
 */
export const KEYSTONE_PATH = "M 60 62 Q 450 6 840 62 M 450 6 L 450 0 M 444 6 L 456 6";

/**
 * Flowing S-curve approval line ending in an architect's cross-mark.
 * Reads as: the principal's signature (the blueprint is approved).
 */
export const SIGNATURE_PATH =
	"M 50 50 C 180 10, 300 90, 420 50 C 540 10, 660 90, 740 50 M 730 40 L 750 60 M 730 60 L 750 40";

/**
 * Full-width section-cut datum line.
 * Diamonds at both ends; three triangular station ticks at thirds.
 * A single continuous path so pathLength draws it cleanly left-to-right.
 *
 * Reads as: the architect marking a phase boundary (one stage complete).
 */
export const DATUM_PATH =
	"M 0 10 L 4 6 L 8 10 L 4 14 L 0 10 L 248 10 L 250 5 L 252 10 L 498 10 L 500 5 L 502 10 L 748 10 L 750 5 L 752 10 L 992 10 L 996 6 L 1000 10 L 996 14 L 992 10";
