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
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	keywords: [
		// --- BRAND & LOCATION ---
		"Hùng Phát Ceramic",
		"Perla Ceramic",
		"perla gạch ốp lát",
		"showroom gạch porcelain hà nội",
		"gạch ốp lát cao cấp Tây Hồ Tây",
		"gạch cao cấp Starlake",

		// --- VIETNAMESE: HIGH-END & GENERAL CATEGORIES ---
		"gạch ceramic",
		"gạch ceramic cao cấp",
		"gạch porcelain",
		"gạch porcelain cao cấp",
		"gạch ốp lát",
		"gạch ốp lát cao cấp",
		"gạch khổ lớn",
		"gạch trang trí",
		"gạch lát nền cao cấp",
		"gạch ốp tường sang trọng",
		"gạch giả đá marble",
		"gạch giả đá travertine",
		"gạch porcelain khổ lớn",
		"gạch nhập khẩu cao cấp",
		"gạch nhập khẩu indonesia",
		"gạch nhập khẩu malaysia",
		"gạch nhập khẩu trung quốc",
		"gạch lát nền biệt thự",
		"gạch lát nền villa sang trọng",
		"gạch ốp lát khách sạn 5 sao",
		"thi công gạch khổ lớn",
		"thiết kế nội thất gốm sứ",

		// --- VIETNAMESE: WHOLESALE & B2B ---
		"phân phối gạch ốp lát",
		"bán buôn gạch porcelain",
		"đại lý gạch ốp lát cao cấp",
		"nguồn cung cấp gạch dự án",
		"cung cấp gạch ốp lát sỉ",
		"tổng kho gạch porcelain",
		"nhà cung cấp gạch B2B",
		"xuất khẩu gạch ốp lát Việt Nam",
		"phân phối gạch khổ lớn toàn quốc",

		// --- ENGLISH: HIGH-END & GENERAL CATEGORIES ---
		"ceramic tiles",
		"ceramic tiles high-end",
		"porcelain tiles",
		"porcelain tiles high-end",
		"luxury porcelain tiles",
		"premium ceramic tiles",
		"large format porcelain slabs",
		"imported wall tiles vietnam",
		"marble look porcelain tiles",
		"high end tile showroom hanoi",
		"premium ceramic surfaces",
		"luxury porcelain slabs",
		"high-end architectural tiles",
		"italian travertine look tiles",
		"marble look porcelain slabs",
		"luxury villa tile supplier",
		"hotel porcelain tile supplier",
		"designer porcelain tiles",
		"bespoke porcelain surfaces",
		"luxury home tiling vietnam",
		"high-end interior tiles",

		// --- ENGLISH: WHOLESALE & B2B / GLOBAL ---
		"vietnam tile supplier",
		"ceramic tile wholesaler vietnam",
		"porcelain tile wholesale supplier",
		"vietnam tile exporter",
		"porcelain slab distributor",
		"wholesale ceramic tiles vietnam",
		"bulk porcelain tiles",
		"tile supplier for projects",
		"B2B tile supplier vietnam",
		"vietnam luxury tile manufacturer",
		"porcelain tile export vietnam",
		"global porcelain tile supplier",
		"vietnam porcelain tile export",
		"ceramic tile sourcing vietnam",
		"wholesale tiles global shipping",
		"luxury tiles vietnam exporter",
		"international tile supplier",
		"vietnamese tile distribution",
		"high quality vietnamese tiles",
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
