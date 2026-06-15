import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Link } from "@/i18n/navigation";

/* ─── Variant Styles ─────────────────────────────────────────────────────────── */

const VARIANT_STYLES = {
	primary: [
		"bg-champagne text-sapphire-deep",
		"hover:bg-champagne-deep",
		"active:bg-champagne-deep",
		"focus-visible:ring-2 focus-visible:ring-champagne/50",
	].join(" "),

	secondary: [
		"bg-transparent text-linen border border-linen/20",
		"hover:border-champagne hover:text-champagne",
		"active:border-champagne-deep",
	].join(" "),

	ghost: ["bg-transparent text-linen", "hover:bg-sapphire-ocean hover:text-champagne"].join(" "),

	outline: [
		"bg-transparent text-champagne border border-champagne/40",
		"hover:bg-champagne/10",
		"active:bg-champagne/20",
	].join(" "),
} as const;

const SIZE_STYLES = {
	sm: "px-5 py-2 text-body-sm",
	md: "px-7 py-3 text-body-sm",
	lg: "px-9 py-4 text-body",
} as const;

type ButtonVariant = keyof typeof VARIANT_STYLES;
type ButtonSize = keyof typeof SIZE_STYLES;

/* ─── Shared Props ───────────────────────────────────────────────────────────── */

interface SharedButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	withShimmer?: boolean;
	className?: string;
	children: ReactNode;
}

/* ─── As <button> ────────────────────────────────────────────────────────────── */

type NativeButtonProps = SharedButtonProps &
	Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof SharedButtonProps> & {
		href?: never;
	};

/* ─── As <Link> (internal) or <a> (external) ─────────────────────────────────── */

type LinkButtonProps = SharedButtonProps &
	Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof SharedButtonProps> & {
		href: string;
		/** Open in new tab. Defaults to true for external URLs. */
		external?: boolean;
	};

export type ButtonProps = NativeButtonProps | LinkButtonProps;

/**
 * Button — Dual-purpose interactive element.
 *
 * Renders a `<button>` when no `href` is provided, or a Next.js `<Link>`
 * (or native `<a>` for external URLs) when `href` is set.
 *
 * @example
 * <Button variant="primary" size="lg">Get Started</Button>
 * <Button href={ROUTES.products} variant="secondary">Browse Products</Button> (import ROUTES from `@/constants/routes`)
 * <Button href="https://maps.google.com" external>Find Us</Button>
 */
export function Button(props: ButtonProps) {
	const { variant = "primary", size = "md", withShimmer = false, className, children, ...rest } = props;

	const baseStyles = cn(
		"inline-flex items-center justify-center gap-2",
		"rounded-full font-sans font-medium tracking-wide",
		"transition-colors duration-300 ease-luxury",
		"disabled:pointer-events-none disabled:opacity-40",
		"cursor-pointer select-none",
		VARIANT_STYLES[variant],
		SIZE_STYLES[size],
		withShimmer && "button-border-shimmer",
		className,
	);

	const shimmerLabelClass = cn(
		"button-shimmer-label",
		variant === "primary" && "button-shimmer-label-inverse",
	);

	const content = withShimmer ? (
		<span className={shimmerLabelClass}>{children}</span>
	) : (
		children
	);

	/* ── Link variant ───────────────────────────────────────────────────────── */
	if ("href" in rest && rest.href) {
		const { href, external, ...anchorRest } = rest as LinkButtonProps;
		const isHash = href.startsWith("#");
		const isExternal = external ?? (href.startsWith("http") || isHash);

		if (isExternal) {
			return (
				<a
					href={href}
					className={baseStyles}
					{...(!isHash ? { target: "_blank", rel: "noopener noreferrer" } : {})}
					{...anchorRest}
				>
					{content}
				</a>
			);
		}

		return (
			<Link href={href} className={baseStyles} {...anchorRest}>
				{content}
			</Link>
		);
	}

	/* ── Native button ──────────────────────────────────────────────────────── */
	const { ...buttonRest } = rest as NativeButtonProps;

	return (
		<button type="button" className={baseStyles} {...buttonRest}>
			{content}
		</button>
	);
}
