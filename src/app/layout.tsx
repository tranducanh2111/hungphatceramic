import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "Perla powered by Hung Phat | Gạch Porcelain Cao Cấp & Gạch Ốp Lát Sang Trọng",
		template: "%s | Perla powered by Hung Phat",
	},
	description:
		"Chuyên cung cấp gạch porcelain cao cấp, gạch ốp lát khổ lớn nhập khẩu sang trọng cho biệt thự, khách sạn và căn hộ cao cấp tại Việt Nam.",
	keywords: [
		"gạch porcelain",
		"gạch porcelain cao cấp",
		"gạch ốp lát",
		"gạch ốp lát cao cấp",
		"gạch khổ lớn",
		"gạch trang trí",
		"gạch lát nền cao cấp",
		"gạch ốp tường sang trọng",
		"gạch giả đá marble",
		"gạch porcelain khổ lớn",
		"gạch nhập khẩu cao cấp",
		"gạch porcelain tây ban nha",
		"gạch porcelain ý",
		"gạch porcelain indonesia",
		"gạch porcelain ấn độ",
		"gạch lát nền biệt thự",
		"thi công gạch khổ lớn",
		"showroom gạch porcelain hà nội",
		"Hùng Phát Ceramic",
		"Perla Ceramic",
		"thiết kế nội thất gốm sứ",
		"luxury porcelain tiles",
		"premium ceramic tiles",
		"large format porcelain slabs",
		"imported wall tiles vietnam",
		"marble look porcelain tiles",
		"high end tile showroom hanoi",
		"vietnam tile supplier",
	],
	verification: {
		google:
			process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
			"X4OwkClp6U5m8C7teGOPNxpX5UkLtCSL2UtskXmMin4",
	},
	other: {
		"google-site-verification":
			process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
			"X4OwkClp6U5m8C7teGOPNxpX5UkLtCSL2UtskXmMin4",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return children;
}
