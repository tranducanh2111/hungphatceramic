import type { SpiralGeometry, SpiralSlot } from "./constants";

export function computeSpiralSlot(
	index: number,
	totalCards: number,
	geometry: SpiralGeometry,
): SpiralSlot {
	const angle = index * geometry.angularStep;
	const angleRad = (angle * Math.PI) / 180;
	const totalHeight = (totalCards - 1) * geometry.verticalPitch;
	const centeredY = index * geometry.verticalPitch - totalHeight / 2;

	return {
		x: Math.sin(angleRad) * geometry.radius - geometry.cardWidth / 2,
		y: centeredY - geometry.cardHeight / 2,
		z: Math.cos(angleRad) * geometry.radius,
		rotateY: angle,
	};
}
