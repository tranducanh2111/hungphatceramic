/** Production fallback when no env or Vercel host is available (e.g. misconfigured CI). */
const DEFAULT_PRODUCTION_SITE_URL = "https://perla.com.vn";

const LOCAL_DEV_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawUrl: string): string {
	const trimmed = rawUrl.trim();
	const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	return withProtocol.replace(/\/+$/, "");
}

function readExplicitSiteUrl(): string | undefined {
	const raw = process.env.SITE_URL?.trim() || process.env.NEXT_PUBLIC_SITE_URL?.trim();
	return raw ? normalizeSiteUrl(raw) : undefined;
}

/**
 * Resolves the public site origin for canonical URLs, sitemap, Open Graph, and JSON-LD.
 *
 * Set `SITE_URL` per Vercel environment so metadata always matches the deployed host:
 * - Production (main / perla.com.vn): `https://perla.com.vn`
 * - Preview / staging (perlaceramic.vercel.app): `https://perlaceramic.vercel.app`
 *
 * Resolution order:
 * 1. `SITE_URL` or `NEXT_PUBLIC_SITE_URL` (explicit — preferred)
 * 2. Vercel production domain (`VERCEL_PROJECT_PRODUCTION_URL`)
 * 3. Vercel deployment host (`VERCEL_URL`) for preview builds
 * 4. `http://localhost:3000` in local development
 * 5. `https://perla.com.vn` as a last-resort fallback
 */
export function resolveSiteUrl(): string {
	const explicit = readExplicitSiteUrl();
	if (explicit) {
		return explicit;
	}

	if (process.env.VERCEL === "1") {
		if (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
			return normalizeSiteUrl(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
		}

		if (process.env.VERCEL_URL) {
			return normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
		}
	}

	if (process.env.NODE_ENV === "development") {
		return LOCAL_DEV_SITE_URL;
	}

	return DEFAULT_PRODUCTION_SITE_URL;
}

/** Resolved once per server/build process for the active deployment. */
export const SITE_URL = resolveSiteUrl();
