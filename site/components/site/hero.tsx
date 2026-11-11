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
      {/* Mr. Sondr (black outline of DESIGN/MR_SONDR.png), opposite the signature: pops up last, his drawn smile opens, then he keeps smoking (hand to mouth, smoke curling off the tip) */}
      <motion.div className="mr-sondr" style={{ opacity: fade }} aria-hidden="true">
        <svg viewBox="0 380 1640 1980" preserveAspectRatio="xMidYMax meet">
          <image href="/mr-sondr-outline.webp" x="0" y="380" width="1640" height="1980" />
          <image className="ms-mouth" href="/mr-sondr-mouth.webp" x="661" y="1264" width="139" height="166" />
          <defs>
            <filter id="ms-brush" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="7" result="n"/>
              <feDisplacementMap in="SourceGraphic" in2="n" scale="6"/>
            </filter>
          </defs>
          <g className="ms-hand" transform="translate(975 1345) scale(1.8)">
            <g className="ms-hand-move">
              {/* arm + hand silhouette (white, hides the face lines behind it) */}
              <path fill="#fff" d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 10 -66 C22 -96 46 -96 50 -70 C56 -40 54 -10 54 0 C78 -12 98 6 92 30 C112 32 122 52 110 78 C112 120 98 152 74 172 L180 700 L-60 700 L14 166 C-20 150 -42 120 -42 92 C-72 74 -80 40 -60 24 C-50 20 -42 40 -40 70 Z"/>
              <g filter="url(#ms-brush)" fill="none" stroke="#000" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-40 70 C-50 20 -45 -40 -30 -75 C-20 -92 0 -88 4 -66"/>
                <path d="M6 -40 C8 -10 6 15 8 42"/>
                <path d="M12 -64 C22 -96 46 -96 50 -70 C55 -38 53 -8 52 22"/>
                <path d="M58 -2 C80 -12 98 6 92 30"/>
                <path d="M96 34 C114 34 122 54 110 78"/>
                <path d="M110 84 C112 122 98 150 72 170"/>
                <path d="M-40 84 C-72 74 -80 40 -60 24 C-50 18 -40 32 -36 44"/>
                <path d="M-38 100 C-36 130 -14 152 14 166"/>
                <path d="M14 172 C0 260 -24 400 -40 600"/>
                <path d="M74 178 C100 260 140 400 170 600"/>
                <path d="M-14 112 L-2 96" strokeWidth="10"/>
                <path d="M30 120 L44 108" strokeWidth="10"/>
              </g>
              {/* cigarette: from the corner of his mouth, out between the fingers */}
              <g filter="url(#ms-brush)">
                <path d="M-100 -2 L46 -26 L49 -8 L-97 14 Z" fill="#fff" stroke="#000" strokeWidth="9" strokeLinejoin="round"/>
                <path className="ms-ember" d="M46 -26 L72 -30 L75 -12 L49 -8 Z" fill="#F80A02" stroke="#000" strokeWidth="9" strokeLinejoin="round"/>
              </g>
              {/* smoke curling up from the tip */}
              <g className="ms-smoke" fill="none" stroke="#000" strokeWidth="6" strokeLinecap="round">
                <path d="M80 -40 C60 -90 110 -120 86 -170 C66 -210 112 -240 92 -290"/>
                <path d="M86 -44 C110 -96 70 -130 100 -180 C124 -220 84 -260 110 -310"/>
                <path d="M76 -42 C50 -80 84 -110 62 -150 C44 -184 74 -210 58 -246"/>
              </g>
            </g>
          </g>
          <g className="ms-exhale" fill="none" stroke="#000" strokeWidth="11" strokeLinecap="round">
            <path d="M760 1330 C700 1300 740 1250 690 1215 C650 1185 690 1140 650 1110"/>
            <path d="M730 1345 C670 1335 680 1290 630 1275"/>
            <path d="M790 1320 C770 1270 810 1240 780 1190"/>
          </g>
        </svg>
      </motion.div>
      <motion.div className="sig" style={{ opacity: fade }}>
        <Image src="/signature.png" alt="Dhruv Hardin’s signature" width={1005} height={345} priority sizes="(max-width: 639px) 160px, 21vw" />
      </motion.div>
    </section>
  );
}
