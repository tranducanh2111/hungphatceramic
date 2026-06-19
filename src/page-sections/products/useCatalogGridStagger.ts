import { useTransform } from "framer-motion";
import { useAppScroll } from "@/hooks/useAppScroll";

/** Pixels of page scroll over which the middle column reaches a half-card drop. */
const MIDDLE_COLUMN_SCROLL_RANGE_PX = 320;

export function useCatalogGridStagger() {
	const { scrollY } = useAppScroll();
	const middleColumnOffset = useTransform(
		scrollY,
		[0, MIDDLE_COLUMN_SCROLL_RANGE_PX],
		["0%", "50%"],
	);

	return { middleColumnOffset };
}
