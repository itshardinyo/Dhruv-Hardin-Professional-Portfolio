"use client";

import * as React from "react";
import { getLenis } from "@/lib/lenis-store";

const BASE = "/brands/sondr-cinematics";
const SRC = `${BASE}/intro.mp4`;
const POSTER = `${BASE}/intro-poster.webp`;
/** Marvel-style flip: Dhruv's own comics and Mr. Sondr art, flashed one after another before the clip. */
const FLIP = [
  "/artsy/comics/da-villain-da-beginnin.webp", "/artsy/mr-sondr/detective-sondr.webp", "/artsy/comics/da-monsta.webp",
  "/artsy/sondr-universe/sondr-sunset.webp", "/artsy/comics/eskapades.webp", "/artsy/mr-sondr/mr-sondr-ponders.webp",
  "/artsy/comics/mental.webp", "/artsy/sondr-universe/sondr-universe.webp", "/artsy/mr-sondr/mr-sondr.webp",
];
const FLIP_MS = 95; // per panel
const CARD_MS = 1500; // red title card hold
const OUT_MS = 650; // zoom-through into the page

type Phase = "flip" | "play" | "card" | "out" | "done";

/**
 * Sondr Cinematics opener, full screen like a studio intro:
 * 1. flip: Dhruv's art flashes past (≈0.9s)
 * 2. play: Mr. Sondr walking (7.6s). The clip is vertical, so on landscape screens a blurred, darkened copy fills the
 *    screen behind a sharp centre with feathered edges; both push in slowly like a camera move.
 * 3. card: red title card, white camera logo + "SONDR CINEMATICS" slam in
 * 4. out: the card zooms through into the page.
 * Click, tap, Esc/Enter/Space or "Skip" ends it. Reduced motion: no opener.
 */
export function CinematicsIntro() {
  const [phase, setPhase] = React.useState<Phase>("flip");
  const [panel, setPanel] = React.useState(0);
  const fg = React.useRef<HTMLVideoElement>(null);
  const bg = React.useRef<HTMLVideoElement>(null);

  const skip = React.useCallback(() => setPhase((p) => (p === "done" || p === "out" ? p : "out")), []);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("done"); return; }
    window.scrollTo(0, 0);
    FLIP.forEach((src) => { const i = new Image(); i.src = src; }); // warm the cache so the flip doesn't stutter
  }, []);

  // 1. flip through the panels
  React.useEffect(() => {
    if (phase !== "flip") return;
    if (panel >= FLIP.length) { setPhase("play"); return; }
    const t = window.setTimeout(() => setPanel((n) => n + 1), FLIP_MS);
    return () => window.clearTimeout(t);
  }, [phase, panel]);

  // 2. play both copies of the clip in step
  React.useEffect(() => {
    if (phase !== "play") return;
    const v = fg.current, b = bg.current;
    if (!v) return;
    v.play().catch(() => setPhase("card"));
    b?.play().catch(() => {});
    const sync = () => { if (b && Math.abs(b.currentTime - v.currentTime) > 0.15) b.currentTime = v.currentTime; };
    v.addEventListener("timeupdate", sync);
    return () => v.removeEventListener("timeupdate", sync);
  }, [phase]);

  // 3–4. card, then out, then gone
  React.useEffect(() => {
    if (phase !== "card" && phase !== "out") return;
    const t = window.setTimeout(() => setPhase(phase === "card" ? "out" : "done"), phase === "card" ? CARD_MS : OUT_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // lock scrolling while it's up
  React.useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    html.classList.add("cine-on");
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => { if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); skip(); } };
    window.addEventListener("keydown", onKey);
    return () => { html.classList.remove("cine-on"); getLenis()?.start(); window.removeEventListener("keydown", onKey); };
  }, [phase, skip]);

  if (phase === "done") return null;
  const showCard = phase === "card" || phase === "out";

  return (
    <div className={`cine-intro is-${phase}`} onClick={skip} role="presentation">
      {phase === "flip" && panel < FLIP.length && (
        <div className="cine-flip" aria-hidden="true">
          <img key={panel} src={FLIP[panel]} alt="" />
        </div>
      )}
      <div className="cine-stage" aria-hidden={phase !== "play"}>
        <video ref={bg} className="cine-bg" src={SRC} muted playsInline preload="auto" aria-hidden="true" tabIndex={-1} />
        <video
          ref={fg} className="cine-video" src={SRC} poster={POSTER} muted playsInline preload="auto"
          onEnded={() => setPhase((p) => (p === "play" ? "card" : p))} aria-label="Mr. Sondr walking down an alley"
        />
        <div className="cine-bars" aria-hidden="true" />
      </div>
      {showCard && (
        <div className="cine-card">
          <img src={`${BASE}/logo-white.webp`} alt="" className="cine-card-logo" />
          <div className="cine-card-name">Sondr Cinematics</div>
        </div>
      )}
      {!showCard && (
        <button type="button" className="cine-skip" onClick={(e) => { e.stopPropagation(); skip(); }}>Skip</button>
      )}
    </div>
  );
}
