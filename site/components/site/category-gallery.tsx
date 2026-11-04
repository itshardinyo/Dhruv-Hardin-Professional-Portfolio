"use client";

import * as React from "react";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";
import { GalleryViewer } from "./gallery-viewer";
import { ContactSheet } from "./contact-sheet";
import { ArcLogo } from "./arc-logo";
import type { GalleryCategory } from "@/lib/galleries";

const MIN_RING = 6; // a ring with fewer cards looks empty, so short categories repeat round it

/** One category: heading (text or logo), the gallery, and its full-image viewer. */
export function CategoryGallery({ category, hint = true }: { category: GalleryCategory; hint?: boolean }) {
  const [open, setOpen] = React.useState<number | null>(null);
  const opener = React.useRef<HTMLButtonElement | null>(null);
  const [touch, setTouch] = React.useState(false);
  React.useEffect(() => setTouch(window.matchMedia("(hover: none)").matches), []);

  const n = category.items.length;
  const sheet = category.layout === "sheet";
  const items: GalleryItem[] = React.useMemo(() => {
    const base = category.items.map((it) => ({
      common: it.title,
      binomial: it.description ?? "",
      photo: { url: it.image.src, text: `${it.title}, ${category.kind}`, pos: it.pos, width: it.image.width, height: it.image.height },
    }));
    if (!base.length) return base;
    const out: GalleryItem[] = [...base];
    while (out.length < MIN_RING) out.push({ ...base[out.length % base.length], repeat: true });
    return out;
  }, [category]);

  const close = () => {
    setOpen(null);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  };

  return (
    <section id={category.id} className="cat" aria-labelledby={`${category.id}-title`}>
      <div className="cat-head">
        <h2 id={`${category.id}-title`} className="cat-title">
          {category.logo ? (
            <ArcLogo src={category.logo.src} width={category.logo.width} height={category.logo.height} text={category.title} />
          ) : (
            <span className="cat-name">{category.title}</span>
          )}
        </h2>
        {hint && <p className="cat-hint">
          {sheet
            ? touch ? "Tap a piece to see it full size" : "Click a piece to see it full size"
            : touch ? "Swipe sideways to spin · tap a card to see it full size" : "Scroll sideways or drag to spin · click a card to see it full size"}
        </p>}
      </div>
      {n === 0 ? (
        <p className="cat-empty">Placeholder: no images found for {category.title} yet.</p>
      ) : sheet ? (
        <ContactSheet category={category} onOpen={(i, card) => { opener.current = card; setOpen(i); }} />
      ) : (
        <CircularGallery
          items={items}
          radius={Math.max(600, Math.round((items.length * 330) / (2 * Math.PI)))}
          label={`${category.title} gallery, ${n} ${n === 1 ? "piece" : "pieces"}`}
          onOpen={(i, card) => { opener.current = card; setOpen(i % n); }}
        />
      )}
      <GalleryViewer category={category} index={open} onIndex={setOpen} onClose={close} />
    </section>
  );
}
