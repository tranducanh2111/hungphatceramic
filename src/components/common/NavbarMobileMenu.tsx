"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/constants/routes";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { Button } from "@/components/ui";

interface NavItem {
	href: string;
	label: string;
}

interface NavbarMobileMenuProps {
	isOpen: boolean;
	navItems: NavItem[];
	pathname: string;
	onClose: () => void;
}

export function NavbarMobileMenu({ isOpen, navItems, pathname, onClose }: NavbarMobileMenuProps) {
	const t = useTranslations("navbar");

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key="mobile-menu"
					initial={{ opacity: 0, y: -12, scale: 0.97 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -8, scale: 0.97 }}
					transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
					className={cn(
						"fixed top-[88px] left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2",
						"rounded-3xl border border-[#D4B886]/15 bg-[#071A2B]/95 backdrop-blur-2xl",
						"p-6 shadow-[0_20px_60px_rgba(7,26,43,0.7)]",
						"pointer-events-auto lg:hidden",
					)}
				>
					<ul className="flex flex-col gap-1">
						{navItems.map(({ label, href }) => {
							const isActive =
								href === "/" ? pathname === "/" : pathname.startsWith(href);
							return (
								<li key={href}>
									<Link
										href={href}
										onClick={onClose}
										className={cn(
											"text-body-sm block rounded-xl px-4 py-3 font-sans tracking-[0.12em] uppercase",
											"transition-all duration-200",
											isActive
												? "bg-[#D4B886]/10 text-[#D4B886]"
												: "text-[#F4F4F6]/60 hover:bg-[#1A3D5C]/50 hover:text-[#F4F4F6]",
										)}
									>
										{label}
									</Link>
								</li>
							);
						})}
					</ul>
					<div className="mt-3">
						<LocaleSwitcher />
					</div>

					{/* Mobile CTA */}
					<div className="mt-4 border-t border-[#1A3D5C] pt-4">
						<Button
							href={ROUTES.contact}
							variant="outline"
							size="lg"
							withShimmer
							onClick={onClose}
							className="w-full border-[#D4B886]/40 bg-[#D4B886]/8 text-[#D4B886] hover:bg-[#D4B886] hover:text-[#071A2B]"
						>
							{t("cta.bookConsultation")}
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
