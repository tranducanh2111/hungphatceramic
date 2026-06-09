import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://hungphatceramic.vn"),
	title: {
		default: "Perla powered by Hung Phat | Gạch Porcelain Cao Cấp & Gạch Ốp Lát Sang Trọng",
		template: "%s | Perla powered by Hung Phat",
	},
	description: "Chuyên cung cấp gạch porcelain cao cấp, gạch ốp lát khổ lớn nhập khẩu sang trọng cho biệt thự, khách sạn và căn hộ cao cấp tại Việt Nam.",
	keywords: [
		"gạch porcelain",
		"gạch porcelain cao cấp",
		"gạch ốp lát",
		"gạch ốp lát cao cấp",
		"gạch khổ lớn",
		"gạch trang trí",
		"luxury porcelain tiles",
		"premium ceramic tiles",
		"Hùng Phát Ceramic",
		"Perla Ceramic",
		"thiết kế nội thất gốm sứ",
	],
	verification: {
		google: "google-site-verification-placeholder",
	},
	other: {
		"google-site-verification": "google-site-verification-placeholder",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}