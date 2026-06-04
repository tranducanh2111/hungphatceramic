import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
	variable: "--font-cormorant",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	style: ["normal", "italic"],
	display: "swap",
});

const jost = Jost({
	variable: "--font-jost",
	subsets: ["latin"],
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
