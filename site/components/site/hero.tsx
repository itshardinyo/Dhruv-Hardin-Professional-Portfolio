"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useIntro } from "@/components/intro/intro-controller";

/*
  The hero (hero-mockup.png), drawn in mockup pixels: 1u = one pixel of the 1512×982 frame.
  Dots, each headline line, the signature and Mr. Sondr are separate elements so each can be animated on its own.
  Scrolling toward the footer: line 1 rises 8vh, line 2 14vh, the dots and signature fade out, all over the
  first screen of scrolling (or the whole scroll distance to the footer when that is shorter).
*/
export function Hero() {
  const { reduced } = useIntro();
  const { scrollY } = useScroll();
  const [range, setRange] = React.useState({ dist: 1, vh: 1 });
  React.useEffect(() => {
    const set = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setRange({ dist: Math.max(1, Math.min(window.innerHeight, max)), vh: window.innerHeight });
    };
    set();
    window.addEventListener("resize", set);
    const ro = new ResizeObserver(set);
    ro.observe(document.body);
    return () => { window.removeEventListener("resize", set); ro.disconnect(); };
  }, []);
  const p = useTransform(scrollY, (y) => (reduced ? 0 : Math.min(1, Math.max(0, y / range.dist))));
  const y1 = useTransform(p, (v) => -v * 0.08 * range.vh);
  const y2 = useTransform(p, (v) => -v * 0.14 * range.vh);
  const fade = useTransform(p, (v) => 1 - v);

  return (
    <section className="hero" aria-labelledby="headline">
      <div className="hero-body">
        <motion.div className="dots" aria-hidden="true" style={{ opacity: fade }}>
          <i />
          <i />
          <i />
        </motion.div>
        <h1 className="headline" id="headline" tabIndex={-1}>
          <motion.span className="line l1" style={{ y: y1 }}>
            <span className="txt">You’ve reached,</span>
          </motion.span>{" "}
          <motion.span className="line l2" style={{ y: y2 }}>
            <span className="txt">Dhruv Hardin.</span>
          </motion.span>
        </h1>
      </div>
      {/* Mr. Sondr (black outline of DESIGN/MR_SONDR.png), opposite the signature. Comes last in the entrance: pops up with
          a cigarette, blows a puff of smoke, smiles, then keeps smoking slowly. */}
      <motion.div className="mr-sondr" style={{ opacity: fade }} aria-hidden="true">
        <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
          <defs>
            <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
            </filter>
            {/* one puff of smoke, drawn like his clouds: bumpy white blob, thick black outline, a curl or two */}
            <symbol id="ms-cloud" viewBox="-110 -80 220 160" overflow="visible">
              <g filter="url(#ms-brush)">
                <g fill="none" stroke="#000" strokeWidth="16"><circle cx="-55" cy="12" r="42" /><circle cx="-8" cy="-18" r="52" /><circle cx="48" cy="6" r="44" /><circle cx="-20" cy="36" r="36" /><circle cx="28" cy="38" r="36" /><circle cx="80" cy="30" r="26" /></g>
                <g fill="#fff"><circle cx="-55" cy="12" r="42" /><circle cx="-8" cy="-18" r="52" /><circle cx="48" cy="6" r="44" /><circle cx="-20" cy="36" r="36" /><circle cx="28" cy="38" r="36" /><circle cx="80" cy="30" r="26" /></g>
                <path d="M-40 10 c10 -16 32 -16 40 0 M14 -26 c8 -12 26 -10 30 4 M30 30 c6 -8 18 -8 22 2" fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" />
              </g>
            </symbol>
          </defs>
          <image href="/mr-sondr-outline.webp" x="0" y="380" width="1640" height="1980" />
          {/* the drawing ran off its canvas on the right: finish the shoulder and sleeve */}
          <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="28" strokeLinecap="round">
            <path d="M1626 1980 C1700 2030 1762 2120 1798 2250 C1810 2300 1816 2340 1820 2420" />
            <path d="M1572 2092 C1610 2112 1640 2134 1668 2172" />
          </g>
          <image className="ms-mouth" href="/mr-sondr-mouth.webp" x="661" y="1264" width="139" height="166" />
          <g className="ms-hand" transform="translate(975 1345) scale(1.8)">
            <g className="ms-hand-move">
              {/* arm + hand silhouette (white, hides the face lines behind it) */}
              <path fill="#fff" d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 10 -66 C22 -96 46 -96 50 -70 C56 -40 54 -10 54 0 C78 -12 98 6 92 30 C112 32 122 52 110 78 C112 120 98 152 74 172 L180 700 L-60 700 L14 166 C-20 150 -42 120 -42 92 C-72 74 -80 40 -60 24 C-50 20 -42 40 -40 70 Z" />
              <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 4 -66" />
                <path d="M6 -40 C8 -10 6 15 8 42" />
                <path d="M12 -64 C22 -96 46 -96 50 -70 C55 -38 53 -8 52 22" />
                <path d="M58 -2 C80 -12 98 6 92 30" />
                <path d="M96 34 C114 34 122 54 110 78" />
                <path d="M110 84 C112 122 98 150 72 170" />
                <path d="M-40 84 C-72 74 -80 40 -60 24 C-50 18 -40 32 -36 44" />
                <path d="M-38 100 C-36 130 -14 152 14 166" />
                <path d="M14 172 C0 260 -24 400 -40 600" />
                <path d="M74 178 C100 260 140 400 170 600" />
                <path d="M-14 112 L-2 96" strokeWidth="10" />
                <path d="M30 120 L44 108" strokeWidth="10" />
              </g>
              {/* cigarette: from the corner of his mouth, out between the fingers */}
              <g filter="url(#ms-brush)">
                <path d="M-100 -2 L46 -26 L49 -8 L-97 14 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
                <path className="ms-ember" d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#F80A02" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
              </g>
              {/* little puffs drifting off the tip */}
              <g className="ms-smoke">
                <g><use href="#ms-cloud" x="44" y="-100" width="70" height="51" /></g>
                <g><use href="#ms-cloud" x="40" y="-104" width="78" height="57" /></g>
                <g><use href="#ms-cloud" x="46" y="-98" width="64" height="47" /></g>
              </g>
            </g>
          </g>
          {/* the slow exhale in the loop: clouds rolling out of his mouth */}
          <g className="ms-exhale">
            <g><use href="#ms-cloud" x="760" y="1150" width="420" height="305" /></g>
            <g><use href="#ms-cloud" x="820" y="1040" width="520" height="378" /></g>
            <g><use href="#ms-cloud" x="740" y="1220" width="320" height="233" /></g>
          </g>
        </svg>
      </motion.div>
      {/* his first puff: clouds rolling out of his mouth into the gap by the headline, then drifting off */}
      <div className="ms-puff" aria-hidden="true">
        <svg viewBox="0 0 1150 600">
          <g><use href="#ms-cloud" x="0" y="250" width="150" height="109" /></g>
          <g><use href="#ms-cloud" x="60" y="200" width="190" height="138" /></g>
          <g><use href="#ms-cloud" x="150" y="150" width="230" height="167" /></g>
          <g><use href="#ms-cloud" x="260" y="110" width="260" height="189" /></g>
          <g><use href="#ms-cloud" x="120" y="260" width="170" height="124" /></g>
          <g><use href="#ms-cloud" x="330" y="40" width="220" height="160" /></g>
        </svg>
      </div>
      <motion.div className="sig" style={{ opacity: fade }}>
        <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} priority sizes="(max-width: 639px) 160px, 21vw" />
      </motion.div>
    </section>
  );
}
