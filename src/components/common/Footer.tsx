"use client";

import Link from "next/link";
import { Text } from "@/components/ui";
import { PublicIcon } from "@/components/icons";
import { COMPANY_NAME } from "@/constants/navigation";
import { ICON_PATHS } from "@/constants/media";
import { ROUTES, productsWithCollection } from "@/constants/routes";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FOOTER_COMPANY_LINKS = [
  { label: "About Us", href: ROUTES.about },
  { label: "Our Projects", href: ROUTES.projects },
  { label: "Our Process", href: ROUTES.aboutProcess },
  { label: "Book a Consultation", href: ROUTES.contact },
];

const FOOTER_COLLECTION_LINKS = [
  { label: "Inspire Series", collectionId: "inspire" },
  { label: "Travertine Series", collectionId: "travertine" },
  { label: "Orient Star Series", collectionId: "orient-star" },
  { label: "Sunshine Series", collectionId: "sunshine" },
  { label: "20mm Architectural", collectionId: "architectural" },
].map(({ label, collectionId }) => ({
  label,
  href: productsWithCollection(collectionId),
}));

const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: ROUTES.privacyPolicy },
  { label: "Terms of Service", href: ROUTES.termsOfService },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com", iconSrc: ICON_PATHS.social.instagram },
  { label: "Facebook", href: "https://facebook.com", iconSrc: ICON_PATHS.social.facebook },
  { label: "YouTube", href: "https://youtube.com", iconSrc: ICON_PATHS.social.youtube },
];

const CONTACT_ITEMS = [
  {
    iconSrc: ICON_PATHS.contact.mapPin,
    text: "Số 583 Giải Phóng, Giáp Bát, Hoàng Mai, Hà Nội",
    href: "https://maps.google.com/?q=583+Giải+Phóng,+Giáp+Bát,+Hoàng+Mai,+Hà+Nội",
    isExternal: true,
  },
  {
    iconSrc: ICON_PATHS.contact.phone,
    text: "+84 (0) 24 1234 5678",
    href: "tel:+842412345678",
    isExternal: false,
  },
  {
    iconSrc: ICON_PATHS.contact.mail,
    text: "contact@hungphatceramic.vn",
    href: "mailto:contact@hungphatceramic.vn",
    isExternal: false,
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <Text
        variant="label"
        className="mb-5 font-sans uppercase tracking-[0.2em] text-[#D4B886]"
      >
        {heading}
      </Text>
      <ul className="space-y-3" role="list">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="font-sans text-body-sm text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

/**
 * Footer — Premium site footer with contact details, nav links, and socials.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-[#040F1A] text-[#F4F4F6]"
      aria-label="Site footer"
    >
      {/* Top champagne border */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4B886]/30 to-transparent" />

      {/* ── Main content ── */}
      <div className="mx-auto max-w-7xl px-6 pb-12 pt-20 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">

          {/* ── Brand block ── */}
          <div>
            {/* Monogram + wordmark */}
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
                <div className="absolute inset-0 rotate-45 border border-[#D4B886]/60" />
                <span className="relative font-serif text-sm font-light text-[#D4B886]">HP</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-sm font-light tracking-[0.12em] text-[#F4F4F6]">
                  Hùng Phát
                </span>
                <span className="font-sans text-[8px] font-light tracking-[0.25em] uppercase text-[#D4B886]">
                  Ceramic
                </span>
              </div>
            </div>

            {/* Tagline */}
            <Text variant="body-sm" className="mt-5 max-w-xs text-[#F4F4F6]/45 leading-relaxed">
              Luxury ceramic surfaces for discerning spaces. Crafted with precision,
              installed with care, designed to endure.
            </Text>

            {/* Social links */}
            <div className="mt-8 flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, iconSrc }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full border border-[#1A3D5C] transition-all duration-300 hover:border-[#D4B886]/50"
                >
                  <PublicIcon
                    src={iconSrc}
                    alt=""
                    size={18}
                    className="opacity-55 transition-opacity group-hover:opacity-100"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* ── Navigation ── */}
          <FooterLinkGroup heading="Navigate" links={FOOTER_COMPANY_LINKS} />
          <FooterLinkGroup heading="Collections" links={FOOTER_COLLECTION_LINKS} />

          {/* ── Contact ── */}
          <div>
            <Text
              variant="label"
              className="mb-5 font-sans uppercase tracking-[0.2em] text-[#D4B886]"
            >
              Contact
            </Text>
            <ul className="space-y-4" role="list">
              {CONTACT_ITEMS.map(({ iconSrc, text, href, isExternal }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(isExternal
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex items-start gap-3 text-[#F4F4F6]/45 transition-colors duration-300 hover:text-[#D4B886]"
                  >
                    <PublicIcon
                      src={iconSrc}
                      alt=""
                      size={18}
                      className="mt-0.5 shrink-0 opacity-60 transition-opacity group-hover:opacity-100"
                    />
                    <Text variant="body-sm" className="leading-relaxed">
                      {text}
                    </Text>
                  </a>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href={ROUTES.contact}
              className="mt-8 inline-flex items-center justify-center rounded-full border border-[#D4B886]/30 bg-[#D4B886]/5 px-6 py-2.5 font-sans text-body-sm tracking-[0.1em] uppercase text-[#D4B886] transition-all duration-300 hover:bg-[#D4B886] hover:text-[#071A2B] hover:border-[#D4B886]"
            >
              Book a Consultation
            </Link>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-[#1A3D5C] to-transparent" />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Text variant="footnote" className="text-[#F4F4F6]/25">
            © {currentYear} {COMPANY_NAME}. All rights reserved.
          </Text>
          <div className="flex gap-6">
            {FOOTER_LEGAL_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="font-sans text-footnote text-[#F4F4F6]/25 transition-colors duration-300 hover:text-[#D4B886]/60"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
