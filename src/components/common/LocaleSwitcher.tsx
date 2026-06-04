"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { LocaleFlagIcon } from "@/components/icons/LocaleFlagIcon";
import { routing, type AppLocale } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

interface LocaleSwitcherProps {
	className?: string;
}

function LocaleOptionLabel({ localeCode, label }: { localeCode: AppLocale; label: string }) {
	return (
		<span className="inline-flex items-center gap-2">
			<LocaleFlagIcon locale={localeCode} />
			<span className="tracking-[0.1em] uppercase">{label}</span>
		</span>
	);
}

export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const t = useTranslations("navbar.locale");
	const activeLocale = useLocale() as AppLocale;
	const pathname = usePathname();
	const listboxId = useId();
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isMenuOpen) return;

		const handlePointerDown = (event: PointerEvent) => {
			const rootEl = rootRef.current;
			if (!rootEl || !(event.target instanceof Node)) return;
			if (!rootEl.contains(event.target)) {
				setIsMenuOpen(false);
			}
		};

		document.addEventListener("pointerdown", handlePointerDown, true);
		return () => document.removeEventListener("pointerdown", handlePointerDown, true);
	}, [isMenuOpen]);

	return (
		<div ref={rootRef} className={cn("relative z-[60]", className)}>
			<button
				type="button"
				aria-label={t("label")}
				aria-haspopup="listbox"
				aria-expanded={isMenuOpen}
				aria-controls={listboxId}
				className={cn(
					"text-body-sm inline-flex items-center gap-1 rounded-full border border-[#D4B886]/30 px-3 py-1.5 font-sans tracking-[0.1em] text-[#F4F4F6]/85 uppercase transition-colors duration-300 hover:border-[#D4B886] hover:text-[#D4B886]",
				)}
				onClick={() => setIsMenuOpen((prevState) => !prevState)}
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						setIsMenuOpen(false);
					}
				}}
			>
				<span className="inline-flex items-center gap-1.5">
					<LocaleOptionLabel
						localeCode={activeLocale}
						label={t(`options.${activeLocale}`)}
					/>
					{isMenuOpen ? (
						<ChevronUp className="h-4 w-4 shrink-0" aria-hidden="true" />
					) : (
						<ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
					)}
				</span>
			</button>

			{isMenuOpen && (
				<ul
					id={listboxId}
					role="listbox"
					aria-label={t("label")}
					className="absolute top-full right-0 z-[70] mt-2 w-fit rounded-xl border border-[#1A3D5C] bg-[#071A2B] p-1 px-3 shadow-lg"
				>
					{routing.locales.map((localeCode) => {
						const locale = localeCode as AppLocale;
						const isActiveLocale = locale === activeLocale;
						return (
							<li key={localeCode} role="option" aria-selected={isActiveLocale}>
								<Link
									href={pathname}
									locale={localeCode}
									className={cn(
										"text-body-sm block rounded-lg px-3 py-2 font-sans transition-colors",
										isActiveLocale
											? "bg-[#D4B886]/10 text-[#D4B886]"
											: "text-[#F4F4F6]/75 hover:bg-[#1A3D5C] hover:text-[#F4F4F6]",
									)}
									onClick={() => setIsMenuOpen(false)}
								>
									<LocaleOptionLabel
										localeCode={locale}
										label={t(`options.${localeCode}`)}
									/>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
