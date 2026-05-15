import type { NavItem } from "@/types";
import { ROUTES } from "@/constants/routes";

export const PRIMARY_NAV_ITEMS: NavItem[] = [
	{ label: "Home", href: ROUTES.home },
	{ label: "About Us", href: ROUTES.about },
	{ label: "Products", href: ROUTES.products },
	{ label: "Projects", href: ROUTES.projects },
];

export const COMPANY_NAME = "Perla powered by Hung Phat";
export const COMPANY_TAGLINE = "Luxury Ceramic Solutions for Distinguished Interiors";
