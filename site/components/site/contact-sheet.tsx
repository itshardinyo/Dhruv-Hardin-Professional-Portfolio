"use client";

import * as React from "react";
import Image from "next/image";
import type { GalleryCategory } from "@/lib/galleries";

/**
 * Contact-sheet layout (Comics): a white sheet with binder holes, a numbered grid of prints
 * ("01" above, square photo, "—" below). Three columns, two on phones. Clicking a print opens the viewer.
 */
export function ContactSheet({
  category,
  onOpen,
}: {
  category: GalleryCategory;
  onOpen: (index: number, card: HTMLButtonElement) => void;
}) {
  return (
    <div className="sheet" style={{ position: "relative", background: "#FFFFFF" }} role="region" aria-label={`${category.title}, ${category.items.length} pieces`}>
      <span className="sheet-holes" aria-hidden="true"><i /><i /><i /></span>
      {/* core layout is inline too, so the grid holds even if the stylesheet is stale */}
      <ol className="sheet-grid" style={{ display: "grid", gridTemplateColumns: "repeat(var(--sheet-cols, 3), minmax(0, 1fr))", listStyle: "none", margin: 0, padding: 0 }}>
        {category.items.map((it, i) => (
          <li key={it.id}>
            <button type="button" className="sheet-print" style={{ display: "flex", flexDirection: "column", width: "100%" }} onClick={(e) => onOpen(i, e.currentTarget)} aria-label={`Open ${it.title}, ${category.kind}`}>
              <span className="sheet-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className="sheet-photo" style={{ position: "relative", display: "block", width: "100%", aspectRatio: "336 / 392", overflow: "hidden" }}>
                <Image
                  src={it.image.src}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 45vw, 26vw"
                  className="object-cover"
                  style={{ objectPosition: it.pos || "center" }}
                />
              </span>
              <span className="sheet-dash" aria-hidden="true">—</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
