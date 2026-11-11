"use client";

/*
  Circular Gallery (21st.dev), used for HUSTLER JERSEYS, SCHOOL and COMICS.
  Kept from the original: the 3D ring (perspective 2000px, rotateY, translateZ radius 600), 300×400 cards,
  auto-rotation at 0.02°/frame that pauses for 150ms while you're scrolling, the opacity falloff toward the back
  (min 0.3, 0.3s linear), and the card look (rounded, border, shadow, image cover, caption on a dark fade).
  SONDR changes, marked "SONDR:":
  - the ring turns with horizontal scrolling (trackpad swipe or Shift + wheel), dragging, swiping and the arrow
    keys, instead of page scroll, so each gallery spins on its own and vertical scrolling still moves the page
  - each card is a button that opens the full image (onOpen); a drag never counts as a click
  - sizes scale down with the container width so the ring fits phones
  - only animates while on screen; with reduced motion it stands still
  - momentum: a flick (scroll, drag, swipe) keeps the ring gliding, easing down to a steady cruise in the
    direction you spun it, so it never stops by itself; hovering a card (mouse) stops it until you move off
  - Next.js <Image>, site fonts, the "Photo by" demo line removed
*/

import React, { useState, useEffect, useRef, HTMLAttributes } from "react";
import Image from "next/image";

// A simple utility for conditional class names
const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(" ");
};

// Define the type for a single gallery item
export interface GalleryItem {
  /** SONDR: the title */
  common: string;
  /** SONDR: the short description */
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    /** SONDR: intrinsic size for next/image */
    width: number;
    height: number;
  };
  /** SONDR: a repeat that only fills out a short ring (hidden from screen readers and Tab) */
  repeat?: boolean;
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends Omit<HTMLAttributes<HTMLDivElement>, "onScroll"> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** SONDR: open item i (the full image). */
  onOpen?: (index: number, card: HTMLButtonElement) => void;
  /** SONDR: accessible name of the region. */
  label?: string;
}

const DEG_PER_PX = 0.18; // SONDR: how far a horizontal scroll or drag turns the ring
const MAX_VEL = 6; // SONDR: fastest glide after a flick, °/frame
const FRICTION = 0.975; // SONDR: how quickly a flick eases down to the cruise (per frame)
const CRUISE = 0.15; // SONDR: steady speed once the ring has been spun, °/frame

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  ({ items, className, radius = 600, autoRotateSpeed = 0.02, onOpen, label = "Circular 3D Gallery", style, ...props }, ref) => {
    const [rotation, setRotation] = useState(0);
    const isScrolling = useRef(false); // SONDR: a ref, so the frame loop doesn't restart
    const vel = useRef(0); // SONDR: current glide, °/frame
    const dir = useRef(0); // SONDR: direction of the last spin (0 = never spun: original slow auto-rotate)
    const hovering = useRef(false); // SONDR: mouse over a card stops the ring
    const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const [scale, setScale] = useState(1); // SONDR
    const [visible, setVisible] = useState(false); // SONDR
    const [reduced, setReduced] = useState(false); // SONDR
    const drag = useRef({ id: -1, x: 0, moved: 0 });

    const setRefs = (el: HTMLDivElement | null) => {
      rootRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    // SONDR: "scrolling" now means a horizontal scroll, drag or key press on this gallery
    const nudge = (deg: number, momentum = true) => {
      isScrolling.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      setRotation((r) => r + deg);
      if (momentum && deg !== 0) {
        vel.current = Math.max(-MAX_VEL, Math.min(MAX_VEL, vel.current * 0.5 + deg * 0.5));
        dir.current = Math.sign(deg);
      }
      scrollTimeoutRef.current = setTimeout(() => { isScrolling.current = false; }, 150);
    };

    // SONDR: horizontal wheel turns the ring; vertical wheel is left to the page (Lenis)
    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const onWheel = (e: WheelEvent) => {
        let dx = e.deltaX;
        if (e.shiftKey && dx === 0) dx = e.deltaY; // Shift + mouse wheel
        else if (Math.abs(dx) <= Math.abs(e.deltaY)) return; // mostly vertical: let the page scroll
        e.preventDefault();
        e.stopPropagation();
        nudge(-dx * DEG_PER_PX);
      };
      el.addEventListener("wheel", onWheel, { passive: false });
      return () => {
        el.removeEventListener("wheel", onWheel);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      };
    }, []);

    // SONDR: size to the container, run only on screen, respect reduced motion
    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;
      const ro = new ResizeObserver(([e]) => setScale(Math.min(1, Math.max(0.42, e.contentRect.width / 1400))));
      ro.observe(el);
      const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
      io.observe(el);
      const m = window.matchMedia("(prefers-reduced-motion: reduce)");
      const onM = () => setReduced(m.matches);
      onM();
      m.addEventListener("change", onM);
      return () => { ro.disconnect(); io.disconnect(); m.removeEventListener("change", onM); };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      if (!visible || reduced) return; // SONDR
      const autoRotate = () => {
        // SONDR: glide after a flick, easing to the cruise; hovering a card holds it still
        if (hovering.current) vel.current = 0;
        else if (!isScrolling.current) {
          const cruise = dir.current === 0 ? autoRotateSpeed : dir.current * Math.max(CRUISE, autoRotateSpeed);
          vel.current = cruise + (vel.current - cruise) * FRICTION;
          const v = vel.current;
          setRotation((prev) => prev + v);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [autoRotateSpeed, visible, reduced]);

    const anglePerItem = 360 / items.length;
    const r = radius * scale; // SONDR
    const cw = 300 * scale, ch = 400 * scale; // SONDR

    // SONDR: drag / swipe to turn
    const onPointerDown = (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      drag.current = { id: e.pointerId, x: e.clientX, moved: 0 };
    };
    const onPointerMove = (e: React.PointerEvent) => {
      const d = drag.current;
      if (d.id !== e.pointerId) return;
      const dx = e.clientX - d.x;
      d.x = e.clientX;
      d.moved += Math.abs(dx);
      if (d.moved > 6) {
        if (!rootRef.current?.hasPointerCapture(e.pointerId)) rootRef.current?.setPointerCapture(e.pointerId);
        nudge(dx * DEG_PER_PX * 1.4);
      }
    };
    const onPointerUp = (e: React.PointerEvent) => {
      if (drag.current.id === e.pointerId) drag.current.id = -1;
    };

    // SONDR: bring a card to the front (keyboard focus)
    const face = (i: number) => {
      setRotation((cur) => {
        const target = -i * anglePerItem;
        const diff = ((((target - cur) % 360) + 540) % 360) - 180;
        return cur + diff;
      });
    };

    return (
      <div
        ref={setRefs}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        className={cn("relative w-full flex items-center justify-center overflow-hidden select-none", className)}
        style={{ perspective: "2000px", height: Math.round(620 * scale + 40), touchAction: "pan-y", ...style }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") { e.preventDefault(); nudge(anglePerItem, false); }
          if (e.key === "ArrowRight") { e.preventDefault(); nudge(-anglePerItem, false); }
        }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

            return (
              <div
                key={`${item.photo.url}-${i}`}
                role="group"
                aria-label={item.common}
                aria-hidden={item.repeat || undefined}
                className="absolute"
                onPointerEnter={(e) => { if (e.pointerType === "mouse") hovering.current = true; }}
                onPointerLeave={(e) => { if (e.pointerType === "mouse") hovering.current = false; }}
                style={{
                  width: cw,
                  height: ch,
                  transform: `rotateY(${itemAngle}deg) translateZ(${r}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: -cw / 2,
                  marginTop: -ch / 2,
                  opacity: opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <button
                  type="button"
                  tabIndex={item.repeat ? -1 : 0}
                  aria-label={`Open ${item.photo.text}`}
                  onFocus={() => face(i)}
                  onClick={(e) => {
                    if (drag.current.moved > 6) { drag.current.moved = 0; return; } // a drag, not a click
                    onOpen?.(i, e.currentTarget);
                  }}
                  className="cg-card relative block w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-white cursor-pointer p-0 text-left"
                >
                  <Image
                    src={item.photo.url}
                    alt=""
                    width={item.photo.width}
                    height={item.photo.height}
                    sizes="(max-width: 639px) 140px, 300px"
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    style={{ objectPosition: item.photo.pos || "center" }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white" style={{ padding: 16 * Math.max(scale, 0.6) }}>
                    <h3 className="font-display uppercase leading-none" style={{ fontSize: Math.max(18, 30 * scale) }}>{item.common}</h3>
                    {item.binomial && <em className="block not-italic font-hand leading-tight mt-1 line-clamp-2" style={{ fontSize: Math.max(13, 17 * scale) }}>{item.binomial}</em>}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
