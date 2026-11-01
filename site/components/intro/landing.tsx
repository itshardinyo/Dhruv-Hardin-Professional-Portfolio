"use client";

/*
  The landing layer on "/": TV opener → Slot A → hero.
  Slot A lives in ./slot-a.tsx; swap it there without touching the hero, header or footer.
*/

import * as React from "react";
import { usePathname } from "next/navigation";
import { useIntro } from "./intro-controller";
import { TvEngine, staticSound } from "./tv-engine";
import { SlotA, type SlotAHandle } from "./slot-a";

export function Landing() {
  const pathname = usePathname();
  const { state } = useIntro();
  if (pathname !== "/" || state === "hero") return null;
  return <LandingLayer />;
}

type Phase = "tv" | "slot";

function LandingLayer() {
  const { state, setState, finish, collapseRef, reduced } = useIntro();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const screenRef = React.useRef<HTMLDivElement>(null);
  const cvRef = React.useRef<HTMLCanvasElement>(null);
  const fuzzRef = React.useRef<HTMLCanvasElement>(null);
  const chRef = React.useRef<HTMLDivElement>(null);
  const flashRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const engineRef = React.useRef<TvEngine | null>(null);
  const slotRef = React.useRef<SlotAHandle | null>(null);
  const leavingRef = React.useRef(false);
  const [phase, setPhase] = React.useState<Phase>("tv");
  const [still, setStill] = React.useState(false); // reduced motion: the patch, no animation
  const [slotSize, setSlotSize] = React.useState(0);
  const [touch, setTouch] = React.useState(false);
  const startState = React.useRef(state);

  React.useEffect(() => setTouch(window.matchMedia("(hover: none)").matches), []);

  /* ---------- landing → hero ---------- */
  const leave = React.useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    const engine = engineRef.current, screen = screenRef.current, flash = flashRef.current, root = rootRef.current;
    setState("leaving");
    if (reduced || !engine || !screen || !flash || !root) {
      if (root) root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).onfinish = () => finish(true);
      else finish(true);
      return;
    }
    engine.leave();
    chRef.current?.classList.remove("on");
    staticSound();
    window.setTimeout(() => {
      screen.animate(
        [
          { transform: "scale(1,1)", filter: "brightness(1)" },
          { transform: "scale(1,.006)", filter: "brightness(3)", offset: 0.75 },
          { transform: "scale(.9,.003)", filter: "brightness(6)" },
        ],
        { duration: 300, easing: "cubic-bezier(.55,0,.85,.35)", fill: "forwards" },
      );
    }, 220);
    window.setTimeout(() => {
      screen.style.visibility = "hidden";
      flash.animate([{ transform: "scale(.9,.003)" }, { transform: "scale(1,.004)", offset: 0.25 }, { transform: "scale(1,1)" }], {
        duration: 420,
        easing: "cubic-bezier(.2,.75,.25,1)",
        fill: "forwards",
      });
    }, 520);
    window.setTimeout(() => { engine.stop(); finish(true); }, 960);
  }, [finish, reduced, setState]);

  const skip = React.useCallback(() => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    engineRef.current?.stop();
    finish(true);
  }, [finish]);

  /* ---------- boot ---------- */
  React.useEffect(() => {
    const img = imgRef.current, cv = cvRef.current, fuzz = fuzzRef.current, screen = screenRef.current, root = rootRef.current;
    if (!img || !cv || !fuzz || !screen || !root) return;
    let alive = true;
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => engineRef.current?.size(), 120);
    };

    const start = () => {
      if (!alive || engineRef.current) return;
      if (!img.naturalWidth) { finish(false); return; } // no patch: never trap the visitor on a blank screen
      const engine = new TvEngine(cv, fuzz, img, {
        onChannel: (on) => chRef.current?.classList.toggle("on", on),
        onHandover: () => {
          setPhase("slot");
          slotRef.current?.resetClock();
          requestAnimationFrame(() => scrollerRef.current?.focus({ preventScroll: true }));
        },
      });
      engineRef.current = engine;
      setSlotSize(engine.lh / window.innerHeight);
      window.addEventListener("resize", onResize);

      if (reduced) {
        screen.classList.remove("off");
        engine.drawStill();
        chRef.current?.classList.add("on");
        setStill(true);
        if (startState.current === "returning") {
          document.documentElement.classList.add("intro-on", "pre");
          setState("landing");
        }
        return;
      }

      if (startState.current === "returning") {
        const site = document.getElementById("site");
        const runShort = () => {
          document.documentElement.classList.add("intro-on", "pre");
          setState("landing");
          screen.classList.remove("off");
          engine.short();
        };
        if (collapseRef.current && site) {
          // The hero switches off like a CRT (0.3s), then the short opener plays.
          collapseRef.current = false;
          root.classList.add("behind");
          site.classList.add("front");
          site.style.transformOrigin = `50% ${window.scrollY + window.innerHeight / 2}px`;
          const a = site.animate([{ transform: "scale(1,1)" }, { transform: "scale(1,.006)", offset: 0.75 }, { transform: "scale(.9,.003)" }], {
            duration: 300,
            easing: "cubic-bezier(.55,0,.85,.35)",
            fill: "forwards",
          });
          a.onfinish = () => {
            if (!alive) return;
            window.scrollTo(0, 0);
            runShort();
            a.cancel();
            site.classList.remove("front");
            site.style.transformOrigin = "";
            root.classList.remove("behind");
          };
        } else {
          runShort();
        }
        return;
      }

      // First load: 0.3s of empty landing, then the tube warms up (dot → line → full screen, 0.6s).
      engine.warm(() => {
        screen.classList.remove("off");
        screen.animate(
          [
            { transform: "scale(.02,.004)", filter: "brightness(7)" },
            { transform: "scale(1,.004)", filter: "brightness(5)", offset: 0.38 },
            { transform: "scale(1,1)", filter: "brightness(1)" },
          ],
          { duration: 600, easing: "cubic-bezier(.3,.7,.25,1)" },
        );
      });
    };

    const ready = img.complete && img.naturalWidth ? Promise.resolve() : img.decode().catch(() => undefined);
    void ready.then(() => document.fonts?.ready).then(start, start);

    return () => {
      alive = false;
      window.removeEventListener("resize", onResize);
      window.clearTimeout(rt);
      engineRef.current?.stop();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- keyboard: Enter plays Slot A, Esc skips to the hero ---------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leavingRef.current) return;
      if (e.key === "Escape") { e.preventDefault(); skip(); return; }
      if (e.key !== "Enter") return;
      const el = document.activeElement as HTMLElement | null;
      if (el?.classList.contains("la-cta") || el?.classList.contains("la-skip")) return; // the button handles it
      e.preventDefault();
      if (still) { leave(); return; }
      const engine = engineRef.current;
      const playSlot = () => {
        rootRef.current?.querySelector<HTMLButtonElement>(".la-skip")?.click();
        window.setTimeout(() => rootRef.current?.querySelector<HTMLButtonElement>(".la-cta")?.focus({ preventScroll: true }), 1400);
      };
      if (phase === "tv") {
        engine?.handover();
        window.setTimeout(playSlot, 520);
      } else playSlot();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, still, leave, skip]);

  const onPointerMove = (e: React.PointerEvent) => {
    const en = engineRef.current;
    if (!en) return;
    en.hover = en.state === "idle" && e.pointerType === "mouse" && e.clientX > en.lx && e.clientX < en.lx + en.lw && e.clientY > en.ly && e.clientY < en.ly + en.lh;
  };

  return (
    <div
      ref={rootRef}
      className="landing"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="SONDR Rules The World. Press Enter to tune in, Escape to skip."
      onPointerMove={onPointerMove}
      onPointerLeave={() => { if (engineRef.current) engineRef.current.hover = false; }}
    >
      <div ref={screenRef} className="tv-screen off">
        <canvas ref={cvRef} className="tv-canvas" aria-hidden="true" />
        <div
          ref={scrollerRef}
          className="slot-a-scroller"
          tabIndex={-1}
          data-phase={phase}
          aria-hidden={phase !== "slot"}
        >
          {slotSize > 0 && !reduced && (
            <SlotA scroller={scrollerRef} size={slotSize} handleRef={slotRef} onComplete={() => window.setTimeout(leave, 350)} />
          )}
        </div>
        <div className="tv-roll" aria-hidden="true" />
        <div className="tv-scan" aria-hidden="true" />
        <div className="tv-vig" aria-hidden="true" />
        <canvas ref={fuzzRef} className="tv-fuzz" aria-hidden="true" />
        <div ref={chRef} className="osd osd-ch" aria-hidden="true">
          CH 22
        </div>
        {still && (
          <button type="button" className="tv-enter" onClick={leave} autoFocus aria-label="Enter the site">
            <span className="osd osd-cue on">{touch ? "TAP TO TUNE IN" : "CLICK TO TUNE IN"}</span>
          </button>
        )}
      </div>
      <div ref={flashRef} className="tv-flash" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src="/logo-patch.webp" alt="" hidden />
    </div>
  );
}
