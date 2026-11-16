"use client";

import * as React from "react";
import { getLenis } from "@/lib/lenis-store";

const SRC = "/brands/sondr-cinematics/intro.mp4";
const POSTER = "/brands/sondr-cinematics/intro-poster.webp";

/**
 * Sondr Cinematics opener: every arrival on the page plays Mr. Sondr walking (7.6s, silent) full screen,
 * then the clip fades into the page. Click, tap, Esc/Enter/Space or "Skip" ends it early. Reduced motion: no opener.
 */
export function CinematicsIntro() {
  const [phase, setPhase] = React.useState<"play" | "out" | "done">("play");
  const ref = React.useRef<HTMLVideoElement>(null);

  const end = React.useCallback(() => setPhase((p) => (p === "play" ? "out" : p)), []);

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPhase("done"); return; }
    window.scrollTo(0, 0);
    ref.current?.play().catch(() => end()); // autoplay refused: go straight to the page
  }, [end]);

  // lock scrolling while the clip is up
  React.useEffect(() => {
    if (phase === "done") return;
    const html = document.documentElement;
    html.classList.add("cine-on");
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => { if (["Escape", "Enter", " "].includes(e.key)) { e.preventDefault(); end(); } };
    window.addEventListener("keydown", onKey);
    return () => { html.classList.remove("cine-on"); getLenis()?.start(); window.removeEventListener("keydown", onKey); };
  }, [phase, end]);

  React.useEffect(() => {
    if (phase !== "out") return;
    const t = window.setTimeout(() => setPhase("done"), 700);
    return () => window.clearTimeout(t);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div className={`cine-intro ${phase === "out" ? "is-out" : ""}`} onClick={end} role="presentation">
      <video ref={ref} className="cine-video" src={SRC} poster={POSTER} muted playsInline preload="auto" onEnded={end} aria-label="Mr. Sondr walking down an alley" />
      <button type="button" className="cine-skip" onClick={(e) => { e.stopPropagation(); end(); }}>Skip</button>
    </div>
  );
}
