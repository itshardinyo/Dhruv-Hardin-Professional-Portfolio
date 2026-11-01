"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import HalftoneWordmarkFooter, { type FooterColumn } from "@/components/ui/halftone-wordmark-footer";
import { useIntro } from "@/components/intro/intro-controller";
import { scrollToTop } from "@/lib/lenis-store";

const EMAIL = "dhruv.d.hardin@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/dhruv-hardin-b01390176/";

/** Slot C, filled with Dhruv's content. Never rendered while the landing is up. */
export function SiteFooter() {
  const pathname = usePathname();
  const { state } = useIntro();
  const [copied, setCopied] = React.useState(false);
  const [face, setFace] = React.useState<string | null>(null);
  React.useEffect(() => {
    // The canvas needs the real family name next/font generated, not a CSS variable.
    setFace(getComputedStyle(document.body).getPropertyValue("--font-bebas").trim() || '"Bebas Neue", Impact, sans-serif');
  }, []);

  const copy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const done = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(EMAIL).then(done, () => { window.location.href = `mailto:${EMAIL}`; });
    else window.location.href = `mailto:${EMAIL}`;
  };

  const columns: FooterColumn[] = [
    {
      title: "Say hi",
      links: [
        { label: copied ? "Copied" : "Email", href: `mailto:${EMAIL}`, onClick: copy },
        { label: EMAIL, href: `mailto:${EMAIL}` },
        { label: "LinkedIn", href: LINKEDIN, target: "_blank" },
      ],
    },
    { title: "Pages", links: [{ label: "Artsy", href: "/artsy" }, { label: "Projects", href: "/projects" }, { label: "About me", href: "/about" }] },
    { title: "Files", links: [{ label: "Resume", href: "/resume.pdf", target: "_blank" }] },
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
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Email address copied" : ""}</span>
    </div>
  );
}
