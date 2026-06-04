"use client";

import { useEffect } from "react";
import { useLenisControls } from "@/components/common";
import { ContactHero } from "./ContactHero";
import { ContactInquirySection } from "./ContactInquirySection";
import { ContactShowroom } from "./ContactShowroom";

function useLenisResizeOnContactMount() {
	const lenisControls = useLenisControls();

	useEffect(() => {
		if (!lenisControls) return;

		const resizeLenis = () => lenisControls.resize();

		resizeLenis();

		const rafId = requestAnimationFrame(() => {
			resizeLenis();
			requestAnimationFrame(resizeLenis);
		});

		window.addEventListener("load", resizeLenis, { once: true });

		return () => {
			cancelAnimationFrame(rafId);
			window.removeEventListener("load", resizeLenis);
		};
	}, [lenisControls]);
}

export function ContactPageContent() {
	useLenisResizeOnContactMount();

	return (
		<>
			<ContactHero />
			<ContactInquirySection />
			<ContactShowroom />
		</>
	);
}
