"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRANDS } from "@/lib/brands";

/**
 * One click on the header SONDR logo: each brand's logo pops up right next to it (staggered), no menu.
 * Click a logo to open its page; click anywhere else or press Esc to tuck them away.
 */
export function BrandsPop({ open, onClose, anchorId }: { open: boolean; onClose: () => void; anchorId: string }) {
  const ref = React.useRef<HTMLDivElement>(null);

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
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open, onClose, anchorId]);

  if (!open) return null;

  return (
    <div ref={ref} className="brands-pop" role="group" aria-label="Brands">
      {BRANDS.map((b, i) => (
        <Link key={b.slug} href={`/${b.slug}`} className="brands-pop-item" onClick={onClose} style={{ animationDelay: `${i * 70}ms` }} title={b.name} aria-label={b.name}>
          <Image src={b.logo} alt="" width={b.width} height={b.height} sizes="(max-width: 639px) 90px, 16vw" />
        </Link>
      ))}
    </div>
  );
}
