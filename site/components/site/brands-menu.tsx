"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/lib/brands";

/**
 * Side menu of Dhruv's brands, opened by one click on the header SONDR logo.
 * Portalled to <body> because the header is transformed (hide-on-scroll), which would break position: fixed.
 */
export function BrandsMenu({ open, onClose, anchorId }: { open: boolean; onClose: () => void; anchorId: string }) {
  const ref = React.useRef<HTMLElement>(null);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (ref.current?.contains(t) || document.getElementById(anchorId)?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose, anchorId]);

  if (!mounted || !open) return null;

  return createPortal(
    <nav ref={ref} className="brands-menu" aria-label="Brands" data-lenis-prevent>
      <div className="brands-head">
        <h2 className="brands-title">Brands</h2>
        <button type="button" className="brands-close" onClick={onClose} aria-label="Close the brands menu">×</button>
      </div>
      <ul className="brands-list">
        {BRANDS.map((b) => (
          <li key={b.slug}>
            <Link href={`/${b.slug}`} className="brands-item" onClick={onClose}>
              <Image src={b.logo} alt="" width={b.width} height={b.height} sizes="200px" />
              <span>{b.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>,
    document.body,
  );
}
