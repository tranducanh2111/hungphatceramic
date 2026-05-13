import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SmoothScrollProvider } from "@/components/common/SmoothScrollProvider";
import { ScrollProgressBar } from "@/components/common/ScrollProgressBar";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
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
	title: "Hùng Phát Ceramic | Luxury Interior Ceramics",
	description:
		"Premium ceramic solutions for discerning interior designers and high-end residential projects. Discover timeless craftsmanship.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
			style={{ position: "relative" }}
			suppressHydrationWarning
		>
			<body
				className="relative flex min-h-full flex-col"
				style={{ position: "relative" }}
				suppressHydrationWarning
			>
				<SmoothScrollProvider>
					<Navbar />
					{children}
					<Footer />
					<ScrollProgressBar />
				</SmoothScrollProvider>
			</body>
		</html>
	);
}
