export interface SpiralGeometry {
	radius: number;
	verticalPitch: number;
	angularStep: number;
	cardWidth: number;
	cardHeight: number;
}

export interface SpiralSlot {
	x: number;
	y: number;
	z: number;
	rotateY: number;
}

export type SpiralCardSize = "lg" | "md";

export const SCROLL_VH_PER_CARD = 90;

export const SPRING_CONFIG = { stiffness: 80, damping: 22, mass: 0.6 } as const;

export const SPIRAL_CARD_FACE_CLIP_CLASS =
	"absolute inset-0 overflow-hidden rounded-[1.75rem] bg-sapphire-ocean [transform:translateZ(0.1px)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [box-shadow:inset_0_0_0_1px_rgba(212,184,134,0.14)]";

export const SPIRAL_CARD_ARTICLE_CLASS = "relative h-full w-full bg-sapphire-ocean";

export const SPIRAL_CARD_UI = {
	lg: {
		imageSizes: "(min-width: 1024px) 360px, 85vw",
		imageFade: "h-[26%]",
		overlay: "top-3 right-3 left-3 gap-2",
		titleBox: "rounded-lg px-2.5 py-1.5",
		titleVariant: "h6",
		year: "px-2 py-0.5 text-[10px] tracking-[0.12em]",
		bottom: "bottom-3 right-3 left-3",
		panel: "rounded-xl p-3",
		metaVariant: "footnote",
		stackGap: "mt-2",
	},
	md: {
		imageSizes: "(min-width: 768px) 300px, 85vw",
		imageFade: "h-[20%]",
		overlay: "top-2 right-2 left-2 gap-1.5",
		titleBox: "rounded-md px-2 py-1",
		titleVariant: "body-sm",
		year: "px-1.5 py-0.5 text-[9px] tracking-[0.1em]",
		bottom: "bottom-2 right-2 left-2",
		panel: "rounded-lg p-2",
		metaVariant: "caption",
		stackGap: "mt-1.5",
	},
} as const;

export const SPIRAL_CARD_BACK_UI = {
	lg: {
		body: "gap-2.5 px-4",
		brand: "text-[11px] tracking-[0.28em]",
		divider: "w-12",
		titleVariant: "h6",
		year: "text-[11px]",
	},
	md: {
		body: "gap-2 px-3",
		brand: "text-[10px] tracking-[0.24em]",
		divider: "w-10",
		titleVariant: "body-sm",
		year: "text-[10px]",
	},
} as const;

export const SPIRAL_PRESETS = {
	lg: {
		radius: 440,
		verticalPitch: 200,
		angularStep: 60,
		cardWidth: 360,
		cardHeight: 270,
	},
	md: {
		radius: 280,
		verticalPitch: 160,
		angularStep: 60,
		cardWidth: 300,
		cardHeight: 225,
	},
} as const satisfies Record<string, SpiralGeometry>;

export function resolveSpiralCardSize(cardWidth: number): SpiralCardSize {
	return cardWidth >= 330 ? "lg" : "md";
}
