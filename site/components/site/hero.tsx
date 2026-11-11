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
          a cigarette, lights it, smiles, then keeps smoking slowly; the smoke always rises. */}
      <motion.div className="mr-sondr" style={{ opacity: fade }} aria-hidden="true">
        <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
          <defs>
            <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6" />
            </filter>
            {/* realistic smoke: soft grey ribbons pushed around by slowly shifting noise, then blurred */}
            <filter id="ms-smokefx" x="-80%" y="-30%" width="260%" height="160%">
              <feTurbulence type="fractalNoise" baseFrequency="0.018 0.045" numOctaves="3" seed="3" result="t">
                <animate attributeName="baseFrequency" dur="11s" values="0.018 0.045;0.024 0.055;0.018 0.045" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="t" scale="26" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="2.2" />
            </filter>
            <filter id="ms-smokefx-big" x="-80%" y="-40%" width="260%" height="180%">
              <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves="3" seed="9" result="t">
                <animate attributeName="baseFrequency" dur="13s" values="0.008 0.02;0.012 0.026;0.008 0.02" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="t" scale="90" xChannelSelector="R" yChannelSelector="G" />
              <feGaussianBlur stdDeviation="15" />
            </filter>
            {/* smoke thins out as it rises */}
            <linearGradient id="ms-fade" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".45" stopColor="#fff" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            <mask id="ms-fade-mask" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="url(#ms-fade)" />
            </mask>
            <filter id="ms-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14" /></filter>
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
                <path d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
                <path className="ms-ember" d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#F80A02" stroke="#000" strokeWidth="9" strokeLinejoin="round" />
              </g>
              {/* a thin stream of smoke rising off the tip, curling and thinning out */}
              <g className="ms-smoke" mask="url(#ms-fade-mask)">
                <g filter="url(#ms-smokefx)" fill="none" stroke="#7D7D7D" strokeLinecap="round">
                  <path pathLength={100} strokeWidth="7" d="M76 -28 C60 -70 96 -110 80 -160 C64 -210 104 -250 86 -300 C70 -350 100 -390 84 -440" />
                  <path pathLength={100} strokeWidth="6" d="M78 -28 C96 -80 66 -120 88 -170 C110 -220 74 -270 96 -320 C116 -370 86 -400 104 -450" />
                  <path pathLength={100} strokeWidth="4" d="M74 -30 C56 -60 74 -100 60 -140 C46 -180 70 -220 54 -270" />
                </g>
              </g>
            </g>
            {/* the lighter (entrance only): comes up in his other hand, flicks a flame under the tip, then drops away */}
            <g className="ms-lighter">
             <g transform="translate(70 0) scale(1.45) translate(-70 0)">
              <circle className="ms-flame-glow" cx="68" cy="-4" r="26" fill="#F80A02" opacity=".35" filter="url(#ms-glow)" />
              <g filter="url(#ms-brush)" stroke="#000" strokeLinecap="round" strokeLinejoin="round">
                <path d="M92 26 L104 -34 L120 -30 L108 28" fill="#fff" strokeWidth="9" />
                <rect x="52" y="4" width="36" height="24" fill="#fff" strokeWidth="9" />
                <circle cx="62" cy="16" r="2.5" fill="#000" strokeWidth="0" />
                <circle cx="76" cy="16" r="2.5" fill="#000" strokeWidth="0" />
                <circle cx="47" cy="14" r="7" fill="#fff" strokeWidth="8" />
                <rect x="46" y="28" width="52" height="70" rx="6" fill="#fff" strokeWidth="11" />
                <path d="M46 52 C30 50 26 66 40 70 M44 72 C28 72 26 88 42 90 M46 92 C34 96 36 108 50 106" fill="none" strokeWidth="11" />
                <path d="M40 34 C30 20 36 6 48 8" fill="none" strokeWidth="11" />
              </g>
              <g className="ms-flame">
                <path d="M70 4 C56 -6 60 -20 68 -34 C74 -22 86 -8 70 4 Z" fill="#F80A02" stroke="#000" strokeWidth="4" strokeLinejoin="round" />
                <path d="M70 0 C64 -6 66 -14 69 -20 C72 -13 77 -6 70 0 Z" fill="#fff" />
              </g>
             </g>
            </g>
          </g>
          {/* the slow exhale: soft smoke rolling out of the corner of his mouth, away from his face, rising */}
          <g className="ms-exhale" filter="url(#ms-smokefx-big)" fill="none" stroke="#B4B4B4" strokeLinecap="round">
            <path pathLength={1} strokeWidth="34" d="M800 1330 C880 1300 900 1240 980 1210 C1060 1180 1060 1110 1130 1070" />
            <path pathLength={1} strokeWidth="26" d="M800 1325 C860 1270 940 1260 990 1190 C1040 1120 1110 1110 1150 1030" />
            <path pathLength={1} strokeWidth="22" d="M795 1335 C870 1340 930 1300 1000 1290 C1080 1280 1110 1220 1180 1200" />
          </g>
        </svg>
      </motion.div>
      <motion.div className="sig" style={{ opacity: fade }}>
        <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} priority sizes="(max-width: 639px) 160px, 21vw" />
      </motion.div>
    </section>
  );
}
