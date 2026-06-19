export const NAV_CONTENT_GAP = 32;

/** Sum visible flex children + gaps ( regardless of justify-between attribute). */
export function measureVisibleContentWidth(contentEl: HTMLDivElement): number {
	const visibleChildren = Array.from(contentEl.children).filter(
		(child): child is HTMLElement =>
			child instanceof HTMLElement && child.getBoundingClientRect().width > 0,
	);

	if (visibleChildren.length === 0) return 0;

	const itemsWidth = visibleChildren.reduce(
		(total, child) => total + child.getBoundingClientRect().width,
		0,
	);

	return Math.ceil(itemsWidth + NAV_CONTENT_GAP * (visibleChildren.length - 1));
}
