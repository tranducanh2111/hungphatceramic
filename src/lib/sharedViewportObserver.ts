type ViewportIntersectionCallback = (isIntersecting: boolean) => void;

interface ObserverPool {
	observer: IntersectionObserver;
	callbacks: Map<Element, ViewportIntersectionCallback>;
}

const observerPools = new Map<string, ObserverPool>();

function getObserverPoolKey(rootMargin: string, threshold: number): string {
	return `${rootMargin}|${threshold}`;
}

function getOrCreateObserverPool(rootMargin: string, threshold: number): ObserverPool {
	const poolKey = getObserverPoolKey(rootMargin, threshold);
	const existingPool = observerPools.get(poolKey);
	if (existingPool) {
		return existingPool;
	}

	const callbacks = new Map<Element, ViewportIntersectionCallback>();
	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				callbacks.get(entry.target)?.(entry.isIntersecting);
			}
		},
		{ rootMargin, threshold },
	);

	const pool = { observer, callbacks };
	observerPools.set(poolKey, pool);
	return pool;
}

/** One IntersectionObserver per rootMargin — shared across catalog tiles. */
export function observeSharedViewportIntersection(
	element: Element,
	rootMargin: string,
	callback: ViewportIntersectionCallback,
): () => void {
	const pool = getOrCreateObserverPool(rootMargin, 0);
	pool.callbacks.set(element, callback);
	pool.observer.observe(element);

	return () => {
		pool.callbacks.delete(element);
		pool.observer.unobserve(element);

		if (pool.callbacks.size === 0) {
			pool.observer.disconnect();
			observerPools.delete(getObserverPoolKey(rootMargin, 0));
		}
	};
}
