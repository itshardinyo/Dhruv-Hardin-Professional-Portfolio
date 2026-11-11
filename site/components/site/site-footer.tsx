"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import HalftoneWordmarkFooter, { type FooterColumn } from "@/components/ui/halftone-wordmark-footer";
import { useIntro } from "@/components/intro/intro-controller";
import { scrollToTop } from "@/lib/lenis-store";
import { ContactForm } from "@/components/site/contact-form";

const EMAIL = "dhruv.d.hardin@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/dhruv-hardin-b01390176/";
/** Dhruv's Instagram profile URL. The Instagram link appears in the footer once this is set. */
const INSTAGRAM = "https://www.instagram.com/itsd.hardin_/";

const LinkedInIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M3 3h18v18H3z M6.2 9.6V18h2.7V9.6z M7.55 5.6a1.55 1.55 0 1 0 0 3.1a1.55 1.55 0 0 0 0-3.1z M10.6 9.6V18h2.7v-4.4c0-1.2.5-1.9 1.5-1.9s1.4.7 1.4 1.9V18h2.7v-5c0-2.3-1.2-3.6-3.1-3.6c-1.2 0-2 .5-2.5 1.3V9.6z" fillRule="evenodd" />
  </svg>
);
const InstagramIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

/** Slot C, filled with Dhruv's content. Never rendered while the landing is up. */
export function SiteFooter() {
  const pathname = usePathname();
  const { state } = useIntro();
  const [contact, setContact] = React.useState(false);
  const [face, setFace] = React.useState<string | null>(null);
  React.useEffect(() => {
    // The canvas needs the real family name next/font generated, not a CSS variable.
    setFace(getComputedStyle(document.body).getPropertyValue("--font-bebas").trim() || '"Bebas Neue", Impact, sans-serif');
  }, []);

  const openForm = (e?: React.MouseEvent) => { e?.preventDefault(); setContact(true); };

  const columns: FooterColumn[] = [
    {
      title: "Say hi",
      onTitleClick: openForm,
      links: [
        { label: "Email", href: `mailto:${EMAIL}`, onClick: openForm },
        { label: "LinkedIn", href: LINKEDIN, target: "_blank", icon: LinkedInIcon, iconOnly: true },
        ...(INSTAGRAM ? [{ label: "Instagram", href: INSTAGRAM, target: "_blank", icon: InstagramIcon, iconOnly: true }] : []),
      ],
    },
    { title: "Pages", hideTitle: true, links: [{ label: "Artsy", href: "/artsy" }, { label: "Projects", href: "/projects" }, { label: "About me", href: "/about" }] },
  ];

  if (pathname === "/" && state !== "hero") return null;
  if (!face) return <div className="footer-slot" style={{ height: 560 }} aria-hidden="true" />;
  return (
    <div className="footer-slot">
      <HalftoneWordmarkFooter
        wordmark="HARDIN"
        label="SONDR rules the world · Est. 2022"
        meta={`© ${new Date().getFullYear()} Dhruv Hardin`}
        columns={columns}
        onBackToTop={scrollToTop}
        fontFamily={face}
        fontWeight={400}
        rough={4}
        height="560px"
      />
      <ContactForm open={contact} onClose={() => setContact(false)} to={EMAIL} />
    </div>
  );
}
