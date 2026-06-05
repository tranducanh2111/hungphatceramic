import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin", "vietnamese"],
	weight: ["300", "400", "500", "600"],
	style: ["normal", "italic"],
	display: "swap",
});

// Inter replaces Jost: next/font Jost has no vietnamese subset, so diacritics fell back to system-ui.
const jost = Inter({
	variable: "--font-jost",
	subsets: ["latin", "vietnamese"],
	weight: ["300", "400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Perla powered by Hung Phat",
	description: "Luxury porcelain interior design and installation.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="vi"
			data-scroll-behavior="smooth"
			className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
			style={{ position: "relative" }}
			suppressHydrationWarning
		>
			<body
				className="relative flex min-h-full flex-col"
				style={{ position: "relative" }}
				suppressHydrationWarning
			>
				{children}
			</body>
		</html>
	);
}
