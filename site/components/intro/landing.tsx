"use client";

/*
  The landing layer on "/": TV opener → patch at rest → click, tap or Enter → hero.
  Slot A is empty (removed at Dhruv's request), so the default transition runs: a short burst of static,
  the screen collapses to a bright line (0.3s), the line opens into the white hero (0.4s), then the hero entrance.
  A future Slot A plugs in here without touching the hero, header or footer.
*/

import * as React from "react";
import { MUSIC_START_EVENT } from "@/lib/music";
import { usePathname } from "next/navigation";
import { useIntro } from "./intro-controller";
import { TvEngine, staticSound } from "./tv-engine";

export function Landing() {
  const pathname = usePathname();
  const { state } = useIntro();
  if (pathname !== "/" || state === "hero") return null;
  return <LandingLayer />;
}

function LandingLayer() {
  const { state, setState, finish, collapseRef, reduced } = useIntro();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const screenRef = React.useRef<HTMLDivElement>(null);
  const cvRef = React.useRef<HTMLCanvasElement>(null);
  const chRef = React.useRef<HTMLDivElement>(null);
  const cueRef = React.useRef<HTMLSpanElement>(null);
  const enterRef = React.useRef<HTMLButtonElement>(null);
  const flashRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const engineRef = React.useRef<TvEngine | null>(null);
  const leavingRef = React.useRef(false);
  const [touch, setTouch] = React.useState(false);
  const startState = React.useRef(state);

  React.useEffect(() => setTouch(window.matchMedia("(hover: none)").matches), []);

  const focusEnter = () => enterRef.current?.focus({ preventScroll: true });

  /* ---------- landing → hero ---------- */
  const leave = React.useCallback(() => {
    if (leavingRef.current) return;
    window.dispatchEvent(new Event(MUSIC_START_EVENT)); // start the site music on this click (browsers need a gesture)
    const engine = engineRef.current, screen = screenRef.current, flash = flashRef.current, root = rootRef.current;
    if (!engine) { leavingRef.current = true; finish(true); return; } // patch not ready yet: go straight in
    leavingRef.current = true;
    setState("leaving");
    chRef.current?.classList.remove("on");
    cueRef.current?.classList.remove("on");
    if (reduced || !screen || !flash || !root) {
      if (root) root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "forwards" }).onfinish = () => finish(true);
      else finish(true);
      return;
    }
    engine.leave();
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
    const img = imgRef.current, cv = cvRef.current, screen = screenRef.current, root = rootRef.current;
    if (!img || !cv || !screen || !root) return;
    let alive = true;
    let rt = 0;
    const onResize = () => {
      window.clearTimeout(rt);
      rt = window.setTimeout(() => engineRef.current?.size(), 120);
    };
    const showCue = () => { cueRef.current?.classList.add("on"); focusEnter(); };

    const start = () => {
      if (!alive || engineRef.current) return;
      if (!img.naturalWidth) { finish(false); return; } // no patch: never trap the visitor on a blank screen
      const engine = new TvEngine(cv, img, {
        onChannel: (on) => chRef.current?.classList.toggle("on", on),
        onIdle: showCue,
      });
      engineRef.current = engine;
      window.addEventListener("resize", onResize);

      if (reduced) {
        if (startState.current === "returning") {
          document.documentElement.classList.add("intro-on", "pre");
          setState("landing");
        }
        screen.classList.remove("off");
        engine.drawStill();
        chRef.current?.classList.add("on");
        showCue();
        return;
      }

      if (startState.current === "returning") {
        const site = document.getElementById("site");
        const runShort = () => {
          document.documentElement.classList.add("intro-on", "pre");
          setState("landing");
          screen.classList.remove("off");
          engine.short();
          focusEnter();
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
        focusEnter();
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

  /* ---------- keyboard: Enter tunes in, Esc skips to the hero ---------- */
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (leavingRef.current) return;
      if (e.key === "Escape") { e.preventDefault(); skip(); }
      else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); leave(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [leave, skip]);

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
      onPointerMove={onPointerMove}
      onPointerLeave={() => { if (engineRef.current) engineRef.current.hover = false; }}
    >
      <div ref={screenRef} className="tv-screen off">
        <canvas ref={cvRef} className="tv-canvas" aria-hidden="true" />
        <div className="tv-roll" aria-hidden="true" />
        <div className="tv-scan" aria-hidden="true" />
        <div className="tv-vig" aria-hidden="true" />
        <div ref={chRef} className="osd osd-top" aria-hidden="true">
          <TvDate />
          <div className="osd-ch"><TvClock /></div>
        </div>
        <button ref={enterRef} type="button" className="tv-enter" onClick={leave} aria-label="SONDR Rules The World. Enter the site (Escape skips)">
          <span ref={cueRef} className="osd osd-cue">{touch ? "TAP TO TUNE IN" : "CLICK TO TUNE IN"}</span>
        </button>
      </div>
      <div ref={flashRef} className="tv-flash" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src="/logo-patch.webp" alt="" hidden />
    </div>
  );
}

/* VCR-style live readouts for the top corners: the date (left) and the time (right).
   Rendered after mount so the server and browser never disagree about the time. */
function useNow() {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
const pad = (n: number) => String(n).padStart(2, "0");
function TvClock() {
  const now = useNow();
  return <div className="osd-time">{now ? `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}` : "\u00a0"}</div>;
}
function TvDate() {
  const now = useNow();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return <div className="osd-date">{now ? `${pad(now.getDate())} ${months[now.getMonth()]} ${now.getFullYear()}` : "\u00a0"}</div>;
}
