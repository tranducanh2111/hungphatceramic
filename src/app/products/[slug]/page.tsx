import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

interface ProductDetailRedirectPageProps {
	params: Promise<{ slug: string }>;
}

export default async function ProductDetailRedirectPage({
	params,
}: ProductDetailRedirectPageProps) {
	const { slug } = await params;
	redirect(`/${routing.defaultLocale}/products/${slug}`);
}
