import type Lenis from "lenis";

/** Scroll to an in-page anchor; prefers Lenis when the smooth-scroll provider is active. */
export function scrollToAnchorElement(
	elementId: string,
	lenis: Lenis | null | undefined,
	options?: { offset?: number },
): void {
	const targetElement = document.getElementById(elementId);
	if (!targetElement) {
		return;
	}

	const offset = options?.offset ?? 0;

	if (lenis) {
		lenis.scrollTo(targetElement, { offset });
		return;
	}

	targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
}
