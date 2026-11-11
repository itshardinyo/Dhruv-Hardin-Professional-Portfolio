"use client";

/*
  Full-image viewer for the galleries. White screen, the image as large as it fits, title and description below,
  previous/next, and for slide decks every slide in a scrolling column plus a link to the PDF.
  Esc or Close returns to the orbit and focus goes back to the card that was opened.
  Keys: ← → move between pieces. Touch: swipe sideways to move between pieces.
*/

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { GalleryCategory } from "@/lib/galleries";
import { getLenis } from "@/lib/lenis-store";

export function GalleryViewer({
  category,
  index,
  onIndex,
  onClose,
}: {
  category: GalleryCategory;
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const touch = React.useRef<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = React.useState(false);
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const n = category.items.length;
  const go = React.useCallback((d: number) => { if (index !== null) onIndex((index + d + n) % n); }, [index, n, onIndex]);

  // Lock the page while open.
  React.useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    return () => { lenis?.start(); document.body.style.overflow = prev; };
  }, [open]);

  // New piece: back to the top of the column.
  React.useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "Tab") {
      // keep focus inside the viewer
      const f = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href]");
      if (!f || !f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!mounted) return null;
  const item = open ? category.items[index] : null;
  const pages = item ? (item.pages?.length ? item.pages : [item.image]) : [];

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="viewer"
          ref={dialogRef}
          className="gv"
          role="dialog"
          aria-modal="true"
          aria-label={`${item.title}, ${category.kind}`}
          data-lenis-prevent
          onKeyDown={onKeyDown}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onTouchStart={(e) => { touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
          onTouchEnd={(e) => {
            const t = touch.current; touch.current = null;
            if (!t) return;
            const dx = e.changedTouches[0].clientX - t.x, dy = e.changedTouches[0].clientY - t.y;
            if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="gv-bar">
            <span className="gv-count" aria-live="polite">
              {category.title} · {index! + 1} / {n}
            </span>
            <button ref={closeRef} type="button" className="gv-chip" onClick={onClose}>
              Close <span aria-hidden="true">✕</span>
            </button>
          </div>

          <div ref={scrollRef} className="gv-stage">
            <motion.div
              key={item.id}
              className={pages.length > 1 ? "gv-pages" : "gv-single"}
              initial={reduced ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {pages.map((p, k) => (
                <Image
                  key={p.src}
                  src={p.src}
                  width={p.width}
                  height={p.height}
                  alt={pages.length > 1 ? `${item.title}, slide ${k + 1} of ${pages.length}. ${category.kind}` : `${item.title}. ${category.kind}`}
                  sizes={pages.length > 1 ? "(max-width: 639px) 100vw, 86vw" : "100vw"}
                  priority={k === 0}
                  className="gv-img"
                />
              ))}
            </motion.div>
          </div>

          <div className="gv-foot">
            <div className="gv-text">
              <h2 className="gv-title">{item.title}</h2>
              {item.description && <p className="gv-desc">{item.description}</p>}
            </div>
            <div className="gv-actions">
              {item.file && (
                <a className="gv-chip gv-chip-red" href={item.file.href} target="_blank" rel="noopener noreferrer">
                  {item.file.label} <span aria-hidden="true">↗</span>
                </a>
              )}
              <button type="button" className="gv-chip gv-arrow" onClick={() => go(-1)} aria-label="Previous">
                ←
              </button>
              <button type="button" className="gv-chip gv-arrow" onClick={() => go(1)} aria-label="Next">
                →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
